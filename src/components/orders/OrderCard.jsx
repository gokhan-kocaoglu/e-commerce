import { Link } from "react-router-dom";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderItemRow from "./OrderItemRow";

const formatMoney = (m) =>
  !m || m.amount == null ? "" : `${m.amount.toFixed(2)} ${m.currency || "USD"}`;

const formatDate = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// --- Shipping address summary (altta) ---
function ShippingAddressSummary({ address }) {
  if (!address) return null;

  const { fullName, line1, line2, city, state, postalCode, countryCode } =
    address;

  return (
    <div className="mt-3 rounded-md bg-[#F9F9F9] px-3 py-2 text-xs text-[#4B5563]">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
        SHIPPING ADDRESS
      </p>
      {fullName && (
        <p className="leading-snug font-semibold text-[#252B42]">{fullName}</p>
      )}
      {line1 && <p className="leading-snug">{line1}</p>}
      {line2 && <p className="leading-snug">{line2}</p>}
      <p className="leading-snug">
        {[city, state, postalCode].filter(Boolean).join(", ")}
      </p>
      {countryCode && <p className="leading-snug">{countryCode}</p>}
    </div>
  );
}

// --- Sağ panelde kullanılacak küçük görseller ---
function OrderThumbStrip({ items }) {
  if (!items || items.length === 0) return null;

  const visible = items.slice(0, 3);
  const remaining = Math.max(items.length - visible.length, 0);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {visible.map((line) => {
        const src =
          line.mainImageUrl ||
          line.imageUrl ||
          line.image ||
          line.image_url ||
          line.thumbnailUrl;
        const alt = line.productTitle || line.sku || "Product image";

        return (
          <div
            key={line.variantId ?? line.id}
            className="h-16 w-16 overflow-hidden rounded-md border border-[#E4E4E4] bg-[#F3F4F6]"
          >
            {src ? (
              <img
                src={src}
                alt={alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold text-[#9CA3AF]">
                {alt.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
        );
      })}

      {remaining > 0 && (
        <span className="text-[11px] font-medium text-[#6B7280]">
          +{remaining} more
        </span>
      )}
    </div>
  );
}

export default function OrderCard({ order }) {
  const items = order.items || [];
  const visibleItems = items.slice(0, 3);
  const remainingCount = Math.max(items.length - visibleItems.length, 0);

  const shortId = order.id ? String(order.id).slice(0, 8) : "";

  return (
    <article className="flex flex-col gap-4 rounded-[4px] border border-[#E4E4E4] bg-white p-4 md:flex-row md:items-stretch">
      {/* SOL: meta + ürün satırları */}
      <div className="flex flex-col gap-4">
        {/* Top row: ID + date + status */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-col gap-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2px] text-[#737373]">
              ORDER ID
            </p>
            <p className="font-['Montserrat'] text-[14px] font-bold text-[#252B42]">
              #{shortId}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1 text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.2px] text-[#737373]">
              ORDER DATE
            </p>
            <p className="text-sm font-medium text-[#252B42]">
              {formatDate(order.createdAt ?? order.created_at)}
            </p>
          </div>

          <div className="w-full md:w-auto md:self-center">
            <OrderStatusBadge status={order.status} />
          </div>
        </div>

        {/* Items list (sadece text satırları) */}
        <div className="mt-2 flex flex-col gap-2">
          {visibleItems.map((item) => (
            <OrderItemRow key={item.id ?? item.variantId} item={item} />
          ))}

          {remainingCount > 0 && (
            <p className="text-xs text-[#737373]">
              + {remainingCount} more item{remainingCount === 1 ? "" : "s"}
            </p>
          )}
        </div>
      </div>

      {/* SAĞ: görseller + totals + adres + buton */}
      <div className="mt-4 flex w-full flex-col justify-between border-t border-[#E4E4E4] pt-4 md:mt-0 md:border-l md:border-t-0 md:pl-6 md:pt-0">
        {/* Üst blok: sol 50% görsel, sağ 50% totals */}
        <div className="flex min-h-[96px] items-center gap-4">
          {/* Sol 50% – görsel alanı, yatayda ortalı */}
          <div className="flex mx-auto justify-center">
            <OrderThumbStrip items={items} />
          </div>

          {/* Sağ 50% – totals, sağa yaslı */}
          <div className="flex justify-end">
            <div className="flex min-w-[180px] flex-col gap-1 text-right text-sm text-[#737373]">
              <div className="flex items-center justify-between">
                <span>Items total</span>
                <span className="font-semibold text-[#252B42]">
                  {formatMoney(order.itemsTotal)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span>{formatMoney(order.shipping)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Discount</span>
                <span className="text-[#E53935]">
                  -{formatMoney(order.discount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax</span>
                <span>{formatMoney(order.tax)}</span>
              </div>

              <hr className="my-2 border-[#E4E4E4]" />

              <div className="flex items-center justify-between text-[15px] font-bold text-[#252B42]">
                <span>Total</span>
                <span>{formatMoney(order.grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Adres */}
        <ShippingAddressSummary address={order.shippingAddress} />

        {/* Buton */}
        <div className="mt-3 flex justify-end">
          <Link
            to={`/account/orders/${order.id ?? ""}`}
            className="inline-flex items-center justify-center rounded-[4px] border border-[#23A6F0] px-4 py-2 text-xs font-semibold text-[#23A6F0] transition hover:bg-[#23A6F0] hover:text-white"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
