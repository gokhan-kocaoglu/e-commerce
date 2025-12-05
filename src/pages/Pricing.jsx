import PricingHeader from "../components/pricing/PricingHeader";
import PricingPlansSection from "../components/pricing/PricingPlansSection";
import PricingClientSection from "../components/pricing/PricingClientSection";
import PricingFaqsSection from "../components/pricing/PricingFaqsSection";
import PricingTrialCta from "../components/common/TrialCta";

export default function PricingPage() {
  return (
    <main>
      <PricingHeader />
      <PricingPlansSection />
      <PricingClientSection />
      <PricingFaqsSection />
      <PricingTrialCta />
    </main>
  );
}
