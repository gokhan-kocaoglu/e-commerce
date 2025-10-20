import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useMemo, useState } from "react";
import { promoSliders } from "../data/slider"; // senin yoluna göre
import prevIcon from "../assets/slider/carousel-control-prev.png";
import nextIcon from "../assets/slider/carousel-control-next.png";

export default function PromoSlider({
  items = promoSliders,
  // Mobil: içerik boyuna göre; Desktop: sabit yükseklik (Hero ile uyumlu)
  heightClass = "h-auto md:h-[640px]",
  autoPlayDelay = 6000,
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: false },
    [Autoplay({ delay: autoPlayDelay, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const canScroll = items.length > 1;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    const onKey = (e) => {
      if (e.key === "ArrowRight") emblaApi.scrollNext();
      if (e.key === "ArrowLeft") emblaApi.scrollPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const toggleAutoplay = (pause) => {
    const ap = emblaApi?.plugins()?.autoplay;
    if (!ap) return;
    pause ? ap.stop() : ap.play();
  };

  if (!items?.length) return null;

  return (
    <section
      className={`relative w-full overflow-hidden ${heightClass}`}
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotional Slider"
      onMouseEnter={() => toggleAutoplay(true)}
      onMouseLeave={() => toggleAutoplay(false)}
    >
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {items.map((item) => (
            <div key={item.id} className="embla__slide min-w-full">
              <PromoSlide item={item} />
            </div>
          ))}
        </div>
      </div>

      {canScroll && (
        <>
          <button
            aria-label="Previous slide"
            onClick={() => emblaApi?.scrollPrev()}
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
            onClick={() => emblaApi?.scrollNext()}
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
            count={items.length}
            current={selectedIndex}
            onDotClick={(i) => emblaApi?.scrollTo(i)}
          />
        </>
      )}
    </section>
  );
}

function PromoSlide({ item }) {
  const {
    theme,
    media,
    content: {
      kicker,
      headline,
      description,
      price,
      cta,
      alignment = "left",
      maxWidth = 460,
      mobileTopGap = "24px", // mobil üst boşluk (opsiyonel)
      mobileMinHeight = "60svh", // mobilde ekran bazlı ortalama (opsiyonel)
    },
  } = item;

  const mdAlignMap = useMemo(
    () => ({
      left: "md:items-start md:text-left",
      center: "md:items-center md:text-center",
      right: "md:items-end md:text-right",
    }),
    []
  );

  return (
    <article
      className="relative w-full"
      style={{ backgroundColor: theme?.background || "#2D7B69" }}
    >
      {/* İç grid: md+ iki sütun; mobil tek sütun (görsel altta) */}
      <div
        className={[
          "mx-auto grid w-full max-w-[1280px] gap-6 px-6",
          "md:h-[640px] md:grid-cols-2 md:gap-6 ", // desktop yüksekliği dışardan heightClass ile de kontrol ediliyor
        ].join(" ")}
      >
        {/* TEXT COLUMN */}
        <div
          className={[
            // Mobil: üst boşluk + min-height ile dikey ortalama
            "flex flex-col items-center justify-center text-center md:pl-12 lg:pl-40",
            mdAlignMap[alignment],
          ].join(" ")}
          style={{
            color: theme?.textColor || "#fff",
            minHeight: mobileMinHeight, // mobilde ekrana göre ortalama
            paddingTop: mobileTopGap, // mobilde üst boşluk
          }}
        >
          <div
            className="space-y-4 md:space-y-6"
            style={{
              maxWidth:
                typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
            }}
          >
            {kicker && (
              <h4 className="font-['Montserrat'] text-[20px] font-normal leading-[30px] tracking-[0.2px]">
                {kicker}
              </h4>
            )}

            {headline && (
              <h1 className="font-['Montserrat'] text-[40px] leading-[50px] md:text-[58px] md:leading-[80px] font-bold tracking-[0.2px]">
                {headline}
              </h1>
            )}

            {description && (
              <p className="font-['Montserrat'] text-[14px] leading-[20px] font-normal tracking-[0.2px] max-w-[240px] md:max-w-[300px] lg:max-w-[360px] mx-auto md:mx-0">
                {description}
              </p>
            )}

            <div className="mt-2 flex flex-col items-center gap-8 lg:flex-row">
              {typeof price === "number" && (
                <h3 className="font-['Montserrat'] leading-[32px] tracking-[0.1px] text-2xl md:text-2xl font-bold">
                  ${price.toFixed(2)}
                </h3>
              )}

              {cta?.label && (
                <a
                  href={cta.href || "#"}
                  className="inline-flex items-center justify-center rounded-[5px] px-8 py-[12px] md:px-10 md:py-[15px] font-['Montserrat'] text-[14px] font-bold leading-8 tracking-[0.1px] shadow-md transition hover:brightness-110"
                  style={{
                    backgroundColor: theme?.buttonBg || "#2DC071",
                    color: theme?.buttonText || "#073B4C",
                  }}
                >
                  {cta.label}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* IMAGE COLUMN (flex ile ALT HİZA) */}
        {media?.type === "image" && (
          <div
            className="flex w-full md:h-full items-end justify-end lg:pr-24"
            style={{ height: media?.mobileHeight || undefined }}
          >
            <img
              src={media.src}
              alt={media.alt || ""}
              draggable="false"
              className="
        pointer-events-none select-none
        object-contain
        w-auto
        self-end
      "
              style={{
                /* Desktop’ta yatay taşmayı engellemek için genişlik sınırı (opsiyonel) */
                maxWidth: media?.maxWidthDesktop || "460px",
              }}
            />
          </div>
        )}
      </div>
    </article>
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
              className="group rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
            >
              <span
                className={[
                  "block h-[10px] w-[62px] transition-colors duration-200",
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
