import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { getTeamHero } from "../../data/team";
import { getPrimaryNav } from "../../data/siteConfig";

export default function TeamHeader({ className = "" }) {
  // Şimdilik tek dil: en
  const hero = getTeamHero("en");
  const nav = getPrimaryNav();

  const homeNav = nav.find((item) => item.id === "home");
  const pricingNav = nav.find((item) => item.id === "team");

  if (!hero || !homeNav || !pricingNav) return null;

  return (
    <section
      className={`flex items-center justify-center py-16 md:py-24 ${className}`}
    >
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 text-center">
        {/* What We Do */}
        <h5 className="font-['Montserrat'] text-[16px] font-bold leading-[24px] tracking-[0.1px] text-[#737373]">
          {hero.eyebrow}
        </h5>

        {/* Innovation tailored for you */}
        <h1 className="mt-4 font-['Montserrat'] text-[40px] font-bold leading-[50px] tracking-[0.2px] text-[#252B42] md:text-[58px] md:leading-[80px]">
          {hero.title}
        </h1>

        {/* Home > Pricing (siteConfig üzerinden) */}
        <nav
          className="mt-4 flex items-center justify-center"
          aria-label="Breadcrumb"
        >
          <Link
            to={homeNav.path}
            className="font-['Montserrat'] text-[14px] font-bold leading-[24px] tracking-[0.2px] text-[#252B42] hover:underline"
          >
            {homeNav.label}
          </Link>

          <ChevronRight className="mx-2 h-4 w-4 text-[#BDBDBD]" />

          <span className="font-['Montserrat'] text-[14px] font-bold leading-[24px] tracking-[0.2px] text-[#737373]">
            {pricingNav.label}
          </span>
        </nav>
      </div>
    </section>
  );
}
