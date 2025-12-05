import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../lib/http";

// Vite alt dizin deploy desteği için görsel yolu normalize
const withBase = (p = "") => {
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/+$/, "")}/${p.replace(/^\/+/, "")}`;
};
const normalizeImageUrl = (url) => {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  // "../" ve "./" öneklerini temizle
  const cleaned = url
    .replace(/^(\.\.\/)+/, "")
    .replace(/^\.\/+/, "")
    .replace(/^\/+/, "");
  return withBase(cleaned); // -> assets/editor/xxx.jpg
};

function Pill({ children }) {
  return (
    <span className="inline-flex items-center bg-white px-6 py-3 text-sm font-semibold tracking-wide text-zinc-900 shadow-sm">
      {children}
    </span>
  );
}

function Card({ category, media, className = "", imgClassName = "" }) {
  if (!category || !media) return null;

  return (
    <Link
      to={`/shop/${category.slug}`} // path yerine slug’dan route
      className={`relative block overflow-hidden bg-zinc-100 ${className}`}
      aria-label={category.name}
    >
      {/* Görsel */}
      <img
        src={media.url}
        alt={media.alt || category.name}
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
  const [slots, setSlots] = useState({
    "left-large": null,
    "middle-tall": null,
    "right-top": null,
    "right-bottom": null,
  });

  // Backend key -> UI slot
  const keyToSlot = useMemo(
    () => ({
      1: "left-large",
      2: "middle-tall",
      3: "right-top",
      4: "right-bottom",
    }),
    []
  );

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        // 1) Editor’s picks
        const epRes = await http.get("api/content/editors-picks");
        const picks = (epRes?.data?.data || []).slice(0, 4);

        // 2) Her pick’in ilk categoryIds[0] için detay çek
        const details = await Promise.all(
          picks.map(async (p) => {
            const firstId = p?.categoryIds?.[0];
            if (!firstId) return null;
            const catRes = await http.get(`api/catalog/categories/${firstId}`);
            const cat = catRes?.data?.data;
            if (!cat) return null;

            const slot = keyToSlot[p.key];
            return {
              slot,
              category: {
                id: cat.id,
                name: cat.name,
                slug: cat.slug,
              },
              media: {
                url: normalizeImageUrl(cat.heroImageUrl),
                alt: `${cat.name} hero`,
              },
            };
          })
        );

        if (!alive) return;
        const next = {
          "left-large": null,
          "middle-tall": null,
          "right-top": null,
          "right-bottom": null,
        };
        details.filter(Boolean).forEach((d) => {
          next[d.slot] = { category: d.category, media: d.media };
        });
        setSlots(next);
      } catch {
        // interceptor toast gösteriyor
      }
    })();

    return () => {
      alive = false;
    };
  }, [keyToSlot]);

  return (
    <section className="mx-auto w-full flex justify-center max-w-7xl px-4 bg-[#FAFAFA]">
      <div className="py-24 items-center justify-center flex flex-col">
        {/* Başlık */}
        <div className="mb-8 text-center md:mb-12 max-w-48 md:max-w-90">
          <h3 className="font-['Montserrat'] text-2xl font-bold leading-[32px] tracking-[0.1px] text-[#252B42]">
            EDITOR’S PICK
          </h3>
          <p className="mt-3 text-[#737373] text-center font-['Montserrat'] font-normal text-sm leading-[20px] tracking-[0.2px]">
            Problems trying to resolve the conflict between
          </p>
        </div>

        {/* Layout: mobile column, md+ flex row */}
        <div className="flex flex-col justify-center items-center gap-6 lg:flex-row md:gap-8">
          {/* LEFT - Large */}
          <div className="md:flex-[2]">
            <Card
              category={slots["left-large"]?.category}
              media={slots["left-large"]?.media}
              className="w-80 h-[500px] aspect-[2/3] md:w-auto md:aspect-auto md:h-[500px] lg:h-[500px] md:max-w-80 lg:min-w-[510px]"
              imgClassName="object-center"
            />
          </div>

          {/* MIDDLE - Tall (WOMEN) */}
          <div className="md:flex-[1] min-w-80 lg:min-w-60">
            <Card
              category={slots["middle-tall"]?.category}
              media={slots["middle-tall"]?.media}
              className="w-80 h-[500px] aspect-[2/3] md:w-auto md:aspect-auto md:h-[500px] lg:h-[500px]"
              imgClassName="object-[center_0%] md:object-center"
            />
          </div>

          {/* RIGHT - Two stacked small cards */}
          <div className="md:flex-[1] flex flex-col gap-4 lg:min-w-[240px]">
            <Card
              category={slots["right-top"]?.category}
              media={slots["right-top"]?.media}
              className="w-80 aspect-[4/3] md:w-80 lg:w-60 md:aspect-auto md:h-[242px]"
              imgClassName="object-center"
            />
            <Card
              category={slots["right-bottom"]?.category}
              media={slots["right-bottom"]?.media}
              className="w-80 aspect-[4/3] md:w-80 lg:w-60 md:aspect-auto md:h-[242px]"
              imgClassName="object-center"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
