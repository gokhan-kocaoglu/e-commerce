// BASE_URL'i (subpath deploy) güvenle uygula
const withBase = (p) => {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/+$/, "")}/${p.replace(/^\/+/, "")}`;
};

const normalizeImageUrl = (url) => {
  if (!url) return "";

  // 1) Tam URL ise direkt kullan
  if (/^https?:\/\//i.test(url)) return url;

  // 2) ../ ve ./ öneklerini TEMİZLE (ek bir 'assets/' ekleme!)
  let cleaned = url
    .replace(/^(\.\.\/)+/, "") // "../" tekrarlarını sil
    .replace(/^\.\/+/, "") // "./" önekini sil
    .replace(/^\/+/, ""); // baştaki "/" varsa sil

  // Şu ana kadar:
  // "../assets/slider/slider2.png" --> "assets/slider/slider2.png"

  // 3) CDN tanımlıysa onu kullan
  const cdn = import.meta.env.VITE_ASSET_BASE_URL;
  if (cdn) {
    return `${cdn.replace(/\/+$/, "")}/${cleaned}`;
  }

  // 4) Public klasöründen servis et (public/assets/...)
  // cleaned "assets/..." ile başlıyor, BASE_URL ile birleştir
  return withBase(cleaned); // -> "/assets/slider/slider2.png"
};

// BE listesi -> UI slide listesi
export function mapApiToHeroSlides(apiList = []) {
  return apiList.map((it, i) => ({
    id: it.id,
    isActive: true,
    sortOrder: i + 1,
    theme: {
      background: "#05B6D3",
      textColor: "#FFFFFF",
      buttonBg: "#2DC071",
      buttonText: "#FFFFFF",
    },
    media: {
      type: "image",
      src: normalizeImageUrl(it.heroImageUrl),
      alt: it.slug || it.name || "hero",
      objectFit: "contain",
      position: "right-bottom",
    },
    content: {
      kicker: it.name, // "AUTUMN 2020"
      headline: it.slug, // "ESSENTIAL STYLES" (BE 'slug'ı başlık gibi)
      description: it.shortDescription,
      cta: it.ctaText ? { label: it.ctaText, href: "/shop" } : undefined,
      alignment: "left",
      maxWidth: 560,
    },
  }));
}
