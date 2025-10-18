import slider1 from "../assets/slider/slider1.png";
import slider2 from "../assets/slider/slider2.png";

export const homeSliders = [
  {
    id: "summer-2020",
    locale: "en",
    isActive: true,
    sortOrder: 1,
    schedule: {
      startAt: null, // ISO string veya null
      endAt: null,
    },
    content: {
      kicker: "SUMMER 2020",
      headline: "NEW COLLECTION",
      description:
        "We know how large objects will act, but things on a small scale.",
      cta: { label: "SHOP NOW", href: "/shop/new" },
      alignment: "left", // left | center | right (metin kutusu hizası)
      maxWidth: 560, // içerik kutusu genişlik sınırı (px)
    },
    theme: {
      // arka planı görsel değil renk olan tasarımlar için
      background: "#05B6D3", // fallback bg
      textColor: "#FFFFFF",
      buttonBg: "#2DC071", // yeşil buton
      buttonText: "#FFFFFF",
    },
    media: {
      type: "image",
      src: slider1,
      alt: "Woman holding shopping bags, summer collection",
      objectFit: "contain",
      position: "right-bottom", // right-bottom | right-center | cover
    },
  },
  {
    id: "autumn-essentials",
    locale: "en",
    isActive: true,
    sortOrder: 2,
    schedule: { startAt: null, endAt: null },
    content: {
      kicker: "AUTUMN 2020",
      headline: "ESSENTIAL STYLES",
      description: "Layer up with cozy picks for chilly days.",
      cta: { label: "DISCOVER", href: "/shop/autumn" },
      alignment: "left",
      maxWidth: 560,
    },
    theme: {
      background: "#0CB0CE",
      textColor: "#FFFFFF",
      buttonBg: "#2DC071",
      buttonText: "#FFFFFF",
    },
    media: {
      type: "image",
      src: slider2,
      alt: "Autumn collection shopper",
      objectFit: "contain",
      position: "right-bottom",
    },
  },
];
