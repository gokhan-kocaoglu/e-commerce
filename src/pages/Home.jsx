import HeroSlider from "../components/HeroSlider";
import { homeSliders } from "../data/homeSliders";
import EditorsPick from "../components/EditorsPick";
import BestSellers from "../components/BestSellers";

export default function Home() {
  return (
    <section>
      <HeroSlider
        items={homeSliders}
        autoPlay={{ enabled: true, delayMs: 6000 }}
      />
      <EditorsPick />
      <BestSellers />
    </section>
  );
}
