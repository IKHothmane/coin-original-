import type { Metadata } from "next";
import { catalogProducts, getProductBySlug } from "@/components/catalog-data";
import { ProductPage } from "@/components/product-page";
import { JsonLd } from "@/components/json-ld";
import { fetchCatalogProductBySlugWithFallback, fetchCatalogProductsWithFallback } from "@/lib/products/storefront";

type ProductRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  try {
    const firebaseProducts = await fetchCatalogProductsWithFallback();
    const firebaseSlugs = firebaseProducts.map((product) => product.slug);
    const catalogSlugs = catalogProducts.map((product) => product.slug);
    const allSlugs = Array.from(new Set([...catalogSlugs, ...firebaseSlugs]));

    return allSlugs.map((slug) => ({ slug }));
  } catch {
    return catalogProducts.map((product) => ({
      slug: product.slug,
    }));
  }
}

export async function generateMetadata({ params }: ProductRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchCatalogProductBySlugWithFallback(slug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://coin-original.ma";

  if (!product) {
    return {
      title: "Produit introuvable",
      robots: { index: false, follow: false },
    };
  }

  const title = `${product.name} | ${product.brand}`;
  const description = product.description;
  const image = product.image;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/produit/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/produit/${product.slug}`,
      images: [
        {
          url: image,
          alt: product.name,
        },
      ],

    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

function parsePrice(price: string) {
  return Number(price.replace(/[^\d]/g, ""));
}

export default async function ProduitSlugPage({ params }: ProductRouteProps) {
  const { slug } = await params;
  const product = (await fetchCatalogProductBySlugWithFallback(slug)) ?? getProductBySlug(slug) ?? undefined;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://coin-original.ma";

  const productJsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        image: [product.image, ...product.gallery.map((item) => item.src)],
        description: product.description,
        brand: {
          "@type": "Brand",
          name: product.brand,
        },
        offers: {
          "@type": "Offer",
          url: `${siteUrl}/produit/${product.slug}`,
          priceCurrency: "MAD",
          price: parsePrice(product.price),
          availability: product.soldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
          itemOffered: {
            "@type": "Product",
            name: product.name,
          },
          seller: {
            "@type": "Organization",
            name: "Coin Original",
          },
        },
      }
    : null;

  const breadcrumbJsonLd = product
    ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Boutique",
            item: `${siteUrl}/boutique`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.name,
            item: `${siteUrl}/produit/${product.slug}`,
          },
        ],
      }
    : null;

  const jsonLdData: Record<string, unknown>[] = [];
  if (productJsonLd) jsonLdData.push(productJsonLd);
  if (breadcrumbJsonLd) jsonLdData.push(breadcrumbJsonLd);

  return (
    <>
      <ProductPage key={slug} slug={slug} product={product} />
      {jsonLdData.length > 0 ? <JsonLd data={jsonLdData} /> : null}
    </>
  );
}
