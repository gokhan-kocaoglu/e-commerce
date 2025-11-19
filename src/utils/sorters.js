const num = (v) => (typeof v === "number" ? v : Number(v ?? 0)) || 0;
const str = (v) => (v ?? "").toString();

export function getComparator(sortKey = "popularity") {
  switch (sortKey) {
    case "price-asc":
      return (a, b) => num(a.price) - num(b.price);
    case "price-desc":
      return (a, b) => num(b.price) - num(a.price);
    case "az":
      return (a, b) =>
        str(a.title).localeCompare(str(b.title), undefined, {
          sensitivity: "base",
        });
    case "za":
      return (a, b) =>
        str(b.title).localeCompare(str(a.title), undefined, {
          sensitivity: "base",
        });
    // “Popularity”: önce bestsellerScore, sonra ratingAvg, sonra ratingCount, en sonda title
    case "popularity":
    default:
      return (a, b) => {
        const byScore = num(b.bestsellerScore) - num(a.bestsellerScore);
        if (byScore) return byScore;
        const byRate = num(b.ratingAvg) - num(a.ratingAvg);
        if (byRate) return byRate;
        const byCount = num(b.ratingCount) - num(a.ratingCount);
        if (byCount) return byCount;
        return str(a.title).localeCompare(str(b.title), undefined, {
          sensitivity: "base",
        });
      };
  }
}
