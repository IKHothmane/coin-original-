import { SITE_URL } from "@/lib/site";
import { JsonLd } from "@/components/json-ld";

export const metadata = {
  title: "شروط البيع | كوين أوريجينال",
  description: "شروط البيع العامة لكوين أوريجينال — الدفع، التوصيل، الإرجاع والاسترداد في المغرب.",
  alternates: {
    canonical: "/ar/cgv",
    languages: {
      fr: "/cgv",
      ar: "/ar/cgv",
      "x-default": "/cgv",
    },
  },
};

export default function ArabicCGVPage() {
  const siteUrl = SITE_URL;

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "شروط البيع | كوين أوريجينال",
    url: `${siteUrl}/ar/cgv`,
    description: "شروط البيع العامة لكوين أوريجينال — الدفع، التوصيل، الإرجاع والاسترداد في المغرب.",
    publisher: {
      "@type": "Organization",
      name: "كوين أوريجينال",
      url: siteUrl,
    },
  };

  return (
    <>
      <main className="max-w-3xl mx-auto px-6 py-12" dir="rtl">
        <h1 className="text-3xl font-bold mb-8">شروط البيع</h1>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">1. مقدمة</h2>
          <p className="text-gray-700 leading-relaxed">
            تحكم هذه الشروط العامة لبيع (CGV) العلاقة بين متجر <strong>كوين أوريجينال</strong> وعملائه لأي عملية شراء تتم على الموقع {siteUrl}.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">2. المنتجات</h2>
          <p className="text-gray-700 leading-relaxed">
            المنتجات المعروضة هي أدوات ملابس الشارع، أحذية رياضية، ملابس وإكسسوارات. يتم عرض الأوصاف، الصور والأسعار لكل منتج. تسعى كوين أوريجينال لضمان دقة المعلومات، لكن قد تختلف الألوان حسب الشاشات.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">3. الأسعار</h2>
          <p className="text-gray-700 leading-relaxed">
            الأسعار معروضة بـ <strong>الدرهم المغربي (MAD)</strong> وقابلة للتغيير دون إشعار مسبق. السعر المدفوع هو السعر الساري وقت الطلب. التوصيل مجاني ابتداءً من 500 درهم.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">4. الطلب</h2>
          <p className="text-gray-700 leading-relaxed">
            يقوم العميل بالطلب بإضافة المنتجات إلى السلة وتأكيد عملية الشراء. يتم تأكيد الطلب برسالة نجاح على الشاشة. تحتفظ كوين أوريجينال بحق إلغاء أي طلب في حال مشكلة في المخزون أو الاشتباه في احتيال.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">5. الدفع</h2>
          <p className="text-gray-700 leading-relaxed">
            يتم الدفع حصرياً <strong>عند الاستلام</strong> (نقداً للساعي). لا يتم قبول أي دفع إلكتروني حالياً. قد تُطبق رسوم توصيل بقيمة 15 درهم للطلبات أقل من 500 درهم.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">6. التوصيل</h2>
          <p className="text-gray-700 leading-relaxed">
            يتم التوصيل داخل المغرب فقط. مدة التوصيل المقدرة هي <strong>3 إلى 5 أيام عمل</strong> حسب المدينة. يتم الاتصال بالعميل هاتفياً قبل التوصيل لتأكيد العنوان والوقت.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">7. الإرجاع والتبديل</h2>
          <p className="text-gray-700 leading-relaxed">
            يحق للعميل طلب الإرجاع أو التبديل خلال <strong>7 أيام</strong> بعد الاستلام. يجب أن يكون المنتج في حالته الأصلية، غير مستعمل، مع البطاقات سليمة. رسوم الإرجاع على حساب العميل إلا في حالة منتج معيب.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">8. الاسترداد</h2>
          <p className="text-gray-700 leading-relaxed">
            في حال قبول الإرجاع، يتم الاسترداد خلال <strong>14 يوماً</strong> عبر تحويل بنكي أو نقداً حسب اختيار العميل. لا تُسترد رسوم التوصيل الأولية.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">9. حق الانسحاب</h2>
          <p className="text-gray-700 leading-relaxed">
            وفقاً للتشريع المغربي، يحق للعميل الانسحاب خلال 7 أيام. لممارسة هذا الحق، يجب على العميل التواصل مع كوين أوريجينال عبر البريد الإلكتروني أو واتساب مع رقم الطلب.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">10. خدمة العملاء</h2>
          <p className="text-gray-700 leading-relaxed">
            لأي سؤال، شكوى أو طلب إرجاع:<br />
            البريد الإلكتروني: contact@coinoriginal.shop<br />
            واتساب: +212 6XX XX XX XX<br />
            ساعات العمل: من الاثنين إلى السبت، 9ص إلى 6م
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">11. القانون المعمول به</h2>
          <p className="text-gray-700 leading-relaxed">
            تخضع هذه الشروط العامة لبيع للقانون المغربي. في حال النزاع، سيتم البحث عن حل ودي قبل أي إجراء قضائي. وإلا تكون محاكم الدار البيضاء هي المختصة.
          </p>
        </section>

        <p className="text-sm text-gray-500 mt-12">آخر تحديث: يوليو 2026</p>
      </main>
      <JsonLd data={webPageJsonLd} />
    </>
  );
}
