import { SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";

export const metadata = {
  title: "كوين أوريجينال | ملابس الشارع المتميزة في المغرب",
  description: "كوين أوريجينال — متجر ملابس الشارع المتميزة في المغرب. أحذية رياضية، ملابس وإكسسوارات حضرية مع الدفع عند الاستلام. توصيل مجاني في المغرب.",
  alternates: {
    canonical: "/ar",
    languages: {
      "fr": "/",
      "ar": "/ar",
      "x-default": "/",
    },
  },
};

export default function ArabicHomePage() {
  const siteUrl = SITE_URL;

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "كوين أوريجينال",
    url: siteUrl,
    logo: `${siteUrl}/og-image.png`,
    sameAs: [
      process.env.NEXT_PUBLIC_INSTAGRAM_URL,
      process.env.NEXT_PUBLIC_FACEBOOK_URL,
      process.env.NEXT_PUBLIC_TIKTOK_URL,
    ].filter(Boolean),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "+212600000000",
      contactType: "customer service",
      areaServed: "MA",
      availableLanguage: ["Arabic", "French"],
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "كوين أوريجينال",
    url: siteUrl,
    inLanguage: "ar",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/boutique?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <main className="max-w-4xl mx-auto px-6 py-12 text-right" dir="rtl">
        <h1 className="text-4xl font-bold mb-6">كوين أوريجينال</h1>
        <p className="text-xl text-gray-600 mb-8">
          ملابس الشارع المتميزة في المغرب
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">👟 أحذية رياضية</h2>
            <p className="text-gray-700">أحدث موديلات الأحذية الرياضية الأصلية</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">👕 ملابس</h2>
            <p className="text-gray-700">هوديز، تيشيرتات، وسترات عصرية</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">🎒 إكسسوارات</h2>
            <p className="text-gray-700">حقائب، قبعات، وإكسسوارات حضرية</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">🚚 توصيل مجاني</h2>
            <p className="text-gray-700">توصيل مجاني في جميع أنحاء المغرب</p>
          </div>
        </div>

        <div className="bg-orange-50 p-6 rounded-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">💰 الدفع عند الاستلام</h2>
          <p className="text-gray-700">
            ادفع نقداً عند استلام طلبك. لا حاجة لبطاقة بنكية أو الدفع الإلكتروني.
          </p>
        </div>

        <div className="flex gap-4 justify-center">
          <a
            href="/boutique"
            className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-lg"
          >
            تسوق الآن
          </a>
          <a
            href="/contact"
            className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-lg"
          >
            تواصل معنا
          </a>
        </div>

        <div className="mt-12 border-t pt-8">
          <p className="text-sm text-gray-500 text-center">
            <a href="/" className="text-blue-600 hover:underline">النسخة الفرنسية</a> متوفرة أيضاً
          </p>
        </div>
      </main>
      <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
    </>
  );
}
