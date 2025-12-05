import { getTeamGallery } from "../../data/team";

export default function TeamGallery({ locale = "en", className = "" }) {
  const gallery = getTeamGallery(locale);
  const items = gallery?.items ?? [];

  if (!items.length) return null;

  const primary = items.find((i) => i.slot === "primary");

  const orderMap = {
    "top-left": 1,
    "top-right": 2,
    "bottom-left": 3,
    "bottom-right": 4,
  };

  const secondary = items
    .filter((i) => i.slot !== "primary")
    .sort(
      (a, b) =>
        (orderMap[a.slot] ?? Number.MAX_SAFE_INTEGER) -
        (orderMap[b.slot] ?? Number.MAX_SAFE_INTEGER)
    );

  return (
    <section className={`bg-white ${className}`} aria-label="Team gallery">
      {/* lg'de ortak yükseklik */}
      <div className="mx-auto flex max-w-7xl flex-col gap-2 lg:flex-row lg:h-[480px]">
        {/* Sol: büyük görsel */}
        {primary && (
          <div className="w-full overflow-hidden lg:w-3/5">
            <div className="h-[360px] md:h-[420px] lg:h-full">
              <img
                src={primary.imageUrl}
                alt={primary.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Sağ: 2x2 grid – toplam yükseklik soldakiyle aynı */}
        <div className="w-full lg:w-2/5">
          <div className="grid grid-cols-2 gap-2 lg:h-full lg:grid-rows-2">
            {secondary.map((item) => (
              <div key={item.id} className="overflow-hidden">
                <div className="h-[160px] md:h-[190px] lg:h-full">
                  <img
                    src={item.imageUrl}
                    alt={item.alt}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
