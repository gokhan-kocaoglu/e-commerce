const withBase = (p) => {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/+$/, "")}/${p.replace(/^\/+/, "")}`;
};

export const normalizeImageUrl = (url) => {
  if (!url) return "";

  // 1) Tam URL ise direkt kullan
  if (/^https?:\/\//i.test(url)) return url;

  // 2) ../ ve ./ öneklerini temizle
  let cleaned = String(url)
    .replace(/^(\.\.\/)+/, "") // "../" tekrarlarını sil
    .replace(/^\.\/+/, "") // "./" önekini sil
    .replace(/^\/+/, ""); // baştaki "/" varsa sil

  // Örnek:
  // "../assets/card/card1.jpg" -> "assets/card/card1.jpg"

  return withBase(cleaned);
};
