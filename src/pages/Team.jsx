import TeamHeader from "../components/team/TeamHeader";
import TeamGallery from "../components/team/TeamGallery";
import TeamMembers from "../components/team/TeamMembers";
import TeamTrialCta from "../components/common/TrialCta";

export default function Team() {
  return (
    <main className="flex flex-col">
      <TeamHeader />
      <TeamGallery />
      <TeamMembers />
      <TeamTrialCta />
    </main>
  );
}
