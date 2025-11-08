export default function HeroSliderSkeleton({
  heightClass = "h-[420px] sm:h-[480px] md:h-[640px]",
}) {
  return (
    <div
      className={`mx-auto max-w-7xl ${heightClass} animate-pulse bg-zinc-200 rounded`}
    />
  );
}
