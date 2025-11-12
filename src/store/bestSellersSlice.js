// src/store/bestSellersSlice.js
import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import { http } from "../lib/http";

// ---------- Helpers
const withBase = (p) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  const base = import.meta.env.BASE_URL || "/";
  const cleaned = String(p)
    .replace(/^(\.\.\/)+/, "")
    .replace(/^\.\/+/, "")
    .replace(/^\/+/, "");
  return `${base.replace(/\/+$/, "")}/${cleaned}`;
};

// benzersiz renk isimleri
const uniqueVariantColors = (variants) => {
  const set = new Map();
  for (const v of variants || []) {
    const color = v?.attributes?.color;
    if (!color || typeof color !== "string") continue;
    const key = color.trim().toLowerCase();
    if (!set.has(key)) set.set(key, color.trim());
  }
  return Array.from(set.values()); // ["Black","Blue",...]
};

// slug → kategori
const resolveCategoryFromSlug = (slug) => {
  if (!slug) return null;
  const seg = String(slug).split("/")[0]?.trim();
  if (!seg) return null;
  const label = seg.charAt(0).toUpperCase() + seg.slice(1);
  return { label, path: `/shop/${seg}` };
};

// ---------- Entity Adapter (ürünler)
const productsAdapter = createEntityAdapter({
  selectId: (p) => p.id,
  sortComparer: false,
});

// ---------- Thunks

// Cache politikası: 60sn tazelik
const TTL_MS = 60_000;

// Ürünleri getir (top-bestsellers)
export const fetchBestSellers = createAsyncThunk(
  "bestSellers/fetchList",
  async ({ limit = 8, signal }) => {
    const res = await http.get("/api/catalog/products/top-bestsellers", {
      params: { limit },
      signal,
      _skipErrorToast: true,
    });
    const list = res?.data?.data || [];
    return list.map((p) => ({
      id: p.id,
      title: p.title,
      description: p.description,
      slug: p.slug,
      category: resolveCategoryFromSlug(p.slug),
      price: { amount: p.price?.amount, currency: p.price?.currency },
      compareAtPrice: {
        amount: p.compareAtPrice?.amount,
        currency: p.compareAtPrice?.currency,
      },
      imageUrl: withBase(p.thumbnailUrl),
    }));
  },
  {
    condition: ({ limit = 8 }, { getState }) => {
      const { bestSellers } = getState();
      const key = String(limit);
      const entry = bestSellers.cache.metaByLimit[key];
      if (!entry) return true;
      const fresh = Date.now() - entry.fetchedAt < TTL_MS;
      return !fresh;
    },
  }
);

// Bir ürünün varyant renklerini getir
export const fetchVariantColorsForProduct = createAsyncThunk(
  "bestSellers/fetchVariantColorsForProduct",
  async ({ productId, signal }) => {
    const res = await http.get(
      `/api/catalog/variants/by-product/${productId}`,
      {
        signal,
        _skipErrorToast: true,
      }
    );
    const colors = uniqueVariantColors(res?.data?.data || []);
    return { productId, colors };
  }
);

// Bir seferde listedeki ürünlerin renklerini getir (N+1’i kontrollü paralellikte çözer)
export const fetchVariantColorsForList = createAsyncThunk(
  "bestSellers/fetchVariantColorsForList",
  async ({ productIds, signal, concurrency = 4 }, { dispatch, getState }) => {
    // 1) Zaten rengi alınmış olanları ele
    const { bestSellers } = getState();
    const missing = productIds.filter((id) => !bestSellers.colorsByProduct[id]);
    if (!missing.length || signal?.aborted) return true;

    // 2) Basit concurrency havuzu
    const queue = [...missing];
    const workers = Array.from(
      { length: Math.min(concurrency, queue.length) },
      async () => {
        while (queue.length && !signal?.aborted) {
          const id = queue.shift();

          await dispatch(
            fetchVariantColorsForProduct({ productId: id, signal })
          )
            .unwrap()
            .catch((e) => {
              // Yalnızca iptalleri sessizce yut
              if (
                e?.name === "CanceledError" ||
                e?.code === "ERR_CANCELED" ||
                e?.message === "canceled"
              ) {
                return;
              }
              // console.debug("Variant colors failed:", id, e);
            });
        }
      }
    );

    await Promise.all(workers);
    return true;
  }
);

// ---------- Slice
const initialState = productsAdapter.getInitialState({
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  cache: {
    metaByLimit: {}, // { "8": { fetchedAt: 123456 } }
  },
  colorsByProduct: {}, // { [productId]: ["Black","Blue"] }
});

const bestSellersSlice = createSlice({
  name: "bestSellers",
  initialState,
  reducers: {
    invalidate(state) {
      state.cache.metaByLimit = {};
    },
    clear(state) {
      productsAdapter.removeAll(state);
      state.colorsByProduct = {};
      state.cache.metaByLimit = {};
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // list
      .addCase(fetchBestSellers.pending, (state, action) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBestSellers.fulfilled, (state, action) => {
        productsAdapter.setAll(state, action.payload);
        state.status = "succeeded";
        const limit = String(action.meta.arg?.limit ?? 8);
        state.cache.metaByLimit[limit] = { fetchedAt: Date.now() };
      })
      .addCase(fetchBestSellers.rejected, (state, action) => {
        // İptaller hataya sayılmaz
        if (
          action.error?.name === "CanceledError" ||
          action.error?.message === "canceled" ||
          action.error?.code === "ERR_CANCELED"
        ) {
          state.status = "idle";
          return;
        }
        state.status = "failed";
        state.error = action.error?.message || "Best sellers yüklenemedi";
      })

      // colors (tek ürün)
      .addCase(fetchVariantColorsForProduct.fulfilled, (state, action) => {
        const { productId, colors } = action.payload;
        state.colorsByProduct[productId] = colors;
      });
  },
});

export const { invalidate, clear } = bestSellersSlice.actions;
export default bestSellersSlice.reducer;

// ---------- Selectors (TEK KEZ tanımla!)
const baseSelectors = productsAdapter.getSelectors(
  (state) => state.bestSellers
);

// Sadece ID'ler (referans stabil)
export const selectBestSellerIds = baseSelectors.selectIds;

// Eksik renkli ürün ID'leri
export const selectMissingColorIds = createSelector(
  selectBestSellerIds,
  (state) => state.bestSellers.colorsByProduct,
  (ids, colorsByProduct) => ids.filter((id) => !colorsByProduct[id])
);

// Kartların UI’da ihtiyacı olan şekil (renklerle birleştirilmiş)
export const selectBestSellerCards = createSelector(
  baseSelectors.selectAll,
  (state) => state.bestSellers.colorsByProduct,
  (products, colorsByProduct) =>
    products.map((p) => ({
      ...p,
      variantColors: colorsByProduct[p.id] || [],
    }))
);

// Basit yardımcılar
export const selectBestSellersStatus = (state) => state.bestSellers.status;
export const selectBestSellersError = (state) => state.bestSellers.error;
