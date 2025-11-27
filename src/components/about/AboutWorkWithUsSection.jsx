import { Link } from "react-router-dom";
import { getAboutWorkWithUs } from "../../data/aboutData";

export default function AboutWorkWithUsSection({ className = "" }) {
  const section = getAboutWorkWithUs("en");
  if (!section) return null;

  const { eyebrow, title, description, primaryAction, image } = section;

  return (
    <section className={`bg-[#2A7CC7] ${className}`}>
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        {/* Sol: metin */}
        <div
          className="
    mx-auto flex w-full flex-col
    items-center justify-center          
    px-16 py-16                           
    text-center text-white               
    lg:w-2/3 lg:px-34 lg:text-left lg:items-start  
  "
        >
          {eyebrow && (
            <h5 className="font-['Montserrat'] text-[16px] font-bold leading-[24px] tracking-[0.1px] text-white">
              {eyebrow}
            </h5>
          )}

          <h2 className="mt-4 font-['Montserrat'] text-[32px] font-bold leading-[40px] tracking-[0.2px] text-white md:text-[40px] md:leading-[50px]">
            {title}
          </h2>

          <p className="mt-4 max-w-md font-['Montserrat'] text-[14px] font-normal leading-[20px] tracking-[0.2px] text-white/90">
            {description}
          </p>

          {primaryAction && (
            <div className="mt-8">
              <Link
                to={primaryAction.href}
                className="inline-flex items-center rounded-[4px] border border-white px-10 py-3 font-['Montserrat'] text-[14px] font-bold leading-[24px] tracking-[0.2px] text-white transition hover:bg-white hover:text-[#2A7CC7]"
              >
                {primaryAction.label}
              </Link>
            </div>
          )}
        </div>

        {/* Sağ: görsel */}
        <div className="w-full hidden lg:block lg:w-1/2">
          {image?.src && (
            <img
              src={image.src}
              alt={image.alt}
              loading="lazy"
              className="h-[630px] w-full object-cover"
            />
          )}
        </div>
      </div>
    </section>
  );
}
