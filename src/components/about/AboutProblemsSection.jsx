import { getAboutProblems } from "../../data/aboutData";

export default function AboutProblemsSection({ className = "" }) {
  const section = getAboutProblems("en");
  if (!section) return null;

  const { eyebrow, title, description } = section;

  return (
    <section className={`bg-white ${className}`}>
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-8 xl:max-w-7xl">
        <div className="w-full flex justify-center md:justify-start">
          {eyebrow && (
            <p className="font-['Montserrat'] text-[14px] font-bold leading-[24px] tracking-[0.2px] text-[#E74040]">
              {eyebrow}
            </p>
          )}
        </div>
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-start md:gap-16 md:text-left">
          {/* Sol taraf */}
          <div className="w-full md:w-1/2">
            <h3 className="mt-3 max-w-100 font-['Montserrat'] text-[24px] font-bold leading-[32px] tracking-[0.1px] text-[#252B42]">
              {title}
            </h3>
          </div>

          {/* Sağ taraf */}
          <div className="w-full md:flex md:items-center md:w-1/2 pt-5">
            <p className="font-['Montserrat'] text-[14px] leading-[24px] tracking-[0.2px] text-[#737373] md:text-[16px]">
              {description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
