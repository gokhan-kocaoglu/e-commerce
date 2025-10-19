import card1Image from "../assets/card/card1.jpg";
import card2Image from "../assets/card/card2.jpg";
import card3Image from "../assets/card/card3.jpg";
import card4Image from "../assets/card/card4.jpg";
import card5Image from "../assets/card/card5.jpg";
import card6Image from "../assets/card/card6.jpg";
import card7Image from "../assets/card/card7.jpg";
import card8Image from "../assets/card/card8.jpg";

export const categories = [
  { id: "men", name: "Men", slug: "men", path: "/shop/men" },
  { id: "women", name: "Women", slug: "women", path: "/shop/women" },
  { id: "kids", name: "Kids", slug: "kids", path: "/shop/kids" },
  { id: "hoodie", name: "Hoodies", slug: "hoodie", path: "/shop/hoodie" },
  { id: "tshirt", name: "T-Shirts", slug: "tshirt", path: "/shop/tshirt" },
];

export const media = {
  // Not: Varlıklarınızı /src/assets/products/ altına koyarsanız build kolay olur.
  // Geçici olarak placeholder kullanıldı; kendi görsellerinizle değiştirin.
  // Desktop gereksinimi: 240×427. Daha büyük kullansanız da render’da kırpıyoruz.
  p1: {
    id: "p1",
    src: card1Image,
    w: 240,
    h: 427,
    alt: "Model 1",
  },
  p2: {
    id: "p2",
    src: card2Image,
    w: 240,
    h: 427,
    alt: "Model 2",
  },
  p3: {
    id: "p3",
    src: card3Image,
    w: 240,
    h: 427,
    alt: "Model 3",
  },
  p4: {
    id: "p4",
    src: card4Image,
    w: 240,
    h: 427,
    alt: "Model 4",
  },
  p5: {
    id: "p5",
    src: card5Image,
    w: 240,
    h: 427,
    alt: "Model 5",
  },
  p6: {
    id: "p6",
    src: card6Image,
    w: 240,
    h: 427,
    alt: "Model 6",
  },
  p7: {
    id: "p7",
    src: card7Image,
    w: 240,
    h: 427,
    alt: "Model 7",
  },
  p8: {
    id: "p8",
    src: card8Image,
    w: 240,
    h: 427,
    alt: "Model 8",
  },
};

// Renk seçeneklerini normalize edelim ki UI doğrudan ürün->options->colors'tan beslensin.
export const colorPalette = [
  { code: "blue", name: "Teal", hex: "#23A6F0" },
  { code: "green", name: "Blue", hex: "#23856D" },
  { code: "orange", name: "Orange", hex: "#E77C40" },
  { code: "darkBlue", name: "Brown", hex: "#252B42" },
  { code: "darkGreen", name: "Green", hex: "#3AA76D" },
  { code: "black", name: "Black", hex: "#000000" },
  { code: "red", name: "Red", hex: "#E02D2D" },
];

