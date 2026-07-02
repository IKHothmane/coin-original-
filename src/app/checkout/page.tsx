import type { Metadata } from "next";
import { CheckoutPage } from "@/components/checkout-page";

export const metadata: Metadata = {
  title: "Finaliser la Commande",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutRoute() {
  return <CheckoutPage />;
}
