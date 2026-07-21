export type FeaturedProduct = {
  slug: string;
  name: string;
  description: string;
  price: string;
  compareAtPrice?: string;
  badge?: string;
  badgeTone?: string;
  image: string;
};

export type TrustItem = {
  title: string;
  text: string;
};

export type CategoryItem = {
  title: string;
  image: string;
  span: string;
};

export type PartnerBrand = {
  slug: string;
  name: string;
  wordmark: string;
  logoUrl?: string;
  tone: "light" | "box" | "accent";
  style:
    | "sport"
    | "wide"
    | "script"
    | "tight"
    | "box"
    | "mono"
    | "heritage"
    | "trail";
};

export const partners: PartnerBrand[] = [
  { slug: "nike", name: "Nike", wordmark: "NIKE", logoUrl: "https://cdn.simpleicons.org/nike/000000", tone: "light", style: "sport" },
  { slug: "adidas", name: "Adidas", wordmark: "ADIDAS", logoUrl: "https://cdn.simpleicons.org/adidas/000000", tone: "light", style: "wide" },
  { slug: "new-balance", name: "New Balance", wordmark: "NEW BALANCE", logoUrl: "https://cdn.simpleicons.org/newbalance/000000", tone: "light", style: "tight" },
  { slug: "puma", name: "Puma", wordmark: "PUMA", logoUrl: "https://cdn.simpleicons.org/puma/000000", tone: "light", style: "sport" },
  { slug: "converse", name: "Converse", wordmark: "CONVERSE", logoUrl: "https://cdn.simpleicons.org/converse/000000", tone: "light", style: "heritage" },
  { slug: "vans", name: "Vans", wordmark: "VANS", logoUrl: "https://cdn.simpleicons.org/vans/000000", tone: "light", style: "wide" },
  { slug: "carhartt-wip", name: "Carhartt WIP", wordmark: "CARHARTT WIP", logoUrl: "https://cdn.simpleicons.org/carhartt/000000", tone: "light", style: "heritage" },
  { slug: "north-face", name: "The North Face", wordmark: "THE NORTH FACE", logoUrl: "https://cdn.simpleicons.org/thenorthface/000000", tone: "light", style: "trail" },
  { slug: "asics", name: "Asics", wordmark: "ASICS", logoUrl: "https://cdn.simpleicons.org/asics/000000", tone: "light", style: "sport" },
  { slug: "salomon", name: "Salomon", wordmark: "SALOMON", tone: "light", style: "trail" },
];

export const partnersLoop = [...partners, ...partners];

export const featuredProducts: FeaturedProduct[] = [];

export const trustItems: TrustItem[] = [
  {
    title: "Livraison Rapide",
    text: "Livraison sous 24h a 48h dans les grandes villes du Royaume.",
  },
  {
    title: "Qualite Certifiee",
    text: "Tous les produits sont verifies avant expedition.",
  },
  {
    title: "Support WhatsApp",
    text: "Une reponse rapide pour les tailles, les commandes et le suivi.",
  },
];

export const categories: CategoryItem[] = [
  {
    title: "Chaussures",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBibpDoBwZcwTGHNiw9BrUiaC067E45J5Ip6ZaCM_PrcYwCAUfUY6sRyv0THOskpax4U6jauQ1OhpdewSIyd4IdX1qhlusEjiUglc8Pcokrup_AbeUakCJgDW9A2WYcdXhuGSyJr5bapd31_hPj-CcfWpMM0ZQH-QYlv5NtC_KY2FZxMxMGgnUWxmf00kLZf9kFSG4EfO8g0CEbBEJ245u-tLzMLrbUhPOZe-xiuu_BK5mYvugk6myK3y9__YwRoVaEyoOFDzRpNA",
    span: "col-span-2 md:col-span-2 md:row-span-2",
  },
  {
    title: "Vetements",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuADO7J8ATz-jsmWyPEOJ3TQGnxQqbNsQTYolUDisEIcJoW0NpNXU0JKQ-zk2eUqqwLhE78eL9x8QhO3KGtapvWQdAL0oINLoscId9q9OBs9gfvh6-NEjfoLz8fggSCOhncxL8vNpitoHakOQK_TeQXKX2VTKFUdPITFYtmJuLFBuRdWqSKqR3RiH1t8YdYkKi_wTg2QIhTysc5pThFRBpFFKGo7FDR_JRAngSVnwQ6YhlqHanho0kxD5CTGj5HzTiREvywxcL0DAQ",
    span: "col-span-1 md:col-span-2",
  },
  {
    title: "Accessoires",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAZ_oFVbvyOnR6Zz54SnZUIWudThaGHnBL9QFL7A_jU2uxg3BIv0oEfLqcHYBflf4kjIIH2WnP6Gfmm7Pq0AO-uWqu3Vlg1nNkg_A2kW1LCN7Wpp4w_PqCyPaNbqkvB8efs-8aQ_BxcXjR_429rr3UFD2DqHZZwiameaA-595EKvuQxYFUgexulzeWEdo-wT7S2ag2VOPAd6rYzadI8G-RYtTyxGBChsqTJZHpMluDBurZPnQcb2vgtx8ix6FU_4r0jmKtCdAxDAA",
    span: "col-span-1 md:col-span-1",
  },
];

