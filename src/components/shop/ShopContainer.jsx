// src/components/shop/ShopContainer.jsx
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { buildTrailById, getRouteMetaByPath } from "../../data/navMeta";

export default function ShopContainer({ className = "" }) {
  const { pathname } = useLocation();
  // mevcut path’e karşılık gelen meta (örn. /shop)
  const current = getRouteMetaByPath(pathname) ?? getRouteMetaByPath("/shop");
  // breadcrumb: parent zinciri + current
  const trail = current ? buildTrailById(current.id) : [];

  return (
    <section
      className={`w-full bg-white ${className}`}
      aria-labelledby="shop-page-heading"
    >
      <div className="mx-auto w-full max-w-7xl lg:px-1 sm:px-6">
        <div className="flex flex-col items-center gap-3 py-6 md:flex-row md:items-center md:justify-between md:py-8">
          {/* Shop başlık — h3: 24/32, 700, 0.1px, #252B42 */}
          <h3
            id="shop-page-heading"
            className="font-['Montserrat'] font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42]"
          >
            {current?.title ?? "Shop"}
          </h3>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center">
            <ol className="flex items-center gap-2">
              {trail.map((r, idx) => {
                const isLast = idx === trail.length - 1;
                return (
                  <li key={r.id} className="flex items-center">
                    {isLast ? (
                      <span
                        className="font-['Montserrat'] font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#BDBDBD]"
                        aria-current="page"
                      >
                        {r.breadcrumb}
                      </span>
                    ) : (
                      <>
                        <Link
                          to={r.path}
                          className="font-['Montserrat'] font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#252B42] hover:opacity-80 transition-opacity"
                        >
                          {r.breadcrumb}
                        </Link>
                        <ChevronRight
                          className="mx-1 h-[18px] w-[18px] text-[#BDBDBD]"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  );
}
