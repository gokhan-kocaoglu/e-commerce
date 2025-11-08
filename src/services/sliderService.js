import { http } from "../lib/http";

export async function fetchHomeSlidersApi() {
  // Interceptor hata/Toast yönetimi global olduğu için burada try/catch şart değil
  const { data } = await http.get("/api/marketing/collections");
  // BE: { success, data: [...] }
  return data?.data || [];
}
