import { Homepage } from "@/components/homepage";
import { RootHostRedirect } from "@/components/root-host-redirect";

export default function Home() {
  return (
    <>
      <RootHostRedirect />
      <Homepage />
    </>
  );
}
