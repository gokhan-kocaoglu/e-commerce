import { useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "../lib/http";

const withBase = (p) => {
  if (!p) return "";
  if (/^https?:\/\//i.test(p)) return p;
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/+$/, "")}/${p.replace(/^(\.\.\/|\.\/|\/)+/, "")}`;
};
const adapt = (x) => ({
  id: x.id,
  title: (x.name || "").toUpperCase(),
  subtitle: x.itemCount != null ? `${x.itemCount} Items` : "",
  imageUrl: withBase(x.heroImageUrl),
  path: `/collections/${(x.name || x.id)
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`,
});

export function useCollectionsSummaries() {
  return useQuery({
    queryKey: ["collections", "summaries"],
    queryFn: async ({ signal }) => {
      const res = await http.get("/api/marketing/collections/Summaries", {
        signal,
      });
      const list = Array.isArray(res?.data?.data) ? res.data.data : [];
      return list.map(adapt);
    },
    staleTime: 5 * 60_000,
  });
}

export function usePrefetchCollectionDetail() {
  const qc = useQueryClient();
  return (slug) =>
    qc.prefetchQuery({
      queryKey: ["collection", "detail", slug],
      queryFn: async ({ signal }) => {
        const res = await http.get(`/api/marketing/collections/${slug}`, {
          signal,
        });
        return res.data;
      },
      staleTime: 60_000,
    });
}
