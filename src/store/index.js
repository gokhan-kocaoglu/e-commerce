import { configureStore } from "@reduxjs/toolkit";
import announcementReducer from "./announcementSlice";
import bestSellersReducer from "./bestSellersSlice";
import promoReducer from "./promoSliderSlice";
import authReducer from "./authSlice";
import wishlistReducer from "./wishlistSlice";
import cartReducer from "./cartSlice";

export const store = configureStore({
  reducer: {
    announcement: announcementReducer,
    bestSellers: bestSellersReducer,
    promo: promoReducer,
    auth: authReducer,
    wishlist: wishlistReducer,
    cart: cartReducer,
  },
});
