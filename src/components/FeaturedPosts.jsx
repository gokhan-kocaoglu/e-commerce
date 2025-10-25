// src/components/home/FeaturedPosts.jsx
import { getFeaturedSection } from "../data/post";
import PostCard from "../components/PostCard";

export default function FeaturedPosts({ className = "" }) {
  const section = getFeaturedSection();

  return (
    <section className={`w-full ${className}`}>
      {/* Heading block */}
      <div className="mx-auto max-w-4xl px-4 text-center">
        <div
          className="
            font-['Montserrat'] text-[14px] font-bold leading-[24px] tracking-[0.2px]
            text-sky-600
          "
        >
          {section.kicker}
        </div>

        <h2
          className="
            mt-2 font-['Montserrat'] text-[40px] font-bold leading-[50px] tracking-[0.2px]
            text-zinc-900
          "
        >
          {section.title}
        </h2>

        <p
          className="
            mx-auto mt-3 max-w-96 lg:max-w-xl
            font-['Montserrat'] text-[14px] font-normal leading-[20px] tracking-[0.2px]
            text-[#737373]
          "
        >
          {section.description}
        </p>
      </div>

      {/* Cards row (flex, responsive) */}
      <div
        className="
          mx-auto mt-10 flex w-full max-w-7xl flex-wrap justify-center gap-6 lg:gap-0 px-20
          lg:justify-center
        "
      >
        {section.posts.map((p) => (
          <div
            key={p.id}
            className="
              flex basis-full justify-center
              sm:basis-[calc(50%-12px)] lg:basis-[calc(33.333%-16px)]
            "
          >
            <PostCard post={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
