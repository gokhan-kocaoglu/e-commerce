import { configureStore } from "@reduxjs/toolkit";
import announcementReducer from "./announcementSlice";
import bestSellersReducer from "./bestSellersSlice";
import promoReducer from "./promoSliderSlice";

export const store = configureStore({
  reducer: {
    announcement: announcementReducer,
    bestSellers: bestSellersReducer,
    promo: promoReducer,
    // diğer slice'lar...
  },
});
