export type LocalizedText = {
  ar: string;
  en: string;
  fr: string;
};

export const carLandingConfig = {
  brand: "CoinOriginal Drive",
  productName: {
    ar: "محوّل كاربلاي لاسلكي",
    en: "Wireless CarPlay Adapter",
    fr: "Adaptateur CarPlay Sans Fil",
  },
  tagline: {
    ar: "شبكه مرة واحدة واستمتع بقيادة بدون كابل كل يوم.",
    en: "Plug it once and drive cable-free every day.",
    fr: "Branche-le une seule fois et conduis sans cable tous les jours.",
  },
  currentPriceMad: 220,
  oldPriceMad: 450,
  whatsappUrl: "https://wa.me/212750663018?text=Salam%20je%20veux%20commander%20l%27adaptateur%20CarPlay%20sans%20fil",
  supportPhone: "0750663018",
  supportEmail: "contact@coinoriginal.shop",
  deliveryMessage: {
    ar: "توصيل خلال 24 إلى 48 ساعة في جميع أنحاء المغرب مع الدفع عند الاستلام.",
    en: "Delivery within 24 to 48 hours across Morocco with cash on delivery.",
    fr: "Livraison en 24 a 48 heures partout au Maroc avec paiement a la livraison.",
  },
  compatibilityMessage: {
    ar: "متوافق مع السيارات التي تتوفر بالفعل على CarPlay أو Android Auto السلكي.",
    en: "Compatible with cars that already support wired CarPlay or wired Android Auto.",
    fr: "Compatible avec les voitures qui disposent deja de CarPlay ou Android Auto filaire.",
  },
} as const;

export const heroStats = [
  {
    value: "3500+",
    label: {
      ar: "عميل تم خدمته",
      en: "Customers served",
      fr: "Clients servis",
    },
  },
  {
    value: "98%",
    label: {
      ar: "توافق مؤكد",
      en: "Verified compatibility",
      fr: "Compatibilite verifiee",
    },
  },
  {
    value: "10 s",
    label: {
      ar: "متوسط الاتصال",
      en: "Average pairing time",
      fr: "Connexion moyenne",
    },
  },
  {
    value: "24/7",
    label: {
      ar: "دعم سريع",
      en: "Fast support",
      fr: "Support rapide",
    },
  },
] as const;

export const featureCards = [
  {
    title: {
      ar: "اتصال ثابت بتردد 5GHz",
      en: "Stable 5 GHz connection",
      fr: "Connexion 5 GHz stable",
    },
    description: {
      ar: "تشغيل سريع للملاحة وسبوتيفاي والمكالمات بدون انقطاع مع كل تشغيل للسيارة.",
      en: "Fast launch for navigation, Spotify, and calls without dropouts every time you start the car.",
      fr: "Lancement rapide de la navigation, de Spotify et des appels sans coupure a chaque demarrage.",
    },
  },
  {
    title: {
      ar: "إعداد مرة واحدة فقط",
      en: "One-time setup",
      fr: "Installation en une seule fois",
    },
    description: {
      ar: "قم بتوصيل المحول، أجر الاقتران الأول، وبعدها ستعيد السيارة الاتصال بهاتفك تلقائياً.",
      en: "Plug in the adapter, complete the first pairing once, and your car reconnects to your phone automatically.",
      fr: "Branche l'adaptateur, fais le premier appairage, puis la voiture reconnecte automatiquement ton telephone.",
    },
  },
  {
    title: {
      ar: "آبل وأندرويد",
      en: "Apple and Android",
      fr: "Apple et Android",
    },
    description: {
      ar: "يعمل مع Apple CarPlay وAndroid Auto حتى لا تحتاج إلى شراء حلين مختلفين.",
      en: "Works with Apple CarPlay and Android Auto so you do not need two different solutions.",
      fr: "Fonctionne avec Apple CarPlay et Android Auto pour eviter d'acheter deux solutions differentes.",
    },
  },
] as const;

export const cockpitHighlights = [
  {
    ar: "حجم صغير يختفي خلف الكونسول.",
    en: "Compact format that hides neatly behind the console.",
    fr: "Format compact qui se cache facilement derriere la console.",
  },
  {
    ar: "يحافظ على أزرار المقود والشاشة الأصلية.",
    en: "Keeps steering-wheel controls and the original screen fully usable.",
    fr: "Conserve les commandes au volant et l'ecran d'origine.",
  },
  {
    ar: "مثالي للخرائط والموسيقى والمكالمات والرسائل الصوتية.",
    en: "Perfect for maps, music, calls, and voice messages.",
    fr: "Ideal pour les cartes, la musique, les appels et les messages vocaux.",
  },
] as const;

export const testimonials = [
  {
    name: "Youssef B.",
    city: "Casablanca",
    quote: {
      ar: "ركبته في السيارة في أقل من دقيقة، والآن يشتغل CarPlay تلقائياً بدون إخراج الكابل.",
      en: "I installed it in under a minute, and now CarPlay launches automatically without pulling out the cable.",
      fr: "Installe en moins d'une minute, et maintenant CarPlay se lance tout seul sans sortir le cable.",
    },
  },
  {
    name: "Amine K.",
    city: "Marrakech",
    quote: {
      ar: "تواصلت مع الدعم عبر واتساب قبل الطلب، كان الرد سريعاً والمنتج فعلاً ممتاز.",
      en: "I contacted support on WhatsApp before ordering. The reply was fast and the product feels genuinely premium.",
      fr: "J'ai contacte le support sur WhatsApp avant de commander. Reponse rapide et produit vraiment premium.",
    },
  },
  {
    name: "Sanaa M.",
    city: "Rabat",
    quote: {
      ar: "الاتصال فوري، وخرائط جوجل والموسيقى يشتغلان بسلاسة. منتج عملي جداً.",
      en: "The connection is instant, Google Maps and music stay smooth. It is honestly very practical.",
      fr: "La connexion est immediate, Google Maps et la musique restent fluides. Franchement tres pratique.",
    },
  },
] as const;

export const faqs = [
  {
    question: {
      ar: "هل هو متوافق مع سيارتي؟",
      en: "Is it compatible with my car?",
      fr: "Est-ce compatible avec ma voiture ?",
    },
    answer: carLandingConfig.compatibilityMessage,
  },
  {
    question: {
      ar: "هل توجد استجابة متأخرة أو بطء؟",
      en: "Is there any delay or latency?",
      fr: "Y a-t-il un delai ou une latence ?",
    },
    answer: {
      ar: "تعطي الشريحة اللاسلكية أولوية لاتصال سريع وثابت ليبقى الإحساس قريباً جداً من الاتصال السلكي.",
      en: "The wireless chip prioritizes a fast and stable connection so the experience stays very close to wired mode.",
      fr: "La puce sans fil privilegie une connexion rapide et stable pour garder une sensation tres proche du mode filaire.",
    },
  },
  {
    question: {
      ar: "كيف يتم التوصيل؟",
      en: "How does delivery work?",
      fr: "Comment se passe la livraison ?",
    },
    answer: carLandingConfig.deliveryMessage,
  },
] as const;

export const landingImages = {
  hero: "/car-landing/hero.jpeg",
  console: "/car-landing/console.jpeg",
  lifestyle: "/car-landing/lifestyle.jpeg",
  chipset: "/car-landing/chipset.jpeg",
  featureA: "/car-landing/a.jpeg",
  featureB: "/car-landing/b.jpeg",
} as const;
