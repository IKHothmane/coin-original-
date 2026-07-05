"use client";

import { useState } from "react";
import {
  BottomDock,
  CategoriesSection,
  DesktopTopBar,
  HeroSection,
  MobileDrawer,
  MobileTopBar,
  PartnersSection,
  ShopSection,
  TrustSection,
} from "@/components/homepage-sections";


export function Homepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="brand-shell brand-grid min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <DesktopTopBar
        mobileMenuOpen={mobileMenuOpen}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />
      <div className="md:hidden">
        <MobileTopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      </div>
      <MobileDrawer
        mobileMenuOpen={mobileMenuOpen}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />
      <BottomDock
        mobileMenuOpen={mobileMenuOpen}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />

      <main id="top" className="pt-18 pb-28 md:pt-20 md:pb-0">
        <HeroSection />
        <PartnersSection />
        <ShopSection />
        <TrustSection />
        <CategoriesSection />
      </main>
    </div>
  );
}
