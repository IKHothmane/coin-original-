import type { Metadata } from "next";
import { BoutiquePage } from "@/components/boutique-page";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "متجر | أحذية وملابس الشارع المغرب",
  description:
    "تسوق أحدث الأحذية الرياضية والملابس والإكسسوارات الحضرية في المغرب. تصفح حسب الفئة والحجم والسعر. الدفع عند الاستلام.",
  alternates: {
    canonical: "/ar/boutique",
    languages: {
      fr: "/boutique",
      ar: "/ar/boutique",
      "x-default": "/boutique",
    },
  },
  openGraph: {
    title: "متجر | أحذية وملابس الشارع المغرب",
    description: "تشكيلة ملابس الشارع والأحذية الرياضية في المغرب مع الدفع عند الاستلام.",
    url: "/ar/boutique",
  },
};

export default async function ArabicBoutiqueRoute() {
  const siteUrl = SITE_URL;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "الرئيسية",
        item: `${siteUrl}/ar`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "المتجر",
        item: `${siteUrl}/ar/boutique`,
      },
    ],
  };

  return (
    <>
      <main dir="rtl">
        <BoutiquePage />
      </main>
      <JsonLd data={breadcrumbJsonLd} />
    </>
  );
}
