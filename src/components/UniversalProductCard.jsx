import { Link } from "react-router-dom";
import { useVariantColors } from "../queries/variantQueries";

// helpers
const normMoney = (v, cur = "USD") =>
  typeof v === "number" ? { amount: v, currency: cur } : v || null;

const parseProductSlug = (slug) => {
  if (!slug) return { categorySlug: null, productSlug: null };

  const parts = String(slug).split("/").filter(Boolean);

  // Eski veri yapıları için: sadece ürün slug'ı geldiyse
  if (parts.length === 1) {
    return {
      categorySlug: null,
      productSlug: parts[0],
    };
  }

  const [categorySlug, ...rest] = parts;
  return {
    categorySlug,
    productSlug: rest.join("/"), // ileride ürün slug'ında "/" olursa da bozulmaz
  };
};

const resolveCategoryFromSlug = (slug) => {
  const { categorySlug } = parseProductSlug(slug);
  if (!categorySlug) return null;

  return {
    label: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1),
    path: `/shop/${categorySlug}`,
  };
};

const pickHexFromName = (name) => {
  const s = (name || "").toLowerCase();
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  const r = 80 + (h & 0x7f),
    g = 80 + ((h >> 7) & 0x7f),
    b = 80 + ((h >> 14) & 0x7f);
  return `rgb(${r},${g},${b})`;
};

const toCssColor = (token) => {
  if (!token) return null;
  const t = String(token).trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(t)) return t;
  if (/^rgba?\(/i.test(t) || /^hsla?\(/i.test(t)) return t;
  if (typeof window !== "undefined" && window.CSS?.supports?.("color", t))
    return t;
  return pickHexFromName(t);
};

const formatMoney = (amt, cur = "USD") =>
  amt == null ? "" : `${amt.toFixed(2)} ${cur}`;

export default function UniversalProductCard({
  product,
  className = "",
  // --- Görsel kontrolü ---
  fixedWidth, // ör: 240 (BestSeller için)
  imageHeight, // ör: 427 (BestSeller için)
  imageAspect = "4/5", // Shop için varsayılan oran
  // --- Varyant kontrolü ---
  autoVariants = true, // initial yoksa lazy fetch
}) {
  // 🔹 slug'ı tek sefer parse edelim
  const { categorySlug, productSlug } = parseProductSlug(product?.slug);
  // 🔹 kategori objesini çıkaralım (label + /shop path)
  const category = resolveCategoryFromSlug(product?.slug);

  const price = normMoney(product?.price);
  const compare = normMoney(product?.compareAtPrice, price?.currency);
  const initialColors = product?.variantColors || [];

  const { data: colors = [] } = useVariantColors(
    product?.id,
    autoVariants ? initialColors : initialColors
  );

  // IMG container boyutlandırma
  const useFixed = fixedWidth && imageHeight; // piksel bazlı (BestSeller)
  const wStyle = fixedWidth ? { width: fixedWidth } : undefined;

  return (
    <div className={`flex flex-col items-center ${className}`} style={wStyle}>
      {/* IMG */}
      <Link
        to={{
          pathname:
            categorySlug && productSlug
              ? `/product/${categorySlug}/${productSlug}`
              : `/product/${product?.slug}`,
          search: product?.id ? `?id=${product.id}` : "",
        }}
        aria-label={product?.title}
        className="block w-full"
      >
        <div
          className={
            useFixed
              ? "overflow-hidden bg-zinc-100"
              : `overflow-hidden bg-zinc-100 aspect-[${imageAspect}] w-full`
          }
          style={
            useFixed ? { width: fixedWidth, height: imageHeight } : undefined
          }
        >
          <img
            src={product?.imageUrl}
            alt={product?.title}
            loading="lazy"
            className="block h-full w-full object-cover object-center"
          />
        </div>
      </Link>

      {/* TEXT */}
      <div className="mt-4 text-center" style={wStyle}>
        <h5 className="font-['Montserrat'] text-[16px] font-bold leading-6 tracking-[0.1px] text-[#252B42]">
          {product?.title}
        </h5>

        {/* 🔹 Burası yeniden çalışıyor */}
        {category && (
          <Link
            to={category.path}
            className="mt-1 inline-block font-['Montserrat'] text-[14px] font-bold leading-[24px] tracking-[0.2px] text-[#737373] hover:underline"
          >
            {category.label}
          </Link>
        )}

        <div className="mt-3 flex items-center justify-center gap-2 font-['Montserrat'] text-[16px] font-bold leading-6 tracking-[0.1px]">
          {compare?.amount != null && (
            <span className="text-[#BDBDBD] line-through">
              {formatMoney(compare.amount, compare.currency)}
            </span>
          )}
          {price?.amount != null && (
            <span className="text-[#23856D]">
              {formatMoney(price.amount, price.currency)}
            </span>
          )}
        </div>

        {!!colors?.length && (
          <div className="mt-3 flex items-center justify-center gap-2">
            {colors.map((c, i) => {
              const name = typeof c === "string" ? c : c.name;
              const val = typeof c === "string" ? c : c.value;
              return (
                <span
                  key={name || i}
                  title={name}
                  className="inline-block h-4 w-4 rounded-full border border-black/10"
                  style={{ backgroundColor: toCssColor(val) }}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
