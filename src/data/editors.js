import menImg from "../assets/editor/men.png";
import womenImg from "../assets/editor/women.png";
import accessoriesImg from "../assets/editor/Accessories.jpg";
import kidsImage from "../assets/editor/Kids.jpg";

export const media = [
  {
    id: "m-men-hero",
    url: menImg, // /src/assets/... 'a kopyalayabilirsin (vite kopyalar)
    width: 1440,
    height: 960,
    alt: "Men casual outfit with jacket and cap",
    mimeType: "image/jpeg",
    createdAt: "2025-10-18T11:00:00Z",
    updatedAt: "2025-10-18T11:00:00Z",
  },
  {
    id: "m-women-hero",
    url: womenImg,
    width: 960,
    height: 1280,
    alt: "Women grey knit sweater portrait",
    mimeType: "image/jpeg",
    createdAt: "2025-10-18T11:00:00Z",
    updatedAt: "2025-10-18T11:00:00Z",
  },
  {
    id: "m-accessories-hero",
    url: accessoriesImg,
    width: 960,
    height: 960,
    alt: "Beige cardigan and accessories",
    mimeType: "image/jpeg",
    createdAt: "2025-10-18T11:00:00Z",
    updatedAt: "2025-10-18T11:00:00Z",
  },
  {
    id: "m-kids-hero",
    url: kidsImage,
    width: 960,
    height: 960,
    alt: "Kids yellow printed shirt",
    mimeType: "image/jpeg",
    createdAt: "2025-10-18T11:00:00Z",
    updatedAt: "2025-10-18T11:00:00Z",
  },
];

export const categories = [
  {
    id: "cat-men",
    name: "Men",
    slug: "men",
    path: "/shop/men",
    isActive: true,
    parentId: null, // ileride üst kategori bağlamak istersen
    heroImageId: "m-men-hero",
    order: 1,
    createdAt: "2025-10-18T11:00:00Z",
    updatedAt: "2025-10-18T11:00:00Z",
  },
  {
    id: "cat-women",
    name: "Women",
    slug: "women",
    path: "/shop/women",
    isActive: true,
    parentId: null,
    heroImageId: "m-women-hero",
    order: 2,
    createdAt: "2025-10-18T11:00:00Z",
    updatedAt: "2025-10-18T11:00:00Z",
  },
  {
    id: "cat-accessories",
    name: "Accessories",
    slug: "accessories",
    path: "/shop/accessories",
    isActive: true,
    parentId: null,
    heroImageId: "m-accessories-hero",
    order: 3,
    createdAt: "2025-10-18T11:00:00Z",
    updatedAt: "2025-10-18T11:00:00Z",
  },
  {
    id: "cat-kids",
    name: "Kids",
    slug: "kids",
    path: "/shop/kids",
    isActive: true,
    parentId: null,
    heroImageId: "m-kids-hero",
    order: 4,
    createdAt: "2025-10-18T11:00:00Z",
    updatedAt: "2025-10-18T11:00:00Z",
  },
];

// Section konfigürasyonu (UI yerleşimi backend’ten yönetilebilir)
export const sections = [
  {
    id: "sec-editors-pick",
    key: "editorsPick",
    title: "EDITOR’S PICK",
    subtitle: "Problems trying to resolve the conflict between",
    isActive: true,
    // UI slot mantığı: layout’u API’den değiştirebilirsin
    items: [
      { slot: "left-large", categoryId: "cat-men" },
      { slot: "middle-tall", categoryId: "cat-women" },
      { slot: "right-top", categoryId: "cat-accessories" },
      { slot: "right-bottom", categoryId: "cat-kids" },
    ],
    createdAt: "2025-10-18T11:00:00Z",
    updatedAt: "2025-10-18T11:00:00Z",
  },
];

// Lookup helper’lar (UI tarafında kolay kullanım için)
export const mediaById = Object.fromEntries(media.map((m) => [m.id, m]));
export const categoriesById = Object.fromEntries(
  categories.map((c) => [c.id, c])
);
