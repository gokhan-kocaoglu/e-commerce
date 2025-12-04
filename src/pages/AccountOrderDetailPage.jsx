// src/pages/account/AccountOrderDetailPage.jsx
import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams, useHistory, Link } from "react-router-dom";

import { selectAuth } from "../store/authSlice";
import { http } from "../lib/http";

import OrderStatusBadge from "../components/orders/OrderStatusBadge";

const formatMoney = (m) =>
  !m || m.amount == null ? "" : `${m.amount.toFixed(2)} ${m.currency || "USD"}`;

const formatDateTime = (iso) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AccountOrderDetailPage() {
  const { orderId } = useParams();
  const history = useHistory();
  const { isAuthenticated } = useSelector(selectAuth) ?? {};

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | loading | succeeded | failed

  // ✅ Auth guard
  useEffect(() => {
    if (!isAuthenticated) {
      history.replace(`/login?redirect=/account/orders/${orderId}`);
    }
  }, [isAuthenticated, history, orderId]);

  // ✅ Order fetch
  useEffect(() => {
    if (!isAuthenticated || !orderId) return;

    let cancelled = false;

    (async () => {
      try {
        setStatus("loading");
        const res = await http.get(`/api/orders/${orderId}`);
        if (!cancelled) {
          setOrder(res?.data?.data || null);
          setStatus("succeeded");
        }
      } catch (e) {
        if (!cancelled) setStatus("failed");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, orderId]);

  const items = useMemo(() => order?.items || [], [order]);

  if (!isAuthenticated) return null;

  return (
    <main className="min-h-screen bg-[#F9F9F9]">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Back link */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => history.push("/account/orders")}
            className="text-sm font-semibold text-[#23A6F0] hover:underline"
          >
            ← Back to orders
          </button>
        </div>

        {/* Loading / Error */}
        {status === "loading" && (
          <div className="rounded-[4px] border border-[#E4E4E4] bg-white p-6 text-sm text-[#737373]">
            Loading order details…
          </div>
        )}

        {status === "failed" && (
          <div className="rounded-[4px] border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            Could not load this order. It may not exist or you may not have
            permission to view it.
          </div>
        )}

        {status === "succeeded" && order && (
          <section className="rounded-[4px] border border-[#E4E4E4] bg-white p-6">
            {/* Header: ID + date + status + total */}
            <OrderDetailHeader order={order} />

            {/* Main content: left items, right summary */}
            <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
              {/* Left: items list */}
              <div className="flex-1 lg:pr-6 border-b border-[#E4E4E4] pb-6 lg:border-b-0 lg:border-r">
                <OrderItemsList items={items} />
              </div>

              {/* Right: totals + addresses */}
              <div className="mt-6 w-full lg:mt-0 lg:w-[260px]">
                <OrderTotalsCard order={order} />
                <div className="mt-4 space-y-4">
                  <AddressBlock
                    title="Shipping address"
                    address={order.shippingAddress}
                  />
                  <AddressBlock
                    title="Billing address"
                    address={order.billingAddress}
                  />
                </div>
              </div>
            </div>

            {/* Footer action */}
            <div className="mt-6 flex justify-end">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center rounded-[4px] border border-[#23A6F0] px-4 py-2 text-xs font-semibold text-[#23A6F0] transition hover:bg-[#23A6F0] hover:text-white"
              >
                Continue shopping
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

/* ------------------------------------------------------------------
   Header
------------------------------------------------------------------ */
function OrderDetailHeader({ order }) {
  const shortId = order.id ? String(order.id).slice(0, 8) : "";
  return (
    <header className="flex flex-col gap-4 border-b border-[#E4E4E4] pb-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2px] text-[#737373]">
          ORDER ID
        </p>
        <p className="font-['Montserrat'] text-[18px] font-bold text-[#252B42]">
          #{shortId}
        </p>

        <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2px] text-[#737373]">
          ORDER DATE
        </p>
        <p className="text-sm font-medium text-[#252B42]">
          {formatDateTime(order.createdAt ?? order.created_at)}
        </p>
      </div>

      <div className="flex flex-col items-start gap-3 md:items-end">
        <OrderStatusBadge status={order.status} />
        <div className="text-right text-sm text-[#737373]">
          <p className="text-xs font-semibold uppercase tracking-[0.2px]">
            ORDER TOTAL
          </p>
          <p className="text-[18px] font-bold text-[#252B42]">
            {formatMoney(order.grandTotal)}
          </p>
        </div>
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------
   Items list
------------------------------------------------------------------ */
function OrderItemsList({ items }) {
  if (!items || items.length === 0) {
    return (
      <p className="text-sm text-[#737373]">
        There are no items in this order.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-['Montserrat'] text-[16px] font-bold leading-[24px] tracking-[0.2px] text-[#252B42]">
        Order items
      </h2>

      <ul className="space-y-3">
        {items.map((it) => (
          <li
            key={it.variantId ?? it.id}
            className="flex items-center gap-4 rounded-[4px] border border-[#E4E4E4] bg-[#F9FAFB] p-3"
          >
            {/* Thumbnail */}
            <OrderItemThumb item={it} />

            {/* Text info */}
            <div className="flex flex-1 flex-col gap-1 text-sm text-[#4B5563]">
              <p className="font-semibold text-[#252B42]">
                {it.productTitle || it.sku}
              </p>
              {it.sku && (
                <p className="text-xs text-[#9CA3AF]">SKU: {it.sku}</p>
              )}
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#737373]">
                <span>Qty: {it.quantity}</span>
                <span>
                  Unit:{" "}
                  <span className="font-semibold text-[#252B42]">
                    {formatMoney(it.unitPrice)}
                  </span>
                </span>
              </div>
            </div>

            {/* Line total */}
            <div className="text-right text-sm font-semibold text-[#252B42]">
              {formatMoney(it.lineTotal)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function resolveImageUrl(raw) {
  if (!raw) return "";

  // Tam URL ise dokunma
  if (/^https?:\/\//i.test(raw)) return raw;

  // root-relative yap: "images/a.jpg" -> "/images/a.jpg"
  const cleaned = raw.replace(/^\/+/, ""); // baştaki /'ları temizle
  return `/${cleaned}`;
}

function OrderItemThumb({ item }) {
  const raw =
    item.mainImageUrl ||
    item.imageUrl ||
    item.image ||
    item.image_url ||
    item.thumbnailUrl;
  const src = resolveImageUrl(raw);
  const alt = item.productTitle || item.sku || "Product";
  return (
    <div className="h-21 w-21 flex-shrink-0 overflow-hidden rounded-md border border-[#E4E4E4] bg-[#F3F4F6]">
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
}

/* ------------------------------------------------------------------
   Totals card (sağ üst)
------------------------------------------------------------------ */
function OrderTotalsCard({ order }) {
  return (
    <div className="rounded-[4px] border border-[#E4E4E4] bg-[#F9FAFB] p-4 text-sm text-[#737373]">
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
        <span className="text-[#E53935]">-{formatMoney(order.discount)}</span>
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
  );
}

/* ------------------------------------------------------------------
   Address block (shipping / billing)
------------------------------------------------------------------ */
function AddressBlock({ title, address }) {
  if (!address) return null;

  const { fullName, line1, line2, city, state, postalCode, countryCode } =
    address;

  return (
    <div className="rounded-[4px] border border-[#E4E4E4] bg-[#F9F9F9] p-4 text-xs text-[#4B5563]">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
        {title}
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
