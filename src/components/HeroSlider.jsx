import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useMemo, useState } from "react";
import prevIcon from "../assets/slider/carousel-control-prev.png";
import nextIcon from "../assets/slider/carousel-control-next.png";
import { mapApiToHeroSlides } from "../adapters/sliderAdapter";

export default function HeroSliderEmbla({
  items = [],
  heightClass = "h-[520px] md:h-[640px]",
  autoPlayDelay = 6000,
}) {
  // items BE biçimindeyse (name/heroImageUrl alanları), UI modeline map'le
  const slides = useMemo(() => {
    const isApiShape =
      items?.[0] && ("name" in items[0] || "heroImageUrl" in items[0]);
    return isApiShape ? mapApiToHeroSlides(items) : items;
  }, [items]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: false },
    [Autoplay({ delay: autoPlayDelay, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const canScroll = slides.length > 1;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollTo = useCallback(
    (i) => emblaApi && emblaApi.scrollTo(i),
    [emblaApi]
  );
  const next = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const prev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, next, prev, onSelect]);

  const toggleAutoplay = (pause) => {
    if (!emblaApi) return;
    const autoplay = emblaApi.plugins()?.autoplay;
    if (!autoplay) return;
    pause ? autoplay.stop() : autoplay.play();
  };

  if (!slides?.length) return null;

  return (
    <section
      className={`relative w-full overflow-hidden ${heightClass}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Hero Slider"
      onMouseEnter={() => toggleAutoplay(true)}
      onMouseLeave={() => toggleAutoplay(false)}
    >
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {slides.map((item) => (
            <div key={item.id} className="embla__slide min-w-full">
              <Slide item={item} />
            </div>
          ))}
        </div>
      </div>

      {canScroll && (
        <>
          <button
            aria-label="Previous slide"
            onClick={prev}
            className="absolute left-10 top-1/2 z-20 -translate-y-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            <img
              src={prevIcon}
              alt=""
              aria-hidden="true"
              draggable="false"
              className="h-11 w-6 select-none"
            />
          </button>

          <button
            aria-label="Next slide"
            onClick={next}
            className="absolute right-10 top-1/2 z-20 -translate-y-1/2 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            <img
              src={nextIcon}
              alt=""
              aria-hidden="true"
              draggable="false"
              className="h-11 w-6 select-none"
            />
          </button>

          <Bars
            count={slides.length}
            current={selectedIndex}
            onDotClick={scrollTo}
          />
        </>
      )}
    </section>
  );
}

function Slide({ item }) {
  const {
    theme,
    media,
    content: {
      kicker,
      headline,
      description,
      cta,
      alignment = "left",
      maxWidth = 560,
    },
  } = item;

  const mdAlignMap = {
    left: "md:items-start md:text-left",
    center: "md:items-center md:text-center",
    right: "md:items-end md:text-right",
  };

  return (
    <div
      className="relative h-full w-full"
      style={{ backgroundColor: theme?.background || "#05B6D3" }}
    >
      {media?.type === "image" && (
        <img
          src={media.src}
          alt={media.alt || ""}
          className="
            pointer-events-none select-none
            absolute inset-0 z-0
            h-full w-full object-cover
            md:object-contain md:bottom-0 md:right-0
          "
          draggable="false"
        />
      )}

      <div className="relative z-10 mx-auto flex h-full w-full items-center max-w-5xl px-4 md:px-6">
        <div
          className={`flex w-full flex-col items-center text-center justify-center ${mdAlignMap[alignment]} `}
          style={{ color: theme?.textColor || "#fff" }}
        >
          <div
            className="space-y-4 md:space-y-6"
            style={{
              maxWidth:
                typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
            }}
          >
            {kicker && (
              <h5 className="font-['Montserrat'] text-[14px] font-bold leading-[24px] tracking-[0.1px]">
                {kicker}
              </h5>
            )}

            {headline && (
              <h1 className="font-['Montserrat'] max-w-[268px] text-[40px] leading-[50px] md:text-[58px] md:leading-[80px] font-bold tracking-[0.2px] md:whitespace-nowrap">
                {headline}
              </h1>
            )}

            {description && (
              <h4 className="font-['Montserrat'] text-[20px] leading-[30px] font-normal tracking-[0.2px] max-w-[290px] md:max-w-[365px] mx-auto md:mx-0">
                {description}
              </h4>
            )}

            {cta?.label && (
              <a
                href={cta.href || "#"}
                className="inline-flex items-center justify-center rounded-[5px] px-8 py-[12px] md:px-10 md:py-[15px] font-['Montserrat'] text-2xl font-bold leading-8 tracking-[0.1px] shadow-md transition hover:brightness-110"
                style={{
                  backgroundColor: theme?.buttonBg || "#2DC071",
                  color: theme?.buttonText || "#ffffff",
                }}
              >
                {cta.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Bars({ count, current, onDotClick }) {
  return (
    <div
      className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2"
      aria-label="Slide indicators"
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: count }).map((_, i) => {
          const isActive = i === current;
          return (
            <button
              key={i}
              type="button"
              onClick={() => onDotClick(i)}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={isActive ? "true" : "false"}
              className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80 rounded-full"
            >
              <span
                className={[
                  "block w-[62px] h-[10px] transition-colors duration-200",
                  isActive
                    ? "bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
                    : "bg-white opacity-50 group-hover:bg-zinc-500",
                ].join(" ")}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
