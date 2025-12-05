import axios from "axios";
import { http } from "../lib/http";
import { readAuth, clearAuth } from "../utils/authStorage";

const baseURL = import.meta.env.VITE_API_BASE_URL;

// LOGIN
export async function loginApi({ email, password, signal }) {
  const res = await http.post(
    "/api/auth/login",
    { email, password },
    { signal }
  );
  // BE: ApiResponse<AuthResponse> → { success, data, ... }
  return res.data.data;
}

// LOGOUT
// BE endpoint: POST /api/auth/logout { refreshToken, logoutAll }
export async function logoutApi({ logoutAll = false } = {}) {
  try {
    const { refreshToken } = readAuth();
    if (!refreshToken) {
      // zaten client’ta token yok, sadece temizle
      clearAuth();
      return;
    }

    await http.post("/api/auth/logout", {
      refreshToken,
      logoutAll,
    });
  } finally {
    // BE ne derse desin, FE tarafını her durumda temizle
    clearAuth();
  }
}

// REFRESH
// BE endpoint: POST /api/auth/refresh { refreshToken }
export async function refreshApi() {
  const { refreshToken } = readAuth();
  if (!refreshToken) {
    throw new Error("NO_REFRESH_TOKEN");
  }
  // Direkt axios ile yapalım, http instance’ı kullanmayalım
  const res = await axios.post(
    `${baseURL}/api/auth/refresh`,
    { refreshToken },
    {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }
  );

  // ApiResponse<AuthResponse>
  return res.data?.data;
}
