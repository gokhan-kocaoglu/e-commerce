import { Twitter, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { getContactHero } from "../../data/contact";
import { getActiveSocials } from "../../data/siteConfig";

const platformIconMap = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
};

export default function ContactHero({ locale = "en", className = "" }) {
  const hero = getContactHero(locale);
  const socials = getActiveSocials();

  if (!hero) return null;

  const {
    eyebrow,
    title,
    description,
    channels = [],
    socialPlatforms = [],
    image,
  } = hero;

  const visibleSocials =
    socialPlatforms.length > 0
      ? socials.filter((s) => socialPlatforms.includes(s.platform))
      : socials;

  return (
    <section className={`bg-white ${className}`}>
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-14 px-6 py-16 md:px-6 lg:flex-row lg:py-12">
        {/* Sol: Metin */}
        <div className="flex-1 space-y-6 text-center lg:text-left">
          {eyebrow && (
            <h5 className="font-['Montserrat'] text-[16px] font-bold leading-[24px] tracking-[0.1px] text-[#252B42] uppercase">
              {eyebrow}
            </h5>
          )}

          <h1 className="max-w-xl font-['Montserrat'] text-[40px] leading-[50px] font-bold tracking-[0.2px] text-[#252B42] md:text-[48px] md:leading-[60px] lg:text-[58px] lg:leading-[80px]">
            {title}
          </h1>

          {description && (
            <p className="mx-auto md:mx-0 max-w-[200px] md:max-w-[400px] font-['Montserrat'] text-[16px] leading-[24px] tracking-[0.2px] text-[#737373] md:text-[18px] md:leading-[30px]">
              {description}
            </p>
          )}

          {/* Phone / Fax */}
          <div className="space-y-2 pt-4">
            {channels
              .filter((c) => c.status === "active")
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((ch) => (
                <div
                  key={ch.id}
                  className="font-['Montserrat'] text-[20px] font-bold leading-[32px] tracking-[0.1px] text-[#252B42] md:text-[22px] lg:text-[24px]"
                >
                  <span className="mr-2">
                    {ch.label} {ch.type === "phone" ? ";" : ":"}
                  </span>
                  <span>{ch.display || ch.value}</span>
                </div>
              ))}
          </div>

          {/* Sosyal medya ikonları */}
          {visibleSocials.length > 0 && (
            <div className="flex items-center justify-center gap-6 pt-6 lg:justify-start">
              {visibleSocials.map((s) => {
                const Icon = platformIconMap[s.platform];
                if (!Icon) return null;
                return (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.platform}
                    className="rounded-full border border-transparent p-2 transition hover:border-[#23A6F0] hover:text-[#23A6F0]"
                  >
                    <Icon className="h-6 w-6 text-[#252B42]" />
                  </a>
                );
              })}
            </div>
          )}
        </div>

        {/* Sağ: Görsel */}
        <div className="relative flex-1">
          <div className="relative mx-auto mt-4 w-full max-w-xs sm:max-w-sm md:max-w-md lg:mt-0 lg:max-w-lg">
            {image?.url && (
              <img
                src={image.url}
                alt={image.alt || ""}
                className="relative z-0 w-full object-contain"
                loading="lazy"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
