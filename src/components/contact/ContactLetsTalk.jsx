import { ArrowDown } from "lucide-react";
import { Link } from "react-router-dom";
import { getContactLetsTalk } from "../../data/contact";

export default function ContactLetsTalk({ locale = "en", className = "" }) {
  const section = getContactLetsTalk(locale);
  if (!section) return null;

  const { eyebrow, title, image, primaryAction } = section;
  const isInternal = primaryAction?.href?.startsWith("/");

  const ButtonInner = (
    <span className="font-['Montserrat'] text-[14px] font-bold leading-[22px] tracking-[0.2px]">
      {primaryAction?.label}
    </span>
  );

  return (
    <section className={`bg-white ${className}`}>
      <div className="mx-auto flex max-w-7xl flex-col items-center px-6 py-4 text-center md:px-10 lg:py-0">
        {/* Arrow */}
        {image?.url && (
          <div className="mb-4 flex justify-center">
            <img
              src={image.url}
              alt={image.alt || ""}
              loading="lazy"
              className="h-10 w-auto md:h-12 lg:h-14"
            />
          </div>
        )}

        {/* Eyebrow */}
        {eyebrow && (
          <h5 className="font-['Montserrat'] text-[14px] font-bold leading-[24px] tracking-[0.1px] text-[#252B42] md:text-[16px]">
            {eyebrow}
          </h5>
        )}

        {/* Title */}
        <h1 className="mt-3 font-['Montserrat'] text-[32px] font-bold leading-[42px] tracking-[0.2px] text-[#252B42] md:mt-4 md:text-[40px] md:leading-[50px] lg:text-[58px] lg:leading-[80px]">
          {title}
        </h1>

        {/* Button */}
        {primaryAction && (
          <div className="mt-6">
            {isInternal ? (
              <Link
                to={primaryAction.href}
                className="inline-flex items-center justify-center rounded-[5px] bg-[#23A6F0] px-10 py-3 text-white transition hover:bg-[#1b86d3]"
              >
                {ButtonInner}
              </Link>
            ) : (
              <a
                href={primaryAction.href}
                className="inline-flex items-center justify-center rounded-[5px] bg-[#23A6F0] px-10 py-3 text-white transition hover:bg-[#1b86d3]"
              >
                {ButtonInner}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
