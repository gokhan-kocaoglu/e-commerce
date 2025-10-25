// src/components/blog/PostCard.jsx
import { Link } from "react-router-dom";
import { Clock, MessageSquare, ChevronRight } from "lucide-react";
import { getMediaById, getTagById } from "../data/post";

// Yardımcı: ISO → "22 April 2021"
function formatPostDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function PostCard({ post }) {
  const img = getMediaById(post.mediaId);
  const dateStr = formatPostDate(post.publishedAt);

  return (
    <article
      className="
        flex w-full flex-col overflow-hidden border border-zinc-200 bg-white
        shadow-sm transition-shadow hover:shadow-md
        max-w-[348px] 
      "
    >
      {/* Media */}
      <div className="relative">
        <img
          src={img?.src}
          alt={img?.alt || post.title}
          className="
            h-[220px] w-full object-cover
            md:h-[260px] lg:h-[300px]
          "
          style={{
            objectPosition: `${(img?.focal?.x ?? 0.5) * 100}% ${
              (img?.focal?.y ?? 0.5) * 100
            }%`,
          }}
        />
        {/* NEW badge (varsa) */}
        {post.tagIds?.includes("new") && (
          <span
            className="
              absolute left-3 top-3 rounded-sm bg-rose-500 px-2 py-1
              font-['Montserrat'] text-[12px] font-bold leading-[16px] tracking-[0.2px]
              text-white
            "
          >
            NEW
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        {/* Tag row: google · trending · new */}
        <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1">
          {post.tagIds?.map((tid) => {
            const tag = getTagById(tid);
            return (
              <span
                key={tid}
                className="
                  font-['Montserrat'] text-[12px] font-normal leading-[16px] tracking-[0.2px]
                  text-sky-600
                "
              >
                {tag?.label}
              </span>
            );
          })}
        </div>

        {/* Title (h4) */}
        <h3
          className="
            mb-2 font-['Montserrat'] text-[20px] font-normal leading-[30px] tracking-[0.2px]
            text-zinc-900
          "
        >
          {post.title} <span className="text-zinc-700">{post.subtitle}</span>
        </h3>

        {/* Excerpt (p) */}
        <p
          className="
            mb-4 font-['Montserrat'] text-[14px] font-normal leading-[20px] tracking-[0.2px]
            text-[#737373]
          "
        >
          {post.excerpt}
        </p>

        {/* Meta row */}
        <div className="mt-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#737373]">
            <Clock className="h-4 w-4" />
            <span className="font-['Montserrat'] text-[12px] leading-[16px] tracking-[0.2px]">
              {dateStr}
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#737373]">
            <MessageSquare className="h-4 w-4" />
            <span className="font-['Montserrat'] text-[12px] leading-[16px] tracking-[0.2px]">
              {post.commentsCount} comments
            </span>
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/blog/${post.slug}`}
          className="
            group mt-5 inline-flex items-center gap-2
            font-['Montserrat'] text-[14px] font-semibold leading-[24px] tracking-[0.2px]
            text-zinc-900 hover:text-zinc-700
          "
        >
          Learn More
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
