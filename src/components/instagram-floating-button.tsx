"use client";

import { Instagram } from "lucide-react";
import { useCallback } from "react";

export function InstagramFloatingButton() {
  const handleInstagramClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Essayer d'ouvrir dans l'app Instagram d'abord (mobile)
    const instagramUsername = "coinoriginal_";
    const instagramAppUrl = `instagram://user?username=${instagramUsername}`;
    const instagramWebUrl = "https://www.instagram.com/coinoriginal_?igsh=dnFqNng4aXZ2MDY5&utm_source=qr";
    
    // Sur mobile, essayer l'app d'abord
    if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      // Tenter d'ouvrir l'app
      const timer = setTimeout(() => {
        // Si l'app n'existe pas, ouvrir le web
        window.location.href = instagramWebUrl;
      }, 500);
      
      window.location.href = instagramAppUrl;
      
      // Nettoyer le timer si l'app s'ouvre
      return () => clearTimeout(timer);
    } else {
      // Sur desktop, ouvrir directement le web
      window.open(instagramWebUrl, "_blank");
    }
  }, []);

  return (
    <a
      href="https://www.instagram.com/coinoriginal_"
      onClick={handleInstagramClick}
      className="fixed bottom-20 right-6 z-[130] inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white shadow-lg hover:shadow-xl hover:scale-110 transition-transform duration-200"
      aria-label="Suivez-nous sur Instagram"
      title="Instagram"
    >
      <Instagram size={24} strokeWidth={2} />
    </a>
  );
}
