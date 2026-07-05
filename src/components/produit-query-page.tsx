"use client";

import { useSearchParams } from "next/navigation";
import { ProduitSlugPage } from "@/components/produit-slug-page";

export function ProduitQueryPage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";

  return <ProduitSlugPage slug={slug} />;
}
