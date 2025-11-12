import { ChevronLeft, ChevronRight } from "lucide-react";
import { useHistory, useLocation } from "react-router-dom";
import UniversalProductCard from "../../components/UniversalProductCard";

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

export default function ProductGrid({ data, isLoading, isError, page, size }) {
  const update = useQueryUpdater();
  const totalPages = data?.totalPages ?? 0;
  const curPage = page ?? 1;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 md:py-8">
      {/* grid / skeleton */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: size ?? 12 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] animate-pulse rounded-xl bg-zinc-200"
            />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          Ürünler yüklenemedi. Lütfen tekrar deneyin.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {data?.items?.map((p) => (
              <UniversalProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex justify-center">
              <nav className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white p-1">
                <button
                  onClick={() => update({ page: 1 })}
                  disabled={curPage <= 1}
                  className="px-3 py-2 text-sm disabled:opacity-40"
                >
                  First
                </button>

                <button
                  onClick={() => update({ page: Math.max(1, curPage - 1) })}
                  disabled={curPage <= 1}
                  className="px-3 py-2 text-sm disabled:opacity-40"
                >
                  <ChevronLeft className="inline h-4 w-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const n = i + 1;
                  const active = n === curPage;
                  return (
                    <button
                      key={n}
                      onClick={() => update({ page: n })}
                      className={`h-9 w-9 rounded-md text-sm ${
                        active ? "bg-[#23A6F0] text-white" : "bg-white"
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    update({ page: Math.min(totalPages, curPage + 1) })
                  }
                  disabled={curPage >= totalPages}
                  className="px-3 py-2 text-sm disabled:opacity-40"
                >
                  <ChevronRight className="inline h-4 w-4" />
                </button>

                <button
                  onClick={() => update({ page: totalPages })}
                  disabled={curPage >= totalPages}
                  className="px-3 py-2 text-sm disabled:opacity-40"
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
