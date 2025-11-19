import {
  FaHooli,
  FaLyft,
  FaLeaf,
  FaStripe,
  FaAws,
  FaRedditAlien,
} from "react-icons/fa";

export default function ClientsStrip({
  items,
  size,
  color = "#737373",
  className,
}) {
  const data = items ?? [
    { id: "hooli", label: "Hooli", Icon: FaHooli },
    { id: "lyft", label: "Lyft", Icon: FaLyft },
    { id: "leaf", label: "Leaf", Icon: FaLeaf },
    { id: "stripe", label: "Stripe", Icon: FaStripe },
    { id: "aws", label: "AWS", Icon: FaAws },
    { id: "reddit", label: "Reddit", Icon: FaRedditAlien },
  ];

  const sizePx = { sm: 28, md: 36, lg: 100 }[size] ?? 36;

  return (
    <section
      className={`mx-auto bg-[#FAFAFA] w-full max-w-7xl px-4 sm:px-6 ${className}`}
    >
      {/* FLEX container */}
      <div className="flex flex-col items-center gap-8 py-8 md:py-12 md:flex-row md:justify-between">
        {data.map(({ id, label, Icon }) => (
          <div
            key={id}
            className="
              flex items-center justify-center md:justify-center
              w-full 
              opacity-70 grayscale transition
              hover:opacity-100 hover:grayscale-0
            "
            aria-label={label}
            title={label}
          >
            <Icon size={sizePx} color={color} />
          </div>
        ))}
      </div>
    </section>
  );
}
