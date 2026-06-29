import { headers } from "next/headers";
import { CarLandingPage } from "@/components/car-landing/car-landing-page";
import { Homepage } from "@/components/homepage";

const CAR_SUBDOMAIN = "car.coinoriginal.shop";

export default async function Home() {
  const requestHeaders = await headers();
  const hostHeader = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "";
  const host = hostHeader.split(":")[0].toLowerCase();

  if (host === CAR_SUBDOMAIN) {
    return <CarLandingPage />;
  }

  return <Homepage />;
}
