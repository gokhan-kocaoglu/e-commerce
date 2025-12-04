// src/lib/http.js
import axios from "axios";
import { toast } from "react-toastify";
import { readAuth, saveAuth, clearAuth } from "../utils/authStorage";
import { refreshApi } from "../services/authService";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export const http = axios.create({
  baseURL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// ---------- REQUEST INTERCEPTOR ----------
http.interceptors.request.use((config) => {
  const { accessToken } = readAuth(); // NEW+LEGACY normalize
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  config.headers["Accept-Language"] = navigator.language || "tr-TR";
  try {
    config.headers["X-Timezone"] =
      Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/Istanbul";
  } catch {
    config.headers["X-Timezone"] = "Europe/Istanbul";
  }
  return config;
});

// ---------- REFRESH DURUM STATE’İ ----------
let isRefreshing = false;
let subscribers = [];

function addSubscriber(callback) {
  subscribers.push(callback);
}

function notifySubscribers(newToken) {
  subscribers.forEach((cb) => cb(newToken));
  subscribers = [];
}

// localStorage mı, sessionStorage mı?
function detectRemember() {
  const where = localStorage.getItem("auth_where");
  if (where === "local") return true;
  if (where === "session") return false;

  // fallback: accessToken local’de varsa “remember me” gibi düşün
  return (
    !!localStorage.getItem("accessToken") ||
    !!localStorage.getItem("auth_token")
  );
}

// ---------- RESPONSE INTERCEPTOR ----------
http.interceptors.response.use(
  (res) => res,
  async (err) => {
    // İstek iptal edildiyse refresh denemeyelim
    if (
      axios.isCancel?.(err) ||
      err?.code === "ERR_CANCELED" ||
      err?.name === "CanceledError" ||
      err?.message === "canceled"
    ) {
      return Promise.reject(err);
    }

    const { response, config } = err || {};
    const originalRequest = config || {};
    const status = response?.status;

    const url = originalRequest?.url || "";

    // SADECE login / register / refresh / logout için refresh denemesin
    const isAuthUrl =
      url.startsWith("/api/auth/login") ||
      url.startsWith("/api/auth/register") ||
      url.startsWith("/api/auth/refresh") ||
      url.startsWith("/api/auth/logout");

    // ----- SADECE 401 + auth OLMAYAN endpoint -----
    if (status === 401 && !originalRequest._retry && !isAuthUrl) {
      originalRequest._retry = true;

      try {
        // Aynı anda birden fazla refresh olmasın → global kilit
        if (!isRefreshing) {
          isRefreshing = true;

          const data = await refreshApi(); // AuthResponse
          const remember = detectRemember();
          saveAuth(data, remember); // yeni access+refresh+expiresAt

          isRefreshing = false;
          notifySubscribers(data.accessToken);
        }

        // Diğer istekler, refresh bitince yeniden denenecek
        return new Promise((resolve) => {
          addSubscriber((newToken) => {
            originalRequest.headers = originalRequest.headers || {};
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(http(originalRequest));
          });
        });
      } catch (refreshErr) {
        isRefreshing = false;
        subscribers = [];

        // refresh de patladı → tamamen logout
        clearAuth();

        if (!originalRequest?._skipErrorToast) {
          const apiMsg =
            refreshErr?.response?.data?.message ||
            refreshErr?.response?.data?.error ||
            refreshErr.message;
          toast.error(
            apiMsg || "Oturumunuz sona erdi. Lütfen tekrar giriş yapın."
          );
        }

        // login sayfasına direkt yönlendir:
        window.location.href = "/login";

        return Promise.reject(refreshErr);
      }
    }

    // ----- Diğer hatalar için eski toast davranışı -----
    if (!originalRequest?._skipErrorToast) {
      const apiMsg =
        response?.data?.message || response?.data?.error || err.message;
      toast.error(apiMsg || "İstek sırasında bir hata oluştu.");
    }

    return Promise.reject(err);
  }
);
