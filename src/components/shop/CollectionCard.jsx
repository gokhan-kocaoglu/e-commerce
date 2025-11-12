import { Link } from "react-router-dom";

export default function CollectionCard({
  item,
  className = "",
  textClass = "",
}) {
  if (!item) return null;
  return (
    <div className={`shrink-0 grow-0 ${className}`}>
      <Link
        to={item.path}
        className="group relative block w-full aspect-[4/5] overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-900"
      >
        <img
          src={item.imageUrl}
          alt={item.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-black/30" />
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-white">
          <div
            className={`font-['Montserrat'] font-extrabold tracking-[0.2px] ${
              textClass ||
              "text-[20px] leading-[28px] sm:text-[22px] sm:leading-[30px]"
            }`}
          >
            {item.title}
          </div>
          {item.subtitle && (
            <div className="mt-1 font-['Montserrat'] text-[14px] leading-[24px] tracking-[0.2px] opacity-90">
              {item.subtitle}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