/* ---------------------------------------------------------------- */
/* Donnees de la nouvelle page d'accueil (style reference)           */
/* ---------------------------------------------------------------- */

export type HeroSlide = {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  description: string;
  ctaHref: string;
  image: string;
  imageAlt: string;
};

export const heroSlides: HeroSlide[] = [
  {
    eyebrow: "Nouvelle collection",
    titleTop: "Retro High",
    titleAccent: "OG Edition",
    description: "Style legendaire. Confort ultime. Affirme ton style avec Coin Original.",
    ctaHref: "/produit/retro-high-og",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC7_om9JluK_wVuiNzE0zvnNM_vn8sWrs6hhWljXnsBmN1hycfhmtoAhE67-8Ce2QGGsW8aCLNIY0Dff66n1fpeg13gf_DMHECNYI7sa_OE_ccLVyw9rveIDy-JaociaTFg6w6ZCylFplZp4t3tm1rZ8nF1ej-_-3lK4FljDDNdZtXjsKX1CpsBjeptvEpr6M2tnvsUoI4xfJXpWYiPHqSDg51PWjezNTym6lrbSXZATTQv3S20gd0tjP5PqsBxohrcWiBjup9Jgw",
    imageAlt: "Retro High OG",
  },
  {
    eyebrow: "Drop exclusif",
    titleTop: "Speed Volt",
    titleAccent: "Runner",
    description: "Basket technique premium, silhouette urbaine pensee pour le quotidien.",
    ctaHref: "/produit/speed-volt-runner",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDScsdk0dK2EmEEl06JHtgQ9NNce_Kidj6G_RDdz82v-GkaxD4itk5Vw350GCuluidbTuaVKI7GWT80sByRRumZFIAJ2WQijMBUutAj3CuQPj-vH_6C3e6sRVaCLThyIejcr19kq0Y5m9Wnj_qfUIhzUhwlw-DxbdutTAU9tr9ZuSXLLqKuOyHby-em-wGS_2-AEk1MKk8FpA_PU_VHCcPPczh6Nyb0otYdkVoflioU7bmk3R0J1TbQc4Fq3jyNuRkxxSAEawfodA",
    imageAlt: "Speed Volt Runner",
  },
  {
    eyebrow: "Streetwear premium",
    titleTop: "Heavy Box",
    titleAccent: "Hoodie",
    description: "Coton biologique 400GSM. Le hoodie lourd qui tient chaud avec style.",
    ctaHref: "/produit/heavy-box-hoodie",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDC11f4yEjEiMiNaIAhVO6u3ekZ4xHaToYALHbMgeQdqh--ZHgu0kNsQG4aCElDnT2Jcw5I9J4hSzAI5oI9QWO6TjUidy-FcNpo_5OdNp2siRQpxcQ0KWaDzM0zebu00NS7AwDvKUvKPLbtvEfqK79evxEq2sOiCj4AnOoT10SpxbUpPeJ378DgZAFxAKjqMgD-LoOTq0RHRHV7naq5z3DL9BEzdzwHH1MM4V1kYqfhkiaWp2o1XLhYWjuxitKNPiz85ebB0cm5bA",
    imageAlt: "Heavy Box Hoodie",
  },
];

export type HomeCategory = {
  title: string;
  image: string;
  href: string;
};

