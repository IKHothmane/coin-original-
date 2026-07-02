import { SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";

export const metadata = {
  title: "اتصل بنا | كوين أوريجينال",
  description: "تواصل مع كوين أوريجينال — واتساب، هاتف، بريد إلكتروني وشبكات اجتماعية.",
  alternates: {
    canonical: "/ar/contact",
    languages: {
      fr: "/contact",
      ar: "/ar/contact",
      "x-default": "/contact",
    },
  },
};

export default function ArabicContactPage() {
  const whatsappNumber = process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "+212600000000";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\+/g, "")}`;
  const instagramUrl = process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://instagram.com/coinoriginal";
  const facebookUrl = process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "https://facebook.com/coinoriginal";
  const tiktokUrl = process.env.NEXT_PUBLIC_TIKTOK_URL ?? "https://tiktok.com/@coinoriginal";
  const siteUrl = SITE_URL;

  const contactJsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "اتصل بنا | كوين أوريجينال",
    url: `${siteUrl}/ar/contact`,
    mainEntity: {
      "@type": "Organization",
      name: "كوين أوريجينال",
      url: siteUrl,
      logo: `${siteUrl}/og-image.png`,
      contactPoint: {
        "@type": "ContactPoint",
        telephone: whatsappNumber,
        contactType: "customer service",
        areaServed: "MA",
        availableLanguage: ["Arabic", "French"],
      },
      sameAs: [instagramUrl, facebookUrl, tiktokUrl].filter(Boolean),
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "ما هو مدة التوصيل؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "3 إلى 5 أيام عمل حسب المدينة. توصيل مجاني ابتداءً من 500 درهم.",
        },
      },
      {
        "@type": "Question",
        name: "كيف يمكنني إرجاع منتج؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "لديك 7 أيام بعد الاستلام. تواصل معنا عبر واتساب مع رقم طلبك.",
        },
      },
      {
        "@type": "Question",
        name: "ما هي طرق الدفع المتاحة؟",
        acceptedAnswer: {
          "@type": "Answer",
          text: "الدفع عند الاستلام نقداً فقط. لا يلزم أي دفع إلكتروني.",
        },
      },
    ],
  };

  const jsonLdData = [contactJsonLd, faqJsonLd];

  return (
    <>
      <main className="max-w-3xl mx-auto px-6 py-12" dir="rtl">
        <h1 className="text-3xl font-bold mb-4">اتصل بنا</h1>
        <p className="text-gray-600 mb-8">
          هل لديك سؤال أو مشكلة؟ نحن هنا لمساعدتك.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WhatsApp */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl">
              💬
            </div>
            <div>
              <h3 className="font-semibold text-green-800">واتساب</h3>
              <p className="text-sm text-green-700">رد سريع مضمون</p>
              <p className="text-sm text-green-600 font-mono">{whatsappNumber}</p>
            </div>
          </a>

          {/* Téléphone */}
          <a
            href={`tel:${whatsappNumber}`}
            className="flex items-center gap-4 p-6 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl">
              📞
            </div>
            <div>
              <h3 className="font-semibold text-blue-800">الهاتف</h3>
              <p className="text-sm text-blue-700">من الاثنين إلى السبت، 9ص–6م</p>
              <p className="text-sm text-blue-600 font-mono">{whatsappNumber}</p>
            </div>
          </a>

          {/* Email */}
          <a
            href="mailto:contact@coinoriginal.shop"
            className="flex items-center gap-4 p-6 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
          >
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl">
              ✉️
            </div>
            <div>
              <h3 className="font-semibold text-orange-800">البريد الإلكتروني</h3>
              <p className="text-sm text-orange-700">رد خلال 24 ساعة</p>
              <p className="text-sm text-orange-600 font-mono">contact@coinoriginal.shop</p>
            </div>
          </a>

          {/* Adresse */}
          <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center text-white text-xl">
              📍
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">العنوان</h3>
              <p className="text-sm text-gray-700">الدار البيضاء، المغرب</p>
              <p className="text-sm text-gray-600">توصيل في جميع أنحاء المغرب</p>
            </div>
          </div>
        </div>

        {/* Réseaux sociaux */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">تابعنا</h2>
          <div className="flex gap-4">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Instagram
            </a>
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Facebook
            </a>
            <a
              href={tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              TikTok
            </a>
          </div>
        </div>

        {/* FAQ rapide */}
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-4">أسئلة شائعة</h2>
          <div className="space-y-4">
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-medium cursor-pointer">ما هو مدة التوصيل؟</summary>
              <p className="text-gray-600 mt-2">3 إلى 5 أيام عمل حسب المدينة. توصيل مجاني ابتداءً من 500 درهم.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-medium cursor-pointer">كيف يمكنني إرجاع منتج؟</summary>
              <p className="text-gray-600 mt-2">لديك 7 أيام بعد الاستلام. تواصل معنا عبر واتساب مع رقم طلبك.</p>
            </details>
            <details className="bg-gray-50 rounded-lg p-4">
              <summary className="font-medium cursor-pointer">ما هي طرق الدفع المتاحة؟</summary>
              <p className="text-gray-600 mt-2">الدفع عند الاستلام نقداً فقط. لا يلزم أي دفع إلكتروني.</p>
            </details>
          </div>
        </div>
      </main>
      <JsonLd data={jsonLdData} />
    </>
  );
}
