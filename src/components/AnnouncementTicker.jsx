import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getLiveAnnouncements } from "../utils/announcement";

/**
 * Props:
 *  - intervalMs: mesajlar arası bekleme (varsayılan 5000)
 *  - className: tipografi vb.
 */
export default function AnnouncementTicker({
  intervalMs = 5000,
  className = "",
}) {
  const items = useSelector((s) => s.announcement.items);
  const live = useMemo(() => getLiveAnnouncements(items), [items]);

  const [idx, setIdx] = useState(0);
  const timerRef = useRef(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    setIdx(0);
  }, [live.length]);

  useEffect(() => {
    if (live.length <= 1 || pausedRef.current) return;
    timerRef.current = setInterval(() => {
      setIdx((i) => (i + 1) % live.length);
    }, intervalMs);
    return () => clearInterval(timerRef.current);
  }, [live.length, intervalMs]);

  if (!live.length) {
    return <span className="sr-only">No active announcement</span>;
  }

  // Basit slide/fade animasyonu için Tailwind class'ları
  return (
    <div
      className="relative overflow-hidden"
      role="status"
      aria-live="polite"
      onMouseEnter={() => {
        pausedRef.current = true;
        clearInterval(timerRef.current);
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      {/* Metin */}
      <div
        key={live[idx].id}
        className={`transition-all duration-500 ease-out translate-y-0 opacity-100 ${className}`}
      >
        {live[idx].text}
      </div>

      {/* Dots (opsiyonel)
      {live.length > 1 && (
        <div className="mt-1 flex items-center justify-center gap-1.5">
          {live.map((_, i) => (
            <button
              key={i}
              className={`h-1.5 w-4 rounded-full transition-all ${
                i === idx ? "bg-white" : "bg-white/40"
              }`}
              onClick={() => setIdx(i)}
              aria-label={`Show announcement ${i + 1}`}
            />
          ))}
        </div>
      )} */}
    </div>
  );
}
