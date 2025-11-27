import AboutHero from "../components/about/AboutHero";
import AboutProblemsSection from "../components/about/AboutProblemsSection";
import AboutStats from "../components/about/AboutStats";
import AboutVideoSection from "../components/about/AboutVideoSection";
import AboutTeamSection from "../components/about/AboutTeamSection";
import AboutClientsSection from "../components/about/AboutClientsSection";
import AboutWorkWithUsSection from "../components/about/AboutWorkWithUsSection";

export default function About() {
  return (
    <main>
      <AboutHero />
      <AboutProblemsSection />
      <AboutStats />
      <AboutVideoSection />
      <AboutTeamSection />
      <AboutClientsSection />
      <AboutWorkWithUsSection />
      {/* Sonraki adımlarda: <AboutStats />, <AboutMission />, <AboutTeam /> vs. */}
    </main>
  );
}
