import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Coin Original",
    short_name: "CoinOriginal",
    description: "Boutique streetwear premium au Maroc — sneakers, vetements et accessoires urbains.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ff571a",
    icons: [
      {
        src: "/logo%20ligh.jpg",
        sizes: "192x192",
        type: "image/jpeg",
      },
      {
        src: "/logo%20ligh.jpg",
        sizes: "512x512",
        type: "image/jpeg",
      },
    ],
  };
}
