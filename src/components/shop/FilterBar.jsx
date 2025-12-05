import { useEffect, useState } from "react";
import { LayoutGrid, List } from "lucide-react";
import { ChevronDown } from "lucide-react";

export default function FilterBar({
  totalText,
  view, // "grid" | "list"
  sort, // url’deki/uygulanmış sort
  onChangeView, // (v) => void
  onApplySort, // (v) => void  // Filter'a basınca bunu çağırıyoruz
  className = "",
}) {
  const [pendingSort, setPendingSort] = useState(sort);

  // URL değişirse select'i senkronla
  useEffect(() => setPendingSort(sort), [sort]);

  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 ${className}`}>
      <div className="flex flex-wrap items-center justify-center sm:justify-between gap-4 py-4">
        {/* SOL: toplam */}
        <div className="min-w-0 order-1 sm:order-none">
          <h6 className="font-['Montserrat'] font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#737373]">
            {totalText}
          </h6>
        </div>

        {/* ORTA: Views (merkez) */}
        <div className="order-2 w-full sm:order-none sm:w-auto">
          <div className="flex items-center justify-center gap-3">
            <span className="font-['Montserrat'] font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#737373]">
              Views:
            </span>
            <button
              type="button"
              onClick={() => onChangeView("grid")}
              className={`h-10 w-10 rounded-md border transition ${
                view === "grid"
                  ? "border-zinc-300 bg-white shadow-sm ring-1 ring-zinc-300"
                  : "border-zinc-200 bg-white/70 hover:bg-white"
              }`}
              aria-pressed={view === "grid"}
              title="Grid view"
            >
              <LayoutGrid className="mx-auto" />
            </button>
            <button
              type="button"
              onClick={() => onChangeView("list")}
              className={`h-10 w-10 rounded-md border transition ${
                view === "list"
                  ? "border-zinc-300 bg-white shadow-sm ring-1 ring-zinc-300"
                  : "border-zinc-200 bg-white/70 hover:bg-white"
              }`}
              aria-pressed={view === "list"}
              title="List view"
            >
              <List className="mx-auto" />
            </button>
          </div>
        </div>

        {/* SAĞ: Sort + Filter */}
        <div className="flex gap-3 sm:order-none order-3">
          <div className="relative">
            <select
              value={pendingSort}
              onChange={(e) => setPendingSort(e.target.value)}
              className="
      h-10 rounded-md border border-[#DDDDDD] bg-[#F9F9F9]
      px-3 pr-10
      appearance-none
      font-['Montserrat'] font-normal text-[14px] leading-[28px] tracking-[0.2px]
      text-[#252B42]
    "
            >
              <option value="popularity">Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="az">A to Z</option>
              <option value="za">Z to A</option>
            </select>

            <ChevronDown
              className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2"
              color="#737373"
              strokeWidth={2}
            />
          </div>

          <button
            type="button"
            onClick={() => onApplySort(pendingSort)}
            className="h-10 rounded-md bg-[#23A6F0] px-4 text-white font-semibold"
          >
            Filter
          </button>
        </div>
      </div>
    </div>
  );
}
