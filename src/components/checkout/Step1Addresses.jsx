import { Plus } from "lucide-react";

export default function Step1Addresses({
  loading,
  addresses,
  shippingId,
  billingId,
  billingSameAsShipping,
  onChangeShipping,
  onChangeBilling,
  onToggleBillingSame,
  onOpenEditor,
  onBackToCart,
  onContinue,
  canContinue,
}) {
  if (loading) {
    return (
      <div className="rounded-[4px] border border-[#E4E4E4] bg-white p-6 text-sm text-zinc-500">
        Loading addresses…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-zinc-600">
        You can choose one of your saved addresses for shipping and billing, or
        add a new address.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Shipping */}
        <div className="rounded-[4px] border border-[#E4E4E4] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-['Montserrat'] text-[16px] font-bold leading-[24px] tracking-[0.2px] text-[#252B42]">
              Shipping Address
            </h3>
            <button
              type="button"
              onClick={() => onOpenEditor(null, "shipping")}
              className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-3 h-9 text-xs font-semibold text-[#23A6F0] hover:bg-zinc-50"
            >
              <Plus className="h-4 w-4" />
              Add address
            </button>
          </div>

          {addresses.length === 0 ? (
            <p className="text-xs text-zinc-500">
              You don&apos;t have any saved addresses yet. Please add one.
            </p>
          ) : (
            <ul className="space-y-3">
              {addresses.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    onClick={() => onChangeShipping(a.id)}
                    className={`w-full rounded-lg border px-3 py-3 text-left text-xs transition ${
                      shippingId === a.id
                        ? "border-[#23A6F0] bg-[#EAF4FF]"
                        : "border-zinc-200 bg-white hover:bg-zinc-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-zinc-900">
                        {a.fullName}
                      </span>
                      {shippingId === a.id && (
                        <span className="text-[10px] text-[#23A6F0] font-semibold uppercase">
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-zinc-600">
                      {a.line1}
                      {a.line2 ? `, ${a.line2}` : ""}
                    </div>
                    <div className="text-zinc-600">
                      {a.city}, {a.state} {a.postalCode}
                    </div>
                    <div className="text-zinc-600">{a.countryCode}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Billing */}
        <div className="rounded-[4px] border border-[#E4E4E4] bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-['Montserrat'] text-[16px] font-bold leading-[24px] tracking-[0.2px] text-[#252B42]">
              Billing Address
            </h3>
          </div>

          <label className="mb-3 inline-flex items-center gap-2 text-xs text-zinc-800">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={billingSameAsShipping}
              onChange={(e) => onToggleBillingSame(e.target.checked)}
            />
            Use the same address for billing
          </label>

          {!billingSameAsShipping && (
            <>
              <div className="mb-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => onOpenEditor(null, "billing")}
                  className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-3 h-9 text-xs font-semibold text-[#23A6F0] hover:bg-zinc-50"
                >
                  <Plus className="h-4 w-4" />
                  Add address
                </button>
              </div>

              {addresses.length === 0 ? (
                <p className="text-xs text-zinc-500">
                  You don&apos;t have any saved addresses yet. Please add one.
                </p>
              ) : (
                <ul className="space-y-3">
                  {addresses.map((a) => (
                    <li key={a.id}>
                      <button
                        type="button"
                        onClick={() => onChangeBilling(a.id)}
                        className={`w-full rounded-lg border px-3 py-3 text-left text-xs transition ${
                          billingId === a.id
                            ? "border-[#23A6F0] bg-[#EAF4FF]"
                            : "border-zinc-200 bg-white hover:bg-zinc-50"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-zinc-900">
                            {a.fullName}
                          </span>
                          {billingId === a.id && (
                            <span className="text-[10px] text-[#23A6F0] font-semibold uppercase">
                              Selected
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-zinc-600">
                          {a.line1}
                          {a.line2 ? `, ${a.line2}` : ""}
                        </div>
                        <div className="text-zinc-600">
                          {a.city}, {a.state} {a.postalCode}
                        </div>
                        <div className="text-zinc-600">{a.countryCode}</div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {billingSameAsShipping && (
            <p className="mt-3 text-xs text-zinc-500">
              The billing address will be the same as your selected shipping
              address.
            </p>
          )}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={onBackToCart}
          className="rounded-[4px] border border-[#E4E4E4] px-6 py-2.5 text-sm font-semibold text-[#737373] hover:bg-zinc-50"
        >
          Back to cart
        </button>
        <button
          type="button"
          onClick={onContinue}
          disabled={!canContinue}
          className={`rounded-[4px] px-6 py-2.5 text-sm font-semibold text-white ${
            canContinue
              ? "bg-[#23A6F0] hover:bg-[#1d8dd0]"
              : "bg-[#9CCEF5] cursor-not-allowed"
          }`}
        >
          Save and Continue
        </button>
      </div>
    </div>
  );
}