export const homeCategories: HomeCategory[] = [
  {
    title: "Chaussures",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC7_om9JluK_wVuiNzE0zvnNM_vn8sWrs6hhWljXnsBmN1hycfhmtoAhE67-8Ce2QGGsW8aCLNIY0Dff66n1fpeg13gf_DMHECNYI7sa_OE_ccLVyw9rveIDy-JaociaTFg6w6ZCylFplZp4t3tm1rZ8nF1ej-_-3lK4FljDDNdZtXjsKX1CpsBjeptvEpr6M2tnvsUoI4xfJXpWYiPHqSDg51PWjezNTym6lrbSXZATTQv3S20gd0tjP5PqsBxohrcWiBjup9Jgw",
    href: "/boutique?category=Chaussures",
  },
  {
    title: "Vetements",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDC11f4yEjEiMiNaIAhVO6u3ekZ4xHaToYALHbMgeQdqh--ZHgu0kNsQG4aCElDnT2Jcw5I9J4hSzAI5oI9QWO6TjUidy-FcNpo_5OdNp2siRQpxcQ0KWaDzM0zebu00NS7AwDvKUvKPLbtvEfqK79evxEq2sOiCj4AnOoT10SpxbUpPeJ378DgZAFxAKjqMgD-LoOTq0RHRHV7naq5z3DL9BEzdzwHH1MM4V1kYqfhkiaWp2o1XLhYWjuxitKNPiz85ebB0cm5bA",
    href: "/boutique?category=Vetements",
  },
  {
    title: "Baskets",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDScsdk0dK2EmEEl06JHtgQ9NNce_Kidj6G_RDdz82v-GkaxD4itk5Vw350GCuluidbTuaVKI7GWT80sByRRumZFIAJ2WQijMBUutAj3CuQPj-vH_6C3e6sRVaCLThyIejcr19kq0Y5m9Wnj_qfUIhzUhwlw-DxbdutTAU9tr9ZuSXLLqKuOyHby-em-wGS_2-AEk1MKk8FpA_PU_VHCcPPczh6Nyb0otYdkVoflioU7bmk3R0J1TbQc4Fq3jyNuRkxxSAEawfodA",
    href: "/boutique?category=Chaussures",
  },
  {
    title: "T-shirts",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjzZg34_S4gLJUHWLDRhArJWhjznEJb57-t_MjLdC_76AbtGYm8aYwdSOZzCvqBC7bPk6HFE33NttZM3YD7pqg0CQ10QhbdC3EVy5Wm26G0MSdTMRf9SwS8dQfpEHYronRzhfGSv2Oei6hl0k4UPd7thq_6ZQEy7eaVtHfQfLtg7ogotUmVsHamsXmyrlHW0JIA7tNSLaQ4uY33wxs7_0PMWHuxo4HClxPvf_K5DBnCuVWSI5rwa_mON8b2pRXFNKsbuFvwAhRlw",
    href: "/boutique?category=Vetements",
  },
  {
    title: "Vestes",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCz7nWWSUSuOqGPVCuVuwlKBKqVI9MzzlYqDmk7fEUFxgZW3DQnQQLiDYCkGHKNAYn7lZfI50v_pgst3VYBw4n6vE8RV8xpsTMwiBMxw-q5yF7Mxtu1BnExoXQO9I2cre7Md8P9O8tHwuwYSQu0mcw9B7f3AC91GFplQ7MXl0ygnutiuCwxD0lYAkuov6t5bDQCyKNPfjlwpN-MzNzBY2eUT6TdROMEwwYVFscNV00De4HFxIYieesvFu1Ajs1f4FLBF0MkDeKItg",
    href: "/boutique?category=Vetements",
  },
  {
    title: "Accessoires",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD4_rJthmolHaMi-cYnWY3RGWjSwmb709tFxb1PNSH9uguSUlK-xbQ5zB-goIrER19AR6VBybizdQ6x4h6ZA8UK2HWVeW8Ep3BCMmAK6p7Eh-uLChipFH-Gn9B6GG1Jyjnql3KlkMIOPsyH1yOdn25QyjsqoWN06Lv3UNJOaX1nE82SpVVpRb4eTfNPdyxqJXZvuW0hONH1hXd65s9ZFHOFLSZP4kTpsxHFC9it_r-k02bFspi9VokBggvFJDQcuJY6mW0AbwLOVQ",
    href: "/boutique?category=Accessoires",
  },
];

export type FeatureItem = {
  icon: "truck" | "payment" | "shield" | "returns";
  titleKey: string;
  subKey: string;
};

export const featureItems: FeatureItem[] = [
  { icon: "truck", titleKey: "features.livraison", subKey: "features.livraison_sub" },
  { icon: "payment", titleKey: "features.paiement", subKey: "features.paiement_sub" },
  { icon: "shield", titleKey: "features.authentique", subKey: "features.authentique_sub" },
  { icon: "returns", titleKey: "features.retours", subKey: "features.retours_sub" },
];

/** Notes statiques affichees sur les cartes "Produits populaires". */
export const popularRatings: Record<string, { rating: string; count: number }> = {
  "retro-high-og": { rating: "4.8", count: 128 },
  "speed-volt-runner": { rating: "4.7", count: 96 },
  "earth-suede-low": { rating: "4.6", count: 74 },
  "heavy-box-hoodie": { rating: "4.5", count: 58 },
  "volta-sneakers": { rating: "4.6", count: 81 },
  "iconic-leather": { rating: "4.7", count: 64 },
};
