import { createSlice } from "@reduxjs/toolkit";
import { fetchAnnouncements } from "../services/announcementApi";

const initial = { items: [], status: "idle", error: null };

const slice = createSlice({
  name: "announcement",
  initialState: initial,
  reducers: {
    loading: (s) => {
      s.status = "loading";
      s.error = null;
    },
    setItems: (s, { payload }) => {
      s.items = payload || [];
      s.status = "ready";
    },
    failed: (s, { payload }) => {
      s.status = "error";
      s.error = payload || "fetch_failed";
    },
    clear: (s) => Object.assign(s, initial),
  },
});

export const { loading, setItems, failed, clear } = slice.actions;
export default slice.reducer;

export const loadAnnouncement = () => async (dispatch) => {
  try {
    dispatch(loading());
    const list = await fetchAnnouncements(); // ISO string tarih döndürüyor
    dispatch(setItems(list));
  } catch (e) {
    dispatch(failed(e?.message));
  }
};
