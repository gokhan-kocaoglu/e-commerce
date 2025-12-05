import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { getPrimaryNav } from "../../data/siteConfig";

// küçük manifest çıkarımı (breadcrumb için)
function flatten(items, parent = null, acc = []) {
  for (const it of items) {
    acc.push({ ...it, parent: parent?.id || null });
    if (it.children) flatten(it.children, it, acc);
  }
  return acc;
}
const NAV = flatten(getPrimaryNav());
const byPath = Object.fromEntries(NAV.map((x) => [x.path, x]));
const byId = Object.fromEntries(NAV.map((x) => [x.id, x]));

function buildTrail(meta) {
  if (!meta) return [];
  const trail = [];
  let cur = meta;
  while (cur) {
    trail.unshift(cur);
    cur = cur.parent ? byId[cur.parent] : null;
  }
  return trail;
}

export default function ShopContainer({
  className = "",
  heading, // <─ opsiyonel: başlığı override etmek için
  customTrail, // <─ opsiyonel: breadcrumb’ı override etmek için
}) {
  const { pathname } = useLocation();

  const current = byPath[pathname] || byPath["/shop"];

  // Eğer customTrail geldiyse onu kullan, yoksa eski mantık
  const trail = customTrail?.length ? customTrail : buildTrail(current);

  // Başlık da override edilebilir, yoksa yine eski mantık
  const title = heading || current?.label || "Shop";

  return (
    <section
      className={`w-full bg-white ${className}`}
      aria-labelledby="shop-heading"
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-3 py-6 md:flex-row md:items-center md:justify-between md:py-8">
          <h3
            id="shop-heading"
            className="font-['Montserrat'] font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42]"
          >
            {title}
          </h3>

          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              {trail.map((r, i) => {
                const last = i === trail.length - 1;
                const key = r.id || r.path || r.label || i; // customTrail için fallback key
                return (
                  <li key={key} className="flex items-center">
                    {last ? (
                      <span
                        className="font-['Montserrat'] font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#BDBDBD]"
                        aria-current="page"
                      >
                        {r.label}
                      </span>
                    ) : (
                      <>
                        <Link
                          to={r.path || "#"}
                          className="font-['Montserrat'] font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#252B42] hover:opacity-80"
                        >
                          {r.label}
                        </Link>
                        <ChevronRight className="mx-1 h-[18px] w-[18px] text-[#BDBDBD]" />
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
