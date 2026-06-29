"use client";

/* eslint-disable @next/next/no-img-element */
import { useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  Gauge,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Usb,
  Wifi,
} from "lucide-react";
import {
  carLandingConfig,
  cockpitHighlights,
  faqs,
  featureCards,
  heroStats,
  landingImages,
  type LocalizedText,
  testimonials,
} from "@/components/car-landing/car-landing-data";

type CarLandingPageProps = {
  showBackLink?: boolean;
};

type Locale = "fr" | "en" | "ar";

const featureIcons = [Wifi, Usb, ShieldCheck] as const;
const uiText = {
  navAdvantages: { ar: "المزايا", en: "Advantages", fr: "Avantages" },
  navTestimonials: { ar: "آراء العملاء", en: "Testimonials", fr: "Temoignages" },
  navFaq: { ar: "الأسئلة الشائعة", en: "FAQ", fr: "FAQ" },
  navContact: { ar: "التواصل", en: "Contact", fr: "Contact" },
  order: { ar: "اطلب الآن", en: "Order now", fr: "Commander" },
  adBadge: { ar: "صفحة هبوط إعلانية", en: "Advertising landing page", fr: "Landing page publicitaire" },
  heroEyebrow: { ar: "لاسلكي. سريع. أنيق.", en: "Wireless. Fast. Clean.", fr: "Sans fil. Rapide. Propre." },
  heroDescription: {
    ar: "حوّل لوحة القيادة إلى تجربة أكثر راحة مع محول صغير وثابت وجاهز خلال ثوانٍ.",
    en: "Turn your dashboard into a premium experience with a compact, stable adapter ready within seconds.",
    fr: "Transforme ton tableau de bord en experience premium avec un adaptateur compact, stable et pret en quelques secondes.",
  },
  currentOffer: { ar: "العرض الحالي", en: "Current offer", fr: "Offre actuelle" },
  currentPrice: { ar: "السعر الحالي", en: "Current price", fr: "Prix actuel" },
  cod: { ar: "الدفع عند الاستلام", en: "Cash on delivery", fr: "Paiement a la livraison" },
  installFast: { ar: "تركيب في أقل من دقيقة", en: "Setup in under a minute", fr: "Installation en moins d'une minute" },
  readyRoad: { ar: "جاهز للطريق", en: "Ready for the road", fr: "Pret pour la route" },
  benefitsEyebrow: { ar: "مزايا حقيقية", en: "Real benefits", fr: "Avantages reels" },
  benefitsTitle: {
    ar: "كل ما يحتاجه السائق بدون فوضى الكابلات",
    en: "Everything a driver wants without cable chaos",
    fr: "Tout ce qu'un conducteur veut sans le chaos des cables",
  },
  benefitsDescription: {
    ar: "نفس روح الصفحة الأصلية لكن بتنفيذ أنظف وأقوى للإعلانات والتحويل.",
    en: "The same product-driven tone as the original template, but rebuilt for cleaner presentation and stronger conversion.",
    fr: "La landing reprend le ton produit du template fourni, mais avec une execution plus propre et plus efficace pour la conversion.",
  },
  cockpitEyebrow: { ar: "تكامل داخل السيارة", en: "Cockpit integration", fr: "Integration cockpit" },
  cockpitTitle: {
    ar: "شكله مخفي داخل السيارة لكن أثره واضح في الراحة اليومية",
    en: "Invisible inside the car, obvious in everyday comfort",
    fr: "Un rendu invisible dans la voiture, mais tres visible dans le confort",
  },
  cockpitDescription: {
    ar: "المحول يبقى صغيراً ومخفياً، لكنه يغيّر فعلاً استعمال الخرائط والموسيقى والمكالمات يومياً.",
    en: "The adapter stays physically discreet, but it meaningfully upgrades everyday maps, music, and call usage.",
    fr: "L'adaptateur reste discret physiquement, mais change vraiment l'usage quotidien de la navigation, de la musique et des appels.",
  },
  proofEyebrow: { ar: "ثقة العملاء", en: "Social proof", fr: "Preuve sociale" },
  proofTitle: {
    ar: "آراء بسيطة وواقعية مبنية على الاستعمال الفعلي",
    en: "Simple, credible feedback built around real usage",
    fr: "Des retours simples, credibles et centres sur l'usage",
  },
  proofDescription: {
    ar: "الصفحة تعالج أهم اعتراضات الإعلانات: السرعة، الثبات، والتوصيل داخل المغرب.",
    en: "The page addresses the biggest campaign objections: speed, stability, and delivery across Morocco.",
    fr: "La page repond aux objections de campagne en mettant en avant la rapidite, la stabilite et la livraison au Maroc.",
  },
  otherAnglesEyebrow: { ar: "زوايا إضافية", en: "Extra angles", fr: "Autres angles" },
  otherAnglesTitle: {
    ar: "شاهد المنتج والاستعمال من زوايا إضافية",
    en: "See the product and usage from additional angles",
    fr: "Vois le produit et son utilisation sous d'autres angles",
  },
  otherAnglesDescription: {
    ar: "صور إضافية لإظهار شكل الجهاز داخل السيارة وطريقة الاستعمال بشكل أوضح.",
    en: "Additional visuals that show how the adapter looks inside the car and how it is used in real conditions.",
    fr: "Des visuels supplementaires pour montrer le rendu du produit dans la voiture et son usage en situation reelle.",
  },
  faqEyebrow: { ar: "أجوبة واضحة", en: "Objections handled", fr: "Objections traitees" },
  faqTitle: {
    ar: "أهم الأسئلة التي تمنع الشراء تمت الإجابة عنها",
    en: "The key pre-purchase questions are already answered",
    fr: "Les questions qui bloquent l'achat sont deja repondues",
  },
  faqDescription: {
    ar: "أسئلة قصيرة ومباشرة تساعد الزائر على اتخاذ القرار قبل الضغط على واتساب.",
    en: "Short, direct answers that help visitors decide before clicking through to WhatsApp.",
    fr: "Une FAQ courte et directe pour rassurer avant le clic WhatsApp.",
  },
  finalEyebrow: { ar: "الخطوة الأخيرة", en: "Final step", fr: "Derniere etape" },
  finalTitle: {
    ar: "اطلب الآن واستمتع بسيارة أكثر ترتيباً وراحة من الغد",
    en: "Order now and enjoy a cleaner, more comfortable car from tomorrow",
    fr: "Lance la commande maintenant et profite d'une voiture plus propre des demain",
  },
  finalDescription: {
    ar: "السعر الحالي 220 درهم مع توصيل سريع داخل المغرب ودعم متوفر قبل وبعد الطلب.",
    en: "Current price is 220 MAD with fast delivery across Morocco and support available before and after the order.",
    fr: "Prix actuel a 220 DH avec livraison rapide au Maroc et support disponible avant et apres la commande.",
  },
  orderAdapter: { ar: "اطلب المحول", en: "Order the adapter", fr: "Commander l'adaptateur" },
  backStore: { ar: "العودة إلى المتجر", en: "Back to the shop", fr: "Revenir a la boutique" },
  supportDirect: { ar: "دعم مباشر", en: "Direct support", fr: "Support direct" },
  directLink: { ar: "رابط مباشر", en: "Direct link", fr: "Lien direct" },
  orderWhatsapp: { ar: "الطلب عبر واتساب", en: "Order on WhatsApp", fr: "Commander sur WhatsApp" },
} as const;

