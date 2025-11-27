export const teamPages = [
  {
    id: "team-main",
    slug: "team",
    locale: "en",
    hero: {
      eyebrow: "WHAT WE DO",
      title: "Innovation tailored for you",
    },
    gallery: {
      // Slot bazlı yapı: desktop ve mobile yerleşimi buradan kontrol edilebilir
      items: [
        {
          id: "team-primary",
          slot: "primary", // büyük soldaki görsel
          imageUrl: "/assets/team/hero-1.png",
          alt: "Woman in floral dress on red background",
        },
        {
          id: "team-top-left",
          slot: "top-left", // sağ üst sol
          imageUrl: "/assets/team/hero-2.png",
          alt: "Eco aware coat outfit",
        },
        {
          id: "team-top-right",
          slot: "top-right", // sağ üst sağ
          imageUrl: "/assets/team/hero-3.png",
          alt: "Casual denim jacket pose",
        },
        {
          id: "team-bottom-left",
          slot: "bottom-left", // sağ alt sol
          imageUrl: "/assets/team/hero-4.png",
          alt: "Sporty black hoodie outfit",
        },
        {
          id: "team-bottom-right",
          slot: "bottom-right", // sağ alt sağ
          imageUrl: "/assets/team/hero-5.png",
          alt: "Blue denim jacket with floral details",
        },
      ],
    },
  },
];

export const teamMembers = [
  {
    id: "member-1",
    name: "Username",
    role: "Profession",
    avatarUrl: "/assets/team/team-1-user-1 (1).jpg",
    socials: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
    },
  },
  {
    id: "member-2",
    name: "Username",
    role: "Profession",
    avatarUrl: "/assets/team/team-1-user-2 (1).jpg",
    socials: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
    },
  },
  {
    id: "member-3",
    name: "Username",
    role: "Profession",
    avatarUrl: "/assets/team/team-1-user-3 (1).jpg",
    socials: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
    },
  },
  {
    id: "member-4",
    name: "Username",
    role: "Profession",
    avatarUrl: "/assets/team/team-1-user-1 (2).jpg",
    socials: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
    },
  },
  {
    id: "member-5",
    name: "Username",
    role: "Profession",
    avatarUrl: "/assets/team/team-1-user-2 (2).jpg",
    socials: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
    },
  },
  {
    id: "member-6",
    name: "Username",
    role: "Profession",
    avatarUrl: "/assets/team/team-1-user-3 (2).jpg",
    socials: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
    },
  },
  {
    id: "member-7",
    name: "Username",
    role: "Profession",
    avatarUrl: "/assets/team/team-1-user-1 (3).jpg",
    socials: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
    },
  },
  {
    id: "member-8",
    name: "Username",
    role: "Profession",
    avatarUrl: "/assets/team/team-1-user-2 (3).jpg",
    socials: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
    },
  },
  {
    id: "member-9",
    name: "Username",
    role: "Profession",
    avatarUrl: "/assets/team/team-1-user-3 (3).jpg",
    socials: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
    },
  },
];

export const teamSections = [
  {
    id: "team-main-members",
    pageId: "team-main",
    locale: "en",
    title: "Meet Our Team",
    memberIds: [
      "member-1",
      "member-2",
      "member-3",
      "member-4",
      "member-5",
      "member-6",
      "member-7",
      "member-8",
      "member-9",
    ],
  },
];

export const getTeamHero = (locale = "en") =>
  teamPages.find((p) => p.locale === locale)?.hero ?? null;

export const getTeamGallery = (locale = "en") =>
  teamPages.find((p) => p.locale === locale)?.gallery ?? null;

export const getTeamMembersSection = (locale = "en") => {
  const page = teamPages.find(
    (p) => p.locale === locale && p.id === "team-main"
  );
  if (!page) return null;

  const section = teamSections.find(
    (s) => s.locale === locale && s.pageId === page.id
  );
  if (!section) return null;

  const members = section.memberIds
    .map((id) => teamMembers.find((m) => m.id === id))
    .filter(Boolean);

  return {
    id: section.id,
    title: section.title,
    members,
  };
};
