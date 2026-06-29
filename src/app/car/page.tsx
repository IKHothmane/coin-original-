import type { Metadata } from "next";
import { CarLandingPage } from "@/components/car-landing/car-landing-page";

export const metadata: Metadata = {
  title: "CarPlay Sans Fil | CoinOriginal Drive",
  description: "Landing page produit pour l'adaptateur CarPlay sans fil avec commande WhatsApp.",
};

export default function CarPage() {
  return <CarLandingPage showBackLink />;
}
