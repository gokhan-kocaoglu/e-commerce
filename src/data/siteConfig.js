export const contacts = [
  {
    id: "support-phone",
    type: "phone",
    label: "Support",
    value: "+12255550118",
    display: "(225) 555-0118",
    countryCode: "US",
    isPrimary: true,
    status: "active",
  },
  {
    id: "support-email",
    type: "email",
    label: "Support",
    value: "michelle.rivera@example.com",
    display: "michelle.rivera@example.com",
    isPrimary: true,
    status: "active",
  },
];

export const socials = [
  {
    id: "ig",
    platform: "instagram",
    handle: "shop",
    url: "https://instagram.com/",
    order: 1,
    status: "active",
  },
  {
    id: "fb",
    platform: "facebook",
    handle: "shop",
    url: "https://facebook.com/",
    order: 2,
    status: "active",
  },
  {
    id: "yt",
    platform: "youtube",
    handle: "shop",
    url: "https://youtube.com/",
    order: 3,
    status: "active",
  },
  {
    id: "tw",
    platform: "twitter",
    handle: "shop",
    url: "https://twitter.com/",
    order: 4,
    status: "active",
  },
];

export const announcements = [
  {
    id: "follow-and-win",
    message: "Backend den gelmiyor",
    locale: "en",
    startsAt: null,
    endsAt: null,
    status: "active",
  },
];

//HeaderMenu Kısmı İçin
export const siteConfig = {
  brand: { id: "bandage", name: "Bandage", logoUrl: null },

  navigation: {
    primary: [
      { id: "home", label: "Home", path: "/" },

      {
        id: "shop",
        label: "Shop",
        path: "/shop",
        children: [
          // 💡 BACKEND CATEGORY UUID’LERİ—tek kaynak
          {
            id: "men",
            label: "Men",
            path: "/shop/men",
            categoryId: "b6a4c7fc-bb03-4da9-899d-16b19ec0a99b", //buraya backend kısmındaki uuid yazılacak
          },
          {
            id: "women",
            label: "Women",
            path: "/shop/women",
            categoryId: "3a014ca5-ca4b-43a3-ab65-48bf26096ebd", //buraya backend kısmındaki uuid yazılacak
          },
          {
            id: "kids",
            label: "Kids",
            path: "/shop/kids",
            categoryId: "ea42a00e-04af-4406-b30d-691abb7317a0", //buraya backend kısmındaki uuid yazılacak
          },
          {
            id: "electronics",
            label: "Electronics",
            path: "/shop/electronics",
          },
          {
            id: "home-living",
            label: "Home & Living",
            path: "/shop/home-living",
          },
          {
            id: "beauty-personal-care",
            label: "Beauty & Personal Care",
            path: "/shop/beauty-personal-care",
          },
          {
            id: "sports-outdoor",
            label: "Sports & Outdoor",
            path: "/shop/sports-outdoor",
          },
          { id: "shoes", label: "Shoes", path: "/shop/shoes" },
          {
            id: "accessories-jewelry",
            label: "Accessories & Jewelry",
            path: "/shop/accessories-jewelry",
            categoryId: "852fe2b5-b96c-4f44-a1d6-581f8148f712", //buraya backend kısmındaki uuid yazılacak
          },
          {
            id: "toys-hobbies",
            label: "Toys & Hobbies",
            path: "/shop/toys-hobbies",
          },
          {
            id: "baby-maternity",
            label: "Baby & Maternity",
            path: "/shop/baby-maternity",
          },
          {
            id: "grocery-household",
            label: "Grocery & Household",
            path: "/shop/grocery-household",
          },
        ],
      },

      { id: "about", label: "About", path: "/about" },
      { id: "blog", label: "Blog", path: "/blog" },
      { id: "contact", label: "Contact", path: "/contact" },
      { id: "pages", label: "Pages", path: "/pages" },
    ],
  },

  auth: {
    login: { id: "login", label: "Login", path: "/login" },
    register: { id: "register", label: "Register", path: "/register" },
    combinedLabel: "Login / Register",
  },

  headerActions: {
    cartCount: 1,
    wishlistCount: 1,
    routes: {
      search: "/search",
      cart: "/cart",
      wishlist: "/wishlist",
      account: "/account",
    },
  },
};

/* --- Getter'lar: UI katmanını veri şekline bağımlı kılmadan okumanı sağlar --- */
export const getBrand = () => siteConfig.brand;
export const getPrimaryNav = () => siteConfig.navigation.primary;
export const getAuthConfig = () => siteConfig.auth;
export const getHeaderActions = () => siteConfig.headerActions;

// Basit yardımcılar
export const getPrimaryContact = (type) =>
  contacts.find((c) => c.type === type && c.isPrimary && c.status === "active");

export const getActiveAnnouncement = (locale = "en") =>
  announcements.find((a) => a.status === "active" && a.locale === locale);

export const getActiveSocials = () =>
  socials
    .filter((s) => s.status === "active")
    .sort((a, b) => a.order - b.order);
