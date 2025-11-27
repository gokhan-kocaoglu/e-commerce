// src/data/pricingData.js

export const pricingPages = [
  {
    id: "pricing-main",
    slug: "pricing",
    locale: "en",
    hero: {
      eyebrow: "PRICING",
      title: "Simple Pricing",
    },
    table: {
      title: "Pricing",
      subtitle:
        "Problems trying to resolve the conflict between the two major realms of Classical physics: Newtonian mechanics",

      // Sadece desktop layout için satır kırıklı versiyon
      subtitleDesktop: [
        "Problems trying to resolve the conflict between",
        "the two major realms of Classical physics: Newtonian mechanics",
      ],
      currency: "USD",
      billing: {
        defaultPeriod: "monthly",
        periods: [
          { id: "monthly", label: "Monthly" },
          {
            id: "yearly",
            label: "Yearly",
            badge: {
              label: "Save 25%",
            },
          },
        ],
      },
      plans: [
        {
          id: "free",
          name: "FREE",
          description: "Organize across all apps by hand",
          featured: false,
          prices: {
            monthly: { amount: 0, unit: "Per Month" },
            yearly: { amount: 0, unit: "Per Year", discountPercent: 25 },
          },
          ctaLabel: "Try for free",
          features: [
            {
              id: "free-upd-1",
              label: "Unlimited product updates",
              included: true,
            },
            {
              id: "free-upd-2",
              label: "Unlimited product updates",
              included: true,
            },
            {
              id: "free-upd-3",
              label: "Unlimited product updates",
              included: true,
            },
            {
              id: "free-storage",
              label: "1GB  Cloud storage",
              included: false,
            },
            {
              id: "free-support",
              label: "Email and community support",
              included: false,
            },
          ],
        },
        {
          id: "standard",
          name: "STANDARD",
          description: "Organize across all apps by hand",
          featured: true,
          prices: {
            monthly: { amount: 9.99, unit: "Per Month" },
            yearly: { amount: 89.99, unit: "Per Year", discountPercent: 25 },
          },
          ctaLabel: "Try for free",
          features: [
            {
              id: "std-upd-1",
              label: "Unlimited product updates",
              included: true,
            },
            {
              id: "std-upd-2",
              label: "Unlimited product updates",
              included: true,
            },
            {
              id: "std-upd-3",
              label: "Unlimited product updates",
              included: true,
            },
            { id: "std-storage", label: "1GB  Cloud storage", included: true },
            {
              id: "std-support",
              label: "Email and community support",
              included: false,
            },
          ],
        },
        {
          id: "premium",
          name: "PREMIUM",
          description: "Organize across all apps by hand",
          featured: false,
          prices: {
            monthly: { amount: 19.99, unit: "Per Month" },
            yearly: { amount: 179.99, unit: "Per Year", discountPercent: 25 },
          },
          ctaLabel: "Try for free",
          features: [
            {
              id: "prm-upd-1",
              label: "Unlimited product updates",
              included: true,
            },
            {
              id: "prm-upd-2",
              label: "Unlimited product updates",
              included: true,
            },
            {
              id: "prm-upd-3",
              label: "Unlimited product updates",
              included: true,
            },
            { id: "prm-storage", label: "1GB  Cloud storage", included: true },
            {
              id: "prm-support",
              label: "Email and community support",
              included: true,
            },
          ],
        },
      ],
    },
    clientsSection: {
      id: "about-clients",
      title: "",
      subtitle: "Trusted By Over 4000 Big Companies",
    },

    faqs: {
      title: "Pricing FAQs",
      subtitle:
        "Problems trying to resolve the conflict between the two major realms of Classical physics",
      items: [
        {
          id: "faq-1",
          order: 1,
          question: "the quick fox jumps over the lazy dog",
          answer:
            "Met minim Mollie non desert Alamo est sit cliquey dolor do met sent. RELIT official consequent door ENIM RELIT Mollie. Excitation venial consequent sent nostrum met.",
        },
        {
          id: "faq-2",
          order: 2,
          question: "the quick fox jumps over the lazy dog",
          answer:
            "Met minim Mollie non desert Alamo est sit cliquey dolor do met sent. RELIT official consequent door ENIM RELIT Mollie. Excitation venial consequent sent nostrum met.",
        },
        {
          id: "faq-3",
          order: 3,
          question: "the quick fox jumps over the lazy dog",
          answer:
            "Met minim Mollie non desert Alamo est sit cliquey dolor do met sent. RELIT official consequent door ENIM RELIT Mollie. Excitation venial consequent sent nostrum met.",
        },
        {
          id: "faq-4",
          order: 4,
          question: "the quick fox jumps over the lazy dog",
          answer:
            "Met minim Mollie non desert Alamo est sit cliquey dolor do met sent. RELIT official consequent door ENIM RELIT Mollie. Excitation venial consequent sent nostrum met.",
        },
        {
          id: "faq-5",
          order: 5,
          question: "the quick fox jumps over the lazy dog",
          answer:
            "Met minim Mollie non desert Alamo est sit cliquey dolor do met sent. RELIT official consequent door ENIM RELIT Mollie. Excitation venial consequent sent nostrum met.",
        },
        {
          id: "faq-6",
          order: 6,
          question: "the quick fox jumps over the lazy dog",
          answer:
            "Met minim Mollie non desert Alamo est sit cliquey dolor do met sent. RELIT official consequent door ENIM RELIT Mollie. Excitation venial consequent sent nostrum met.",
        },
      ],
      footer: {
        preText: "Haven’t got your answer?",
        linkLabel: "Contact our support",
        contactNavId: "contact", // siteConfig.navigation.primary içinden resolve edeceğiz
      },
    },
    trialCta: {
      title: "Start your 14 days free trial",
      description:
        "Met minim Mollie non desert Alamo est sit cliquey dolor do met sent. RELIT official consequent.",
      primaryAction: {
        id: "start-trial",
        label: "Try it free now",
        // auth config içindeki register path'ine bağlamak için
        routeId: "register",
      },
    },
  },
];

// Hero için kullandığımız helper
export const getPricingHero = (locale = "en") =>
  pricingPages.find((p) => p.locale === locale)?.hero ?? null;

// Yeni: pricing table datası
export const getPricingTable = (locale = "en") =>
  pricingPages.find((p) => p.locale === locale)?.table ?? null;

// Yeni: pricing clients datası
export const getPricingClients = (locale = "en") =>
  pricingPages.find((p) => p.locale === locale)?.clientsSection ?? null;

export const getPricingFaqs = (locale = "en") =>
  pricingPages.find((p) => p.locale === locale)?.faqs ?? null;

export const getPricingTrialCta = (locale = "en") =>
  pricingPages.find((p) => p.locale === locale)?.trialCta ?? null;
