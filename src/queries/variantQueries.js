import { useQuery } from "@tanstack/react-query";
import { fetchVariantColorsApi } from "../services/variantService";

/**
 * Named export: useVariantColors
 * - productId: string
 * - initial: string[] (opsiyonel; varsa fetch'i kapatır)
 */
export function useVariantColors(productId, initial = []) {
  const hasInitial = initial.length > 0;
  return useQuery({
    queryKey: ["variants", "colors", productId],
    queryFn: ({ signal }) => fetchVariantColorsApi(productId, { signal }), // [{name,value}]
    enabled: !!productId && !hasInitial,
    staleTime: 10 * 60_000,
    initialData: hasInitial ? initial : undefined,
    select: (arr) => arr || [],
  });
}
