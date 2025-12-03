import { useEffect, useMemo, useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { selectAuth } from "../store/authSlice";
import { selectCartItems, setCartFromApi, clearCart } from "../store/cartSlice";
import { http } from "../lib/http";

import { Plus } from "lucide-react";

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */
const requiredMsg = (f) => `${f} is required`;

const formatMoney = (m) =>
  !m || m.amount == null ? "" : `${m.amount.toFixed(2)} ${m.currency || "USD"}`;

const cardBrandFromNumber = (raw) => {
  const num = (raw || "").replace(/\D/g, "");
  if (!num) return "unknown";

  if (num.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(num) || /^2(2[2-9]|[3-6]\d|7[01])/.test(num))
    return "mastercard";
  if (/^3[47]/.test(num)) return "amex";
  return "card";
};

const toOrderAddressPayload = (addr) => {
  if (!addr) return null;
  return {
    fullName: addr.fullName ?? "",
    line1: addr.line1 ?? "",
    line2: addr.line2 ?? "",
    city: addr.city ?? "",
    state: addr.state ?? "",
    postalCode: addr.postalCode ?? "",
    countryCode: addr.countryCode ?? "",
  };
};

/* -------------------------------------------------------
   Main Page
------------------------------------------------------- */
export default function CheckoutPaymentPage() {
  const history = useHistory();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector(selectAuth) ?? {};
  const cartItems = useSelector(selectCartItems);

  const [step, setStep] = useState(1);

  // Address data
  const [addresses, setAddresses] = useState([]);
  const [addrLoading, setAddrLoading] = useState(true);
  const [addrEditor, setAddrEditor] = useState(null); // null | { initial, context }

  const [shippingId, setShippingId] = useState(null);
  const [billingId, setBillingId] = useState(null);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);

  // Cart summary (from BE /api/cart)
  const [summary, setSummary] = useState(null);

  // Order submitting state
  const [submitting, setSubmitting] = useState(false);

  // Payment form
  const paymentForm = useForm({
    mode: "onTouched",
    defaultValues: {
      method: "card",
      cardHolder: "",
      cardNumber: "",
      expiry: "",
      cvv: "",
    },
  });

  /* ----------------- Auth guard + empty cart guard ----------------- */
  useEffect(() => {
    if (!isAuthenticated) {
      history.replace("/login?redirect=/checkout/payment");
    }
  }, [isAuthenticated, history]);

  useEffect(() => {
    if (isAuthenticated && (!cartItems || cartItems.length === 0)) {
      // If cart is empty, there is no reason to be on payment page
      history.replace("/checkout");
    }
  }, [isAuthenticated, cartItems, history]);

  /* ----------------- Bootstrap: addresses + cart summary ----------------- */
  useEffect(() => {
    if (!isAuthenticated) return;

    (async () => {
      try {
        setAddrLoading(true);

        const [addrRes, cartRes] = await Promise.all([
          http.get("/api/account/addresses"),
          http.get("/api/cart"),
        ]);

        const addrList = Array.isArray(addrRes?.data?.data)
          ? addrRes.data.data
          : [];
        setAddresses(addrList);

        // defaults
        const defaultShip =
          addrList.find((a) => a.defaultShipping) || addrList[0];
        const defaultBill =
          addrList.find((a) => a.defaultBilling) || defaultShip;

        setShippingId(defaultShip?.id || null);
        setBillingId(defaultBill?.id || null);
        setBillingSameAsShipping(
          !!defaultShip && !!defaultBill && defaultShip.id === defaultBill.id
        );

        const apiCart = cartRes?.data?.data || {};
        dispatch(setCartFromApi(apiCart)); // keep FE cart fully in sync with BE
        setSummary(apiCart.summary || null);
      } catch (e) {
        // interceptor already shows toast
      } finally {
        setAddrLoading(false);
      }
    })();
  }, [isAuthenticated, dispatch]);

  /* ----------------- Derived state ----------------- */
  const shippingAddress = useMemo(
    () => addresses.find((a) => a.id === shippingId) || null,
    [addresses, shippingId]
  );

  const billingAddress = useMemo(() => {
    if (billingSameAsShipping) return shippingAddress;
    return addresses.find((a) => a.id === billingId) || null;
  }, [addresses, billingId, billingSameAsShipping, shippingAddress]);

  const canContinueStep1 =
    !!shippingAddress && (!!billingAddress || billingSameAsShipping);

  const cartItemsPayload = useMemo(
    () =>
      (cartItems || []).map((it) => ({
        variantId: it.variantId,
        quantity: it.quantity || 1,
      })),
    [cartItems]
  );

  /* ----------------- Address reload helper ----------------- */
  const reloadAddresses = async () => {
    try {
      const addrRes = await http.get("/api/account/addresses");
      const list = Array.isArray(addrRes?.data?.data) ? addrRes.data.data : [];
      setAddresses(list);

      // Ensure selected ids still exist
      if (shippingId && !list.some((a) => a.id === shippingId)) {
        setShippingId(list[0]?.id || null);
      }
      if (billingId && !list.some((a) => a.id === billingId)) {
        setBillingId(list[0]?.id || null);
      }
    } catch {}
  };

  /* ----------------- Payment submit ----------------- */
  const onSubmitPayment = paymentForm.handleSubmit(async (vals) => {
    if (!shippingAddress) {
      toast.error("Please select a shipping address.");
      setStep(1);
      return;
    }

    const billAddr = billingAddress || shippingAddress;

    if (!cartItemsPayload.length) {
      toast.error("Your cart is empty.");
      history.replace("/checkout");
      return;
    }

    setSubmitting(true);
    try {
      // 1) ORDER CREATE  (stock reservation also happens here)
      const orderRes = await http.post("/api/orders", {
        items: cartItemsPayload,
        shippingAddress: toOrderAddressPayload(shippingAddress),
        billingAddress: toOrderAddressPayload(billAddr),
        couponCode: null,
      });

      const order = orderRes?.data?.data;
      if (!order) throw new Error("Order create failed");

      // 2) CAPTURE (mock payment)
      const cleanCardNumber = vals.cardNumber.replace(/\D/g, "");
      const providerRef = `mock-${order.id}-${Date.now()}`;
      const amountCents = Math.round((order.grandTotal?.amount || 0) * 100);

      await http.post(`/api/orders/${order.id}/capture`, {
        provider: "mock-card",
        providerRef,
        amountCents,
        payloadJson: JSON.stringify({
          brand: cardBrandFromNumber(cleanCardNumber),
          last4: cleanCardNumber.slice(-4),
          holder: vals.cardHolder,
          expiry: vals.expiry,
        }),
        cardSnapshotJson: null,
      });

      // 3) Clear FE cart
      dispatch(clearCart());

      toast.success("Your order has been placed successfully.");
      history.replace("/account/orders");
    } catch (e) {
      // For stock issues etc. BE returns 400; interceptor shows error message
      // Optionally you could redirect back to /checkout here
    } finally {
      setSubmitting(false);
    }
  });

  /* ----------------- Render guards ----------------- */
  if (!isAuthenticated) return null;

  if (!cartItems || cartItems.length === 0) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-sm text-zinc-600">
          Your cart is currently empty.{" "}
          <Link to="/shop" className="text-[#23A6F0] underline">
            Continue shopping
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="bg-[#F9F9F9] min-h-screen">
      {/* Step indicator */}
      <div className="bg-white border-b border-[#E4E4E4]">
        <div className="mx-auto flex max-w-7xl px-4 py-4 text-sm font-semibold">
          <div
            className={`flex-1 border-b-2 pb-2 flex items-center gap-2 ${
              step === 1
                ? "border-[#23A6F0] text-[#23A6F0]"
                : "border-transparent text-[#737373]"
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                step === 1
                  ? "bg-[#23A6F0] text-white"
                  : "bg-zinc-200 text-zinc-700"
              }`}
            >
              1
            </span>
            <span>Address Details</span>
          </div>
          <div
            className={`flex-1 border-b-2 pb-2 flex items-center gap-2 ${
              step === 2
                ? "border-[#23A6F0] text-[#23A6F0]"
                : "border-transparent text-[#737373]"
            }`}
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                step === 2
                  ? "bg-[#23A6F0] text-white"
                  : "bg-zinc-200 text-zinc-700"
              }`}
            >
              2
            </span>
            <span>Payment Details</span>
          </div>
        </div>
      </div>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row lg:items-start">
        {/* LEFT: Step 1 / Step 2 content */}
        <div className="flex-1/2">
          {step === 1 ? (
            <Step1Addresses
              loading={addrLoading}
              addresses={addresses}
              shippingId={shippingId}
              billingId={billingId}
              billingSameAsShipping={billingSameAsShipping}
              onChangeShipping={setShippingId}
              onChangeBilling={setBillingId}
              onToggleBillingSame={setBillingSameAsShipping}
              onOpenEditor={(initial, context) =>
                setAddrEditor({ initial, context })
              }
            />
          ) : (
            <Step2Payment
              form={paymentForm}
              submitting={submitting}
              summary={summary}
              shippingAddress={shippingAddress}
              billingAddress={billingAddress}
              onBack={() => setStep(1)}
              onSubmit={onSubmitPayment}
            />
          )}

          {step === 1 && (
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={() => history.push("/checkout")}
                className="rounded-[4px] border border-[#E4E4E4] px-6 py-2.5 text-sm font-semibold text-[#737373] hover:bg-zinc-50"
              >
                Back to cart
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!canContinueStep1) {
                    toast.error(
                      "Please select both shipping and billing addresses."
                    );
                    return;
                  }
                  setStep(2);
                }}
                disabled={!canContinueStep1}
                className={`rounded-[4px] px-6 py-2.5 text-sm font-semibold text-white ${
                  canContinueStep1
                    ? "bg-[#23A6F0] hover:bg-[#1d8dd0]"
                    : "bg-[#9CCEF5] cursor-not-allowed"
                }`}
              >
                Save and Continue
              </button>
            </div>
          )}
        </div>

        {/* RIGHT: order summary + step 2 address preview */}
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

          {/* Step 2: address previews */}
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
      </section>

      {/* Address editor modal */}
      {addrEditor && (
        <AddressEditor
          initial={addrEditor.initial}
          onClose={() => setAddrEditor(null)}
          onSaved={async (newId) => {
            await reloadAddresses();
            // Select the newly created address for the relevant context
            if (addrEditor.context === "shipping") {
              setShippingId(newId);
              if (billingSameAsShipping) setBillingId(newId);
            } else if (addrEditor.context === "billing") {
              setBillingId(newId);
            }
            setAddrEditor(null);
          }}
        />
      )}
    </main>
  );
}

/* -------------------------------------------------------
   Step 1: Addresses
------------------------------------------------------- */
function Step1Addresses({
  loading,
  addresses,
  shippingId,
  billingId,
  billingSameAsShipping,
  onChangeShipping,
  onChangeBilling,
  onToggleBillingSame,
  onOpenEditor,
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
    </div>
  );
}

/* -------------------------------------------------------
   Step 2: Payment
------------------------------------------------------- */
function Step2Payment({
  form,
  submitting,
  summary,
  shippingAddress,
  billingAddress,
  onBack,
  onSubmit,
}) {
  const {
    register,
    formState: { errors },
    setValue,
  } = form;

  const handleCardNumberChange = (e) => {
    const raw = e.target.value || "";
    const digits = raw.replace(/\D/g, "").slice(0, 16);
    const spaced = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    setValue("cardNumber", spaced);
  };

  const handleExpiryChange = (e) => {
    const raw = e.target.value || "";
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    let formatted = digits;
    if (digits.length >= 3) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    setValue("expiry", formatted);
  };

  return (
    <div className="rounded-[4px] border border-[#E4E4E4] bg-white p-6">
      <h2 className="text-xl font-semibold text-[#252B42] mb-6">
        Payment details
      </h2>

      <form onSubmit={onSubmit} className="grid gap-8" noValidate>
        {/* payment form */}
        <div>
          {/* payment methods */}
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="bg-gray-100 p-4 rounded-md border border-gray-300 cursor-pointer">
              <div className="flex items-center">
                <input
                  type="radio"
                  value="card"
                  {...register("method")}
                  className="w-5 h-5 cursor-pointer"
                  defaultChecked
                />
                <span className="ml-4 flex gap-2">
                  <img
                    src="https://readymadeui.com/images/visa.webp"
                    className="w-12"
                    alt="visa"
                  />
                  <img
                    src="https://readymadeui.com/images/american-express.webp"
                    className="w-12"
                    alt="amex"
                  />
                  <img
                    src="https://readymadeui.com/images/master.webp"
                    className="w-12"
                    alt="mastercard"
                  />
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-500 font-medium">
                Pay with your debit or credit card
              </p>
            </label>

            <label className="bg-gray-100 p-4 rounded-md border border-gray-300 cursor-not-allowed opacity-60">
              <div className="flex items-center">
                <input
                  type="radio"
                  value="paypal"
                  disabled
                  className="w-5 h-5"
                />
                <span className="ml-4 flex gap-2">
                  <img
                    src="https://readymadeui.com/images/paypal.webp"
                    className="w-20"
                    alt="paypal"
                  />
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-500 font-medium">
                PayPal integration is not enabled
              </p>
            </label>
          </div>

          {/* card fields */}
          <div className="grid md:grid-cols-2 gap-y-6 gap-x-4 mt-8">
            <div className="max-lg:col-span-full">
              <label className="text-sm text-[#252B42] font-medium block mb-2">
                Cardholder&apos;s Name
              </label>
              <input
                type="text"
                placeholder="Enter Cardholder's Name"
                className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-[#23A6F0]"
                {...register("cardHolder", {
                  required: requiredMsg("Cardholder's Name"),
                  minLength: { value: 3, message: "Min 3 characters" },
                })}
              />
              <FieldError error={errors.cardHolder?.message} />
            </div>

            <div className="max-lg:col-span-full">
              <label className="text-sm text-[#252B42] font-medium block mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                autoComplete="cc-number"
                inputMode="numeric"
                maxLength={19}
                className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-[#23A6F0]"
                {...register("cardNumber", {
                  required: requiredMsg("Card Number"),
                  validate: {
                    digits: (v) =>
                      /^\d{16}$/.test((v || "").replace(/\D/g, "")) ||
                      "Enter 16 digit card number",
                  },
                })}
                onChange={handleCardNumberChange}
              />
              <FieldError error={errors.cardNumber?.message} />
            </div>

            <div>
              <label className="text-sm text-[#252B42] font-medium block mb-2">
                Expiry (MM/YY)
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                autoComplete="cc-exp"
                inputMode="numeric"
                maxLength={5}
                className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-[#23A6F0]"
                {...register("expiry", {
                  required: requiredMsg("Expiry"),
                  validate: {
                    pattern: (v) =>
                      /^(0[1-9]|1[0-2])\/\d{2}$/.test(v || "") ||
                      "Use MM/YY format",
                    notPast: (v) => {
                      if (!v) return true;
                      const [mm, yy] = v.split("/");
                      const month = parseInt(mm, 10);
                      const year = 2000 + parseInt(yy, 10);
                      const now = new Date();
                      const thisMonth = now.getMonth() + 1;
                      const thisYear = now.getFullYear();
                      if (year < thisYear) return "Card expired";
                      if (year === thisYear && month < thisMonth)
                        return "Card expired";
                      return true;
                    },
                  },
                })}
                onChange={handleExpiryChange}
              />
              <FieldError error={errors.expiry?.message} />
            </div>

            <div>
              <label className="text-sm text-[#252B42] font-medium block mb-2">
                CVV
              </label>
              <input
                type="password"
                placeholder="CVV"
                autoComplete="cc-csc"
                inputMode="numeric"
                maxLength={4}
                className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-[#23A6F0]"
                {...register("cvv", {
                  required: requiredMsg("CVV"),
                  validate: {
                    len: (v) =>
                      /^\d{3,4}$/.test(v || "") || "CVV must be 3 or 4 digits",
                  },
                })}
              />
              <FieldError error={errors.cvv?.message} />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onBack}
              className="rounded-[4px] border border-[#E4E4E4] px-6 py-2.5 text-sm font-semibold text-[#737373] hover:bg-zinc-50"
            >
              Back to steps
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="cursor-pointer rounded-md px-4 py-2.5 min-w-[180px] text-sm font-medium tracking-wide bg-[#23A6F0] hover:bg-[#1d8dd0] text-white disabled:bg-[#9CCEF5] disabled:cursor-not-allowed"
            >
              {submitting ? "Processing..." : "Pay now"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* -------------------------------------------------------
   Address preview card (right side)
------------------------------------------------------- */
function AddressPreviewCard({ address }) {
  return (
    <div className="bg-gray-100 border border-gray-300 rounded-lg p-4 space-y-1 text-xs font-medium text-slate-500">
      <p>{address.fullName}</p>
      <p>{address.line1}</p>
      {address.line2 && <p>{address.line2}</p>}
      <p>
        {address.city}, {address.state} {address.postalCode}
      </p>
      <p>{address.countryCode}</p>
    </div>
  );
}

/* -------------------------------------------------------
   Small shared components (error + address editor)
------------------------------------------------------- */
function FieldError({ error }) {
  if (!error) return null;
  return <div className="mt-1 text-xs text-red-500">{error}</div>;
}

/**
 * AddressEditor:
 * Simplified version of the profile page editor.
 * Uses /api/account/addresses POST/PUT.
 */
function AddressEditor({ initial, onClose, onSaved }) {
  const isEdit = !!initial;
  const methods = useForm({
    mode: "onTouched",
    defaultValues: {
      fullName: initial?.fullName || "",
      line1: initial?.line1 || "",
      line2: initial?.line2 || "",
      city: initial?.city || "",
      state: initial?.state || "",
      postalCode: initial?.postalCode || "",
      countryCode: initial?.countryCode || "",
      defaultShipping: initial?.defaultShipping || false,
      defaultBilling: initial?.defaultBilling || false,
    },
  });

  const submit = methods.handleSubmit(async (vals) => {
    try {
      if (isEdit) {
        await http.put(`/api/account/addresses/${initial.id}`, vals);
        toast.success("Address updated");
        await onSaved?.(initial.id);
      } else {
        const res = await http.post(`/api/account/addresses`, vals);
        const newId = res?.data?.data?.id;
        toast.success("Address added");
        await onSaved?.(newId);
      }
    } catch {
      // interceptor will show error
    }
  });

  return (
    <div className="fixed inset-0 z-40 bg-black/30 flex items-end md:items-center md:justify-center">
      <div className="w-full md:max-w-2xl md:rounded-2xl bg-white border border-zinc-200 p-6">
        <div className="flex items-center justify-between">
          <h4 className="font-['Montserrat'] font-bold text-[18px] leading-[28px] tracking-[0.1px] text-[#252B42]">
            {isEdit ? "Edit Address" : "Add Address"}
          </h4>
          <button
            onClick={onClose}
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            Close
          </button>
        </div>

        <FormProvider {...methods}>
          <form
            className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={submit}
            noValidate
          >
            <AF name="fullName" label="Full name" />
            <AF name="line1" label="Address line 1" />
            <AF name="line2" label="Address line 2" required={false} />
            <AF name="city" label="City" />
            <AF name="state" label="State" />
            <AF name="postalCode" label="Postal code" />
            <AF name="countryCode" label="Country code" />

            <div className="md:col-span-2 grid grid-cols-2 gap-4 pt-2">
              <Chk name="defaultShipping" label="Default shipping" />
              <Chk name="defaultBilling" label="Default billing" />
            </div>

            <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-5 h-11 text-sm font-semibold hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[#23A6F0] px-6 h-11 text-white font-semibold tracking-wide hover:opacity-90 transition"
              >
                {isEdit ? "Save changes" : "Add address"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

function AF({ name, label, required = true }) {
  const { register, formState } = useFormContext();
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700">{label}</label>
      <input
        className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
        type="text"
        {...register(name, required ? { required: requiredMsg(label) } : {})}
      />
      <FieldError error={formState.errors?.[name]?.message} />
    </div>
  );
}

function Chk({ name, label }) {
  const { register } = useFormContext();
  return (
    <label className="inline-flex items-center gap-2 text-sm text-zinc-800">
      <input type="checkbox" className="h-4 w-4" {...register(name)} />
      {label}
    </label>
  );
}
