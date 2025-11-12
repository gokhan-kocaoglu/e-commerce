import { useQuery } from "@tanstack/react-query";
import {
  fetchAllProducts,
  fetchProductsByCategory,
} from "../services/catalogService";
import { getCategoryIdByKey } from "../data/siteConfig.helpers";

export function useProductsQuery({ categoryKey, page = 1, size = 12 }) {
  const bePage = Math.max(0, page - 1);
  return useQuery({
    queryKey: [
      "products",
      { categoryKey: categoryKey || null, page: bePage, size },
    ],
    queryFn: async ({ signal }) => {
      const catId = categoryKey ? getCategoryIdByKey(categoryKey) : null;
      if (catId) {
        return fetchProductsByCategory(
          { categoryId: catId, page: bePage, size },
          { signal }
        );
      }
      return fetchAllProducts({ page: bePage, size }, { signal });
    },
    keepPreviousData: true,
    staleTime: 60_000,
  });
}
