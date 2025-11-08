import { http } from "../lib/http";

/**
 * Beklenen BE çıktısı:
 * {
 *  success: true,
 *  data: [{ id, text, startsAt, endsAt, active }],
 *  errorCode, message, timestamp
 * }
 */
export async function fetchAnnouncements() {
  const res = await http.get("/api/content/announcements/active");
  const list = res?.data?.data ?? [];
  return list.map((a) => ({
    id: a.id,
    text: a.text,
    startsAt: a.startsAt ?? null,
    endsAt: a.endsAt ?? null,
    active: Boolean(a.active),
  }));
}
