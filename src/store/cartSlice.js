// src/store/cartSlice.js
import {
  createSlice,
  createSelector,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import { http } from "../lib/http";

const STORAGE_KEY = "cartItems";

// LocalStorage'dan başlangıç yükü
const loadInitialItems = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveItems = (items) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // sessiz geç
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    // {variantId, productId, title, slug, price, quantity, size, color, thumbnailUrl}
    items: loadInitialItems(),
  },
  reducers: {
    addItem(state, action) {
      const p = action.payload;
      if (!p?.variantId) return;

      const existing = state.items.find((it) => it.variantId === p.variantId);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + (p.quantity || 1);
      } else {
        state.items.push({
          ...p,
          quantity: p.quantity || 1,
        });
      }
      saveItems(state.items);
    },
    removeItem(state, action) {
      const variantId = action.payload;
      state.items = state.items.filter((it) => it.variantId !== variantId);
      saveItems(state.items);
    },
    clearCart(state) {
      state.items = [];
      saveItems(state.items);
    },
    // 🔹 BE'den gelen sepeti tamamen state'e yazmak için
    setItems(state, action) {
      state.items = Array.isArray(action.payload) ? action.payload : [];
      saveItems(state.items);
    },
  },
});

export const { addItem, removeItem, clearCart, setItems } = cartSlice.actions;
export default cartSlice.reducer;

// ---- Selectors ----
const emptyCartState = { items: [] };
const selectCartState = (state) => state?.cart || emptyCartState;

export const selectCartItems = createSelector(selectCartState, (c) => c.items);

// toplam ürün adedi (quantity'lerin toplamı)
export const selectCartCount = createSelector(selectCartItems, (items) =>
  items.reduce((sum, it) => sum + (it.quantity || 0), 0)
);

// toplam fiyat (sadece amount üzerinden)
export const selectCartTotal = createSelector(selectCartItems, (items) =>
  items.reduce(
    (sum, it) => sum + (it.price?.amount || 0) * (it.quantity || 0),
    0
  )
);

/**
 * 🔸 BE'den tam sepeti çeker ve local state + localStorage'ı BE'ye eşitler
 * endpoint: GET /api/cart
 * response:
 * {
 *   success: true,
 *   data: {
 *     id,
 *     items: [{ variantId, productTitle, attributes, quantity, unitPrice, lineTotal, thumbnailUrl }],
 *     summary: {...}
 *   },
 *   ...
 * }
 */
export const fetchCartFromServer = createAsyncThunk(
  "cart/fetchCartFromServer",
  async (_, { dispatch }) => {
    const res = await http.get("/api/cart", {
      _skipErrorToast: true,
    });

    const apiCart = res.data?.data;
    const apiItems = apiCart?.items || [];

    console.log("Fetched cart from server:", apiCart);

    const mapped = apiItems.map((it) => ({
      variantId: it.variantId,
      productId: null, // BE'den gelirse doldurursun
      title: it.productTitle,
      slug: null, // BE'den productSlug gelirse buraya maplersin
      price: it.unitPrice, // { amount, currency }
      compareAtPrice: null,
      quantity: it.quantity || 1,
      size: it.attributes?.size || null,
      color: it.attributes?.color || null,
      thumbnailUrl: it.thumbnailUrl || null,
      lineTotal: it.lineTotal || null, // İstersen kullanırsın
    }));

    // Redux + localStorage state'ini BE ile senkronla
    dispatch(setItems(mapped));
    return mapped;
  }
);

/**
 * 🔸 LOGIN SONRASI SENKRON:
 * 1) Local (guest) sepetini oku
 * 2) /api/cart ile BE'deki sepeti kontrol et
 * 3) Eğer BE'de item yoksa VE local doluysa → local item'ları /api/cart/items'e POST et
 * 4) En sonda fetchCartFromServer ile BE'nin son halini çekip local'i onunla eşitle
 *
 * Bu sayede:
 * - İlk login'de guest sepeti BE'ye taşınır
 * - Sonraki login'lerde BE zaten doluysa tekrar tekrar push edilmez → ikiye katlama olmaz
 */
export const syncCartOnLogin = createAsyncThunk(
  "cart/syncCartOnLogin",
  async (_, { getState, dispatch }) => {
    const state = getState();
    const localItems = selectCartItems(state);

    // 1) Önce BE sepetini oku
    const res = await http.get("/api/cart", { _skipErrorToast: true });
    const apiCart = res.data?.data;
    const serverItems = apiCart?.items || [];
    const hasServerItems = serverItems.length > 0;

    // 2) BE sepeti boşsa ve local doluysa → guest sepetini BE'ye migrate et
    if (!hasServerItems && localItems.length > 0) {
      for (const item of localItems) {
        try {
          await http.post(
            "/api/cart/items",
            {
              variantId: item.variantId,
              quantity: item.quantity || 1,
            },
            { _skipErrorToast: true }
          );
        } catch (e) {
          console.error("cart sync error", e);
        }
      }
    }

    // 3) En sonda BE'den son halini çek ve local state'i onunla eşitle
    await dispatch(fetchCartFromServer());
  }
);
