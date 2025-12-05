import ClientsStrip from "../common/ClientsStrip";
import { getPricingClients } from "../../data/pricingData";

export default function PricingClientSection({ className = "" }) {
  const section = getPricingClients("en");
  if (!section) return null;

  const { title, subtitle } = section;
  return (
    <ClientsStrip
      title={title}
      h4={subtitle}
      size="lg"
      showLabels={false} // sadece logo istiyoruz; yazı istenirse true
      className={className}
    />
  );
}
