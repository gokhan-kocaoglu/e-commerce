import { http } from "../lib/http";

const withBase = (p) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/+$/, "")}/${p.replace(/^(\.\.\/|\.\/|\/)+/, "")}`;
};

// catalogService.js içindeki adaptProduct'ı bununla değiştir
const adaptProduct = (x) => {
  // Para birimi: price yoksa compareAtPrice'tan devral
  const priceAmount = x?.price?.amount ?? null;
  const compareAmount = x?.compareAtPrice?.amount ?? null;
  const currency = x?.price?.currency || x?.compareAtPrice?.currency || "USD";

  return {
    id: x.id,
    title: x.title,
    subtitle: x.description ?? "", // UI alt metin
    slug: x.slug, // ör: "women/Graphic-Design-6" veya "women"
    categoryId: x.categoryId,

    // Fiyatlar — UI kartlarında kolay kullanım için number + currency
    price: priceAmount,
    compareAtPrice: compareAmount,
    currency,

    // Görsel yolu normalize
    imageUrl: withBase(x.thumbnailUrl),

    // Ek alanlar (ileride badge/sort için işine yarar)
    ratingAvg: x?.ratingAvg ?? 0,
    ratingCount: x?.ratingCount ?? 0,
    bestsellerScore: x?.bestsellerScore ?? 0,
  };
};

export async function fetchAllProducts({ page, size }, { signal } = {}) {
  const res = await http.get("/api/catalog/products", {
    signal,
    params: { page, size },
  });
  const d = res.data?.data ?? {};
  return {
    items: (d.content ?? []).map(adaptProduct),
    page: d.page ?? page,
    size: d.size ?? size,
    total: d.totalElements ?? 0,
    totalPages: d.totalPages ?? 0,
  };
}

/**
 * Doğru istek: /api/catalog/products/by-category/{categoryId}?page=0&size=12
 * Yanlış olan: /by-category?categoryId=...  (bunu artık göndermiyoruz)
 */
export async function fetchProductsByCategory(
  { categoryId, page, size },
  { signal } = {}
) {
  if (!categoryId) {
    throw new Error("fetchProductsByCategory: categoryId gerekli.");
  }

  const id = encodeURIComponent(categoryId);
  const res = await http.get(`/api/catalog/products/by-category/${id}`, {
    signal,
    params: { page, size },
  });

  const d = res.data?.data ?? {};
  return {
    items: (d.content ?? []).map(adaptProduct),
    page: d.page ?? page,
    size: d.size ?? size,
    total: d.totalElements ?? 0,
    totalPages: d.totalPages ?? 0,
  };
}
