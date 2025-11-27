import { Link } from "react-router-dom";
import { Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import { getPricingTrialCta } from "../../data/pricingData";
import { getAuthConfig, getActiveSocials } from "../../data/siteConfig";

const iconByPlatform = {
  twitter: Twitter,
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
};

export default function TrialCta({ className = "" }) {
  const trial = getPricingTrialCta("en");
  if (!trial) return null;

  const auth = getAuthConfig();
  // Data içindeki routeId'yi global auth config ile eşleştiriyoruz
  let actionPath = "/register";
  if (trial.primaryAction?.routeId === "register" && auth?.register?.path) {
    actionPath = auth.register.path;
  }

  const socials = getActiveSocials().filter((s) => iconByPlatform[s.platform]);

  return (
    <section className={`bg-white py-16 md:pt-10 ${className}`}>
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 text-center">
        {/* Başlık */}
        <h2 className="px-20 font-['Montserrat'] text-[32px] font-bold leading-[40px] tracking-[0.2px] text-[#252B42] md:text-[40px] md:leading-[50px]">
          {trial.title}
        </h2>

        {/* Açıklama */}
        <p className="mt-4 px-16 max-w-105 font-['Montserrat'] text-[14px] font-normal leading-[20px] tracking-[0.2px] text-[#737373]">
          {trial.description}
        </p>

        {/* Buton */}
        <Link
          to={actionPath}
          className="mt-8 inline-flex items-center justify-center rounded-[5px] bg-[#23A6F0] px-10 py-3 font-['Montserrat'] text-[14px] font-bold leading-[22px] tracking-[0.2px] text-white"
        >
          {trial.primaryAction?.label ?? "Try it free now"}
        </Link>

        {/* Sosyal ikonlar (siteConfig.socials'den) */}
        {socials.length > 0 && (
          <div className="mt-10 flex items-center justify-center gap-6">
            {socials.map((social) => {
              const Icon = iconByPlatform[social.platform];
              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.platform}
                  className="flex h-10 w-10 items-center justify-center"
                >
                  <Icon className="h-6 w-6 text-[#23A6F0]" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
