import { Link } from "react-router-dom";
import { getAboutHero } from "../../data/aboutData";

export default function AboutHero({ className = "" }) {
  const hero = getAboutHero("en");
  if (!hero) return null;

  const { eyebrow, title, description, primaryAction, image } = hero;

  return (
    <section className={`bg-white ${className}`}>
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-10 px-6 py-16 md:px-8 lg:flex-row lg:py-10 xl:max-w-7xl">
        {/* Sol taraf – metin */}
        <div className="w-full flex flex-col items-center text-center lg:items-start lg:text-left lg:w-1/2">
          {eyebrow && (
            <h5 className="font-['Montserrat'] font-bold text-[16px] leading-[24px] tracking-[0.1px] text-[#252B42]">
              {eyebrow}
            </h5>
          )}

          <h1 className="mt-4 font-['Montserrat'] font-bold text-[40px] leading-[50px] lg:text-[58px] lg:leading-[80px] tracking-[0.2px] text-[#252B42]">
            {title}
          </h1>

          <h4 className="mt-4 max-w-100 font-['Montserrat'] font-normal text-[20px] leading-[30px] tracking-[0.2px] text-[#737373]">
            {description}
          </h4>

          {primaryAction && (
            <div className="mt-8 flex justify-center lg:justify-start">
              <Link
                to={primaryAction.href}
                className="inline-flex items-center rounded-md bg-[#23A6F0] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#1b7dc3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#23A6F0] focus-visible:ring-offset-2"
              >
                {primaryAction.label}
              </Link>
            </div>
          )}
        </div>

        {/* Sağ taraf – görsel */}
        <div className="relative flex w-full justify-center lg:w-1/2">
          {image?.src && (
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="relative z-10 max-h-[460px] w-full max-w-md object-contain"
            />
          )}
        </div>
      </div>
    </section>
  );
}
