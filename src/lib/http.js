// lib/http.js
import axios from "axios";
import { toast } from "react-toastify";
import { readAuth } from "../utils/authStorage";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const http = axios.create({
  baseURL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

http.interceptors.request.use((config) => {
  const { accessToken } = readAuth(); // NEW+LEGACY normalize
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;

  config.headers["Accept-Language"] = navigator.language || "tr-TR";
  try {
    config.headers["X-Timezone"] =
      Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Istanbul";
  } catch {
    config.headers["X-Timezone"] = "Europe/Istanbul";
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (
      axios.isCancel?.(err) ||
      err?.code === "ERR_CANCELED" ||
      err?.name === "CanceledError" ||
      err?.message === "canceled"
    ) {
      return Promise.reject(err);
    }
    if (!err?.config?._skipErrorToast) {
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message;
      toast.error(apiMsg || "İstek sırasında bir hata oluştu.");
    }
    return Promise.reject(err);
  }
);
