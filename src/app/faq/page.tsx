import type { Metadata } from "next";
import { FAQPageClient } from "@/components/faq-page";

export const metadata: Metadata = {
  title: "FAQ | Coin Original",
  description: "Questions fréquentes sur Coin Original — livraison, paiement, retours et tailles.",
};

export default function FAQPage() {
  return <FAQPageClient />;
}
