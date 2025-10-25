import ctaImage from "../assets/cta/ctaImage.png";
export const ctaBlocks = [
  {
    id: "cta-neural-universe",
    slug: "neural-universe",
    locale: "en",
    version: 2,
    hero: {
      // 2. görsel (transparent PNG) için yolunu kendi projenine göre ayarla
      image: {
        id: "cta-cutout",
        src: ctaImage, // ör: public/assets/cta/ctaImage.png
        alt: "Couple wrapped in a red plaid scarf",
        // görsel yerleşim ipuçları (UI)
        position: "left-bottom",
        scaleDesktop: 1.06, // desktop'ta hafif büyüt
        scaleMobile: 1.0,
        shiftXDesktopPct: -11, // sola kaydır (%)
        shiftYDesktopPct: -7, // gerekirse - değer yukarı kaydırır
      },
    },
    badge: {
      text: "SUMMER 2020",
      color: "#BDBDBD",
    },
    title: {
      text: "Part of the Neural Universe",
      color: "#252B42",
    },
    description: {
      text: "We know how large objects will act, but things on a small scale.",
      color: "#737373",
    },
    actions: [
      { id: "buy-now", label: "BUY NOW", kind: "primary", to: "/shop" },
      {
        id: "read-more",
        label: "READ MORE",
        kind: "outline",
        to: "/blog/part-of-the-neural-universe",
      },
    ],
  },
];

export const getCtaBySlug = (slug) => ctaBlocks.find((x) => x.slug === slug);
