"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Coin Original</h3>
            <p className="text-sm leading-relaxed">
              Boutique streetwear premium au Maroc. Sneakers, vêtements et accessoires urbains avec paiement à la livraison.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Liens utiles</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/boutique" className="hover:text-white transition-colors">
                  Boutique
                </Link>
              </li>
              <li>
                <Link href="/car" className="hover:text-white transition-colors">
                  La Car
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/panier" className="hover:text-white transition-colors">
                  Panier
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white text-lg font-bold mb-4">Informations légales</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/mentions-legales" className="hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="hover:text-white transition-colors">
                  Conditions générales de vente
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Coin Original. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
