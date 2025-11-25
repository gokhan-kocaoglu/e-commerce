import { getAboutStats } from "../../data/aboutData";

export default function AboutStats({ className = "" }) {
  const section = getAboutStats("en");
  if (!section?.items?.length) return null;

  const { items } = section;

  return (
    <section className={`bg-white ${className}`}>
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-8 xl:max-w-7xl">
        <div className="flex flex-wrap items-center justify-center gap-10 md:justify-between">
          {items.map((stat) => (
            <div
              key={stat.id}
              className="flex min-w-[130px] flex-col items-center text-center"
            >
              <h1 className="font-['Montserrat'] font-bold text-[40px] leading-[50px] tracking-[0.2px] text-[#252B42] md:text-[48px] md:leading-[60px] lg:text-[58px] lg:leading-[80px]">
                {stat.displayValue ?? stat.value}
              </h1>
              <h5 className="mt-1 font-['Montserrat'] text-[16px] font-bold leading-[24px] tracking-[0.1px] text-[#737373]">
                {stat.label}
              </h5>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
