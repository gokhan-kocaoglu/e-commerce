export const ABOUT_PAGE_SLUG = "about";

const aboutPage = {
  slug: ABOUT_PAGE_SLUG,
  route: "/about",
  locale: "en", // ileride çok dillilik için hazır
  hero: {
    id: "about-hero",
    section: "about-company",
    eyebrow: "ABOUT COMPANY",
    title: "ABOUT US",
    description:
      "We know how large objects will act, but things on a small scale.",
    primaryAction: {
      label: "Get Quote Now",
      href: "/about",
    },
    image: {
      src: "/assets/about/aboutHero.jpg",
      alt: "Smiling woman in yellow dress holding shopping bags and a credit card",
    },
  },

  problemSection: {
    id: "about-problems",
    eyebrow: "Problems trying",
    title:
      "Met minim Mollie non desert Alamo est sit cliquey dolor do met sent.",
    description:
      "Problems trying to resolve the conflict between the two major realms of Classical physics: Newtonian mechanics",
  },

  statsSection: {
    id: "about-stats",
    items: [
      {
        id: "happy-customers",
        value: 15000,
        displayValue: "15K",
        label: "Happy Customers",
      },
      {
        id: "monthly-visitors",
        value: 150000,
        displayValue: "150K",
        label: "Monthly Visitors",
      },
      {
        id: "countries-worldwide",
        value: 15,
        displayValue: "15",
        label: "Countries  Worldwide",
      },
      {
        id: "top-partners",
        value: 100,
        displayValue: "100+",
        label: "Top Partners",
      },
    ],
  },

  videoSection: {
    id: "about-video",
    video: {
      // YouTube örneği
      provider: "youtube",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
      // Dosya kullanmak istenilirse:
      // provider: "file",
      // url: "/media/about/about-video.mp4",
    },
    thumbnail: {
      src: "/assets/about/about-video-thumb.png",
      alt: "Mountain landscape reflected in a lake",
    },
    playButtonLabel: "Play company video",
  },
  teamSection: {
    id: "about-team",
    title: "Meet Our Team",
    subtitle:
      "Problems trying to resolve the conflict between the two major realms of Classical physics: Newtonian mechanics",

    // Sadece desktop layout için satır kırıklı versiyon
    subtitleDesktop: [
      "Problems trying to resolve the conflict between",
      "the two major realms of Classical physics: Newtonian mechanics",
    ],
    members: [
      {
        id: "member-1",
        name: "Username",
        profession: "Profession",
        avatar: {
          src: "/assets/about/team-1-user-1.jpg",
          alt: "Team member holding coffee and phone",
        },
        socials: {
          facebook: "#",
          instagram: "#",
          twitter: "#",
        },
      },
      {
        id: "member-2",
        name: "Username",
        profession: "Profession",
        avatar: {
          src: "/assets/about/team-1-user-2.jpg",
          alt: "Smiling team member in red dress",
        },
        socials: {
          facebook: "#",
          instagram: "#",
          twitter: "#",
        },
      },
      {
        id: "member-3",
        name: "Username",
        profession: "Profession",
        avatar: {
          src: "/assets/about/team-1-user-3.jpg",
          alt: "Team member holding smartphone",
        },
        socials: {
          facebook: "#",
          instagram: "#",
          twitter: "#",
        },
      },
    ],
  },

  clientsSection: {
    id: "about-clients",
    title: "Big Companies Are Here",
    subtitle:
      "Problems trying to resolve the conflict between the two major realms of Classical physics: Newtonian mechanics",

    // Sadece desktop layout için satır kırıklı versiyon
    subtitleDesktop: [
      "Problems trying to resolve the conflict between",
      "the two major realms of Classical physics: Newtonian mechanics",
    ],
  },

  workWithUsSection: {
    id: "about-work-with-us",
    eyebrow: "WORK WITH US",
    title: "Now Let’s grow Yours",
    description:
      "The gradual accumulation of information about atomic and small-scale behavior during the first quarter of the 20th",
    primaryAction: {
      label: "Button",
      href: "#",
    },
    image: {
      src: "/assets/about/work-with-us.png",
      alt: "Woman",
    },
  },
};

export function getAboutPage(locale = "en") {
  // Şimdilik tek dil, ileride locale’e göre filter edilebilir.
  return aboutPage;
}

export function getAboutHero(locale = "en") {
  const page = getAboutPage(locale);
  return page.hero;
}

export function getAboutProblems(locale = "en") {
  return getAboutPage(locale).problemSection;
}

export function getAboutStats(locale = "en") {
  return getAboutPage(locale).statsSection;
}

export function getAboutVideo(locale = "en") {
  return getAboutPage(locale).videoSection;
}

export function getAboutTeam(locale = "en") {
  return getAboutPage(locale).teamSection;
}

export function getAboutClients(locale = "en") {
  return getAboutPage(locale).clientsSection;
}

export function getAboutWorkWithUs(locale = "en") {
  return getAboutPage(locale).workWithUsSection;
}

export default aboutPage;
