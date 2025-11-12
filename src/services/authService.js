import { http } from "../lib/http";

import { readAuth, clearAuth } from "../utils/authStorage";

export async function loginApi({ email, password, signal }) {
  const res = await http.post(
    "/api/auth/login",
    { email, password },
    { signal, _skipErrorToast: false } // interceptor toast etsin
  );
  // Beklenen response: { success, data:{ accessToken, refreshToken, tokenType, expiresAt, user }, ... }
  return res.data?.data;
}

export async function logoutApi() {
  const { refreshToken } = readAuth();
  try {
    await http.post("/api/account/logout", { refreshToken });
  } catch (e) {
    // 401 vs. gelse bile client clean-up yapacağız
    // console.warn("logout error (ignored):", e?.response?.data || e.message);
  } finally {
    clearAuth();
  }
}
