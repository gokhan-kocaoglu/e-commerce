// src/components/home/EditorsPick.jsx
import { Link } from "react-router-dom";
import { sections, categoriesById, mediaById } from "../data/editors";

function Pill({ children }) {
  return (
    <span className="inline-flex items-center bg-white px-6 py-3 text-sm font-semibold tracking-wide text-zinc-900 shadow-sm">
      {children}
    </span>
  );
}

function Card({ category, media, className = "", imgClassName = "" }) {
  return (
    <Link
      to={category.path}
      className={`relative block overflow-hidden bg-zinc-100 ${className}`}
      aria-label={category.name}
    >
      {/* Görsel */}
      <img
        src={media.url}
        alt={media.alt}
        className={`h-full w-full object-cover transition-transform duration-300 will-change-transform hover:scale-105 ${imgClassName}`}
        loading="lazy"
      />

      {/* Alt sol etiket */}
      <div className="pointer-events-none absolute bottom-6 left-6">
        <Pill>{category.name.toUpperCase()}</Pill>
      </div>

      {/* Soft overlay okunurluk için */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
    </Link>
  );
}

export default function EditorsPick() {
  const section = sections.find((s) => s.key === "editorsPick" && s.isActive);
  if (!section) return null;

  // Slot -> Category & Media
  const pick = Object.fromEntries(
    section.items.map((it) => {
      const cat = categoriesById[it.categoryId];
      const med = mediaById[cat?.heroImageId];
      return [it.slot, { category: cat, media: med }];
    })
  );

  return (
    <section className="mx-auto w-full flex justify-center max-w-7xl px-4 bg-[#FAFAFA]">
      <div className="py-24 items-center justify-center flex flex-col">
        {/* Başlık */}
        <div className="mb-8 text-center md:mb-12 max-w-48 md:max-w-90">
          <h3 className="font-['Montserrat'] text-2xl font-bold leading-[32px] tracking-[0.1px] text-[#252B42]">
            {section.title}
          </h3>
          <p className="mt-3 text-[#737373] text-center font-['Montserrat'] font-normal text-sm leading-[20px] tracking-[0.2px]">
            {section.subtitle}
          </p>
        </div>

        {/* Layout: mobile column, md+ flex row */}
        <div className="flex flex-col justify-center items-center gap-6 lg:flex-row md:gap-8">
          {/* LEFT - Large */}
          <div className="md:flex-[2]">
            <Card
              category={pick["left-large"].category}
              media={pick["left-large"].media}
              // Mobil: geniş oran; md+ sabit yükseklik
              className="w-80 h-[500px] aspect-[2/3] md:w-auto md:aspect-auto md:h-[500px] lg:h-[500px] md:max-w-80 lg:min-w-[510px]"
              imgClassName="object-center"
            />
          </div>

          {/* MIDDLE - Tall (WOMEN) */}
          <div className="md:flex-[1] min-w-80 lg:min-w-60">
            <Card
              category={pick["middle-tall"].category}
              media={pick["middle-tall"].media}
              // Mobil: portre oran (2/3) daha fazla kadraj gösterir
              // md+: sabit yükseklik
              className="w-80 h-[500px] aspect-[2/3] md:w-auto md:aspect-auto md:h-[500px] lg:h-[500px]"
              // Mobilde yüz/kafa kesilmesin diye kadrajı biraz yukarı al
              imgClassName="object-[center_0%] md:object-center"
            />
          </div>

          {/* RIGHT - Two stacked small cards */}
          <div className="md:flex-[1] flex flex-col gap-4 lg:min-w-[240px]">
            <Card
              category={pick["right-top"].category}
              media={pick["right-top"].media}
              // Mobil: oran; md+: sabit yükseklik
              className="w-80 aspect-[4/3] md:w-80 lg:w-60 md:aspect-auto md:h-[242px]"
              imgClassName="object-center"
            />
            <Card
              category={pick["right-bottom"].category}
              media={pick["right-bottom"].media}
              className="w-80 aspect-[4/3] md:w-80 lg:w-60 md:aspect-auto md:h-[242px]"
              imgClassName="object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
