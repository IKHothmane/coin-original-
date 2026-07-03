"use client";

import { useEffect, useState } from "react";
import {
  BottomDock,
  CategoriesSection,
  DesktopTopBar,
  HeroSection,
  MobileDrawer,
  MobileTopBar,
  PartnersSection,
  ShopSection,
  SiteFooter,
  TrustSection,
} from "@/components/homepage-sections";

function SplashScreen({ onClose }: { onClose: () => void }) {
  return (
    <div className="splash-screen fixed inset-0 z-[1000] flex items-center justify-center bg-black">
      <video
        src="/videoscreen.mp4"
        poster="/hero-home.jpg"
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={onClose}
        className="splash-screen__video absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}

export function Homepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(false);

  useEffect(() => {
    setShowSplash(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen || showSplash ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen, showSplash]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleCloseSplash = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onClose={handleCloseSplash} />}
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
          onCloseMobileMenu={closeMobileMenu}
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
    </>
  );
}
