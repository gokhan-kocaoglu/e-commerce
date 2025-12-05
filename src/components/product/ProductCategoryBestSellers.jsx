import { useProductPage } from "./ProductPageContext";
import BestSellers from "../BestSellers";

export default function ProductCategoryBestSellers({
  limit = 4,
  className = "",
}) {
  const { status, product } = useProductPage();

  if (status !== "succeeded" || !product) {
    return null;
  }

  const categoryId = product.categoryId || null;

  if (!categoryId) {
    // kategori yoksa global bestsellers, ama HEADER yine kategori varyantında
    return (
      <BestSellers
        limit={limit}
        variant="category"
        className={`pt-4 pb-16 ${className}`}
      />
    );
  }

  return (
    <BestSellers
      limit={limit}
      categoryId={categoryId}
      variant="category"
      className={`pt-4 pb-16 ${className}`}
    />
  );
}
