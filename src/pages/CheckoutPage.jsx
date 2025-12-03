// src/pages/CheckoutPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { selectAuth } from "../store/authSlice";
import {
  selectCartItems,
  setCartFromApi,
  updateItemQuantity,
  removeItem as removeCartItem,
} from "../store/cartSlice";

import { http } from "../lib/http";
import { Trash2, Plus, Minus } from "lucide-react";

const formatMoney = (m) =>
  !m || m.amount == null ? "" : `${m.amount.toFixed(2)} ${m.currency || "USD"}`;

export default function CheckoutPage() {
  const history = useHistory();
  const dispatch = useDispatch();

  const { isAuthenticated } = useSelector(selectAuth) ?? {};
  const items = useSelector(selectCartItems); // 🔹 Tek kaynak: Redux cart

  // --- LOCAL UI STATE ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Seçili variantId set'i
  const [selectedIds, setSelectedIds] = useState(new Set());

  const hasSelected = selectedIds.size > 0;

  // BE'den gelen shipping / tax / discount bilgisi
  const [baseSummary, setBaseSummary] = useState(null);

  // Delete confirmation modal state
  const [confirmRemove, setConfirmRemove] = useState({
    open: false,
    item: null,
  });

  // --- AUTH GUARD ---
  useEffect(() => {
    if (!isAuthenticated) {
      history.replace("/login?redirect=/checkout");
    }
  }, [isAuthenticated, history]);

  // --- BE /api/cart -> Redux + baseSummary ---
  useEffect(() => {
    if (!isAuthenticated) return;

    let cancelled = false;

    const loadCart = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await http.get("/api/cart");
        if (cancelled) return;

        const apiCart = res.data?.data || { items: [], summary: null };

        // 🔹 Redux cart state'ini BE ile senkronla
        dispatch(setCartFromApi(apiCart));

        // 🔹 Base summary (shipping, tax, discount vs.)
        setBaseSummary(apiCart.summary || null);

        // 🔹 Başlangıçta tüm satırlar seçili olsun
        const initialSelected = new Set(
          (apiCart.items ?? []).map((i) => i.variantId)
        );
        setSelectedIds(initialSelected);
      } catch (err) {
        if (!cancelled) {
          console.error(err);
          setError("An error occurred while loading your cart.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadCart();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, dispatch]);

  // items değiştiğinde, selectedIds içinden artık var olmayan id'leri temizle
  useEffect(() => {
    setSelectedIds((prev) => {
      if (!items || !items.length) return new Set();
      const validIds = new Set(items.map((it) => it.variantId));
      const next = new Set();
      for (const id of prev) {
        if (validIds.has(id)) next.add(id);
      }
      return next;
    });
  }, [items]);

  // --- CHECKBOX HANDLERS ---
  const toggleItemSelected = (variantId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(variantId)) next.delete(variantId);
      else next.add(variantId);
      return next;
    });
  };

  const allSelected =
    items.length > 0 && items.every((it) => selectedIds.has(it.variantId));

  const toggleSelectAll = () => {
    if (!items.length) return;
    setSelectedIds((prev) => {
      if (allSelected) return new Set(); // unselect all
      return new Set(items.map((i) => i.variantId)); // select all
    });
  };

  // --- CHANGE QUANTITY (delta = +1 / -1) ---
  const handleChangeQuantity = async (item, delta) => {
    const current = item.quantity || 1;
    const nextQty = current + delta;

    // 1 → 0'a düşüyorsa modal aç
    if (nextQty < 1) {
      setConfirmRemove({ open: true, item });
      return;
    }

    try {
      // BE: yeni toplam quantity set edilir
      const res = await http.put("/api/cart/items", {
        variantId: item.variantId,
        quantity: nextQty,
      });

      const apiCart = res.data?.data; // ApiResponse<CartResponse> içindeki data

      if (apiCart) {
        // 🔹 Redux cart'ı tamamen BE cevabına eşitle
        dispatch(setCartFromApi(apiCart));

        // 🔹 Tax / shipping / discount / grandTotal için baseSummary'yi güncelle
        setBaseSummary(apiCart.summary || null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- REMOVE ITEM (BE + Redux) ---
  const handleRemoveItem = async (item) => {
    try {
      const res = await http.delete(`/api/cart/items/${item.variantId}`, {
        _skipErrorToast: true,
      });

      const apiCart = res.data?.data;

      if (apiCart) {
        // 🔹 Redux cart'ı taze state ile güncelle
        dispatch(setCartFromApi(apiCart));

        // 🔹 Summary'yi de güncelle (tax, shipping vs.)
        setBaseSummary(apiCart.summary || null);
      }

      // Checkbox seçili listesinden çıkar
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(item.variantId);
        return next;
      });
    } catch (err) {
      console.error(err);
    }
  };

  // --- DELETE CONFIRM MODAL HANDLERS ---
  const closeConfirmRemove = () =>
    setConfirmRemove({ open: false, item: null });

  const confirmRemoveItem = async () => {
    const item = confirmRemove.item;
    if (!item) {
      closeConfirmRemove();
      return;
    }

    await handleRemoveItem(item);
    closeConfirmRemove();
  };

  // --- RIGHT SIDE SUMMARY: only selected items ---
  const selectedSummary = useMemo(() => {
    const base = baseSummary || {};
    const selectedItems = items.filter((it) => selectedIds.has(it.variantId));

    // Currency fallback
    const currency =
      base.itemsTotal?.currency ||
      base.shipping?.currency ||
      base.tax?.currency ||
      base.discount?.currency ||
      base.grandTotal?.currency ||
      "USD";

    if (selectedItems.length === 0) {
      const zero = { amount: 0, currency };
      return {
        itemsTotal: { ...zero },
        shipping: { ...zero },
        discount: { ...zero },
        tax: { ...zero },
        grandTotal: { ...zero },
      };
    }

    const itemsTotalAmount = selectedItems.reduce((sum, it) => {
      const lineAmount =
        it.lineTotal?.amount ?? (it.price?.amount || 0) * (it.quantity || 0);
      return sum + lineAmount;
    }, 0);

    const itemsTotal = { amount: itemsTotalAmount, currency };

    const shipping = base.shipping
      ? { ...base.shipping }
      : { amount: 0, currency };

    const discount = base.discount
      ? { ...base.discount }
      : { amount: 0, currency };

    const tax = base.tax ? { ...base.tax } : { amount: 0, currency };

    const grandTotal = {
      amount:
        itemsTotal.amount +
        (shipping.amount || 0) +
        (tax.amount || 0) -
        (discount.amount || 0),
      currency: base.grandTotal?.currency || currency,
    };

    return { itemsTotal, shipping, discount, tax, grandTotal };
  }, [items, selectedIds, baseSummary]);

  // --- CONDITIONAL RETURNS (after hooks) ---

  if (!isAuthenticated) {
    // redirect happens in useEffect, just render nothing here
    return null;
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-sm text-zinc-500">Loading your cart…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-10">
        <p className="text-sm text-red-500">{error}</p>
      </main>
    );
  }

  if (!items || items.length === 0) {
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
    <>
      <main className="bg-white">
        <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 lg:flex-row lg:items-start">
          {/* LEFT: cart items list */}
          <div className="flex-1">
            <h1 className="mb-4 font-['Montserrat'] text-[24px] font-bold leading-[32px] tracking-[0.2px] text-[#252B42]">
              My Cart ({items.length} items)
            </h1>

            {/* Select / unselect all */}
            <div className="mb-4 flex items-center gap-2 text-sm text-[#737373]">
              <input
                type="checkbox"
                checked={!!allSelected}
                onChange={toggleSelectAll}
                className="h-4 w-4 rounded border-zinc-300"
              />
              <span>Select / unselect all items</span>
            </div>

            <div className="divide-y divide-[#E4E4E4] rounded-[4px] border border-[#E4E4E4]">
              {items.map((item) => {
                const checked = selectedIds.has(item.variantId);
                return (
                  <div
                    key={item.variantId}
                    className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center"
                  >
                    {/* Checkbox + image + info */}
                    <div className="flex items-start gap-3 md:w-2/3">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleItemSelected(item.variantId)}
                        className="mt-2 h-4 w-4 rounded border-zinc-300"
                      />

                      {item.thumbnailUrl ? (
                        <div className="h-20 w-20 shrink-0 overflow-hidden rounded bg-zinc-100">
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      ) : (
                        <div className="h-20 w-20 shrink-0 rounded bg-zinc-100" />
                      )}

                      <div className="flex-1">
                        <div className="text-sm font-semibold text-[#252B42]">
                          {item.title}
                        </div>
                        <div className="mt-1 text-[12px] text-[#737373]">
                          {item.size && (
                            <>
                              Size:{" "}
                              <span className="font-medium pr-2">
                                {item.size}
                              </span>
                            </>
                          )}
                          <span className="font-medium pr-2">/</span>
                          {item.color && (
                            <>
                              Color:{" "}
                              <span
                                className="inline-block h-3 w-3 mt-[-2px] rounded-full border border-black/10 align-middle"
                                style={{ backgroundColor: item.color }}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity + price + remove */}
                    <div className="flex flex-1 flex-col items-end gap-3 md:flex-row md:items-center md:justify-end">
                      <div className="inline-flex items-center rounded border border-[#E4E4E4]">
                        <button
                          type="button"
                          onClick={() => handleChangeQuantity(item, -1)}
                          className="flex h-8 w-8 items-center justify-center text-[#737373] hover:bg-zinc-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <div className="w-10 text-center text-sm text-[#252B42]">
                          {item.quantity}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleChangeQuantity(item, +1)}
                          className="flex h-8 w-8 items-center justify-center text-[#737373] hover:bg-zinc-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-semibold text-[#23A6F0]">
                          {formatMoney(
                            item.lineTotal || {
                              amount:
                                (item.price?.amount || 0) *
                                (item.quantity || 0),
                              currency: item.price?.currency || "USD",
                            }
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => setConfirmRemove({ open: true, item })}
                          className="mt-1 inline-flex items-center gap-1 text-[12px] text-[#E53935] hover:underline"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: order summary */}
          <aside className="w-full max-w-md rounded-[4px] border border-[#E4E4E4] p-4 lg:w-[320px]">
            <h2 className="mb-4 font-['Montserrat'] text-[18px] font-bold leading-[24px] tracking-[0.2px] text-[#252B42]">
              Order Summary
            </h2>

            {selectedSummary && (
              <div className="space-y-2 text-sm text-[#737373]">
                <div className="flex items-center justify-between">
                  <span>Subtotal (selected items)</span>
                  <span className="font-semibold text-[#252B42]">
                    {formatMoney(selectedSummary.itemsTotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Shipping</span>
                  <span>{formatMoney(selectedSummary.shipping)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Discount</span>
                  <span className="text-[#E53935]">
                    -
                    {formatMoney({
                      ...selectedSummary.discount,
                      amount: selectedSummary.discount.amount || 0,
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Tax</span>
                  <span>{formatMoney(selectedSummary.tax)}</span>
                </div>

                <hr className="my-3 border-[#E4E4E4]" />

                <div className="flex items-center justify-between text-[16px] font-bold text-[#252B42]">
                  <span>Total</span>
                  <span>{formatMoney(selectedSummary.grandTotal)}</span>
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={!hasSelected}
              onClick={() => hasSelected && history.push("/checkout/payment")}
              className={`mt-4 w-full rounded-[4px] py-3 text-center font-['Montserrat'] text-[14px] font-bold leading-[22px] tracking-[0.2px] text-white ${
                hasSelected
                  ? "bg-[#23A6F0] hover:bg-[#031c49]"
                  : "bg-[#A0C8EB] cursor-not-allowed"
              }`}
            >
              Confirm cart
            </button>
          </aside>
        </section>
      </main>

      {/* 🔴 Delete Confirmation Modal */}
      {confirmRemove.open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h3 className="font-['Montserrat'] text-[18px] font-bold leading-[26px] tracking-[0.2px] text-[#252B42]">
              Do you want to remove this item from your cart?
            </h3>

            <p className="mt-3 font-['Montserrat'] text-[14px] leading-[20px] tracking-[0.2px] text-[#737373]">
              Quantity cannot be 0.{" "}
              <span className="font-semibold text-[#252B42]">
                {confirmRemove.item?.title || "This item"}
              </span>{" "}
              will be removed from your cart. Do you confirm?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeConfirmRemove}
                className="rounded-[4px] border border-[#E4E4E4] px-4 py-2 text-[13px] font-['Montserrat'] font-medium leading-[20px] tracking-[0.2px] text-[#737373] hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRemoveItem}
                className="rounded-[4px] bg-[#E53935] px-4 py-2 text-[13px] font-['Montserrat'] font-bold leading-[20px] tracking-[0.2px] text-white hover:bg-[#c62828]"
              >
                Yes, remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
