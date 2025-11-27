import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { getPricingFaqs } from "../../data/pricingData";
import { getPrimaryNav } from "../../data/siteConfig";

export default function PricingFaqsSection({ className = "" }) {
  const faqs = getPricingFaqs("en");
  if (!faqs) return null;

  const nav = getPrimaryNav();
  const contactNav = nav.find((item) => item.id === faqs.footer?.contactNavId);

  const items = [...faqs.items].sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section className={`bg-white py-16 md:py-24 ${className}`}>
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4">
        {/* Başlık */}
        <h2 className="font-['Montserrat'] text-[32px] font-bold leading-[40px] tracking-[0.2px] text-[#252B42] md:text-[40px] md:leading-[50px]">
          {faqs.title}
        </h2>

        {/* Alt başlık */}
        <h4 className="mt-4 max-w-[520px] text-center font-['Montserrat'] text-[20px] font-normal leading-[30px] tracking-[0.2px] text-[#737373]">
          {faqs.subtitle}
        </h4>

        {/* FAQ grid */}
        <div className="mt-16 grid w-full px-4 lg:px-30 gap-x-20 gap-y-12 md:grid-cols-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-4">
              {/* Sol ok ikonu */}
              <span className="mt-1 flex h-6 w-6 items-center justify-center">
                <ChevronRight className="h-4 w-4 text-[#23A6F0]" />
              </span>

              {/* Soru / cevap */}
              <div>
                <h5 className="font-['Montserrat'] text-[16px] font-bold leading-[24px] tracking-[0.1px] text-[#252B42]">
                  {item.question}
                </h5>
                <p className="mt-2 font-['Montserrat'] text-[14px] font-normal leading-[20px] tracking-[0.2px] text-[#737373]">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        {faqs.footer && (
          <div className="mt-20 text-center">
            <p className="font-['Montserrat'] text-[20px] font-normal leading-[20px] tracking-[0.2px] text-[#737373]">
              {faqs.footer.preText}{" "}
              {contactNav ? (
                <Link
                  to={contactNav.path}
                  className="font-normal text-[#737373] hover:underline"
                >
                  {faqs.footer.linkLabel}
                </Link>
              ) : (
                <span className="font-normal text-[#737373]">
                  {faqs.footer.linkLabel}
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