const localeOptions: Array<{ value: Locale; label: string }> = [
  { value: "fr", label: "FR" },
  { value: "en", label: "EN" },
  { value: "ar", label: "AR" },
];

function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#08111f] text-white">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.28),transparent_28%),radial-gradient(circle_at_top_right,rgba(34,197,94,0.18),transparent_20%),linear-gradient(180deg,#08111f_0%,#091424_38%,#030712_100%)]" />
      <div className="absolute inset-0 -z-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function BilingualText({
  value,
  locale,
  englishClassName = "",
  arabicClassName = "",
  frenchClassName = "",
}: {
  value: LocalizedText;
  locale: Locale;
  englishClassName?: string;
  arabicClassName?: string;
  frenchClassName?: string;
}) {
  const className =
    locale === "ar" ? arabicClassName : locale === "fr" ? (frenchClassName || englishClassName) : englishClassName;

  return (
    <span dir={locale === "ar" ? "rtl" : "ltr"} className={className}>
      {value[locale]}
    </span>
  );
}

function SectionTitle({
  eyebrow,
  title,
  description,
  locale,
}: {
  eyebrow: LocalizedText;
  title: LocalizedText;
  description: LocalizedText;
  locale: Locale;
}) {
  return (
    <div className="space-y-4">
      <div className="font-mono text-xs tracking-[0.36em] text-cyan-200/80 uppercase">
        <BilingualText value={eyebrow} locale={locale} arabicClassName="text-[0.75rem]" />
      </div>
      <h2 className="max-w-3xl font-[var(--font-display)] text-4xl uppercase leading-[0.92] md:text-6xl">
        <BilingualText value={title} locale={locale} englishClassName="leading-[0.92]" arabicClassName="leading-[1.1]" />
      </h2>
      <div className="max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
        <BilingualText value={description} locale={locale} arabicClassName="leading-8" englishClassName="leading-7" />
      </div>
    </div>
  );
}

