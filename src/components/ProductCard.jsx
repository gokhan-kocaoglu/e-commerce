import { Link } from "react-router-dom";
import { getCategoryById, getColorByCode } from "../data/catalog";
import { formatMoney } from "../utils/format";

export default function ProductCard({ product }) {
  const category = getCategoryById(product.categoryId);
  const img = product.media?.[0];

  return (
    // Dış sarmalayıcıyı parent (BestSellers) yönetiyor.
    <div className="flex w-80 lg:w-60 flex-col items-center">
      {/* Görsel */}
      <Link
        to={`/product/${product.slug}`}
        className="block"
        aria-label={product.title}
      >
        <div
          className="mx-auto w-[320px] lg:w-full max-h-[425px] overflow-hidden md:h-[427px] md:w-[240px]"
          style={{ aspectRatio: "240/427" }}
        >
          <img
            src={img?.src}
            alt={img?.alt || product.title}
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
        </div>
      </Link>

      {/* Metinler */}
      <div className="mt-4 flex w-full max-w-[240px] flex-col items-center text-center">
        <h5 className="font-['Montserrat'] text-[16px] font-bold leading-6 tracking-[0.1px] text-[#252B42]">
          {product.title}
        </h5>

        {category && (
          <Link
            to={category.path}
            className="mt-1 font-['Montserrat'] text-[14px] font-bold leading-6 tracking-[0.2px] text-[#737373] hover:underline"
          >
            {category.name}
          </Link>
        )}

        {/* Fiyatlar */}
        <div className="mt-3 flex items-center gap-2 font-['Montserrat'] text-sm leading-5">
          <span className="text-[#BDBDBD] line-through">
            {formatMoney(product.price.list, product.price.currency)}
          </span>
          <span className="font-bold text-[#23856D]">
            {formatMoney(product.price.sale, product.price.currency)}
          </span>
        </div>

        {/* Renk seçenekleri */}
        <div className="mt-3 flex items-center gap-2">
          {product.options?.colors?.map((code) => {
            const c = getColorByCode(code);
            return (
              <span
                key={code}
                title={c?.name || code}
                className="inline-block h-4 w-4 rounded-full border border-black/10"
                style={{ backgroundColor: c?.hex || "#ccc" }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
