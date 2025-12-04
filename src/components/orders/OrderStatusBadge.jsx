const STATUS_STYLES = {
  CREATED: {
    label: "Created",
    className: "bg-[#E3F3FF] text-[#23A6F0] border-[#23A6F0]",
  },
  PENDING_PAYMENT: {
    label: "Awaiting payment",
    className: "bg-[#FFF4E5] text-[#F2994A] border-[#F2994A]",
  },
  PAID: {
    label: "Paid",
    className: "bg-[#E7F6EC] text-[#2DC071] border-[#2DC071]",
  },
  FULFILLING: {
    label: "Preparing order",
    className: "bg-[#E3F3FF] text-[#252B42] border-[#23A6F0]",
  },
  SHIPPED: {
    label: "Shipped",
    className: "bg-[#E7F6EC] text-[#2DC071] border-[#2DC071]",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-[#E7F6EC] text-[#2DC071] border-[#2DC071]",
  },
  CANCELED: {
    label: "Canceled",
    className: "bg-[#FDECEC] text-[#E53935] border-[#E53935]",
  },
  REFUNDED: {
    label: "Refunded",
    className: "bg-[#FDECEC] text-[#E53935] border-[#E53935]",
  },
};

export default function OrderStatusBadge({ status }) {
  const key = (status || "").toUpperCase();
  const cfg = STATUS_STYLES[key] || {
    label: status || "Unknown",
    className: "bg-gray-100 text-gray-600 border-gray-300",
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.4px] ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}