export function CarLandingPage({ showBackLink = false }: CarLandingPageProps) {
  const [locale, setLocale] = useState<Locale>("fr");

  return (
    <Shell>
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#08111f]/85 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 md:px-8">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-emerald-300/80">CoinOriginal</p>
            <p className="text-lg font-semibold text-white">{carLandingConfig.brand}</p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
            {localeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setLocale(option.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  locale === option.value
                    ? "bg-emerald-400 text-slate-950"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#avantages">
              <BilingualText value={uiText.navAdvantages} locale={locale} englishClassName="text-sm" arabicClassName="text-sm" />
            </a>
            <a href="#temoignages">
              <BilingualText value={uiText.navTestimonials} locale={locale} englishClassName="text-sm" arabicClassName="text-sm" />
            </a>
            <a href="#faq">
              <BilingualText value={uiText.navFaq} locale={locale} englishClassName="text-sm" arabicClassName="text-sm" />
            </a>
            <a href="#contact">
              <BilingualText value={uiText.navContact} locale={locale} englishClassName="text-sm" arabicClassName="text-sm" />
            </a>
          </div>
          <a
            href={carLandingConfig.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-emerald-300"
          >
            <BilingualText value={uiText.order} locale={locale} englishClassName="text-sm" arabicClassName="text-sm" />
            <ArrowRight className="h-4 w-4" />
          </a>
        </nav>
      </header>

      <main>
        <section className="mx-auto grid min-h-[calc(100vh-81px)] max-w-7xl items-center gap-10 px-5 py-12 pb-28 md:grid-cols-[1.08fr_0.92fr] md:gap-12 md:px-8 md:py-20 md:pb-20">
          <div className="car-fade-up space-y-8">
            <div className="car-fade-up-delay-1 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-cyan-100/85">
              <Sparkles className="h-4 w-4 text-emerald-300" />
              <BilingualText value={uiText.adBadge} locale={locale} englishClassName="text-xs" arabicClassName="text-xs" />
            </div>
            <div className="car-fade-up-delay-2 space-y-5">
              <div className="font-mono text-xs uppercase tracking-[0.36em] text-slate-400">
                <BilingualText value={uiText.heroEyebrow} locale={locale} englishClassName="text-xs" arabicClassName="text-xs" />
              </div>
              <h1 className="max-w-4xl font-[var(--font-display)] text-5xl uppercase leading-[0.9] md:text-7xl">
                <BilingualText
                  value={carLandingConfig.productName}
                  locale={locale}
                  englishClassName="leading-[0.9]"
                  arabicClassName="leading-[1.05]"
                />
              </h1>
              <div className="max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
                <BilingualText value={carLandingConfig.tagline} locale={locale} arabicClassName="leading-9" englishClassName="leading-8" />
              </div>
              <div className="max-w-2xl text-base leading-7 text-slate-400">
                <BilingualText value={uiText.heroDescription} locale={locale} arabicClassName="leading-8" englishClassName="leading-7" />
              </div>
            </div>

            <div className="car-fade-up-delay-3 flex flex-col gap-4 sm:flex-row">
              <a
                href={carLandingConfig.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="car-pulse-glow inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-400 px-8 py-4 text-base font-bold text-slate-950 transition hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(74,222,128,0.28)]"
              >
                <MessageCircle className="h-5 w-5" />
                <BilingualText value={uiText.orderWhatsapp} locale={locale} englishClassName="text-base" arabicClassName="text-base" />
              </a>
              <div className="rounded-2xl border border-cyan-300/20 bg-white/5 px-6 py-4 backdrop-blur">
                <div className="font-mono text-xs uppercase tracking-[0.3em] text-slate-400">
                  <BilingualText value={uiText.currentOffer} locale={locale} englishClassName="text-xs" arabicClassName="text-xs" />
                </div>
                <div className="mt-2 flex items-end gap-3">
                  <span className="text-3xl font-black text-white">{carLandingConfig.currentPriceMad} DH</span>
                  <span className="pb-1 text-sm text-slate-500 line-through">{carLandingConfig.oldPriceMad} DH</span>
                </div>
              </div>
            </div>

            <div className="car-fade-up-delay-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {heroStats.map((stat) => (
                <div key={stat.label.en} className="car-card-pop rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
                  <p className="text-3xl font-black text-cyan-100">{stat.value}</p>
                  <div className="mt-1 text-sm text-slate-400">
                    <BilingualText value={stat.label} locale={locale} englishClassName="text-sm" arabicClassName="text-sm" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                <BilingualText value={uiText.cod} locale={locale} englishClassName="text-sm" arabicClassName="text-sm" />
              </span>
              <span className="inline-flex items-center gap-2">
                <Gauge className="h-4 w-4 text-cyan-300" />
                <BilingualText value={uiText.installFast} locale={locale} englishClassName="text-sm" arabicClassName="text-sm" />
              </span>
            </div>
          </div>

          <div className="car-fade-up-delay-2 relative">
            <div className="absolute inset-x-10 top-10 h-56 rounded-full bg-cyan-400/20 blur-3xl" />
            <div className="car-float relative overflow-hidden rounded-[2rem] border border-cyan-200/15 bg-white/8 p-3 shadow-[0_20px_80px_rgba(2,6,23,0.6)] backdrop-blur md:p-4">
              <img
                src={landingImages.hero}
                alt="Adaptateur CarPlay sans fil mis en scene dans un interieur automobile premium."
                className="h-[360px] w-full rounded-[1.5rem] object-cover sm:h-[420px] md:h-[520px]"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-[1.25rem] border border-white/10 bg-slate-950/70 p-4 backdrop-blur md:inset-x-8 md:bottom-8 md:rounded-[1.5rem] md:p-5">
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-emerald-300">
                  <BilingualText value={uiText.readyRoad} locale={locale} englishClassName="text-[11px]" arabicClassName="text-[11px]" />
                </div>
                <div className="mt-2 text-base text-slate-200">
                  <BilingualText
                    value={carLandingConfig.deliveryMessage}
                    locale={locale}
                    arabicClassName="leading-8"
                    englishClassName="leading-7"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="avantages" className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <SectionTitle
            eyebrow={uiText.benefitsEyebrow}
            title={uiText.benefitsTitle}
            description={uiText.benefitsDescription}
            locale={locale}
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {featureCards.map((feature, index) => {
              const Icon = featureIcons[index];
              return (
                <article
                  key={feature.title.en}
                  className="car-card-pop rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.3)] backdrop-blur transition hover:-translate-y-1 md:p-7"
                >
                  <div className="inline-flex rounded-2xl border border-cyan-200/20 bg-cyan-400/10 p-3 text-cyan-100">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-white">
                    <BilingualText value={feature.title} locale={locale} englishClassName="leading-8" arabicClassName="leading-9" />
                  </h3>
                  <div className="mt-3 text-base leading-7 text-slate-300">
                    <BilingualText value={feature.description} locale={locale} arabicClassName="leading-8" englishClassName="leading-7" />
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="border-y border-white/10 bg-slate-950/30">
          <div className="mx-auto grid max-w-7xl gap-6 px-5 py-16 md:grid-cols-[1.05fr_0.95fr] md:px-8 md:py-24">
            <div className="grid gap-5 sm:grid-cols-2 md:gap-6">
              <img
                src={landingImages.console}
                alt="Branchement de l'adaptateur sur le port USB de la voiture."
                className="car-card-pop h-full min-h-64 w-full rounded-[1.75rem] border border-white/10 object-cover md:min-h-72"
              />
              <div className="grid gap-6">
                <img
                  src={landingImages.chipset}
                  alt="Vue detaillee du chipset de l'adaptateur sans fil."
                  className="car-card-pop min-h-52 w-full rounded-[1.75rem] border border-white/10 object-cover md:min-h-60"
                />
                <img
                  src={landingImages.lifestyle}
                  alt="Cockpit automobile premium de nuit avec interface de navigation active."
                  className="car-card-pop min-h-52 w-full rounded-[1.75rem] border border-white/10 object-cover md:min-h-60"
                />
              </div>
            </div>
            <div className="flex flex-col justify-center space-y-7">
              <SectionTitle
                eyebrow={uiText.cockpitEyebrow}
                title={uiText.cockpitTitle}
                description={uiText.cockpitDescription}
                locale={locale}
              />
              <div className="space-y-4">
                {cockpitHighlights.map((item) => (
                  <div key={item.en} className="car-card-pop flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                    <div className="text-base leading-7 text-slate-200">
                      <BilingualText value={item} locale={locale} arabicClassName="leading-8" englishClassName="leading-7" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-[2rem] border border-cyan-300/15 bg-white/5 p-5 backdrop-blur">
                <div className="font-mono text-xs uppercase tracking-[0.32em] text-cyan-200/70">
                  <BilingualText value={uiText.otherAnglesEyebrow} locale={locale} englishClassName="text-xs" arabicClassName="text-xs" />
                </div>
                <div className="mt-3 text-2xl font-semibold text-white">
                  <BilingualText value={uiText.otherAnglesTitle} locale={locale} englishClassName="leading-8" arabicClassName="leading-9" />
                </div>
                <div className="mt-3 text-sm text-slate-300">
                  <BilingualText value={uiText.otherAnglesDescription} locale={locale} englishClassName="leading-7" arabicClassName="leading-8" />
                </div>
                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <figure className="car-angle-card-left relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-3 shadow-[0_18px_60px_rgba(2,6,23,0.45)]">
                    <img
                      src={landingImages.featureA}
                      alt="Visuel promotionnel CarPlay 2 en 1 avec compatibilite Android Auto et Apple CarPlay."
                      className="h-64 w-full rounded-[1.25rem] object-cover md:h-72"
                    />
                  </figure>
                  <figure className="car-angle-card-right relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-3 shadow-[0_18px_60px_rgba(2,6,23,0.45)]">
                    <img
                      src={landingImages.featureB}
                      alt="Visuel comparatif avant et apres montrant l'utilisation du CarPlay sans fil."
                      className="h-64 w-full rounded-[1.25rem] object-cover md:h-72"
                    />
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="temoignages" className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <SectionTitle
            eyebrow={uiText.proofEyebrow}
            title={uiText.proofTitle}
            description={uiText.proofDescription}
            locale={locale}
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="car-card-pop rounded-[2rem] border border-white/10 bg-white/6 p-7 backdrop-blur">
                <div className="flex gap-1 text-amber-300">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={`${testimonial.name}-${index}`} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <div className="mt-5 text-base leading-7 text-slate-200">
                  <BilingualText value={testimonial.quote} locale={locale} arabicClassName="leading-8" englishClassName="leading-7" />
                </div>
                <div className="mt-6 border-t border-white/10 pt-5">
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-slate-400">{testimonial.city}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="border-y border-white/10 bg-slate-950/35">
          <div className="mx-auto max-w-4xl px-5 py-16 md:px-8 md:py-24">
            <SectionTitle
              eyebrow={uiText.faqEyebrow}
              title={uiText.faqTitle}
              description={uiText.faqDescription}
              locale={locale}
            />
            <div className="mt-10 space-y-4">
              {faqs.map((faq) => (
                <details key={faq.question.en} className="car-card-pop group rounded-[1.5rem] border border-white/10 bg-white/5 p-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-white">
                    <BilingualText value={faq.question} locale={locale} englishClassName="leading-8" arabicClassName="leading-9" />
                    <CircleHelp className="h-5 w-5 shrink-0 text-cyan-200 transition group-open:rotate-12" />
                  </summary>
                  <div className="pt-4 text-base leading-7 text-slate-300">
                    <BilingualText value={faq.answer} locale={locale} arabicClassName="leading-8" englishClassName="leading-7" />
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-24">
          <div className="overflow-hidden rounded-[2.5rem] border border-emerald-300/20 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(37,99,235,0.18),rgba(2,6,23,0.96))] p-8 shadow-[0_25px_80px_rgba(16,185,129,0.14)] md:p-12">
            <div className="font-mono text-xs uppercase tracking-[0.36em] text-emerald-200/85">
              <BilingualText value={uiText.finalEyebrow} locale={locale} englishClassName="text-xs" arabicClassName="text-xs" />
            </div>
            <h2 className="mt-4 max-w-3xl font-[var(--font-display)] text-4xl uppercase leading-[0.92] md:text-6xl">
              <BilingualText value={uiText.finalTitle} locale={locale} englishClassName="leading-[0.92]" arabicClassName="leading-[1.08]" />
            </h2>
            <div className="mt-5 max-w-2xl text-base leading-7 text-slate-200 md:text-lg">
              <BilingualText value={uiText.finalDescription} locale={locale} arabicClassName="leading-8" englishClassName="leading-7" />
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href={carLandingConfig.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-emerald-400 px-8 py-4 text-base font-bold text-slate-950 transition hover:-translate-y-1"
              >
                <MessageCircle className="h-5 w-5" />
                <BilingualText value={uiText.orderAdapter} locale={locale} englishClassName="text-base" arabicClassName="text-base" />
              </a>
              {showBackLink ? (
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:-translate-y-1"
                >
                  <BilingualText value={uiText.backStore} locale={locale} englishClassName="text-base" arabicClassName="text-base" />
                </Link>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <div className="fixed inset-x-3 bottom-3 z-40 md:hidden">
        <div className="rounded-[1.5rem] border border-emerald-300/20 bg-slate-950/88 p-3 shadow-[0_18px_40px_rgba(2,6,23,0.6)] backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-emerald-200/70">
                <BilingualText value={uiText.currentPrice} locale={locale} englishClassName="text-[11px]" arabicClassName="text-[11px]" />
              </div>
              <div className="mt-1 text-2xl font-black text-white">{carLandingConfig.currentPriceMad} DH</div>
            </div>
            <div className="text-right text-xs text-slate-400">
              <BilingualText value={uiText.cod} locale={locale} englishClassName="text-xs" arabicClassName="text-xs" />
            </div>
          </div>
          <a
            href={carLandingConfig.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="car-pulse-glow inline-flex w-full items-center justify-center gap-3 rounded-[1.1rem] bg-emerald-400 px-5 py-3.5 text-sm font-bold text-slate-950"
          >
            <MessageCircle className="h-4 w-4" />
            <BilingualText value={uiText.orderWhatsapp} locale={locale} englishClassName="text-sm" arabicClassName="text-sm" />
          </a>
        </div>
      </div>

      <footer id="contact" className="border-t border-white/10 bg-slate-950/70">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:grid-cols-3 md:px-8">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.32em] text-cyan-200/70">
              <BilingualText value={uiText.supportDirect} locale={locale} englishClassName="text-xs" arabicClassName="text-xs" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-white">{carLandingConfig.brand}</p>
            <div className="mt-4 max-w-sm text-base leading-7 text-slate-400">
              <BilingualText
                value={carLandingConfig.deliveryMessage}
                locale={locale}
                arabicClassName="leading-8"
                englishClassName="leading-7"
              />
            </div>
          </div>
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-slate-400">
              <BilingualText value={uiText.navContact} locale={locale} englishClassName="text-sm" arabicClassName="text-sm" />
            </div>
            <p className="mt-4 text-base text-white">{carLandingConfig.supportPhone}</p>
            <p className="mt-2 text-base text-white">{carLandingConfig.supportEmail}</p>
          </div>
          <div>
            <div className="text-sm uppercase tracking-[0.2em] text-slate-400">
              <BilingualText value={uiText.directLink} locale={locale} englishClassName="text-sm" arabicClassName="text-sm" />
            </div>
            <a
              href={carLandingConfig.whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-base font-semibold text-emerald-300"
            >
              <BilingualText value={uiText.orderWhatsapp} locale={locale} englishClassName="text-base" arabicClassName="text-base" />
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </Shell>
  );
}
