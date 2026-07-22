import type { Metadata } from "next";
import { FavoritesPage } from "@/components/favorites-page";

export const metadata: Metadata = {
  title: "Vos favoris | Coin Original",
  description: "Retrouve tes articles preferes chez Coin Original.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function FavorisRoute() {
  return <FavoritesPage />;
}
