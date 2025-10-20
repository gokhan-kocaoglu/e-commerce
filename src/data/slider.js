import slider3 from "../assets/slider/slider3.png";

export const promoSliders = [
  {
    id: "vita-classic-01",
    theme: {
      background: "#2D7B69",
      textColor: "#FFFFFF",
      buttonBg: "#2BB24C",
      buttonText: "#FFFFFF",
    },
    media: {
      type: "image",
      src: slider3,
      alt: "Male model in white sweatshirt",
      // (Artık absolute gerekmediği için position kaldırıldı)
      // Opsiyonel: desktop görsel genişlik sınırı
      maxWidthDesktop: "460px",
    },
    content: {
      kicker: "SUMMER 2020",
      headline: "Vita Classic Product",
      description:
        "We know how large objects will act, We know how are objects will act, We know",
      price: 16.48,
      cta: { label: "ADD TO CART", href: "#" },
      alignment: "left", // md+ hizalama: left | center | right
      maxWidth: 560, // text block max genişliği
      mobileTopGap: "24px", // mobil üst boşluk
      mobileMinHeight: "60svh", // mobilde ekran bazlı ortalama yüksekliği
    },
  },

  {
    id: "vita-classic-01",
    theme: {
      background: "#2D7B69",
      textColor: "#FFFFFF",
      buttonBg: "#2BB24C",
      buttonText: "#FFFFFF",
    },
    media: {
      type: "image",
      src: slider3,
      alt: "Male model in white sweatshirt",
      // (Artık absolute gerekmediği için position kaldırıldı)
      // Opsiyonel: desktop görsel genişlik sınırı
      maxWidthDesktop: "460px",
    },
    content: {
      kicker: "SUMMER 2020",
      headline: "Vita Classic Product",
      description:
        "We know how large objects will act, We know how are objects will act, We know",
      price: 16.48,
      cta: { label: "ADD TO CART", href: "#" },
      alignment: "left", // md+ hizalama: left | center | right
      maxWidth: 560, // text block max genişliği
      mobileTopGap: "24px", // mobil üst boşluk
      mobileMinHeight: "60svh", // mobilde ekran bazlı ortalama yüksekliği
    },
  },
];
