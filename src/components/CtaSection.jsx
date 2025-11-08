import { Link } from "react-router-dom";
import { getCtaBySlug } from "../data/cta";

export default function CtaSection({
  slug = "neural-universe",
  className = "",
}) {
  const item = getCtaBySlug(slug);
  if (!item) return null;

  const { hero, badge, title, description, actions } = item;
  const img = hero.image;

  // position -> anchor map
  const anchor = {
    "left-bottom": {
      inset: "md:bottom-0 md:left-0",
      origin: "[transform-origin:left_bottom]",
    },
    "left-center": {
      inset: "md:inset-y-0 md:left-0",
      origin: "[transform-origin:left_center]",
    },
    "center-bottom": {
      inset: "md:bottom-0 md:left-1/2 md:-translate-x-1/2",
      origin: "[transform-origin:center_bottom]",
    },
    center: { inset: "md:inset-0", origin: "[transform-origin:center]" },
    "right-bottom": {
      inset: "md:bottom-0 md:right-0",
      origin: "[transform-origin:right_bottom]",
    },
  }[img.position || "left-bottom"];

  const desktopTransform = `translate(${img.shiftXDesktopPct || 0}%, ${
    img.shiftYDesktopPct || 0
  }%) scale(${img.scaleDesktop || 1})`;
  const mobileTransform = `scale(${img.scaleMobile || 1})`;

  return (
    <section
      aria-labelledby={`${item.id}-title`}
      className={`mx-auto w-full max-w-7xl px-4 md:px-6 ${className}`}
    >
      {/* EŞİT PAYLAŞIM: md:gap-24 => 6rem, her kolon: calc(50% - 3rem) */}
      <div className="flex flex-col md:flex-row md:items-center ">
        {/* MEDIA COLUMN (solda) */}
        <div className="order-2 md:order-1 md:basis-[calc(50%-3rem)] md:grow min-w-0">
          <figure
            className="
              relative w-full
              overflow-visible md:overflow-hidden
              min-h-0 md:min-h-[520px] lg:min-h-[640px]
            "
            aria-hidden="true"
          >
            {/* Bleed: container paddingini içerde telafi et; kolon %50 kalır */}
            <div className="ml-[-1rem] md:ml-[-1.5rem]">
              {/* Mobile: doğal akış, kırpma yok */}
              <img
                src={img.src}
                alt={img.alt}
                className="relative block w-full h-auto md:hidden"
                style={{ transform: mobileTransform }}
                loading="eager"
                decoding="async"
              />

              {/* Desktop: absolute + crop + transform (data’dan) */}
              <img
                src={img.src}
                alt=""
                aria-hidden="true"
                className={[
                  "hidden md:block absolute max-w-none w-auto h-full pointer-events-none select-none",
                  anchor.inset, // örn: bottom-0 left-0
                  anchor.origin, // örn: [transform-origin:left_bottom]
                ].join(" ")}
                style={{ transform: desktopTransform }}
              />
            </div>

            {/* transparent PNG için arkaplan */}
            <div className="absolute inset-0 -z-10 bg-white" />
          </figure>
        </div>

        {/* CONTENT COLUMN (sağda) */}
        <div className="order-1 md:order-2 md:basis-[calc(50%-3rem)] md:grow min-w-0 lg:px-30">
          <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3 pt-30 md:pt-0">
            {/* h5 - SUMMER 2020 */}
            <p className="font-['Montserrat'] font-bold text-[16px] leading-[24px] tracking-[0.1px] text-[#BDBDBD] uppercase">
              {badge.text}
            </p>

            {/* h2 - Title */}
            <h2
              id={`${item.id}-title`}
              className="font-['Montserrat'] font-bold text-[#252B42] text-[40px] leading-[50px] tracking-[0.2px]"
            >
              {title.text}
            </h2>

            {/* h4 - Description */}
            <p className="mt-1 font-['Montserrat'] text-[#737373] text-[20px] leading-[30px] tracking-[0.2px] font-normal lg:max-w-[460px]">
              {description.text}
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col md:flex-row items-center gap-4">
              {actions.map((a) => {
                const base =
                  "inline-flex items-center justify-center rounded-[5px] px-8 py-3 font-['Montserrat'] text-[14px] font-bold tracking-[0.2px] transition focus:outline-none focus:ring-2 focus:ring-offset-2";
                return a.kind === "primary" ? (
                  <Link
                    key={a.id}
                    to={a.to}
                    className={`${base} bg-[#2DC071] text-white hover:opacity-95 focus:ring-[#2DC071]`}
                  >
                    {a.label}
                  </Link>
                ) : (
                  <Link
                    key={a.id}
                    to={a.to}
                    className={`${base} border border-[#2DC071] text-[#2DC071] hover:bg-[#2DC071]/10 focus:ring-[#2DC071]`}
                  >
                    {a.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
