// src/store/wishlistSlice.js
import { createSlice, createSelector } from "@reduxjs/toolkit";

const STORAGE_KEY = "wishlistItems";

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

// ---- Slice ----
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: loadInitialItems(),
  },
  reducers: {
    toggleWishlistItem(state, action) {
      console.log("GEldi");
      const p = action.payload;
      if (!p?.id) return;

      const idx = state.items.findIndex((it) => it.id === p.id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(p);
      }

      console.log("✅ wishlist toggle:", {
        id: p.id,
        newLength: state.items.length,
        items: state.items,
      });

      saveItems(state.items);
    },
    clearWishlist(state) {
      state.items = [];
      saveItems(state.items);
    },
  },
});

export const { toggleWishlistItem, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

// ---- Selectors ----
const emptyWishlistState = { items: [] };

// wishlist slice yoksa bile boş bir state dön:
const selectWishlistState = (state) => state?.wishlist || emptyWishlistState;

export const selectWishlistItems = createSelector(
  selectWishlistState,
  (w) => w.items
);

export const selectWishlistCount = createSelector(
  selectWishlistItems,
  (items) => items.length
);

export const selectIsInWishlist = (state, productId) =>
  selectWishlistItems(state).some((it) => it.id === productId);
