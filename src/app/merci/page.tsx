import { Suspense } from "react";
import type { Metadata } from "next";
import { MerciContent } from "./merci-content";

export const metadata: Metadata = {
  title: "Commande Confirmee",
  description: "Confirmation de commande Coin Original.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MerciPage() {
  return (
    <Suspense fallback={null}>
      <MerciContent />
    </Suspense>
  );
}
