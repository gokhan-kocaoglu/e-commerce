import {
  FaHooli,
  FaLyft,
  FaLeaf,
  FaStripe,
  FaAws,
  FaRedditAlien,
} from "react-icons/fa";

const ICON_MAP = {
  hooli: FaHooli,
  lyft: FaLyft,
  leaf: FaLeaf,
  stripe: FaStripe,
  aws: FaAws,
  reddit: FaRedditAlien,
};

export default function ClientsStrip({
  items,
  size,
  color = "#737373",
  showLabels = false,
  title,
  subtitle,
  subtitleDesktop,
  className = "",
  h4,
}) {
  const defaultItems = [
    { id: "hooli", label: "Hooli" },
    { id: "lyft", label: "Lyft" },
    { id: "leaf", label: "Leaf" },
    { id: "stripe", label: "Stripe" },
    { id: "aws", label: "AWS" },
    { id: "reddit", label: "Reddit" },
  ];

  const sizePx = { sm: 28, md: 36, lg: 100 }[size] ?? 36;

  // items: { id, label, Icon? , iconKey? } şeklinde gelebilir
  const normalized = (items ?? defaultItems).map((item) => {
    if (item.Icon) return item;
    const Icon = ICON_MAP[item.iconKey || item.id] || FaStripe; // fallback
    return { ...item, Icon };
  });
  console.log(h4);

  return (
    <section
      className={`mx-auto w-full max-w-7xl bg-[#FAFAFA] px-4 sm:px-6 ${className}`}
    >
      <div className="flex flex-col items-center py-10 md:py-14">
        <div className="max-w-2xl text-center py-2 justify-center">
          {/* Başlık varsa */}
          {title && (
            <h2 className="mx-auto max-w-2xs md:max-w-2xl text-center font-['Montserrat'] text-[40px] font-bold leading-[50px] tracking-[0.2px] text-[#252B42]">
              {title}
            </h2>
          )}

          {h4 && (
            <h4 className="mx-auto max-w-60 md:max-w-2xl text-center font-['Montserrat'] text-[20px] font-normal leading-[30px] tracking-[0.2px] text-[#252B42]">
              {h4}
            </h4>
          )}

          {/* Desktop: satır kontrollü versiyon */}
          <p
            className="mt-3 hidden font-['Montserrat'] text-[14px] font-normal leading-[20px] tracking-[0.2px] text-[#737373] md:block"
            aria-hidden={subtitle ? true : false} // ekran okuyucuya tekrar okutmamak için
          >
            {subtitleDesktop && subtitleDesktop.length > 0
              ? subtitleDesktop.map((line, idx) => (
                  <span key={idx} className="block">
                    {line}
                  </span>
                ))
              : subtitle}
          </p>

          {/* Mobil: tek paragraf, doğal kırılım */}
          <p className="mt-3 px-6 font-['Montserrat'] text-[14px] font-normal leading-[20px] tracking-[0.2px] text-[#737373] md:hidden">
            {subtitle}
          </p>
        </div>

        {/* Logo şeridi */}
        <div className="mt-10 flex w-full flex-col items-center gap-8 md:flex-row md:flex-wrap md:justify-between">
          {normalized.map(({ id, label, Icon }) => (
            <div
              key={id}
              className="
                flex w-full flex-col items-center justify-center md:w-auto
                opacity-70 grayscale transition
                hover:opacity-100 hover:grayscale-0
              "
              aria-label={label}
              title={label}
            >
              <Icon size={sizePx} color={color} />
              {showLabels && (
                <span className="mt-3 font-['Montserrat'] text-[14px] font-semibold leading-[24px] tracking-[0.2px] text-[#737373]">
                  {label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
