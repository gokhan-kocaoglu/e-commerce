import { useState } from "react";
import { Check } from "lucide-react";
import { getPricingTable } from "../../data/pricingData";

function BillingToggle({ billingPeriod, onChange, billingConfig }) {
  const { periods } = billingConfig;
  const yearly = periods.find((p) => p.id === "yearly");
  const isYearly = billingPeriod === "yearly";

  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-4 pb-10">
      {/* Monthly */}
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={`font-['Montserrat'] text-[16px] font-bold leading-[24px] tracking-[0.1px] ${
          billingPeriod === "monthly" ? "text-[#252B42]" : "text-[#737373]"
        }`}
      >
        Monthly
      </button>

      {/* Switch */}
      <button
        type="button"
        onClick={() => onChange(isYearly ? "monthly" : "yearly")}
        className="relative inline-flex h-7 w-12 items-center rounded-full border border-[#23A6F0] bg-white"
      >
        <span
          className={`inline-block h-5 w-5 rounded-full bg-[#23A6F0] shadow transition-transform duration-200 ${
            isYearly ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </button>

      {/* Yearly */}
      <button
        type="button"
        onClick={() => onChange("yearly")}
        className={`font-['Montserrat'] text-[16px] font-bold leading-[24px] tracking-[0.1px] ${
          billingPeriod === "yearly" ? "text-[#252B42]" : "text-[#737373]"
        }`}
      >
        Yearly
      </button>

      {/* Save 25% badge */}
      {yearly?.badge && (
        <span className="rounded-[30px] bg-[#B2E3FF] px-6 py-2 font-['Montserrat'] text-[14px] font-bold leading-[24px] tracking-[0.2px] text-[#23A6F0]">
          {yearly.badge.label}
        </span>
      )}
    </div>
  );
}

function PricingPlanCard({ plan, billingPeriod, currency }) {
  const featured = plan.featured;
  const price = plan.prices[billingPeriod];

  if (!price) return null;

  const cardBase =
    "flex flex-col rounded-[10px] border border-[#23A6F0] px-10 text-center shadow-[0_13px_19px_rgba(0,0,0,0.07)]";

  const cardNormal = `${cardBase} bg-white py-10`;
  // Orta kartı daha yüksek + biraz yukarı alınmış:
  const cardFeatured = `${cardBase} bg-[#252B42] py-16 text-white lg:mt-[-30px]`;

  const cardClassName = featured ? cardFeatured : cardNormal;

  return (
    <article className={cardClassName}>
      {/* Plan adı */}
      <h3
        className={`font-['Montserrat'] text-[24px] font-bold leading-[32px] tracking-[0.1px] ${
          featured ? "text-white" : "text-[#252B42]"
        }`}
      >
        {plan.name}
      </h3>

      {/* Açıklama */}
      <p
        className={`mt-3 font-['Montserrat'] text-[16px] font-bold leading-[24px] tracking-[0.1px] text-center ${
          featured ? "text-[#B0B5C3]" : "text-[#737373]"
        }`}
      >
        {plan.description}
      </p>

      {/* Fiyat */}
      <div className="mt-6 flex items-baseline justify-center gap-1">
        <span className="font-['Montserrat'] text-[40px] font-bold leading-[50px] tracking-[0.2px] text-[#23A6F0]">
          {price.amount}
        </span>
        <span className="font-['Montserrat'] text-[20px] font-bold leading-[30px] text-[#23A6F0]">
          $
        </span>
      </div>
      <p className="font-['Montserrat'] text-[14px] font-bold leading-[24px] tracking-[0.2px] text-[#8EC2F2]">
        {price.unit}
      </p>

      {/* Özellikler */}
      <ul className="mt-8 space-y-3 text-left">
        {plan.features.map((feature) => {
          const included = feature.included;
          const textColor = included
            ? featured
              ? "text-white"
              : "text-[#252B42]"
            : "text-[#BDBDBD]";

          return (
            <li key={feature.id} className="flex items-center gap-3">
              <span
                className={
                  included
                    ? "flex h-8 w-8 items-center justify-center rounded-full bg-[#2DC071]"
                    : "flex h-8 w-8 items-center justify-center rounded-full border border-[#BDBDBD]"
                }
              >
                <Check
                  className={`h-4 w-4 ${
                    included ? "text-white" : "text-[#BDBDBD]"
                  }`}
                />
              </span>
              <span
                className={`font-['Montserrat'] text-[14px] font-bold leading-[24px] tracking-[0.2px] ${textColor}`}
              >
                {feature.label}
              </span>
            </li>
          );
        })}
      </ul>

      {/* CTA */}
      <button
        type="button"
        className={`mt-8 w-full rounded-[5px] px-6 py-3 font-['Montserrat'] text-[14px] font-bold leading-[24px] tracking-[0.2px] ${
          featured ? "bg-[#23A6F0] text-white" : "bg-[#23A6F0] text-white"
        }`}
      >
        {plan.ctaLabel}
      </button>
    </article>
  );
}

export default function PricingPlansSection({ className = "" }) {
  const table = getPricingTable("en");
  if (!table) return null;

  const [billingPeriod, setBillingPeriod] = useState(
    table.billing.defaultPeriod || "monthly"
  );

  return (
    <section className={`bg-[#FAFAFA] py-16 md:py-24 ${className}`}>
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4">
        {/* Başlık */}
        <h2 className="font-['Montserrat'] text-[40px] font-bold leading-[50px] tracking-[0.2px] text-[#252B42]">
          {table.title}
        </h2>

        {/* Desktop: satır kontrollü versiyon */}
        <p
          className="mt-3 text-center hidden font-['Montserrat'] text-[14px] font-normal leading-[20px] tracking-[0.2px] text-[#737373] md:block"
          aria-hidden={table.subtitle ? true : false} // ekran okuyucuya tekrar okutmamak için
        >
          {table.subtitleDesktop && table.subtitleDesktop.length > 0
            ? table.subtitleDesktop.map((line, idx) => (
                <span key={idx} className="block">
                  {line}
                </span>
              ))
            : table.subtitle}
        </p>

        {/* Mobil: tek paragraf, doğal kırılım */}
        <p className="mt-3 text-center px-20 font-['Montserrat'] text-[14px] font-normal leading-[20px] tracking-[0.2px] text-[#737373] md:hidden">
          {table.subtitle}
        </p>

        {/* Monthly / Yearly toggle */}
        <BillingToggle
          billingPeriod={billingPeriod}
          onChange={setBillingPeriod}
          billingConfig={table.billing}
        />

        {/* Kartlar */}
        <div className="mt-12 flex w-full flex-col lg:flex-row gap-8 md:gap-0 lg:items-stretch lg:justify-center">
          {table.plans.map((plan) => (
            <PricingPlanCard
              key={plan.id}
              plan={plan}
              billingPeriod={billingPeriod}
              currency={table.currency}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
