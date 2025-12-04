export default function OrdersPagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const isFirst = page <= 0;
  const isLast = page >= totalPages - 1;
  return (
    <nav className="mt-6 flex items-center justify-between text-sm text-[#737373]">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={isFirst}
        className={`rounded-[4px] border px-3 py-1.5 text-xs font-semibold ${
          isFirst
            ? "cursor-not-allowed border-[#E4E4E4] text-[#B3B3B3]"
            : "border-[#23A6F0] text-[#23A6F0] hover:bg-[#23A6F0] hover:text-white transition"
        }`}
      >
        Previous
      </button>

      <span className="text-xs">
        Page <span className="font-semibold text-[#252B42]">{page + 1}</span> of{" "}
        <span className="font-semibold text-[#252B42]">{totalPages}</span>
      </span>

      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={isLast}
        className={`rounded-[4px] border px-3 py-1.5 text-xs font-semibold ${
          isLast
            ? "cursor-not-allowed border-[#E4E4E4] text-[#B3B3B3]"
            : "border-[#23A6F0] text-[#23A6F0] hover:bg-[#23A6F0] hover:text-white transition"
        }`}
      >
        Next
      </button>
    </nav>
  );
}
