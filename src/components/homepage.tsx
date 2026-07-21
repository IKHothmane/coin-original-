"use client";

import { useState } from "react";
import {
  BottomDock,
  BrandsSection,
  DesktopTopBar,
  FeaturesStrip,
  FlashOffersSection,
  HeroSection,
  HomeCategoriesSection,
  MobileDrawer,
  MobileTopBar,
  NewArrivalsSection,
  PopularProductsSection,
  RecentlyViewedSection,
} from "@/components/homepage-sections";


export function Homepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="brand-shell min-h-screen bg-[var(--background)] text-[var(--foreground)]">
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

      <main id="top" className="page-with-header">
        <HeroSection />
        <FeaturesStrip />
        <HomeCategoriesSection />
        <BrandsSection />
        <FlashOffersSection />
        <NewArrivalsSection />
        <PopularProductsSection />
        <RecentlyViewedSection />
      </main>
    </div>
  );
}
