import post1 from "../assets/post/post1.jpg";
import post2 from "../assets/post/post2.png";
import post3 from "../assets/post/post3.png";

export const tags = [
  { id: "google", label: "Google" },
  { id: "trending", label: "Trending" },
  { id: "new", label: "New" },
];

export const media = [
  {
    id: "bo-kaap",
    src: post1,
    alt: "Colorful houses on a street",
    width: 1440,
    height: 960,
    focal: { x: 0.5, y: 0.5 },
  },
  {
    id: "pink-beetle",
    src: post2,
    alt: "Pink beetle car near blue wall",
    width: 1440,
    height: 960,
    focal: { x: 0.5, y: 0.5 },
  },
  {
    id: "umbrellas",
    src: post3,
    alt: "Colorful umbrellas",
    width: 1440,
    height: 960,
    focal: { x: 0.5, y: 0.5 },
  },
];

export const posts = [
  {
    id: 101,
    slug: "loudest-a-la-madison-1-lintegral-color-street",
    title: "Loudest à la Madison #1",
    subtitle: "(L'integral)",
    excerpt:
      "We focus on ergonomics and meeting you where you work. It's only a keystroke away.",
    tagIds: ["google", "trending", "new"],
    mediaId: "bo-kaap",
    publishedAt: "2021-04-22T00:00:00.000Z",
    commentsCount: 10,
    readMinutes: 4,
    authorId: null,
    categoryId: "practice-advice",
  },
  {
    id: 102,
    slug: "loudest-a-la-madison-1-lintegral-pink-beetle",
    title: "Loudest à la Madison #1",
    subtitle: "(L'integral)",
    excerpt:
      "We focus on ergonomics and meeting you where you work. It's only a keystroke away.",
    tagIds: ["google", "trending", "new"],
    mediaId: "pink-beetle",
    publishedAt: "2021-04-22T00:00:00.000Z",
    commentsCount: 10,
    readMinutes: 4,
    authorId: null,
    categoryId: "practice-advice",
  },
  {
    id: 103,
    slug: "loudest-a-la-madison-1-lintegral-umbrellas",
    title: "Loudest à la Madison #1",
    subtitle: "(L'integral)",
    excerpt:
      "We focus on ergonomics and meeting you where you work. It's only a keystroke away.",
    tagIds: ["google", "trending", "new"],
    mediaId: "umbrellas",
    publishedAt: "2021-04-22T00:00:00.000Z",
    commentsCount: 10,
    readMinutes: 4,
    authorId: null,
    categoryId: "practice-advice",
  },
];

// Bölüm konfigürasyonu (başlık/kicker/description + hangi postlar)
export const sections = [
  {
    slug: "featured-posts",
    kicker: "Practice Advice",
    title: "Featured Posts",
    description:
      "Problems trying to resolve the conflict between the two major realms of Classical physics: Newtonian mechanics",
    postIds: [101, 102, 103],
  },
];

// --------- SELECTORS / HELPERS ----------
export const getTagById = (id) => tags.find((t) => t.id === id);
export const getMediaById = (id) => media.find((m) => m.id === id);
export const getPostBySlug = (slug) => posts.find((p) => p.slug === slug);
export const getSectionBySlug = (slug) => sections.find((s) => s.slug === slug);
export const getPostsByIds = (ids = []) =>
  ids.map((id) => posts.find((p) => p.id === id)).filter(Boolean);

export const getFeaturedSection = () => {
  const sec = getSectionBySlug("featured-posts");
  return {
    ...sec,
    posts: getPostsByIds(sec.postIds),
  };
};
