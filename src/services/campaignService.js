import { http } from "../lib/http";

/**
 * Aktif kampanyaları çeker.
 */
export async function fetchActiveCampaignsApi({ signal } = {}) {
  const res = await http.get("/api/content/campaigns/active", { signal });
  // BE response shape:
  // { success, data:[{ id, title, subtitle, description, imageUrl, ctaText, ctaLink, startsAt, endsAt, active }], ... }
  return res?.data?.data ?? [];
}
