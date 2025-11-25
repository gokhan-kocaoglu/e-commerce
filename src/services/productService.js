import { http } from "../lib/http";

export async function fetchProduct(productId, config) {
  const res = await http.get(`/api/catalog/products/${productId}`, config);
  return res.data?.data || null;
}

export async function fetchProductDetail(productId, config) {
  const res = await http.get(
    `/api/catalog/products/${productId}/detail`,
    config
  );
  return res.data?.data || null;
}

export async function fetchProductVariants(productId, config) {
  const res = await http.get(
    `/api/catalog/variants/by-product/${productId}`,
    config
  );
  return res.data?.data || [];
}

// ProductDetails sayfası için “bundle” fetch
export async function fetchProductPageBundle(productId, config) {
  const [product, detail, variants] = await Promise.all([
    fetchProduct(productId, config),
    fetchProductDetail(productId, config),
    fetchProductVariants(productId, config),
  ]);

  return { product, detail, variants };
}
