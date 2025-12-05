import { Facebook, Instagram, Twitter } from "lucide-react";
import { getTeamMembersSection } from "../../data/team";

export default function TeamMembers({ locale = "en", className = "" }) {
  const section = getTeamMembersSection(locale);
  if (!section) return null;

  const { title, members } = section;

  return (
    <section
      className={`bg-white px-4 py-16 md:pb-10 md:pt-24 ${className}`}
      aria-label="Team members"
    >
      {/* Başlık */}
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="font-['Montserrat'] text-[28px] md:text-[40px] font-bold leading-[36px] md:leading-[50px] tracking-[0.2px] text-[#252B42]">
          {title}
        </h2>
      </div>
      {/* Kartlar */}
      <div className="mx-auto mt-10 flex max-w-6xl flex-wrap justify-center gap-y-10">
        {members.map((member) => (
          <article
            key={member.id}
            className="flex w-full flex-col items-center px-3 mb-12 sm:w-1/2 lg:w-1/3"
          >
            {/* Görsel */}
            <div className="w-full max-w-[320px] overflow-hidden bg-[#F9F9F9]">
              <div className="aspect-[4/3] w-full">
                <img
                  src={member.avatarUrl}
                  alt={member.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* İsim / rol */}
            <div className="mt-4 text-center">
              <h3 className="font-['Montserrat'] text-[16px] font-bold leading-[24px] tracking-[0.1px] text-[#252B42]">
                {member.name}
              </h3>
              <p className="mt-1 font-['Montserrat'] text-[14px] font-normal leading-[20px] tracking-[0.2px] text-[#737373]">
                {member.role}
              </p>
            </div>

            {/* Sosyal ikonlar */}
            <div className="mt-4 flex items-center justify-center gap-4 text-[#23A6F0]">
              {/* ikonlar aynı */}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
