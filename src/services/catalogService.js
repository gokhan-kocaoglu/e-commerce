import { http } from "../lib/http";

const withBase = (p) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/+$/, "")}/${p.replace(/^(\.\.\/|\.\/|\/)+/, "")}`;
};

const adaptProduct = (x) => ({
  id: x.id,
  title: x.title,
  subtitle: x.description,
  slug: x.slug,
  categoryId: x.categoryId,
  price: x.price?.amount ?? null,
  compareAtPrice: x.compareAtPrice?.amount ?? null,
  currency: x.price?.currency ?? "USD",
  imageUrl: withBase(x.thumbnailUrl),
});

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
