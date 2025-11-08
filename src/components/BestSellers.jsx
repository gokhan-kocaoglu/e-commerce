import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "../components/ProductCard";
import {
  fetchBestSellers,
  fetchVariantColorsForList,
  selectBestSellerCards,
  selectBestSellersStatus,
  selectBestSellersError,
} from "../store/bestSellersSlice";

export default function BestSellers({ limit = 8, className = "" }) {
  const dispatch = useDispatch();
  const items = useSelector(selectBestSellerCards);
  const status = useSelector(selectBestSellersStatus);
  const error = useSelector(selectBestSellersError);

  useEffect(() => {
    const controller = new AbortController();

    // 1) Liste (cache tazeyse condition sayesinde fetch olmaz)
    dispatch(fetchBestSellers({ limit, signal: controller.signal }));

    return () => controller.abort();
  }, [dispatch, limit]);

  useEffect(() => {
    if (status !== "succeeded") return;
    const controller = new AbortController();
    // 2) Renkler (yalnızca list geldikten sonra)
    const ids = items.map((p) => p.id);
    if (ids.length) {
      dispatch(
        fetchVariantColorsForList({
          productIds: ids,
          signal: controller.signal,
        })
      );
    }
    return () => controller.abort();
  }, [dispatch, status, items]);

  return (
    <section
      className={`mx-auto w-full max-w-7xl px-4 py-12 md:py-16 ${className}`}
    >
      {/* Başlıklar */}
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

      {/* Liste — flex wrap; kart genişliği ProductCard'da sabit 240px */}
      <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-20 lg:gap-y-[7.5rem]">
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
              <ProductCard product={p} />
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
