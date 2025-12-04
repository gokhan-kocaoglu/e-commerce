import AddressPreviewCard from "./AddressPreviewCard";
import { formatMoney } from "../../pages/CheckoutPaymentPage";

export default function OrderSummary({
  summary,
  step,
  shippingAddress,
  billingAddress,
}) {
  return (
    <aside className="flex-1/2 w-full max-w-md rounded-[4px] border border-[#E4E4E4] bg-white p-4 lg:w-[320px]">
      <h2 className="mb-4 font-['Montserrat'] text-[18px] font-bold leading-[24px] tracking-[0.2px] text-[#252B42]">
        Order Summary
      </h2>

      {summary ? (
        <div className="space-y-2 text-sm text-[#737373]">
          <div className="flex items-center justify-between">
            <span>Items total</span>
            <span className="font-semibold text-[#252B42]">
              {formatMoney(summary.itemsTotal)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Shipping</span>
            <span>{formatMoney(summary.shipping)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span className="text-[#E53935]">
              -{formatMoney(summary.discount)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tax</span>
            <span>{formatMoney(summary.tax)}</span>
          </div>

          <hr className="my-3 border-[#E4E4E4]" />

          <div className="flex items-center justify-between text-[16px] font-bold text-[#252B42]">
            <span>Total</span>
            <span>{formatMoney(summary.grandTotal)}</span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-zinc-500">Loading summary…</p>
      )}

      {step === 2 && (
        <div className="mt-8 grid gap-y-6 gap-x-4 md:grid-cols-2">
          <div className="md:col-span-1">
            <h4 className="text-[15px] font-medium text-[#252B42] mb-3">
              Shipping Address
            </h4>
            {shippingAddress ? (
              <AddressPreviewCard address={shippingAddress} />
            ) : (
              <p className="text-xs text-zinc-500">
                No shipping address selected.
              </p>
            )}
          </div>

          <div className="md:col-span-1">
            <h4 className="text-[15px] font-medium text-[#252B42] mb-3">
              Billing Address
            </h4>
            {billingAddress ? (
              <AddressPreviewCard address={billingAddress} />
            ) : (
              <p className="text-xs text-zinc-500">
                No billing address selected.
              </p>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
