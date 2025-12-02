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
    // {variantId, productId, title, slug, price, quantity, size, color, thumbnailUrl, lineTotal?}
    items: loadInitialItems(),
  },
  reducers: {
    addItem(state, action) {
      const p = action.payload;
      if (!p?.variantId) return;

      const existing = state.items.find((it) => it.variantId === p.variantId);
      if (existing) {
        existing.quantity = (existing.quantity || 1) + (p.quantity || 1);
        // lineTotal'ı da güncelle
        const unitAmount = existing.price?.amount || 0;
        existing.lineTotal = {
          amount: unitAmount * (existing.quantity || 1),
          currency:
            existing.price?.currency || existing.lineTotal?.currency || "USD",
        };
      } else {
        const quantity = p.quantity || 1;
        const unitAmount = p.price?.amount || 0;
        state.items.push({
          ...p,
          quantity,
          lineTotal: {
            amount: unitAmount * quantity,
            currency: p.price?.currency || "USD",
          },
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

    // 🔹 Eski setItems dursun (geri uyumluluk için)
    setItems(state, action) {
      const arr = Array.isArray(action.payload) ? action.payload : [];
      state.items = arr;
      saveItems(state.items);
    },

    // 🔹 /api/cart cevabını direkt Redux'e map'lemek için
    setCartFromApi(state, action) {
      const apiCart = action.payload || {};
      const apiItems = apiCart.items || [];

      const mapped = apiItems.map((it) => ({
        variantId: it.variantId,
        productId: it.productId,
        title: it.productTitle,
        slug: it.sku,
        price: it.unitPrice, // { amount, currency }
        compareAtPrice: null,
        quantity: it.quantity || 1,
        size: it.attributes?.size || null,
        color: it.attributes?.color || null,
        thumbnailUrl: it.thumbnailUrl || null,
        lineTotal: it.lineTotal || null,
      }));

      state.items = mapped;
      saveItems(state.items);
    },

    //Tek satırın quantity'sini güncellemek için
    updateItemQuantity(state, action) {
      const { variantId, quantity } = action.payload || {};
      if (!variantId || quantity == null) return;

      const item = state.items.find((it) => it.variantId === variantId);
      if (!item) return;

      item.quantity = quantity;

      const unitAmount = item.price?.amount || 0;
      item.lineTotal = {
        amount: unitAmount * quantity,
        currency: item.price?.currency || item.lineTotal?.currency || "USD",
      };

      saveItems(state.items);
    },
  },
});

export const {
  addItem,
  removeItem,
  clearCart,
  setItems,
  setCartFromApi,
  updateItemQuantity,
} = cartSlice.actions;

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
 */
export const fetchCartFromServer = createAsyncThunk(
  "cart/fetchCartFromServer",
  async (_, { dispatch }) => {
    const res = await http.get("/api/cart", {
      _skipErrorToast: true,
    });

    const apiCart = res.data?.data || { items: [] };

    // Redux + localStorage state'ini BE ile senkronla
    dispatch(setCartFromApi(apiCart));

    return apiCart;
  }
);

/**
 * 🔸 LOGIN SONRASI SENKRON:
 * 1) Local (guest) sepetini oku
 * 2) /api/cart ile BE'deki sepeti kontrol et
 * 3) Eğer BE'de item yoksa VE local doluysa → local item'ları /api/cart/items'e POST et
 * 4) En sonda fetchCartFromServer ile BE'nin son halini çekip local'i onunla eşitle
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
