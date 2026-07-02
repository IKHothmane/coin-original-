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

export const partners = ["NIKE", "ADIDAS", "STUSSY", "JORDAN", "SUPREME"];

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
