import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { useProductPage } from "../product/ProductPageContext";
import { normalizeImageUrl } from "../../utils/imageUrl";

export default function ProductDescriptionTabs() {
  const { status, product, detail } = useProductPage();
  const [activeTab, setActiveTab] = useState("description"); // description | info | reviews

  const sections = detail?.sections || [];
  const firstSection = sections[0] || null;
  const bulletSections = useMemo(
    () => sections.filter((s) => Array.isArray(s.bullets) && s.bullets.length),
    [sections]
  );

  const mainImage = product?.images?.[0] || null;
  const mainSrc = mainImage ? normalizeImageUrl(mainImage.url) : null;

  if (status === "loading" || status === "idle") return null;
  if (status === "failed" || !product) return null;

  const hasDescriptionContent =
    firstSection && (firstSection.title || firstSection.body);

  // Typography helpers
  const tabBase =
    "px-4 py-3 font-['Montserrat'] text-[14px] leading-[24px] tracking-[0.2px] text-center text-[#737373] border-b-2 border-transparent cursor-pointer";
  const tabActive =
    "text-[#252B42] underline underline-offset-4 decoration-[#737373] decoration-0";
  const tabDescWeight = "font-semibold"; // 600
  const tabOtherWeight = "font-bold"; // 700

  return (
    <section className="mx-auto w-full max-w-7xl px-4 sm:px-6 pb-12">
      {/* Tabs header */}
      <div className="border-b border-[#E4E4E4]">
        <nav className="flex justify-center gap-0 lg:gap-8">
          <button
            type="button"
            onClick={() => setActiveTab("description")}
            className={`${tabBase} ${tabDescWeight} ${
              activeTab === "description" ? tabActive : ""
            }`}
          >
            Description
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("info")}
            className={`${tabBase} ${tabOtherWeight} ${
              activeTab === "info" ? tabActive : ""
            }`}
          >
            Additional Information
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("reviews")}
            className={`${tabBase} ${tabOtherWeight} ${
              activeTab === "reviews" ? tabActive : ""
            }`}
          >
            Reviews <span className="text-[#23A6F0]">(0)</span>
          </button>
        </nav>
      </div>

      {/* CONTENT */}
      <div className="pt-8">
        {activeTab === "description" && (
          <>
            {!hasDescriptionContent ? (
              <p className="font-['Montserrat'] text-[14px] leading-[20px] tracking-[0.2px] text-[#737373] text-center">
                Ürün açıklaması şu an mevcut değil.
              </p>
            ) : (
              <div className="flex flex-col gap-10 px-10 lg:flex-row lg:gap-16">
                {/* LEFT: Image */}
                <div className="w-full lg:w-1/3">
                  {mainSrc ? (
                    <div className="img-shadow-l-wrap">
                      <img
                        src={mainSrc}
                        alt={mainImage?.altText || product.title}
                        className="img-shadow-l"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[4/5] w-full rounded-[5px] bg-zinc-100" />
                  )}
                </div>

                {/* MIDDLE: First section (title + body) */}
                <div className="w-full lg:w-1/3">
                  {firstSection?.title && (
                    <h3 className="font-['Montserrat'] font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42]">
                      {firstSection.title}
                    </h3>
                  )}

                  {firstSection?.body ? (
                    firstSection.body
                      .split(/\n+/)
                      .filter((p) => p.trim() !== "")
                      .map((p, idx) => (
                        <p
                          key={idx}
                          className={`font-['Montserrat'] text-[14px] font-normal leading-[20px] tracking-[0.2px] text-[#737373] ${
                            idx === 0 ? "mt-4" : "mt-3"
                          }`}
                        >
                          {p}
                        </p>
                      ))
                  ) : (
                    <p className="mt-4 font-['Montserrat'] text-[14px] leading-[20px] tracking-[0.2px] text-[#737373]">
                      Ürün açıklaması şu an mevcut değil.
                    </p>
                  )}
                </div>

                {/* RIGHT: Bullet sections */}
                <div className="w-full lg:w-1/3">
                  {bulletSections.map((sec, idx) => (
                    <div
                      key={`${sec.title || "section"}-${idx}`}
                      className="mb-8 last:mb-0"
                    >
                      {sec.title && (
                        <h3 className="font-['Montserrat'] font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42]">
                          {sec.title}
                        </h3>
                      )}

                      <ul className="mt-4 space-y-2">
                        {sec.bullets.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 font-['Montserrat'] text-[14px] font-bold leading-[24px] tracking-[0.2px] text-[#737373]"
                          >
                            <ChevronRight className="mt-1 h-3 w-3 text-[#737373]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "info" && (
          <div className="mt-4">
            {detail?.additionalInfo ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(detail.additionalInfo).map(([key, val]) => (
                  <div key={key}>
                    <div className="font-['Montserrat'] text-[14px] font-bold leading-[24px] tracking-[0.2px] text-[#252B42]">
                      {key}
                    </div>
                    <div className="font-['Montserrat'] text-[14px] leading-[20px] tracking-[0.2px] text-[#737373]">
                      {val}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-['Montserrat'] text-[14px] leading-[20px] tracking-[0.2px] text-[#737373] text-center">
                Ek bilgi henüz eklenmedi.
              </p>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <p className="mt-4 font-['Montserrat'] text-[14px] leading-[20px] tracking-[0.2px] text-[#737373] text-center">
            Bu ürün için henüz yorum eklenmemiş.
          </p>
        )}
      </div>
    </section>
  );
}
