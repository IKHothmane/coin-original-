import type { Metadata } from "next";
import { Anton, Archivo_Narrow, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { CartProvider } from "@/components/cart-context";
import { JsonLd } from "@/components/json-ld";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const anton = Anton({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const archivoNarrow = Archivo_Narrow({
  variable: "--font-ui",
  subsets: ["latin"],
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-body",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono-ui",
  subsets: ["latin"],
});

const siteUrl = SITE_URL;
const siteName = "Coin Original";
const siteDescription =
  "Coin Original — boutique streetwear premium au Maroc. Sneakers, vetements et accessoires urbains avec paiement a la livraison. Livraison gratuite au Maroc.";

export const metadata: Metadata = {
  title: {
    default: `${siteName} | Streetwear Premium Maroc`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "streetwear",
    "sneakers",
    "vetements",
    "mode urbaine",
    "Maroc",
    "Casablanca",
    "paiement a la livraison",
    "livraison gratuite",
    "coin original",
  ],
  authors: [{ name: "Coin Original" }],
  creator: "Coin Original",
  publisher: "Coin Original",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "/",
    siteName,
    title: `${siteName} | Streetwear Premium Maroc`,
    description: siteDescription,
    images: [
      {
        url: "/logo%20ligh.jpg",
        width: 1200,
        height: 630,
        alt: "Coin Original — Streetwear Premium Maroc",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Streetwear Premium Maroc`,
    description: siteDescription,
    images: ["/logo%20ligh.jpg"],
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
  icons: {
    icon: "/logo%20ligh.jpg",
    shortcut: "/logo%20ligh.jpg",
    apple: "/logo%20ligh.jpg",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/logo%20ligh.jpg`,
  sameAs: [
    process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    process.env.NEXT_PUBLIC_FACEBOOK_URL,
    process.env.NEXT_PUBLIC_TIKTOK_URL,
  ].filter(Boolean),
  contactPoint: {
    "@type": "ContactPoint",
    telephone: process.env.NEXT_PUBLIC_SUPPORT_PHONE ?? "+212600000000",
    contactType: "customer service",
    areaServed: "MA",
    availableLanguage: ["French", "Arabic"],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteName,
  url: siteUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/boutique?search={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      data-theme="light"
      suppressHydrationWarning
      className={`${anton.variable} ${archivoNarrow.variable} ${hankenGrotesk.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>{children}</CartProvider>
        <JsonLd data={[organizationJsonLd, websiteJsonLd]} />
      </body>
    </html>
  );
}
