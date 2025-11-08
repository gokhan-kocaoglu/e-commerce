import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchActiveCampaignsApi } from "../services/campaignService";
import { adaptCampaignsToPromoItems } from "../adapters/promoAdapter";

export const fetchPromoItems = createAsyncThunk(
  "promo/fetch",
  async ({ signal } = {}, { rejectWithValue }) => {
    try {
      const list = await fetchActiveCampaignsApi({ signal });
      return adaptCampaignsToPromoItems(list);
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.message);
    }
  },
  {
    // İsteğe bağlı: aynı anda tekrar fetch etme
    condition: (_, { getState }) => {
      const { promo } = getState();
      return promo.status !== "loading";
    },
  }
);

const initialState = {
  items: [],
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  lastFetchedAt: null,
};

const promoSlice = createSlice({
  name: "promo",
  initialState,
  reducers: {
    // İsteğe bağlı manuel set
    setPromoItems(state, action) {
      state.items = action.payload || [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromoItems.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchPromoItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload || [];
        state.lastFetchedAt = Date.now();
      })
      .addCase(fetchPromoItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Fetch failed";
      });
  },
});

export const { setPromoItems } = promoSlice.actions;
export default promoSlice.reducer;

// Selectors
export const selectPromoItems = (s) => s.promo.items;
export const selectPromoStatus = (s) => s.promo.status;
export const selectPromoError = (s) => s.promo.error;
