export type ProductBadgeTone = "primary" | "tertiary" | "error";

export type CatalogProduct = {
  slug: string;
  brand: string;
  category: string;
  name: string;
  price: string;
  compareAtPrice?: string;
  description: string;
  badge?: {
    label: string;
    tone: ProductBadgeTone;
  };
  image: string;
  gallery: {
    src: string;
    alt: string;
  }[];
  sizes: string[];
  soldOut?: boolean;
  authenticityLabel?: string;
  deliveryLabel?: string;
  deliveryRegion?: string;
};

export const catalogProducts: CatalogProduct[] = [
  {
    slug: "retro-high-og",
    brand: "Original Drop",
    category: "Chaussures",
    name: "Retro High OG",
    price: "1,200 DH",
    compareAtPrice: "1,550 DH",
    description: 'Edition limitee "Cloud"',
    badge: { label: "New", tone: "primary" },
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC7_om9JluK_wVuiNzE0zvnNM_vn8sWrs6hhWljXnsBmN1hycfhmtoAhE67-8Ce2QGGsW8aCLNIY0Dff66n1fpeg13gf_DMHECNYI7sa_OE_ccLVyw9rveIDy-JaociaTFg6w6ZCylFplZp4t3tm1rZ8nF1ej-_-3lK4FljDDNdZtXjsKX1CpsBjeptvEpr6M2tnvsUoI4xfJXpWYiPHqSDg51PWjezNTym6lrbSXZATTQv3S20gd0tjP5PqsBxohrcWiBjup9Jgw",
    gallery: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC7_om9JluK_wVuiNzE0zvnNM_vn8sWrs6hhWljXnsBmN1hycfhmtoAhE67-8Ce2QGGsW8aCLNIY0Dff66n1fpeg13gf_DMHECNYI7sa_OE_ccLVyw9rveIDy-JaociaTFg6w6ZCylFplZp4t3tm1rZ8nF1ej-_-3lK4FljDDNdZtXjsKX1CpsBjeptvEpr6M2tnvsUoI4xfJXpWYiPHqSDg51PWjezNTym6lrbSXZATTQv3S20gd0tjP5PqsBxohrcWiBjup9Jgw",
        alt: "Retro High OG vue principale",
      },
    ],
    sizes: ["40", "41", "42", "43", "44"],
    authenticityLabel: "Original Authentique",
    deliveryLabel: "LIVRAISON GRATUITE",
    deliveryRegion: "AU MAROC",
  },
  {
    slug: "heavy-box-hoodie",
    brand: "Original Drop",
    category: "Vetements",
    name: "Heavy Box Hoodie",
    price: "450 DH",
    compareAtPrice: "590 DH",
    description: "Coton biologique 400GSM - Noir",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDC11f4yEjEiMiNaIAhVO6u3ekZ4xHaToYALHbMgeQdqh--ZHgu0kNsQG4aCElDnT2Jcw5I9J4hSzAI5oI9QWO6TjUidy-FcNpo_5OdNp2siRQpxcQ0KWaDzM0zebu00NS7AwDvKUvKPLbtvEfqK79evxEq2sOiCj4AnOoT10SpxbUpPeJ378DgZAFxAKjqMgD-LoOTq0RHRHV7naq5z3DL9BEzdzwHH1MM4V1kYqfhkiaWp2o1XLhYWjuxitKNPiz85ebB0cm5bA",
    gallery: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDC11f4yEjEiMiNaIAhVO6u3ekZ4xHaToYALHbMgeQdqh--ZHgu0kNsQG4aCElDnT2Jcw5I9J4hSzAI5oI9QWO6TjUidy-FcNpo_5OdNp2siRQpxcQ0KWaDzM0zebu00NS7AwDvKUvKPLbtvEfqK79evxEq2sOiCj4AnOoT10SpxbUpPeJ378DgZAFxAKjqMgD-LoOTq0RHRHV7naq5z3DL9BEzdzwHH1MM4V1kYqfhkiaWp2o1XLhYWjuxitKNPiz85ebB0cm5bA",
        alt: "Heavy Box Hoodie vue principale",
      },
    ],
    sizes: ["S", "M", "L", "XL"],
    authenticityLabel: "Drop Premium",
    deliveryLabel: "PAIEMENT A LA LIVRAISON",
    deliveryRegion: "MAROC",
  },
  {
    slug: "speed-volt-runner",
    brand: "Original Drop",
    category: "Chaussures",
    name: "Speed Volt Runner",
    price: "1,450 DH",
    compareAtPrice: "1,799 DH",
    description:
      "Basket technique avec finition premium, maintien confortable et silhouette urbaine pensee pour le quotidien.",
    badge: { label: "New Drop", tone: "primary" },
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDScsdk0dK2EmEEl06JHtgQ9NNce_Kidj6G_RDdz82v-GkaxD4itk5Vw350GCuluidbTuaVKI7GWT80sByRRumZFIAJ2WQijMBUutAj3CuQPj-vH_6C3e6sRVaCLThyIejcr19kq0Y5m9Wnj_qfUIhzUhwlw-DxbdutTAU9tr9ZuSXLLqKuOyHby-em-wGS_2-AEk1MKk8FpA_PU_VHCcPPczh6Nyb0otYdkVoflioU7bmk3R0J1TbQc4Fq3jyNuRkxxSAEawfodA",
    gallery: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDScsdk0dK2EmEEl06JHtgQ9NNce_Kidj6G_RDdz82v-GkaxD4itk5Vw350GCuluidbTuaVKI7GWT80sByRRumZFIAJ2WQijMBUutAj3CuQPj-vH_6C3e6sRVaCLThyIejcr19kq0Y5m9Wnj_qfUIhzUhwlw-DxbdutTAU9tr9ZuSXLLqKuOyHby-em-wGS_2-AEk1MKk8FpA_PU_VHCcPPczh6Nyb0otYdkVoflioU7bmk3R0J1TbQc4Fq3jyNuRkxxSAEawfodA",
        alt: "Speed Volt Runner vue principale",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWf8WJc5tG9d46BJwTMO9eZJ8cljK2-laGgZzjnK6yZkQCJX9fZkn3Ivy8hLNllBarVE6jl3tKbnvwJgCDvUAI2a4x3aYSzLxLZbgUFJQtCImCQwGwCmyMbEQ6eLZ1R-PG2GH5QpN0OcV4kT9rg92e4toltq7BTEZYSGDW1C0g9K3lig1daWjbL1dCTfDSld35Y_2gzhGuoPQrePWAAbFMD1XH_TKZIS5EXmSSY_q_CzYPc-JuiR5Ue5ywHdsQt652pwhO2pRzVw",
        alt: "Speed Volt Runner profil lateral",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD0Did9d1T-Tb6I9b1J4URE6QVnrRyDrqzsJvLLUgxN8xDGknxenb1nfUcBc91AelBXpDa_U4EBT0NoIDYywK5mGUpnPsSS2IeiJ57LSXeWdxosYqEeV0w88O4kXXl6vBcFwL3TWd3zuUTPXuGLnAYsTt5NHv7APKwvjtcUMibRw2ZGJUl_pxCjz6tAwBADzeqJTmHy8e_dPqhZFkhyAyMbGXQ_3HbSza-WxypHMKs73VzYduezFtKTzfKX8AwsUrAXSoqD7LL9Mg",
        alt: "Speed Volt Runner vue arriere",
      },
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAT6eGoEatUsMRZJksTa6H50avOZdWz8SdGtbHnvaE9xRYNzJP9Bdt_kZBKDr1zrmcSk4m2W7aQ3dJ-uFw9Gs-ZFfvy7LxYqAE0qAEt7qDqygpwCupEk43zw_K49tRXJM_U5-i9Fvx-XmJAydQe6lc5t8AGFHxYdQr9XJGs6EmkoOnssctqQ5P4T51PWbYUAwfScdcUbZCzfV6mLBxp09qQ5Yt7mlVu5ERm1NeLzyD033F5_1V5bPjLNP6V5qWRBsWnqQpomeuj0Q",
        alt: "Speed Volt Runner detail semelle",
      },
    ],
    sizes: ["40", "41", "42", "43", "44", "45"],
    authenticityLabel: "Original Authentique",
    deliveryLabel: "LIVRAISON GRATUITE",
    deliveryRegion: "AU MAROC",
  },
  {
    slug: "earth-suede-low",
    brand: "Original Drop",
    category: "Chaussures",
    name: "Earth Suede Low",
    price: "850 DH",
    compareAtPrice: "1,050 DH",
    description: "Construction premium en suede",
    badge: { label: "Sale", tone: "tertiary" },
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC2N9LdLoBFCM0pYhLrw5afno0Yrw5kPD3AOWhgjl-uqCkn06105BONkbeFvoJo0TjiuIkdM2cLaEv4Yk22wvT9Rpkd2fRN69bp8OdmcfK4DAGYSMEVizGstGIiM_TxXf5A2k2uB5ZjoiET_HhVSf0ES2BqO-8B3AnVbeLSTDmjV4Xss8sKr8P199-INm-PW1lkRXXhcfFXA5jAoW8MKoA80BnpGoQ8OzK3_XEgkCozm7InCMX4k3cLGli11IPiPXigrjayO0yeSQ",
    gallery: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2N9LdLoBFCM0pYhLrw5afno0Yrw5kPD3AOWhgjl-uqCkn06105BONkbeFvoJo0TjiuIkdM2cLaEv4Yk22wvT9Rpkd2fRN69bp8OdmcfK4DAGYSMEVizGstGIiM_TxXf5A2k2uB5ZjoiET_HhVSf0ES2BqO-8B3AnVbeLSTDmjV4Xss8sKr8P199-INm-PW1lkRXXhcfFXA5jAoW8MKoA80BnpGoQ8OzK3_XEgkCozm7InCMX4k3cLGli11IPiPXigrjayO0yeSQ",
        alt: "Earth Suede Low vue principale",
      },
    ],
    sizes: ["40", "41", "42", "43", "44"],
    authenticityLabel: "Selection Premium",
    deliveryLabel: "PAIEMENT A LA LIVRAISON",
    deliveryRegion: "MAROC",
  },
  {
    slug: "nomad-tee",
    brand: "Atlas Street",
    category: "Vetements",
    name: "Nomad Tee",
    price: "250 MAD",
    description: "T-shirt street coupe relaxed pour les looks de tous les jours.",
    badge: { label: "Limited", tone: "tertiary" },
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjzZg34_S4gLJUHWLDRhArJWhjznEJb57-t_MjLdC_76AbtGYm8aYwdSOZzCvqBC7bPk6HFE33NttZM3YD7pqg0CQ10QhbdC3EVy5Wm26G0MSdTMRf9SwS8dQfpEHYronRzhfGSv2Oei6hl0k4UPd7thq_6ZQEy7eaVtHfQfLtg7ogotUmVsHamsXmyrlHW0JIA7tNSLaQ4uY33wxs7_0PMWHuxo4HClxPvf_K5DBnCuVWSI5rwa_mON8b2pRXFNKsbuFvwAhRlw",
    gallery: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBjzZg34_S4gLJUHWLDRhArJWhjznEJb57-t_MjLdC_76AbtGYm8aYwdSOZzCvqBC7bPk6HFE33NttZM3YD7pqg0CQ10QhbdC3EVy5Wm26G0MSdTMRf9SwS8dQfpEHYronRzhfGSv2Oei6hl0k4UPd7thq_6ZQEy7eaVtHfQfLtg7ogotUmVsHamsXmyrlHW0JIA7tNSLaQ4uY33wxs7_0PMWHuxo4HClxPvf_K5DBnCuVWSI5rwa_mON8b2pRXFNKsbuFvwAhRlw",
        alt: "Nomad Tee vue principale",
      },
    ],
    sizes: ["M", "L", "XL"],
  },
  {
    slug: "tactical-jacket",
    brand: "Neo-Medina",
    category: "Vetements",
    name: "Tactical Jacket",
    price: "890 MAD",
    description: "Veste technique legere avec coupe urbaine et details fonctionnels.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCz7nWWSUSuOqGPVCuVuwlKBKqVI9MzzlYqDmk7fEUFxgZW3DQnQQLiDYCkGHKNAYn7lZfI50v_pgst3VYBw4n6vE8RV8xpsTMwiBMxw-q5yF7Mxtu1BnExoXQO9I2cre7Md8P9O8tHwuwYSQu0mcw9B7f3AC91GFplQ7MXl0ygnutiuCwxD0lYAkuov6t5bDQCyKNPfjlwpN-MzNzBY2eUT6TdROMEwwYVFscNV00De4HFxIYieesvFu1Ajs1f4FLBF0MkDeKItg",
    gallery: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCz7nWWSUSuOqGPVCuVuwlKBKqVI9MzzlYqDmk7fEUFxgZW3DQnQQLiDYCkGHKNAYn7lZfI50v_pgst3VYBw4n6vE8RV8xpsTMwiBMxw-q5yF7Mxtu1BnExoXQO9I2cre7Md8P9O8tHwuwYSQu0mcw9B7f3AC91GFplQ7MXl0ygnutiuCwxD0lYAkuov6t5bDQCyKNPfjlwpN-MzNzBY2eUT6TdROMEwwYVFscNV00De4HFxIYieesvFu1Ajs1f4FLBF0MkDeKItg",
        alt: "Tactical Jacket vue principale",
      },
    ],
    sizes: ["S", "L"],
  },
  {
    slug: "volta-sneakers",
    brand: "Original Drop",
    category: "Chaussures",
    name: "Volta Chaussures",
    price: "1200 MAD",
    description: "Chaussures sobres et sportives pour une silhouette street moderne.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAuT8hkhoeT1EZkhRkMWQK_NSyzfMydpxVg6zfmQj3XYXZTu9i10jPPSNqFlJM_lY3rS8ppWyXld0CJ82Aq5TyH6_eF06dAzNbs617HDrzpeb3DqyLpY_SlsBaKqbS4ECS7TWv8gLeGZpqKSKKK5t7iZm0U897J0nPJ2o1dHnGT9maP6XbZiibHSCXzINl4UJxoned2a5jc7ogjysOMGxvZVTp160H6MJpKu2xWIW0-rTqxnB29JQ1kmzt0MqQ6ueIDgZ3NKKJRmQ",
    gallery: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuT8hkhoeT1EZkhRkMWQK_NSyzfMydpxVg6zfmQj3XYXZTu9i10jPPSNqFlJM_lY3rS8ppWyXld0CJ82Aq5TyH6_eF06dAzNbs617HDrzpeb3DqyLpY_SlsBaKqbS4ECS7TWv8gLeGZpqKSKKK5t7iZm0U897J0nPJ2o1dHnGT9maP6XbZiibHSCXzINl4UJxoned2a5jc7ogjysOMGxvZVTp160H6MJpKu2xWIW0-rTqxnB29JQ1kmzt0MqQ6ueIDgZ3NKKJRmQ",
        alt: "Volta Chaussures vue principale",
      },
    ],
    sizes: ["40", "42", "44"],
  },
  {
    slug: "essential-pack",
    brand: "Casablanca City",
    category: "Accessoires",
    name: "Essential Pack",
    price: "650 MAD",
    description: "Pack lifestyle avec esprit street, pratique pour les sorties urbaines.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD4_rJthmolHaMi-cYnWY3RGWjSwmb709tFxb1PNSH9uguSUlK-xbQ5zB-goIrER19AR6VBybizdQ6x4h6ZA8UK2HWVeW8Ep3BCMmAK6p7Eh-uLChipFH-Gn9B6GG1Jyjnql3KlkMIOPsyH1yOdn25QyjsqoWN06Lv3UNJOaX1nE82SpVVpRb4eTfNPdyxqJXZvuW0hONH1hXd65s9ZFHOFLSZP4kTpsxHFC9it_r-k02bFspi9VokBggvFJDQcuJY6mW0AbwLOVQ",
    gallery: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4_rJthmolHaMi-cYnWY3RGWjSwmb709tFxb1PNSH9uguSUlK-xbQ5zB-goIrER19AR6VBybizdQ6x4h6ZA8UK2HWVeW8Ep3BCMmAK6p7Eh-uLChipFH-Gn9B6GG1Jyjnql3KlkMIOPsyH1yOdn25QyjsqoWN06Lv3UNJOaX1nE82SpVVpRb4eTfNPdyxqJXZvuW0hONH1hXd65s9ZFHOFLSZP4kTpsxHFC9it_r-k02bFspi9VokBggvFJDQcuJY6mW0AbwLOVQ",
        alt: "Essential Pack vue principale",
      },
    ],
    sizes: ["S", "M", "XL"],
  },
  {
    slug: "iconic-leather",
    brand: "Original Drop",
    category: "Chaussures",
    name: "Iconic Leather",
    price: "1500 MAD",
    description: "Modele premium en cuir avec finition clean et volume retro.",
    badge: { label: "Sold Out", tone: "error" },
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD-6pNLxJ63BYDu-LRWOAPwS5VklXBz_BlPkcC2XK7ZGwrU9yAI16QgxcHfMXhr8uWPpE5_3SMbUwJsrW1PZ88jQP7ETa42C7cr_TT_KarA2tX6ePKoeYLOpwxCwiEJ0nEOJ2zBUJfVZ0YyyHpvMoKqArMWww1hwFiN1UFQ7MtvdjpEkpXhfYPlYRJ7Kasf5g3BV53E9BE6qU7V10ORpfPxnwhS-VYWQWKNhBa21rCi5gzkULp8Nua2MUlg02IIFx4s4arsoAfUMw",
    gallery: [
      {
        src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD-6pNLxJ63BYDu-LRWOAPwS5VklXBz_BlPkcC2XK7ZGwrU9yAI16QgxcHfMXhr8uWPpE5_3SMbUwJsrW1PZ88jQP7ETa42C7cr_TT_KarA2tX6ePKoeYLOpwxCwiEJ0nEOJ2zBUJfVZ0YyyHpvMoKqArMWww1hwFiN1UFQ7MtvdjpEkpXhfYPlYRJ7Kasf5g3BV53E9BE6qU7V10ORpfPxnwhS-VYWQWKNhBa21rCi5gzkULp8Nua2MUlg02IIFx4s4arsoAfUMw",
        alt: "Iconic Leather vue principale",
      },
    ],
    sizes: ["M", "L"],
    soldOut: true,
  },
];

export const featuredProductSlugs = [
  "retro-high-og",
  "heavy-box-hoodie",
  "speed-volt-runner",
  "earth-suede-low",
] as const;

export function getProductBySlug(slug: string) {
  return catalogProducts.find((product) => product.slug === slug);
}
