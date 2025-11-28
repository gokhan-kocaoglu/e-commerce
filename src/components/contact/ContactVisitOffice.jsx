import { PhoneCall, MapPin, Send } from "lucide-react";
import { getContactVisitOffice } from "../../data/contact";

const iconMap = {
  phone: PhoneCall,
  location: MapPin,
  email: Send,
};

export default function ContactVisitOffice({ locale = "en", className = "" }) {
  const section = getContactVisitOffice(locale);
  if (!section) return null;

  const { eyebrow, title, cards = [] } = section;

  return (
    <section className={` ${className}`}>
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10 lg:py-24">
        {/* Başlık */}
        <div className="text-center flex flex-col justify-center items-center">
          {eyebrow && (
            <h6 className="font-['Montserrat'] text-[14px] font-bold leading-[24px] uppercase tracking-[0.2em] text-[#252B42]">
              {eyebrow}
            </h6>
          )}

          <h2 className="max-w-[220px] md:max-w-[600px] text-center mt-4 font-['Montserrat'] text-[28px] font-bold leading-[36px] tracking-[0.2px] text-[#252B42] md:text-[32px] md:leading-[42px] lg:text-[40px] lg:leading-[50px]">
            {title}
          </h2>
        </div>

        {/* Kartlar */}
        <div className="mt-12 grid gap-8 md:mt-16 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = iconMap[card.icon];
            const isDark = card.theme === "dark";

            return (
              <div
                key={card.id}
                className={`flex h-full flex-col items-center justify-between px-10 py-12 text-center transition
                  ${
                    isDark
                      ? "bg-[#252B42] text-white"
                      : "bg-white text-[#252B42]"
                  }
                `}
              >
                <div>
                  {/* Icon */}
                  {Icon && (
                    <div className="mb-6 flex justify-center">
                      <Icon className="h-12 w-12 text-[#23A6F0]" />
                    </div>
                  )}

                  {/* Email satırları */}
                  <div className="space-y-1">
                    {card.emails?.map((mail) => (
                      <p
                        key={mail}
                        className={`font-['Montserrat'] text-[14px] font-semibold leading-[24px] tracking-[0.2px] ${
                          isDark ? "text-white" : "text-[#252B42]"
                        }`}
                      >
                        {mail}
                      </p>
                    ))}
                  </div>

                  {/* Headline */}
                  {card.headline && (
                    <p
                      className={`mt-6 font-['Montserrat'] text-[16px] font-bold leading-[24px] tracking-[0.1px] ${
                        isDark ? "text-white" : "text-[#252B42]"
                      }`}
                    >
                      {card.headline}
                    </p>
                  )}
                </div>

                {/* Button */}
                {card.primaryAction && (
                  <a
                    href={card.primaryAction.href || "#"}
                    className={`mt-8 inline-flex items-center justify-center rounded-[5px] md:rounded-[35px] border px-8 py-3 text-sm font-bold tracking-[0.2px] transition
                      ${
                        isDark
                          ? "border-[#23A6F0] text-[#23A6F0] hover:bg-[#23A6F0] hover:text-white"
                          : "border-[#23A6F0] text-[#23A6F0] hover:bg-[#23A6F0] hover:text-white"
                      }
                    `}
                  >
                    {card.primaryAction.label}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
