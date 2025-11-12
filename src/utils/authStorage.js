export function saveAuth(data, remember) {
  // data: { accessToken, refreshToken, expiresAt, user }
  const store = remember ? localStorage : sessionStorage;

  // NEW keys
  store.setItem("accessToken", data.accessToken || "");
  store.setItem("refreshToken", data.refreshToken || "");
  if (data.expiresAt) store.setItem("expiresAt", data.expiresAt);
  if (data.user) store.setItem("user", JSON.stringify(data.user));

  // (Opsiyonel) LEGACY compat – istersen bir süre yazmayı da sürdür
  store.setItem("auth_token", data.accessToken || "");
  store.setItem("auth_refresh", data.refreshToken || "");
  if (data.expiresAt) store.setItem("auth_exp", data.expiresAt);
  if (data.user) store.setItem("auth_user", JSON.stringify(data.user));
}

export function readAuth() {
  // NEW scheme
  const accessNew =
    localStorage.getItem("accessToken") ??
    sessionStorage.getItem("accessToken");
  const refreshNew =
    localStorage.getItem("refreshToken") ??
    sessionStorage.getItem("refreshToken");
  const expNew =
    localStorage.getItem("expiresAt") ?? sessionStorage.getItem("expiresAt");
  const userNewStr =
    localStorage.getItem("user") ?? sessionStorage.getItem("user");

  // LEGACY (sende şu an devtools’ta görünenler)
  const accessLegacy =
    localStorage.getItem("auth_token") ?? sessionStorage.getItem("auth_token");
  const refreshLegacy =
    localStorage.getItem("auth_refresh") ??
    sessionStorage.getItem("auth_refresh");
  const expLegacy =
    localStorage.getItem("auth_exp") ?? sessionStorage.getItem("auth_exp");
  const userLegacyStr =
    localStorage.getItem("auth_user") ?? sessionStorage.getItem("auth_user");

  const accessToken = accessNew || accessLegacy || null;
  const refreshToken = refreshNew || refreshLegacy || null;
  const expiresAt = expNew || expLegacy || null;
  const userStr = userNewStr || userLegacyStr || null;

  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch {
    user = null;
  }

  return { accessToken, refreshToken, expiresAt, user };
}

export function clearAuth() {
  const keys = [
    // NEW
    "accessToken",
    "refreshToken",
    "expiresAt",
    "user",
    // LEGACY
    "auth_token",
    "auth_refresh",
    "auth_exp",
    "auth_user",
    // nerede durduğunu izlemek istersen
    "auth_where",
  ];
  keys.forEach((k) => {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  });
}
