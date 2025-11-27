import { Facebook, Instagram, Twitter } from "lucide-react";
import { getAboutTeam } from "../../data/aboutData";

export default function AboutTeamSection({ className = "" }) {
  const section = getAboutTeam("en");
  if (!section) return null;

  const { title, subtitle, subtitleDesktop, members } = section;

  return (
    <section className={`bg-white ${className}`}>
      <div className="mx-auto max-w-6xl px-6 py-16 md:px-8 xl:max-w-7xl">
        {/* Başlık */}
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="font-['Montserrat'] text-[32px] font-bold leading-[40px] tracking-[0.2px] text-[#252B42] md:text-[40px] md:leading-[50px]">
            {title}
          </h2>

          {/* Desktop: satır kontrollü versiyon */}
          <p
            className="mt-3 hidden font-['Montserrat'] text-[14px] font-normal leading-[20px] tracking-[0.2px] text-[#737373] md:block"
            aria-hidden={subtitle ? true : false} // ekran okuyucuya tekrar okutmamak için
          >
            {subtitleDesktop && subtitleDesktop.length > 0
              ? subtitleDesktop.map((line, idx) => (
                  <span key={idx} className="block">
                    {line}
                  </span>
                ))
              : subtitle}
          </p>

          {/* Mobil: tek paragraf, doğal kırılım */}
          <p className="mt-3 px-6 font-['Montserrat'] text-[14px] font-normal leading-[20px] tracking-[0.2px] text-[#737373] md:hidden">
            {subtitle}
          </p>
        </header>

        {/* Kartlar */}
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((member) => (
            <article
              key={member.id}
              className="flex flex-col items-center text-center"
            >
              <div className="w-full overflow-hidden bg-[#F2F2F2]">
                {member.avatar?.src && (
                  <img
                    src={member.avatar.src}
                    alt={member.avatar.alt}
                    loading="lazy"
                    className="h-60 w-full object-cover"
                  />
                )}
              </div>

              <div className="mt-6">
                <h5 className="font-['Montserrat'] text-[16px] font-bold leading-[24px] tracking-[0.1px] text-[#252B42]">
                  {member.name}
                </h5>
                <h6 className="mt-1 font-['Montserrat'] text-[14px] font-bold leading-[24px] tracking-[0.2px] text-[#737373]">
                  {member.profession}
                </h6>
              </div>

              <div className="mt-4 flex items-center justify-center gap-4 text-[#23A6F0]">
                {member.socials?.facebook && (
                  <a
                    href={member.socials.facebook}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} on Facebook`}
                    className="transition hover:opacity-80"
                  >
                    <Facebook size={20} />
                  </a>
                )}
                {member.socials?.instagram && (
                  <a
                    href={member.socials.instagram}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} on Instagram`}
                    className="transition hover:opacity-80"
                  >
                    <Instagram size={20} />
                  </a>
                )}
                {member.socials?.twitter && (
                  <a
                    href={member.socials.twitter}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${member.name} on Twitter`}
                    className="transition hover:opacity-80"
                  >
                    <Twitter size={20} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
