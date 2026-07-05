import { Suspense } from "react";
import { ProduitQueryPage } from "@/components/produit-query-page";

export default function ProduitPage() {
  return (
    <Suspense fallback={null}>
      <ProduitQueryPage />
    </Suspense>
  );
}
