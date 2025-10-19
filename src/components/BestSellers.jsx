import ProductCard from "../components/ProductCard";
import { getBestSellers } from "../data/catalog";

export default function BestSellers({ limit = 8, className = "" }) {
  const items = getBestSellers(limit);

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

      {/* Flex list — wrap + basis ile responsive kolon sayısı */}
      <div className="mt-10 flex flex-wrap justify-center gap-y-18 gap-x-8 lg:gap-y-30">
        {items.map((p) => (
          <div key={p.id} className="">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
