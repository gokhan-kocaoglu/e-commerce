export const formatMoney = (value, currency = "USD", locale = "en-US") =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(value);

export function resolveCategoryFromSlug(slug) {
  if (!slug) return null;
  const seg = String(slug).split("/")[0]?.trim();
  if (!seg) return null;
  const label = seg.charAt(0).toUpperCase() + seg.slice(1);
  return { label, path: `/shop/${seg}` };
}

// İsim→hex basit eşleme (backend Black/Blue/Green/Orange/Red vb. döndürüyor)
export function pickHexFromName(name) {
  const k = String(name).trim().toLowerCase();
  switch (k) {
    case "black":
      return "#000000";
    case "blue":
      return "#23A6F0";
    case "green":
      return "#23856D";
    case "orange":
      return "#E77C40";
    case "Blue":
      return "#252B42";
    case "dark green":
    case "darkgreen":
      return "#3AA76D";
    case "red":
      return "#E02D2D";
    default:
      return "#CCCCCC";
  }
}
