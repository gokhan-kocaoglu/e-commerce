import { http } from "../lib/http";

export async function fetchHomeSlidersApi() {
  const { data } = await http.get("/api/marketing/collections");
  // BE: { success, data: [...] }
  return data?.data || [];
}
