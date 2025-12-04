import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { selectAuth } from "../store/authSlice";
import { selectCartItems, setCartFromApi, clearCart } from "../store/cartSlice";
import { http } from "../lib/http";

import CheckoutStepIndicator from "../components/checkout/CheckoutStepIndicator";
import Step1Addresses from "../components/checkout/Step1Addresses";
import Step2Payment from "../components/checkout/Step2Payment";
import OrderSummary from "../components/checkout/OrderSummary";
import AddressEditor from "../components/checkout/AddressEditor";

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */
export const requiredMsg = (f) => `${f} is required`;

export const formatMoney = (m) =>
  !m || m.amount == null ? "" : `${m.amount.toFixed(2)} ${m.currency || "USD"}`;

export const cardBrandFromNumber = (raw) => {
  const num = (raw || "").replace(/\D/g, "");
  if (!num) return "unknown";

  if (num.startsWith("4")) return "visa";
  if (/^5[1-5]/.test(num) || /^2(2[2-9]|[3-6]\d|7[01])/.test(num))
    return "mastercard";
  if (/^3[47]/.test(num)) return "amex";
  return "card";
};

export const toOrderAddressPayload = (addr) => {
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
        dispatch(setCartFromApi(apiCart));
        setSummary(apiCart.summary || null);
      } catch (e) {
        // interceptor shows toast
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
      // 1) ORDER CREATE
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
      // interceptor shows message
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
      <CheckoutStepIndicator step={step} />

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row lg:items-start">
        {/* LEFT: steps */}
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
              onBackToCart={() => history.push("/checkout")}
              onContinue={() => {
                if (!canContinueStep1) {
                  toast.error(
                    "Please select both shipping and billing addresses."
                  );
                  return;
                }
                setStep(2);
              }}
              canContinue={canContinueStep1}
            />
          ) : (
            <Step2Payment
              form={paymentForm}
              submitting={submitting}
              summary={summary}
              onBack={() => setStep(1)}
              onSubmit={onSubmitPayment}
            />
          )}
        </div>

        {/* RIGHT: order summary + address preview */}
        <OrderSummary
          summary={summary}
          step={step}
          shippingAddress={shippingAddress}
          billingAddress={billingAddress}
        />
      </section>

      {/* Address editor modal */}
      {addrEditor && (
        <AddressEditor
          initial={addrEditor.initial}
          onClose={() => setAddrEditor(null)}
          onSaved={async (newId) => {
            await reloadAddresses();
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
