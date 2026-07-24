import { Suspense } from "react";
import type { Metadata } from "next";
import { OrderTrackingPage } from "@/components/order-tracking-page";

export const metadata: Metadata = {
  title: "Suivi de commande",
};

export default function OrderTrackingRoute() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--background)]" />}>
      <OrderTrackingPage />
    </Suspense>
  );
}
