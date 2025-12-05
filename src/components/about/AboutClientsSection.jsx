import ClientsStrip from "../common/ClientsStrip";
import { getAboutClients } from "../../data/aboutData";

export default function AboutClientsSection({ className = "" }) {
  const section = getAboutClients("en");
  if (!section) return null;

  const { title, subtitle, subtitleDesktop } = section;

  return (
    <ClientsStrip
      title={title}
      subtitle={subtitle}
      subtitleDesktop={subtitleDesktop}
      size="lg"
      showLabels={false} // sadece logo ; yazı da istenirse true
      className={className}
    />
  );
}
