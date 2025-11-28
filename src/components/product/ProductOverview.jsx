import { useMemo, useState } from "react";
import { Star, Heart, ShoppingCart, Eye } from "lucide-react";
import { normalizeImageUrl } from "../../utils/imageUrl";
import prevArrow from "../../assets/slider/carousel-control-prev.png";
import nextArrow from "../../assets/slider/carousel-control-next.png";
import { useProductPage } from "../product/ProductPageContext";

import { useDispatch, useSelector } from "react-redux";
import {
  toggleWishlistItem,
  selectIsInWishlist,
} from "../../store/wishlistSlice";

import { addItem as addCartItem } from "../../store/cartSlice";
import { selectAuth } from "../../store/authSlice";
import { http } from "../../lib/http";
import { toast } from "react-toastify";

// --- Helpers ---
const formatMoney = (m) =>
  !m || m.amount == null ? "" : `${m.amount.toFixed(2)} ${m.currency || "USD"}`;

const toCssColor = (token) => {
  if (!token) return null;
  const t = String(token).trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(t)) return t;
  if (/^rgba?\(/i.test(t) || /^hsla?\(/i.test(t)) return t;
  return t;
};

export default function ProductOverview() {
  const { status, product, detail, variants } = useProductPage();

  const [showOptions, setShowOptions] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(selectAuth) ?? {};
  const isInWishlist = useSelector((state) =>
    selectIsInWishlist(state, product?.id)
  );

  // --- Variant derived state ---
  const uniqueSizes = useMemo(() => {
    const set = new Set(
      variants
        .map((v) => v.attributes?.size)
        .filter((x) => typeof x === "string" && x.trim() !== "")
    );
    return Array.from(set);
  }, [variants]);

  const colorsForSelectedSize = useMemo(() => {
    if (!selectedSize) return [];
    const set = new Set(
      variants
        .filter((v) => v.attributes?.size === selectedSize)
        .map((v) => v.attributes?.color)
        .filter(Boolean)
    );
    return Array.from(set);
  }, [variants, selectedSize]);

  const activeVariant = useMemo(() => {
    if (!selectedSize && !selectedColor) return null;
    return (
      variants.find((v) => {
        const sizeOk = selectedSize
          ? v.attributes?.size === selectedSize
          : true;
        const colorOk = selectedColor
          ? v.attributes?.color === selectedColor
          : true;
        return sizeOk && colorOk;
      }) || null
    );
  }, [variants, selectedSize, selectedColor]);

  const displayedPrice = activeVariant?.priceCents || product?.price;
  const displayedCompare =
    activeVariant?.compareAtPriceCents || product?.compareAtPrice;

  const ratingValue = product?.ratingAvg || 0;
  const ratingCount = product?.ratingCount || 0;

  const colorDots = useMemo(() => {
    const set = new Set(
      variants.map((v) => v.attributes?.color).filter(Boolean)
    );
    return Array.from(set);
  }, [variants]);

  // --- Wishlist toggle ---
  const handleToggleWishlist = () => {
    if (!product) return;

    const mainImage = product.images?.[0];
    const mainSrc = normalizeImageUrl(mainImage?.url);
    const wasInWishlist = isInWishlist;

    dispatch(
      toggleWishlistItem({
        id: product.id,
        title: product.title,
        slug: product.slug,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        thumbnailUrl: product.thumbnailUrl || mainSrc || null,
      })
    );

    if (wasInWishlist) {
      toast.info("The product has been removed from your favorites.", {
        autoClose: 2000,
        hideProgressBar: true,
      });
    } else {
      toast.success("The product has been added to your favorites.", {
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
  };

  // --- Add to cart ---
  const handleAddToCart = async () => {
    if (!product) return;

    // ürün varyantlı ise mutlaka variant seçilsin
    if (variants.length > 0 && !activeVariant) {
      setShowOptions(true);
      toast.warn("Please select size / color before adding to cart.", {
        autoClose: 2000,
        hideProgressBar: true,
      });
      return;
    }

    const variant = activeVariant || variants[0] || null;
    if (!variant) {
      // burada hiç variant yoksa BE tarafınızda farklı bir model olabilir;
      // şimdilik güvenlik için çıkıyoruz
      toast.error("This product cannot be added to cart.");
      return;
    }

    const mainImage = product.images?.[0];
    const mainSrc = normalizeImageUrl(mainImage?.url);

    const cartPayload = {
      variantId: variant.id,
      productId: product.id,
      title: product.title,
      slug: product.slug,
      price: variant.priceCents || product.price,
      compareAtPrice: variant.compareAtPriceCents || product.compareAtPrice,
      quantity: 1,
      size: variant.attributes?.size || selectedSize || null,
      color: variant.attributes?.color || selectedColor || null,
      thumbnailUrl: product.thumbnailUrl || mainSrc || null,
    };

    try {
      // Login ise BE'ye de yaz
      if (isAuthenticated) {
        await http.post("/api/cart/items", {
          variantId: variant.id,
          quantity: 1,
        });
      }

      // Her durumda local cart + redux güncelle
      dispatch(addCartItem(cartPayload));

      toast.success("The product has been added to your cart.", {
        autoClose: 2000,
        hideProgressBar: true,
      });
    } catch {
      // error toast'u http interceptor zaten basıyor
    }
  };

  // --- UI States ---
  if (status === "loading" || status === "idle") {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-8">
        <div className="py-16 text-center text-sm text-zinc-500">
          Loading product…
        </div>
      </section>
    );
  }

  if (status === "failed" || !product) {
    return (
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-8">
        <div className="py-16 text-center text-sm text-red-500">
          Ürün bulunamadı veya yüklenirken bir hata oluştu.
        </div>
      </section>
    );
  }

  const mainImage = product.images?.[0];
  const mainSrc = normalizeImageUrl(mainImage?.url);

  const shortSummary =
    typeof detail?.shortSummary === "string" ? detail.shortSummary.trim() : "";

  // --- MAIN LAYOUT ---
  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-8">
      <div className="flex flex-col gap-10 lg:gap-16 lg:flex-row">
        {/* LEFT: Image + thumbnails (flex) */}
        <div className="w-full lg:w-1/2">
          {/* Ana görsel */}
          <div className="relative max-h-[450px] w-full bg-zinc-100">
            <div className="aspect-square w-full overflow-hidden">
              <img
                src={mainSrc}
                alt={mainImage?.altText || product.title}
                className="max-h-[450px] w-full object-none"
              />
            </div>

            <img
              src={prevArrow}
              alt="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-[24px] h-[44px] cursor-pointer select-none"
            />

            {/* Sağ ok PNG */}
            <img
              src={nextArrow}
              alt="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-[24px] h-[44px] cursor-pointer select-none"
            />
          </div>

          {/* Thumbnails */}
          <div className="mt-4 flex gap-4">
            {(product.images || []).map((img) => {
              const thumbSrc = normalizeImageUrl(img.url);
              return (
                <button
                  key={img.id}
                  type="button"
                  className="h-24 w-24 overflow-hidden bg-zinc-100"
                >
                  <img
                    src={thumbSrc}
                    alt={img.altText || product.title}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Info panel (flex column) */}
        <div className="w-full lg:w-1/2 px-8">
          {/* Ürün adı */}
          <h3 className="font-['Montserrat'] font-normal text-[20px] leading-[30px] tracking-[0.2px] text-[#252B42]">
            {product.title}
          </h3>

          {/* Rating + Reviews */}
          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, idx) => {
                const filled = idx < Math.round(ratingValue);
                return (
                  <Star
                    key={idx}
                    className="h-4 w-4"
                    fill={filled ? "#F3CD03" : "transparent"}
                    stroke={filled ? "#F3CD03" : "#BDBDBD"}
                  />
                );
              })}
            </div>
            <span className="font-['Montserrat'] font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#737373]">
              {ratingCount} Reviews
            </span>
          </div>

          {/* Fiyat */}
          <div className="mt-4 flex items-baseline gap-3">
            <h3 className="font-['Montserrat'] font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42]">
              {formatMoney(displayedPrice)}
            </h3>
            {displayedCompare?.amount != null &&
              displayedCompare.amount > displayedPrice?.amount && (
                <span className="font-['Montserrat'] text-[16px] font-bold leading-[24px] tracking-[0.1px] text-[#BDBDBD] line-through">
                  {formatMoney(displayedCompare)}
                </span>
              )}
          </div>

          {/* Availability */}
          <div className="mt-2 flex items-center gap-2">
            <span className="font-['Montserrat'] font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#737373]">
              Availability :
            </span>
            <span className="font-['Montserrat'] font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#23A6F0]">
              In Stock
            </span>
          </div>

          {/* Kısa açıklama */}
          <p className="mt-4 max-w-xl font-['Montserrat'] text-[14px] font-normal leading-[20px] tracking-[0.2px] text-[#737373]">
            {shortSummary || "Ürün detayları henüz eklenmedi..."}
          </p>

          {/* Ayırıcı çizgi */}
          <div className="mt-6 border-b border-[#E4E4E4]" />

          {/* Variant renkleri (genel – screenshot'taki 4 renk noktası) */}
          {!!colorDots.length && (
            <div className="mt-6 flex items-center gap-3">
              {colorDots.map((c) => (
                <span
                  key={c}
                  className="inline-block h-8 w-8 rounded-full border border-black/5"
                  style={{ backgroundColor: toCssColor(c) }}
                />
              ))}
            </div>
          )}

          {/* CTA + iconlar */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setShowOptions((x) => !x)}
              className="rounded-[5px] bg-[#23A6F0] px-8 py-3 font-['Montserrat'] text-[14px] font-bold leading-[24px] tracking-[0.2px] text-white hover:bg-[#1b87cc]"
            >
              Select Options
            </button>

            <button
              type="button"
              onClick={handleToggleWishlist}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition
    ${
      isInWishlist
        ? "border-[#23A6F0] bg-[#23A6F0]/10 text-[#23A6F0]"
        : "border-[#E4E4E4] text-[#252B42] hover:bg-zinc-50"
    }`}
            >
              <Heart
                className="h-4 w-4"
                fill={isInWishlist ? "#23A6F0" : "none"}
                stroke={isInWishlist ? "#23A6F0" : "#252B42"}
              />
            </button>

            {/* ADD TO CART */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E4E4E4] text-[#252B42] hover:bg-zinc-50"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E4E4E4] text-[#252B42] hover:bg-zinc-50"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>

          {/* Variant Selector – Select Options tıklanınca görünür */}
          {showOptions && (
            <div className="mt-6 rounded-lg border border-[#E4E4E4] p-4">
              {/* Size seçimi */}
              {uniqueSizes.length > 0 && (
                <div>
                  <label className="mb-1 block font-['Montserrat'] text-[14px] font-bold leading-[24px] tracking-[0.2px] text-[#252B42]">
                    Size
                  </label>
                  <select
                    value={selectedSize}
                    onChange={(e) => {
                      setSelectedSize(e.target.value);
                      setSelectedColor("");
                    }}
                    className="mt-1 w-full rounded border border-[#E4E4E4] bg-white px-3 py-2 font-['Montserrat'] text-[14px] leading-[20px] tracking-[0.2px] text-[#252B42] focus:outline-none focus:ring-2 focus:ring-[#23A6F0]"
                  >
                    <option value="">Select size</option>
                    {uniqueSizes.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Color seçimi */}
              {selectedSize && colorsForSelectedSize.length > 0 && (
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-['Montserrat'] text-[14px] font-bold leading-[24px] tracking-[0.2px] text-[#252B42]">
                      Color
                    </span>
                    {selectedColor && (
                      <span className="text-xs text-zinc-500">
                        Selected: {selectedColor}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {colorsForSelectedSize.map((c) => {
                      const isActive = selectedColor === c;
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() =>
                            setSelectedColor((prev) => (prev === c ? "" : c))
                          }
                          className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                            isActive
                              ? "border-[#23A6F0] ring-2 ring-[#23A6F0]/40"
                              : "border-black/10"
                          }`}
                        >
                          <span
                            className="block h-6 w-6 rounded-full"
                            style={{ backgroundColor: toCssColor(c) }}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Seçili varyant özeti */}
              {activeVariant && (
                <div className="mt-4 rounded bg-zinc-50 p-3 text-sm text-[#252B42]">
                  <div className="font-['Montserrat'] font-bold">
                    {activeVariant.sku}
                  </div>
                  <div className="mt-1">
                    <span className="font-['Montserrat'] font-bold text-[14px] text-[#252B42]">
                      {formatMoney(activeVariant.priceCents)}
                    </span>
                    {activeVariant.compareAtPriceCents?.amount != null && (
                      <span className="ml-2 font-['Montserrat'] text-[13px] text-[#BDBDBD] line-through">
                        {formatMoney(activeVariant.compareAtPriceCents)}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
