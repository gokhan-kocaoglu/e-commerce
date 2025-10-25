import HeroSlider from "../components/HeroSlider";
import { homeSliders } from "../data/homeSliders";
import EditorsPick from "../components/EditorsPick";
import BestSellers from "../components/BestSellers";
import PromoSlider from "../components/Slider";
import CtaSection from "../components/CtaSection";
import FeaturedPosts from "../components/FeaturedPosts";

export default function Home() {
  return (
    <section>
      <HeroSlider
        items={homeSliders}
        autoPlay={{ enabled: true, delayMs: 6000 }}
      />
      <EditorsPick />
      <BestSellers />
      <PromoSlider />
      <CtaSection slug="neural-universe" className="my-0.5" />
      <FeaturedPosts className="py-16 md:py-20" />
    </section>
  );
}
