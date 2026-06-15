export type FeaturedProduct = {
  name: string;
  description: string;
  price: string;
  badge: string;
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

export const featuredProducts: FeaturedProduct[] = [
  {
    name: "Retro High OG",
    description: 'Edition limitee "Cloud"',
    price: "1,200 DH",
    badge: "New",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC7_om9JluK_wVuiNzE0zvnNM_vn8sWrs6hhWljXnsBmN1hycfhmtoAhE67-8Ce2QGGsW8aCLNIY0Dff66n1fpeg13gf_DMHECNYI7sa_OE_ccLVyw9rveIDy-JaociaTFg6w6ZCylFplZp4t3tm1rZ8nF1ej-_-3lK4FljDDNdZtXjsKX1CpsBjeptvEpr6M2tnvsUoI4xfJXpWYiPHqSDg51PWjezNTym6lrbSXZATTQv3S20gd0tjP5PqsBxohrcWiBjup9Jgw",
  },
  {
    name: "Heavy Box Hoodie",
    description: "Coton biologique 400GSM - Noir",
    price: "450 DH",
    badge: "",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDC11f4yEjEiMiNaIAhVO6u3ekZ4xHaToYALHbMgeQdqh--ZHgu0kNsQG4aCElDnT2Jcw5I9J4hSzAI5oI9QWO6TjUidy-FcNpo_5OdNp2siRQpxcQ0KWaDzM0zebu00NS7AwDvKUvKPLbtvEfqK79evxEq2sOiCj4AnOoT10SpxbUpPeJ378DgZAFxAKjqMgD-LoOTq0RHRHV7naq5z3DL9BEzdzwHH1MM4V1kYqfhkiaWp2o1XLhYWjuxitKNPiz85ebB0cm5bA",
  },
  {
    name: "Speed Volt Runner",
    description: "Technologie React Pro semelle intermediaire",
    price: "1,450 DH",
    badge: "",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAcFk5YwZQFLy5NpkSSAhIxIEMhh-ojCzJ2LCUwnWoDvaeRwqFZn5x_OoAaBbpdlZ38UjKr2IfKtbjuRfC_ZYUmXzpF91_5Dw8_sNiUoMCl0MDiDxjg2LhSfMYA-hrh8_m3ynpMfWwh6mQEbF62QAd_ZF5Xh5YG_qPKJdavjZ32wTildYnCzZWv29FQl_3EFamupW5EBOakZAgYrR4Ce0oHXMQLHqiUUtHJhV2I5AByavtx9gorrftW4LcXDLDTTz6uv6Tx9-zQbg",
  },
  {
    name: "Earth Suede Low",
    description: "Construction premium en suede",
    price: "850 DH",
    badge: "Sale",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2N9LdLoBFCM0pYhLrw5afno0Yrw5kPD3AOWhgjl-uqCkn06105BONkbeFvoJo0TjiuIkdM2cLaEv4Yk22wvT9Rpkd2fRN69bp8OdmcfK4DAGYSMEVizGstGIiM_TxXf5A2k2uB5ZjoiET_HhVSf0ES2BqO-8B3AnVbeLSTDmjV4Xss8sKr8P199-INm-PW1lkRXXhcfFXA5jAoW8MKoA80BnpGoQ8OzK3_XEgkCozm7InCMX4k3cLGli11IPiPXigrjayO0yeSQ",
  },
];

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
    title: "Sneakers",
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
