import { configureStore } from "@reduxjs/toolkit";
import announcementReducer from "./announcementSlice";
import bestSellersReducer from "./bestSellersSlice";
import promoReducer from "./promoSliderSlice";
import authReducer from "./authSlice";

export const store = configureStore({
  reducer: {
    announcement: announcementReducer,
    bestSellers: bestSellersReducer,
    promo: promoReducer,
    auth: authReducer,
    // diğer slice'lar...
  },
});
