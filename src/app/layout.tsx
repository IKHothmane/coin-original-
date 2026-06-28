import type { Metadata } from "next";
import { Anton, Archivo_Narrow, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Urban Maghreb",
  description: "Boutique streetwear premium avec themes dark et light.",
  icons: {
    icon: "/logo%20ligh.jpg",
    shortcut: "/logo%20ligh.jpg",
    apple: "/logo%20ligh.jpg",
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
