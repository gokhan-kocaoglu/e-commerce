export const footerData = {
  brand: {
    id: "brand",
    name: "Bandage",
    // Sosyal ağlar: iconKey, url, sıralama
    socials: [
      {
        id: "facebook",
        iconKey: "Facebook",
        url: "https://facebook.com/bandage",
        sort: 1,
      },
      {
        id: "instagram",
        iconKey: "Instagram",
        url: "https://instagram.com/bandage",
        sort: 2,
      },
      {
        id: "twitter",
        iconKey: "Twitter",
        url: "https://twitter.com/bandage",
        sort: 3,
      },
    ],
  },

  /** @type {FooterColumn[]} */
  columns: [
    {
      id: "company",
      title: "Company Info",
      sort: 1,
      links: [
        { id: "about", label: "About Us", to: "/about" },
        { id: "career", label: "Carrier", to: "/careers" },
        { id: "hiring", label: "We are hiring", to: "/careers/open-positions" },
        { id: "blog", label: "Blog", to: "/blog" },
      ],
    },
    {
      id: "legal",
      title: "Legal",
      sort: 2,
      links: [
        { id: "about-legal", label: "About Us", to: "/about" },
        { id: "career-legal", label: "Carrier", to: "/careers" },
        {
          id: "hiring-legal",
          label: "We are hiring",
          to: "/careers/open-positions",
        },
        { id: "blog-legal", label: "Blog", to: "/blog" },
      ],
    },
    {
      id: "features",
      title: "Features",
      sort: 3,
      links: [
        {
          id: "biz-mkt",
          label: "Business Marketing",
          to: "/features/marketing",
        },
        { id: "analytic", label: "User Analytic", to: "/features/analytics" },
        { id: "live-chat", label: "Live Chat", to: "/features/live-chat" },
        {
          id: "unlimited",
          label: "Unlimited Support",
          to: "/features/support",
        },
      ],
    },
    {
      id: "resources",
      title: "Resources",
      sort: 4,
      links: [
        { id: "ios-android", label: "IOS & Android", to: "/apps" },
        { id: "demo", label: "Watch a Demo", to: "/demo" },
        { id: "customers", label: "Customers", to: "/customers" },
        { id: "api", label: "API", to: "/developers" },
      ],
    },
  ],

  newsletter: {
    id: "newsletter",
    title: "Get In Touch",
    placeholder: "Your Email",
    buttonLabel: "Subscribe",
    helperText: "Lore imp sum dolor Amit",
    submitEndpoint: "/newsletter/subscribe",
    method: "POST",
  },

  copyright: {
    id: "copyright",
    text: "Made With Love By Finland All Right Reserved",
    year: new Date().getFullYear(),
  },
};

// Basit yardımcılar (UI’dan bağımsız)
export const getFooterColumns = () =>
  [...footerData.columns].sort((a, b) => a.sort - b.sort);

export const getFooterSocials = () =>
  [...footerData.brand.socials].sort((a, b) => a.sort - b.sort);

export const getFooterNewsletter = () => footerData.newsletter;
