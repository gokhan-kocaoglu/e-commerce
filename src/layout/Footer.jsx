import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Facebook, Instagram, Twitter } from "lucide-react";
import {
  footerData,
  getFooterColumns,
  getFooterSocials,
  getFooterNewsletter,
} from "../data/footer";

const ICONS = {
  Facebook,
  Instagram,
  Twitter,
};

function FooterGroup({ title, links = [] }) {
  return (
    <div className="min-w-40">
      {/* h5: Montserrat, 700, 16/24, 0.1px */}
      <h5 className="font-['Montserrat'] font-bold text-[16px] leading-[24px] tracking-[0.1px] text-zinc-900">
        {title}
      </h5>
      <ul className="mt-4 space-y-2">
        {links.map((l) => {
          const content = (
            // link: Montserrat, 700, 14/24, 0.2px
            <span className="font-['Montserrat'] font-bold text-[14px] leading-[24px] tracking-[0.2px] text-[#737373] hover:text-zinc-900">
              {l.label}
            </span>
          );
          return (
            <li key={l.id}>
              {l.href || l.external ? (
                <a href={l.href} target="_blank" rel="noreferrer">
                  {content}
                </a>
              ) : (
                <Link to={l.to || "#"}>{content}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Footer({ className = "" }) {
  const columns = getFooterColumns();
  const socials = getFooterSocials();
  const newsletter = getFooterNewsletter();
  const [email, setEmail] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    // basit doğrulama – backend yok: Toastify ile mock
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) {
      toast.error("Lütfen geçerli bir e-posta girin.");
      return;
    }
    toast.success("Abonelik talebiniz alındı (mock).");
    setEmail("");
  };

  return (
    <footer className={`w-full bg-white ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-12">
        {/* Üst: Logo + Sosyal */}
        <div className="flex items-start px-8 py-10 md:items-center lg:items-center justify-between lg:py-8 lg:pr-14 flex-col gap-4 lg:flex-row lg:gap-0">
          {/* h3: Montserrat, 700, 24/32, 0.1px */}
          <div className="font-['Montserrat'] font-bold text-[24px] leading-[32px] tracking-[0.1px] text-[#252B42]">
            {footerData.brand.name}
          </div>

          <div className="flex items-center gap-4">
            {socials.map((s) => {
              const Icon = ICONS[s.iconKey] || Facebook;
              return (
                <a
                  key={s.id}
                  href={s.url}
                  aria-label={s.id}
                  className="rounded-full p-1 hover:bg-zinc-100"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon
                    className="text-[#23A6F0]"
                    size={24}
                    strokeWidth={2.5}
                  />
                </a>
              );
            })}
          </div>
        </div>

        <div className="h-px w-full bg-zinc-200" />

        {/* Ana blok: 4 kolon + newsletter */}
        <div className="py-10">
          <div className="flex flex-col gap-6 px-8 lg:gap-6 md:px-4 md:flex-col lg:px-0 lg:flex-row">
            {columns.map((col) => (
              <FooterGroup key={col.id} title={col.title} links={col.links} />
            ))}

            {/* Newsletter */}
            <div className="min-w-40">
              <h5 className="font-['Montserrat'] font-bold text-[16px] leading-[24px] tracking-[0.1px] text-zinc-900">
                {newsletter.title}
              </h5>

              <form
                onSubmit={onSubmit}
                className="mt-4 flex w-full items-stretch rounded-[5px] overflow-hidden"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={newsletter.placeholder}
                  className="flex-1 min-w-0 h-11 border border-zinc-300 border-r-0 px-4
                     font-['Montserrat'] text-[14px] leading-[24px] outline-none
                     focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="shrink-0 h-11 px-5 bg-[#23A6F0] text-white
                     font-['Montserrat'] text-[14px] leading-[28px] font-normal tracking-[0.2px]  
                     " /* İSTERSEN: butonu desktop’ta sağdan 12px dışarı taşır */
                >
                  {newsletter.buttonLabel}
                </button>
              </form>

              <p className="mt-3 font-['Montserrat'] text-[12px] leading-[28px] tracking-[0.2px] text-[#737373]">
                {newsletter.helperText}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alt satır */}
      <div className="bg-zinc-50">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-center py-6">
            <p className="font-['Montserrat'] text-[14px] leading-[24px] tracking-[0.2px] text-[#737373] text-center">
              {footerData.copyright.text}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
