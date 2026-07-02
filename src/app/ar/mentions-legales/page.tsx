import { SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";

export const metadata = {
  title: "إشعارات قانونية | كوين أوريجينال",
  description: "إشعارات قانونية لمتجر كوين أوريجينال — معلومات حول الناشر، الاستضافة وشروط الاستخدام.",
  alternates: {
    canonical: "/ar/mentions-legales",
    languages: {
      fr: "/mentions-legales",
      ar: "/ar/mentions-legales",
      "x-default": "/mentions-legales",
    },
  },
};

export default function ArabicMentionsLegalesPage() {
  const siteUrl = SITE_URL;

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "إشعارات قانونية | كوين أوريجينال",
    url: `${siteUrl}/ar/mentions-legales`,
    description: "إشعارات قانونية لمتجر كوين أوريجينال — معلومات حول الناشر، الاستضافة وشروط الاستخدام.",
    publisher: {
      "@type": "Organization",
      name: "كوين أوريجينال",
      url: siteUrl,
    },
  };

  return (
    <>
      <main className="max-w-3xl mx-auto px-6 py-12" dir="rtl">
        <h1 className="text-3xl font-bold mb-8">إشعارات قانونية</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">1. ناشر الموقع</h2>
          <p className="text-gray-700 leading-relaxed">
            يتم نشر موقع <strong>كوين أوريجينال</strong> بواسطة:<br />
            الاسم: كوين أوريجينال<br />
            العنوان: الدار البيضاء، المغرب<br />
            البريد الإلكتروني: contact@coinoriginal.shop<br />
            الهاتف: +212 6XX XX XX XX
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">2. الاستضافة</h2>
          <p className="text-gray-700 leading-relaxed">
            يتم استضافة الموقع بواسطة:<br />
            <strong>Cloudflare, Inc.</strong><br />
            101 Townsend Street, San Francisco, CA 94107, USA<br />
            الموقع: <a href="https://www.cloudflare.com" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">www.cloudflare.com</a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">3. الملكية الفكرية</h2>
          <p className="text-gray-700 leading-relaxed">
            جميع محتويات الموقع (نصوص، صور، شعارات، علامات تجارية) هي ملكية حصرية لكوين أوريجينال أو شركائها. يمنع منعاً باتاً أي نسخ أو توزيع أو استخدام دون إذن مسبق.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">4. المسؤولية</h2>
          <p className="text-gray-700 leading-relaxed">
            تسعى كوين أوريجينال لضمان دقة المعلومات المنشورة على الموقع. ومع ذلك، قد تحدث أخطاء أو سهو. لا يمكن لكوين أوريجينال أن تكون مسؤولة عن الأضرار المباشرة أو غير المباشرة الناتجة عن استخدام الموقع.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">5. الكوكيز</h2>
          <p className="text-gray-700 leading-relaxed">
            يستخدم الموقع ملفات تعريف الارتباط (كوكيز) لتحسين تجربة المستخدم وتحليل الزيارات (Google Analytics). بتصفح الموقع، تقبل استخدام هذه الكوكيز. يمكنك تعطيلها في إعدادات متصفحك.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">6. القانون المعمول به</h2>
          <p className="text-gray-700 leading-relaxed">
            تخضع هذه الإشعارات القانونية للقانون المغربي. في حال النزاع، تكون محاكم الدار البيضاء هي المختصة.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-12">آخر تحديث: يوليو 2026</p>
      </main>
      <JsonLd data={webPageJsonLd} />
    </>
  );
}
