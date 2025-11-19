import CollectionCard from "./CollectionCard";
import { useCollectionsSummaries } from "../../queries/marketingQueries";

function Skeleton({ className }) {
  return (
    <div className={`shrink-0 grow-0 ${className}`}>
      <div className="aspect-[4/5] w-full animate-pulse bg-zinc-200" />
    </div>
  );
}

const SIZE = {
  sm: {
    basis: "basis-1/3 sm:basis-1/4 md:basis-1/5 xl:basis-1/6",
    gap: "gap-4",
    text: "text-[16px] sm:text-[18px]",
  },
  md: {
    basis: "basis-1/2 sm:basis-1/3 md:basis-1/4 xl:basis-1/5",
    gap: "gap-5",
    text: "",
  },
  lg: {
    basis: "basis-1/2 sm:basis-1/2 md:basis-1/3 xl:basis-1/4",
    gap: "gap-6",
    text: "text-[22px] sm:text-[24px]",
  },
};

export default function CollectionsGrid({
  className = "",
  size = "md",
  itemBasis,
  gap,
}) {
  const { data, isLoading, isError } = useCollectionsSummaries();
  const preset = SIZE[size] || SIZE.md;
  const basisCls = itemBasis || preset.basis;
  const gapCls = gap || preset.gap;

  return (
    <section className={`mx-auto w-full max-w-7xl px-4 sm:px-6 ${className}`}>
      <div
        className={`flex flex-wrap flex-col ${gapCls} justify-center px-6 py-6 md:py-4 sm:flex-row`}
      >
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className={basisCls} />
          ))}

        {!isLoading && isError && (
          <div className="w-full rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            Koleksiyonlar yüklenemedi. Lütfen tekrar deneyin.
          </div>
        )}

        {!isLoading && !isError && data?.length === 0 && (
          <div className="w-full rounded-xl border border-zinc-200 p-8 text-center text-zinc-500">
            No collections to display.
          </div>
        )}

        {!isLoading &&
          !isError &&
          data?.map((it) => (
            <CollectionCard
              key={it.id}
              item={it}
              className={basisCls}
              textClass={preset.text}
            />
          ))}
      </div>
    </section>
  );
}
