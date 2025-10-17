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
    message: "Follow Us  and get a chance to win 80% off",
    locale: "en",
    startsAt: null,
    endsAt: null,
    status: "active",
  },
];

// Basit yardımcılar
export const getPrimaryContact = (type) =>
  contacts.find((c) => c.type === type && c.isPrimary && c.status === "active");

export const getActiveAnnouncement = (locale = "en") =>
  announcements.find((a) => a.status === "active" && a.locale === locale);

export const getActiveSocials = () =>
  socials
    .filter((s) => s.status === "active")
    .sort((a, b) => a.order - b.order);
