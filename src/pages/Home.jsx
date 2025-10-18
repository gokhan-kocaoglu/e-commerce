import HeroSlider from "../components/HeroSlider";
import { homeSliders } from "../data/homeSliders";

export default function Home() {
  return (
    <section>
      <HeroSlider
        items={homeSliders}
        autoPlay={{ enabled: true, delayMs: 6000 }}
      />
    </section>
  );
}
