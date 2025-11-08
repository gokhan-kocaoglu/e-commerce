import axios from "axios";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const http = axios.create({
  baseURL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
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
    // >>> İptal edilmiş istekleri sessize al
    if (
      axios.isCancel?.(err) ||
      err?.code === "ERR_CANCELED" ||
      err?.name === "CanceledError" ||
      err?.message === "canceled"
    ) {
      // İstersen console.debug ile logla
      // console.debug("Request canceled:", err.config?.url);
      return Promise.reject(err);
    }

    // İsteğe bağlı: çağrı bazında toast’ı kapatmak için bayrak
    if (err?.config?._skipErrorToast) {
      return Promise.reject(err);
    }

    const status = err?.response?.status;
    const apiMsg =
      err?.response?.data?.message || err?.response?.data?.error || err.message;

    if (status === 401) {
      // logout/refresh vs.
    }

    toast.error(apiMsg || "İstek sırasında bir hata oluştu.");
    return Promise.reject(err);
  }
);
