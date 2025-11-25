// src/components/BestSellers.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchBestSellers,
  fetchVariantColorsForList,
  selectBestSellerCards,
  selectBestSellersStatus,
  selectBestSellersError,
  selectMissingColorIds,
} from "../store/bestSellersSlice";

import UniversalProductCard from "../components/UniversalProductCard";

export default function BestSellers({
  limit = 8,
  categoryId = null,
  className = "",
  variant = "home", // "home" | "category"
}) {
  const dispatch = useDispatch();
  const items = useSelector((state) =>
    selectBestSellerCards(state, categoryId, limit)
  );
  const status = useSelector(selectBestSellersStatus);
  const error = useSelector(selectBestSellersError);
  const missingIds = useSelector(selectMissingColorIds); // <-- eksikler

  useEffect(() => {
    const controller = new AbortController();
    dispatch(
      fetchBestSellers({
        limit,
        categoryId,
        signal: controller.signal,
      })
    );
    return () => controller.abort();
  }, [dispatch, limit, categoryId]);

  useEffect(() => {
    if (status !== "succeeded") return;
    if (!missingIds.length) return;
    const controller = new AbortController();

    dispatch(
      fetchVariantColorsForList({
        productIds: missingIds,
        signal: controller.signal,
      })
    );
    return () => controller.abort();
  }, [dispatch, status, missingIds]);

  // 🔹 Header varyantı
  let header = null;

  if (variant === "home") {
    // Eski davranış: ortalanmış 3 satır
    header = (
      <div className="mx-auto max-w-[260px] lg:max-w-2xl text-center pb-8">
        <h4 className="font-['Montserrat'] text-[20px] font-normal leading-[30px] tracking-[0.2px] text-[#737373]">
          Featured Products
        </h4>
        <h3 className="mt-2 font-['Montserrat'] text-[24px] font-bold leading-8 tracking-[0.1px] text-[#252B42]">
          BESTSELLER PRODUCTS
        </h3>
        <p className="mt-2 font-['Montserrat'] text-[14px] font-normal leading-5 tracking-[0.2px] text-[#737373]">
          Problems trying to resolve the conflict between
        </p>
      </div>
    );
  } else if (variant === "category") {
    // Kategori detayında: sadece BESTSELLER PRODUCTS, sola yaslı
    header = (
      <div className="pb-8 px-24 flex justify-start flex-wrap">
        <h3 className="font-['Montserrat'] text-[24px] font-bold leading-8 tracking-[0.1px] text-[#252B42]">
          BESTSELLER PRODUCTS
        </h3>
        <hr className="mt-4 w-full border-t border-[#E4E4E4]" />
      </div>
    );
  }

  return (
    <section
      className={`mx-auto w-full max-w-7xl px-4 py-12 md:py-16 ${className}`}
    >
      {header}

      {/* Liste — flex wrap; kart genişliği ProductCard'da sabit 240px */}
      <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-20 lg:gap-y-[7rem]">
        {status === "loading" &&
          Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="w-[240px]" aria-hidden>
              <div className="h-[427px] w-[240px] animate-pulse bg-zinc-200 rounded" />
              <div className="mt-4 h-5 w-[70%] animate-pulse bg-zinc-200 mx-auto rounded" />
              <div className="mt-2 h-4 w-[50%] animate-pulse bg-zinc-200 mx-auto rounded" />
            </div>
          ))}

        {status === "succeeded" &&
          items.map((p) => (
            <div key={p.id} className="shrink-0 grow-0 basis-auto">
              <UniversalProductCard
                product={p}
                fixedWidth={240}
                imageHeight={427}
                autoVariants={false}
              />
            </div>
          ))}

        {status === "failed" && (
          <div className="text-sm text-red-600">
            {String(error || "Best seller ürünler yüklenemedi.")}
          </div>
        )}
      </div>
    </section>
  );
}