export const products = [
  {
    id: "sku-1001",
    sku: "SKU-1001",
    slug: "graphic-design-tee-01",
    title: "Graphic Design",
    shortDescription: "English Department",
    categoryId: "women",
    categories: ["women", "men"], // çoklu kategoriye hazır
    price: { list: 16.48, sale: 6.48, currency: "USD" },
    media: [media.p1],
    options: {
      colors: ["blue", "green", "orange", "darkBlue"], // colorPalette code'ları
    },
    inventory: { inStock: true, qty: 42 },
    rating: { average: 4.6, count: 137 },
    isBestSeller: true,
    createdAt: "2025-10-01T00:00:00Z",
    updatedAt: "2025-10-15T00:00:00Z",
  },
  {
    id: "sku-1002",
    sku: "SKU-1002",
    slug: "graphic-design-tee-02",
    title: "Graphic Design",
    shortDescription: "English Department",
    categoryId: "tshirt",
    categories: ["tshirt", "men"],
    price: { list: 16.48, sale: 6.48, currency: "USD" },
    media: [media.p2],
    options: { colors: ["blue", "green", "orange", "darkBlue"] },
    inventory: { inStock: true, qty: 31 },
    rating: { average: 4.4, count: 91 },
    isBestSeller: true,
    createdAt: "2025-10-01T00:00:00Z",
    updatedAt: "2025-10-15T00:00:00Z",
  },
  {
    id: "sku-1003",
    sku: "SKU-1003",
    slug: "graphic-design-tee-03",
    title: "Graphic Design",
    shortDescription: "English Department",
    categoryId: "women",
    categories: ["women", "tshirt"],
    price: { list: 16.48, sale: 6.48, currency: "USD" },
    media: [media.p3],
    options: { colors: ["blue", "green", "orange", "darkBlue"] },
    inventory: { inStock: true, qty: 18 },
    rating: { average: 4.8, count: 211 },
    isBestSeller: true,
  },
  {
    id: "sku-1004",
    sku: "SKU-1004",
    slug: "graphic-design-tee-04",
    title: "Graphic Design",
    shortDescription: "English Department",
    categoryId: "women",
    categories: ["women", "tshirt"],
    price: { list: 16.48, sale: 6.48, currency: "USD" },
    media: [media.p4],
    options: { colors: ["blue", "green", "orange", "darkBlue"] },
    inventory: { inStock: true, qty: 9 },
    rating: { average: 4.1, count: 58 },
    isBestSeller: true,
  },
  {
    id: "sku-1005",
    sku: "SKU-1005",
    slug: "coat-men-01",
    title: "Graphic Design",
    shortDescription: "English Department",
    categoryId: "men",
    categories: ["men"],
    price: { list: 16.48, sale: 6.48, currency: "USD" },
    media: [media.p5],
    options: { colors: ["blue", "green", "orange", "darkBlue"] },
    inventory: { inStock: true, qty: 24 },
    rating: { average: 4.7, count: 123 },
    isBestSeller: true,
  },
  {
    id: "sku-1006",
    sku: "SKU-1006",
    slug: "cardigan-women-01",
    title: "Graphic Design",
    shortDescription: "English Department",
    categoryId: "women",
    categories: ["women"],
    price: { list: 16.48, sale: 6.48, currency: "USD" },
    media: [media.p6],
    options: { colors: ["blue", "green", "orange", "darkBlue"] },
    inventory: { inStock: true, qty: 15 },
    rating: { average: 4.9, count: 308 },
    isBestSeller: true,
  },
  {
    id: "sku-1007",
    sku: "SKU-1007",
    slug: "hoodie-men-01",
    title: "Graphic Design",
    shortDescription: "English Department",
    categoryId: "hoodie",
    categories: ["hoodie", "men"],
    price: { list: 16.48, sale: 6.48, currency: "USD" },
    media: [media.p7],
    options: { colors: ["blue", "green", "orange", "darkBlue"] },
    inventory: { inStock: true, qty: 44 },
    rating: { average: 4.5, count: 76 },
    isBestSeller: true,
  },
  {
    id: "sku-1008",
    sku: "SKU-1008",
    slug: "tshirt-men-03",
    title: "Graphic Design",
    shortDescription: "English Department",
    categoryId: "kids",
    categories: ["tshirt", "men"],
    price: { list: 16.48, sale: 6.48, currency: "USD" },
    media: [media.p8],
    options: { colors: ["blue", "green", "orange", "darkBlue"] },
    inventory: { inStock: true, qty: 20 },
    rating: { average: 4.3, count: 67 },
    isBestSeller: true,
  },
];

// Yardımcılar
export function getCategoryById(id) {
  return categories.find((c) => c.id === id);
}

export function getColorByCode(code) {
  return colorPalette.find((c) => c.code === code);
}

export function getBestSellers(limit = 8) {
  return products.filter((p) => p.isBestSeller).slice(0, limit);
}
