import { SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";

export const metadata = {
  title: "سياسة الخصوصية | كوين أوريجينال",
  description: "سياسة الخصوصية لكوين أوريجينال — جمع، استخدام وحماية البيانات الشخصية.",
  alternates: {
    canonical: "/ar/politique-confidentialite",
    languages: {
      fr: "/politique-confidentialite",
      ar: "/ar/politique-confidentialite",
      "x-default": "/politique-confidentialite",
    },
  },
};

export default function ArabicPolitiqueConfidentialitePage() {
  const siteUrl = SITE_URL;

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "سياسة الخصوصية | كوين أوريجينال",
    url: `${siteUrl}/ar/politique-confidentialite`,
    description: "سياسة الخصوصية لكوين أوريجينال — جمع، استخدام وحماية البيانات الشخصية.",
    publisher: {
      "@type": "Organization",
      name: "كوين أوريجينال",
      url: siteUrl,
    },
  };

  return (
    <>
      <main className="max-w-3xl mx-auto px-6 py-12" dir="rtl">
        <h1 className="text-3xl font-bold mb-8">سياسة الخصوصية</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">1. مقدمة</h2>
          <p className="text-gray-700 leading-relaxed">
            تلتزم كوين أوريجينال بحماية خصوصية مستخدميها. تشرح هذه السياسة كيفية جمع بياناتك الشخصية واستخدامها وحمايتها عند استخدام موقعنا {siteUrl}.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">2. البيانات المجمعة</h2>
          <p className="text-gray-700 leading-relaxed">
            نجمع البيانات التالية:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-2">
            <li><strong>بيانات الطلب</strong>: الاسم، العنوان، رقم الهاتف، واتساب</li>
            <li><strong>بيانات التصفح</strong>: الصفحات المزارة، الوقت المستغرق، عبر Google Analytics</li>
            <li><strong>بيانات تقنية</strong>: عنوان IP، نوع المتصفح، الجهاز المستخدم</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">3. غرض الجمع</h2>
          <p className="text-gray-700 leading-relaxed">
            تُستخدم بياناتك من أجل:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-2">
            <li>معالجة وتوصيل طلباتك</li>
            <li>التواصل معك بخصوص طلبك</li>
            <li>تحسين موقعنا وخدماتنا</li>
            <li>الالتزام بالالتزامات القانونية</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">4. الاحتفاظ بالبيانات</h2>
          <p className="text-gray-700 leading-relaxed">
            يتم الاحتفاظ ببيانات الطلب لمدة <strong>3 سنوات</strong> من آخر طلب. يتم الاحتفاظ ببيانات التصفح (Google Analytics) لمدة <strong>14 شهراً</strong>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">5. مشاركة البيانات</h2>
          <p className="text-gray-700 leading-relaxed">
            لا تُباع بياناتك لأطراف ثالثة. قد تُشارك مع:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-2">
            <li>خدمة التوصيل لدينا (لتوصيل طلباتك)</li>
            <li>Google Analytics (بيانات تصفح مجهولة)</li>
            <li>السلطات المختصة في حال الالتزام القانوني</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">6. حقوقك</h2>
          <p className="text-gray-700 leading-relaxed">
            وفقاً للقانون 09-08 المتعلق بحماية البيانات الشخصية في المغرب، يحق لك:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-2">
            <li><strong>حق الوصول</strong>: الحصول على نسخة من بياناتك</li>
            <li><strong>حق التصحيح</strong>: تصحيح بياناتك</li>
            <li><strong>حق الحذف</strong>: طلب حذف بياناتك</li>
            <li><strong>حق الاعتراض</strong>: الاعتراض على معالجة بياناتك</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-2">
            لممارسة هذه الحقوق، تواصل معنا على: <strong>contact@coinoriginal.shop</strong>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">7. الكوكيز</h2>
          <p className="text-gray-700 leading-relaxed">
            يستخدم الموقع ملفات تعريف الارتباط (كوكيز) من أجل:
          </p>
          <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-2">
            <li><strong>كوكيز وظيفية</strong>: السلة، التفضيلات</li>
            <li><strong>كوكيز تحليلية</strong>: Google Analytics (الصفحات المزارة، السلوك)</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-2">
            يمكنك تعطيل الكوكيز في إعدادات متصفحك. قد يؤثر ذلك على بعض وظائف الموقع.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">8. الأمان</h2>
          <p className="text-gray-700 leading-relaxed">
            نتخذ تدابير تقنية وتنظيمية لحماية بياناتك: اتصال آمن (HTTPS)، استضافة على Cloudflare، وصول محدود للبيانات.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">9. التعديلات</h2>
          <p className="text-gray-700 leading-relaxed">
            قد تُعدل هذه السياسة في أي وقت. يتم نشر التعديلات على هذه الصفحة مع تاريخ التحديث.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">10. التواصل</h2>
          <p className="text-gray-700 leading-relaxed">
            لأي سؤال بخصوص هذه السياسة:<br />
            البريد الإلكتروني: contact@coinoriginal.shop<br />
            العنوان: الدار البيضاء، المغرب
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-12">آخر تحديث: يوليو 2026</p>
      </main>
      <JsonLd data={webPageJsonLd} />
    </>
  );
}
