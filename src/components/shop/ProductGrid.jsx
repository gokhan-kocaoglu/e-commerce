// src/components/shop/ProductGrid.jsx
import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHistory, useLocation } from "react-router-dom";
import UniversalProductCard from "../../components/UniversalProductCard";
import { getComparator } from "../../utils/sorters";
import { useVariantColors } from "../../queries/variantQueries";

/* URL helper */
function useQueryUpdater() {
  const history = useHistory();
  const location = useLocation();
  return (patch) => {
    const usp = new URLSearchParams(location.search);
    Object.entries(patch).forEach(([k, v]) => {
      if (v == null || v === "") usp.delete(k);
      else usp.set(k, String(v));
    });
    history.replace({ pathname: location.pathname, search: usp.toString() });
  };
}

/* küçük yardımcılar (UniversalProductCard ile uyumlu) */
const fmt = (n, cur = "USD") =>
  n == null ? "" : `${Number(n).toFixed(2)} ${cur}`;
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

/* List görünüm satırı */
function ListRow({ p }) {
  // grid’deki ile aynı davranış: initial varsa onu kullan, yoksa lazy fetch
  const initial = p?.variantColors || [];
  const { data: colors = [] } = useVariantColors(p?.id, initial);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row">
      {/* image */}
      <div className="w-full sm:w-[220px] shrink-0">
        <img
          src={p.imageUrl}
          alt={p.title}
          className="h-[220px] w-full rounded-lg object-cover object-center"
          loading="lazy"
        />
      </div>

      {/* content */}
      <div className="min-w-0 flex-1">
        <h5 className="font-['Montserrat'] text-[16px] font-bold leading-6 tracking-[0.1px] text-[#252B42]">
          {p.title}
        </h5>

        {p.subtitle && (
          <p className="mt-1 line-clamp-2 font-['Montserrat'] text-[14px] leading-6 tracking-[0.2px] text-[#737373]">
            {p.subtitle}
          </p>
        )}

        {/* fiyatlar */}
        <div className="mt-3 flex items-center gap-3 font-['Montserrat'] text-[16px] font-bold leading-6 tracking-[0.1px]">
          {p.compareAtPrice != null && (
            <span className="text-[#BDBDBD] line-through">
              {fmt(p.compareAtPrice, p.currency)}
            </span>
          )}
          <span className="text-[#23856D]">{fmt(p.price, p.currency)}</span>
        </div>

        {/* varyant renkleri */}
        {!!colors.length && (
          <div className="mt-3 flex items-center gap-2">
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

export default function ProductGrid({
  data,
  isLoading,
  isError,
  page,
  size,
  sort = "popularity",
  view = "grid", // "grid" | "list"
}) {
  const update = useQueryUpdater();
  const totalPages = data?.totalPages ?? 0;
  const curPage = page ?? 1;

  const items = data?.items ?? [];
  const sortedItems = useMemo(() => {
    const cmp = getComparator(sort);
    return [...items].sort(cmp);
  }, [items, sort]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 md:py-8">
      {isLoading ? (
        <div
          className={
            view === "grid"
              ? "grid grid-cols-1 gap-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5"
              : "grid grid-cols-1 gap-4"
          }
        >
          {Array.from({ length: size ?? 12 }).map((_, i) => (
            <div
              key={i}
              className={
                view === "grid"
                  ? "aspect-[4/5] animate-pulse rounded-xl bg-zinc-200"
                  : "h-[260px] animate-pulse rounded-xl bg-zinc-200"
              }
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          Ürünler yüklenemedi. Lütfen tekrar deneyin.
        </div>
      ) : (
        <>
          {view === "grid" ? (
            <div className="grid grid-cols-1 px-6 sm:px-0 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {sortedItems.map((p) => (
                <UniversalProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {sortedItems.map((p) => (
                <ListRow key={p.id} p={p} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 min-h-20 flex justify-center">
              <nav
                className="
        inline-flex items-stretch overflow-hidden
        rounded-lg border border-zinc-200 bg-white shadow-sm
        divide-x divide-zinc-200 
      "
                aria-label="Pagination"
              >
                {/* First */}
                <button
                  onClick={() => update({ page: 1 })}
                  disabled={curPage <= 1}
                  className={`
          h-full px-4
          font-['Montserrat'] font-bold text-[14px] leading-6 tracking-[0.2px]
          ${
            curPage <= 1
              ? "text-[#BDBDBD] cursor-not-allowed"
              : "text-[#23A6F0] hover:bg-zinc-50"
          }
        `}
                >
                  First
                </button>

                {/* Sayfa numaraları */}
                {Array.from({ length: totalPages }).map((_, i) => {
                  const n = i + 1;
                  const active = n === curPage;
                  return (
                    <button
                      key={n}
                      onClick={() => update({ page: n })}
                      aria-current={active ? "page" : undefined}
                      className={`
              h-full w-12
              font-['Montserrat'] font-bold text-[14px] leading-6 tracking-[0.2px]
              ${
                active
                  ? "bg-[#23A6F0] text-white"
                  : "bg-white text-[#23A6F0] hover:bg-zinc-50"
              }
            `}
                    >
                      {n}
                    </button>
                  );
                })}

                {/* Next */}
                <button
                  onClick={() =>
                    update({ page: Math.min(totalPages, curPage + 1) })
                  }
                  disabled={curPage >= totalPages}
                  className={`
          h-full px-4
          font-['Montserrat'] font-bold text-[14px] leading-6 tracking-[0.2px]
          ${
            curPage >= totalPages
              ? "text-[#BDBDBD] cursor-not-allowed"
              : "text-[#23A6F0] hover:bg-zinc-50"
          }
        `}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </section>
  );
}
