import { Link } from "react-router-dom";
import {
  formatMoney,
  resolveCategoryFromSlug,
  pickHexFromName,
} from "../utils/format";

export default function ProductCard({ product }) {
  const category = resolveCategoryFromSlug(product.slug);

  return (
    // Kart kapsayıcı: görsel ile aynı genişlik (240px); yatay padding yok
    <div className="flex flex-col items-center" style={{ width: 240 }}>
      {/* IMG */}
      <Link
        to={`/product/${product.slug}`}
        aria-label={product.title}
        className="block"
      >
        <div className="overflow-hidden" style={{ width: 240, height: 427 }}>
          <img
            src={product.imageUrl}
            alt={product.title}
            className="block h-full w-full object-cover object-center"
            loading="lazy"
          />
        </div>
      </Link>

      {/* METİN BLOKU — aynı genişlik */}
      <div className="mt-4 text-center" style={{ width: 240 }}>
        <h5 className="font-['Montserrat'] text-[16px] font-bold leading-6 tracking-[0.1px] text-[#252B42]">
          {product.title}
        </h5>
        {category && (
          <Link
            to={category.path}
            className="mt-1 inline-block font-['Montserrat'] text-[14px] font-bold leading-6 tracking-[0.2px] text-[#737373] hover:underline"
          >
            {category.label}
          </Link>
        )}
        {/* Fiyatlar */}
        <div className="mt-3 flex items-center justify-center gap-2 font-['Montserrat'] font-bold text-[16px] leading-6 tracking-[0.1px]">
          <span className="text-[#BDBDBD]">
            {formatMoney(
              product.compareAtPrice?.amount,
              product.compareAtPrice?.currency
            )}
          </span>
          <span className="font-bold text-[#23856D]">
            {formatMoney(product.price?.amount, product.price?.currency)}
          </span>
        </div>

        {/* Renk seçenekleri — yalnızca varyant renkleri varsa */}
        {!!product.variantColors?.length && (
          <div className="mt-3 flex items-center justify-center gap-2">
            {product.variantColors.map((name) => (
              <span
                key={name}
                title={name}
                className="inline-block h-4 w-4 rounded-full border border-black/10"
                style={{ backgroundColor: pickHexFromName(name) }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
