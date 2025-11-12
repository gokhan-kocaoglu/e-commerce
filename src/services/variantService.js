import { http } from "../lib/http";

const uniqueVariantColors = (variants) => {
  const map = new Map();
  for (const v of variants || []) {
    const name = (
      v?.attributes?.colorName ||
      v?.attributes?.color ||
      ""
    ).trim();
    const code = (
      v?.attributes?.colorHex ||
      v?.attributes?.colorCode ||
      name
    ).trim();
    if (!name && !code) continue;
    const key = (name || code).toLowerCase();
    if (!map.has(key)) map.set(key, { name: name || code, value: code });
  }
  // ["Blue", "#1E3A8A"] şeklinde düz array istersen .map(x => x.value) döndür
  return Array.from(map.values()); // tercih: obje listesi
};

export async function fetchVariantColorsApi(productId, { signal } = {}) {
  const res = await http.get(`/api/catalog/variants/by-product/${productId}`, {
    signal,
    _skipErrorToast: true,
  });
  return uniqueVariantColors(res?.data?.data || []);
}
