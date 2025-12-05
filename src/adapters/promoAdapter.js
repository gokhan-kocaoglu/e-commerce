/** Subpath deploy güvenli base ekleyici */
const withBase = (p) => {
  if (!p) return "";
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/+$/, "")}/${String(p).replace(/^\/+/, "")}`;
};

/** Görsel URL normalize: tam URL ise bırak; relatifse temizle ve BASE/CDN ile birleştir */
export function normalizeImageUrl(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;

  const cleaned = String(url)
    .replace(/^(\.\.\/)+/, "")
    .replace(/^\.\/+/, "")
    .replace(/^\/+/, "");

  const cdn = import.meta.env.VITE_CDN_URL;
  return cdn ? `${cdn.replace(/\/+$/, "")}/${cleaned}` : withBase(cleaned);
}

/** startsAt <= now <= endsAt && active true mu? */
export function isCampaignActive(c) {
  const now = Date.now();
  const startOk = !c.startsAt || Date.parse(c.startsAt) <= now;
  const endOk = !c.endsAt || Date.parse(c.endsAt) >= now;
  return !!c.active && startOk && endOk;
}

/** BE kampanyasını PromoSlider’ın beklediği item’a map*/
export function mapCampaignToPromoItem(c) {
  return {
    id: c.id,
    theme: {
      background: "#2D7B69",
      textColor: "#FFFFFF",
      buttonBg: "#2BB24C",
      buttonText: "#FFFFFF",
    },
    media: {
      type: "image",
      src: normalizeImageUrl(c.imageUrl),
      alt: c.subtitle || c.title || "campaign",
      maxWidthDesktop: "460px",
      // mobileHeight: "60svh",
    },
    content: {
      kicker: c.title, // ör: "SUMMER 2020"
      headline: c.subtitle, // ör: "Vita Classic Product"
      description: c.description,
      cta: { label: c.ctaText, href: c.ctaLink || "#" },
      alignment: "left",
      maxWidth: 460,
      mobileTopGap: "24px",
      mobileMinHeight: "60svh",
    },
    meta: { startsAt: c.startsAt, endsAt: c.endsAt },
  };
}

/** Listeyi filtrele, sırala, map*/
export function adaptCampaignsToPromoItems(list = []) {
  return list
    .filter(isCampaignActive)
    .sort(
      (a, b) =>
        (Date.parse(a.startsAt || 0) || 0) - (Date.parse(b.startsAt || 0) || 0)
    )
    .map(mapCampaignToPromoItem);
}
