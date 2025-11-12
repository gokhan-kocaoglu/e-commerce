import { LayoutGrid, List } from "lucide-react";

export default function FilterBar({
  totalText,
  view,
  sort,
  onChangeView,
  onChangeSort,
  onOpenFilter,
  className = "",
}) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-4 py-4">
        <span className="font-['Montserrat'] text-[14px] leading-[24px] tracking-[0.2px] text-[#252B42]">
          {totalText}
        </span>

        <div className="flex items-center gap-3">
          <span className="font-semibold text-[#252B42]">Views:</span>
          <button
            type="button"
            onClick={() => onChangeView("grid")}
            className={`h-10 w-10 rounded-md border ${
              view === "grid"
                ? "border-zinc-300 bg-white shadow-sm"
                : "border-zinc-200 bg-white/70"
            }`}
            aria-pressed={view === "grid"}
            title="Grid view"
          >
            <LayoutGrid className="mx-auto" />
          </button>
          <button
            type="button"
            onClick={() => onChangeView("list")}
            className={`h-10 w-10 rounded-md border ${
              view === "list"
                ? "border-zinc-300 bg-white shadow-sm"
                : "border-zinc-200 bg-white/70"
            }`}
            aria-pressed={view === "list"}
            title="List view"
          >
            <List className="mx-auto" />
          </button>

          <select
            value={sort}
            onChange={(e) => onChangeSort(e.target.value)}
            className="h-10 rounded-md border border-zinc-200 bg-white px-3 text-sm text-[#252B42]"
          >
            <option value="popularity">Popularity</option>
            <option value="newest">Newest</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>

          <button
            type="button"
            onClick={onOpenFilter}
            className="h-10 rounded-md bg-[#23A6F0] px-4 text-white font-semibold"
          >
            Filter
          </button>
        </div>
      </div>
    </div>
  );
}
