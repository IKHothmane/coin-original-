import type { Metadata } from "next";
import { CartPage } from "@/components/cart-page";

export const metadata: Metadata = {
  title: "سلة التسوق | كوين أوريجينال",
  description: "سلة التسوق الخاصة بك — راجع منتجاتك وأكمل الطلب.",
  alternates: {
    canonical: "/ar/panier",
    languages: {
      fr: "/panier",
      ar: "/ar/panier",
      "x-default": "/panier",
    },
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ArabicPanierRoute() {
  return (
    <main dir="rtl">
      <CartPage />
    </main>
  );
}
