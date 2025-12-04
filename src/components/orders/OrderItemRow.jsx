export default function OrderItemRow({ item }) {
  const title =
    item.productTitleSnapshot || item.productTitle || item.title || "Product";

  const qty = item.quantity ?? 0;

  return (
    <div className="flex items-center justify-between gap-3 text-xs text-[#252B42]">
      <div className="flex min-w-0 flex-col">
        <span className="truncate font-medium">{title}</span>
      </div>
      <div className="flex items-center text-[#737373]">
        <span className="text-[11px]">Qty:</span>
        <span className="ml-1 font-semibold">{qty}</span>
      </div>
    </div>
  );
}
