import { useState } from "react";
import { Play } from "lucide-react";
import { getAboutVideo } from "../../data/aboutData";

export default function AboutVideoSection({ className = "" }) {
  const section = getAboutVideo("en");
  if (!section) return null;

  const { video, thumbnail, playButtonLabel } = section;
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (!video?.url && !video?.embedUrl) return;
    setIsPlaying(true);
  };

  return (
    <section className={`bg-white ${className}`}>
      <div className="mx-auto max-w-6xl px-6 pb-16 pt-4 md:px-8 xl:max-w-7xl">
        <div className="flex justify-center">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-[24px] bg-black shadow-md md:rounded-[30px]">
            {/* Henüz play'e basılmadıysa: thumbnail + buton */}
            {!isPlaying && (
              <>
                {thumbnail?.src && (
                  <img
                    src={thumbnail.src}
                    alt={thumbnail.alt}
                    loading="lazy"
                    className="h-full w-full max-h-[540px] object-cover"
                  />
                )}

                <button
                  type="button"
                  onClick={handlePlay}
                  aria-label={playButtonLabel || "Play video"}
                  className="group absolute inset-0 flex items-center justify-center"
                >
                  <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#23A6F0] shadow-lg transition-transform duration-200 group-hover:scale-105 group-active:scale-95 md:h-24 md:w-24">
                    <Play
                      className="translate-x-[1px] text-white"
                      size={32}
                      strokeWidth={2.5}
                      fill="white"
                    />
                  </span>
                </button>
              </>
            )}

            {/* Play'e basıldıysa: aynı kart içinde video player */}
            {isPlaying && (
              <div className="relative w-full pt-[56.25%]">
                {video?.provider === "youtube" ||
                video?.provider === "vimeo" ? (
                  <iframe
                    src={video.embedUrl || video.url}
                    title="About video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <video
                    src={video.url}
                    controls
                    autoPlay
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
