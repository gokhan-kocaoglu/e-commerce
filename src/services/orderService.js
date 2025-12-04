import { http } from "../lib/http";

export async function fetchMyOrders({ page = 0, size = 5 } = {}) {
  const res = await http.get("/api/orders", {
    params: {
      page,
      size,
      sort: "createdAt,DESC",
    },
  });

  const data = res?.data?.data ?? res?.data; // ApiPage wrapper'a göre esnek
  return {
    content: data?.content ?? [],
    page: data?.page ?? data?.pageNumber ?? 0,
    size: data?.size ?? data?.pageSize ?? size,
    totalPages: data?.totalPages ?? 1,
    totalElements: data?.totalElements ?? data?.content?.length ?? 0,
  };
}
