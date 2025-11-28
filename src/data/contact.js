// Contact page content — backend'e bire bir taşınabilecek yapı

const contactPages = [
  {
    id: "contact-main",
    slug: "contact",
    locale: "en",
    status: "active",
    hero: {
      eyebrow: "CONTACT US",
      title: "Get in touch today!",
      description:
        "We know how large objects will act, but things on a small scale",
      channels: [
        {
          id: "phone-main",
          type: "phone",
          label: "Phone",
          value: "+451 215 215",
          display: "+451 215 215",
          isPrimary: true,
          status: "active",
          order: 1,
        },
        {
          id: "fax-main",
          type: "fax",
          label: "Fax",
          value: "+451 215 215",
          display: "+451 215 215",
          isPrimary: true,
          status: "active",
          order: 2,
        },
      ],
      // Hangi sosyal ağların burada gösterileceği (siteConfig.socials içinden filtrelenecek)
      socialPlatforms: ["twitter", "facebook", "instagram", "linkedin"],
      image: {
        id: "family-shopping",
        type: "image",
        url: "/assets/contact/contactHeaderImages.jpg",
        alt: "Happy family shopping with colorful bags",
      },
    },
    visitOffice: {
      eyebrow: "VISIT OUR OFFICE",
      title: "We help small businesses with big ideas",
      cards: [
        {
          id: "office-phone",
          kind: "phone",
          theme: "light", // light | dark
          icon: "phone",
          headline: "Get Support",
          emails: ["georgia.young@example.com", "georgia.young@ple.com"],
          primaryAction: {
            id: "phone-support-request",
            label: "Submit Request",
            href: "#", // ileride gerçek route /support vs. olabilir
          },
        },
        {
          id: "office-location",
          kind: "location",
          theme: "dark",
          icon: "location",
          headline: "Get Support",
          emails: ["georgia.young@example.com", "georgia.young@ple.com"],
          primaryAction: {
            id: "location-support-request",
            label: "Submit Request",
            href: "#",
          },
        },
        {
          id: "office-email",
          kind: "email",
          theme: "light",
          icon: "email",
          headline: "Get Support",
          emails: ["georgia.young@example.com", "georgia.young@ple.com"],
          primaryAction: {
            id: "email-support-request",
            label: "Submit Request",
            href: "#",
          },
        },
      ],
    },
    letsTalk: {
      id: "contact-lets-talk",
      eyebrow: "WE Can't WAIT TO MEET YOU",
      title: "Let’s Talk",
      image: {
        id: "arrow-down",
        type: "image",
        url: "/assets/contact/Arrow 2.png",
        alt: "Arrow down icon",
      },
      primaryAction: {
        id: "contact-lets-talk-try-free",
        label: "Try it free now",
        href: "/pricing", // istersen "#" yaparsın
      },
    },
  },
];

// ---- Getter'lar ----

export function getContactHero(locale = "en", slug = "contact") {
  const page = contactPages.find(
    (p) => p.slug === slug && p.locale === locale && p.status === "active"
  );
  return page?.hero ?? null;
}

export function getContactVisitOffice(locale = "en", slug = "contact") {
  const page = contactPages.find(
    (p) => p.slug === slug && p.locale === locale && p.status === "active"
  );
  return page?.visitOffice ?? null;
}

export function getContactLetsTalk(locale = "en", slug = "contact") {
  const page = contactPages.find(
    (p) => p.slug === slug && p.locale === locale && p.status === "active"
  );
  return page?.letsTalk ?? null;
}
