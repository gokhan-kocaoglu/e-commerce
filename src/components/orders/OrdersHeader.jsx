export default function OrdersHeader({ totalOrders, loading }) {
  return (
    <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="font-['Montserrat'] text-[24px] font-bold leading-[32px] tracking-[0.2px] text-[#252B42]">
          My Orders
        </h1>
        <p className="text-sm text-[#737373]">
          Here you can track all your past and current orders.
        </p>
      </div>

      <div className="mt-2 flex items-center gap-3 sm:mt-0">
        <div className="rounded-full bg-[#E3F3FF] px-4 py-1 text-xs font-semibold text-[#23A6F0]">
          {loading
            ? "Loading…"
            : `${totalOrders} order${totalOrders === 1 ? "" : "s"}`}
        </div>
      </div>
    </header>
  );
}
