"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-context";
import { ThemeLogo, BottomDock, MobileTopBar, DesktopTopBar, MobileDrawer } from "@/components/homepage-sections";
import { getOrderRepository } from "@/lib/orders/repository";
import type { Order } from "@/lib/orders/types";

export default function MonComptePage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/");
      return;
    }

    if (user) {
      loadOrders();
    }
  }, [user, authLoading, router]);

  const loadOrders = async () => {
    setLoadingOrders(true);
    try {
      const allOrders = await getOrderRepository().fetchAll();
      // Filter orders by user email
      const userOrders = allOrders.filter((order) => order.customer?.email === user?.email);
      setOrders(userOrders);
    } catch {
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#131313] flex items-center justify-center text-[#e5e2e1]">
        <p className="font-mono text-xs uppercase tracking-widest text-[#e6beb2]">Chargement...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1]">
      <MobileTopBar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <DesktopTopBar mobileMenuOpen={mobileMenuOpen} onOpenMobileMenu={() => setMobileMenuOpen(true)} />
      <MobileDrawer mobileMenuOpen={mobileMenuOpen} onCloseMobileMenu={() => setMobileMenuOpen(false)} />

      <main className="page-with-header px-3 pb-24 lg:px-5 lg:pb-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="font-[var(--font-display)] text-3xl uppercase tracking-wider">
              Mon compte
            </h1>
            <button
              onClick={logout}
              className="border border-red-500 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-red-400 transition-colors hover:bg-red-500 hover:text-white"
            >
              Déconnexion
            </button>
          </div>

          <div className="mb-8 border border-[#3a3a3a] bg-[#1a1a1a] p-6">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-[#a3a1a0] mb-4">
              Informations personnelles
            </h2>
            <div className="space-y-2 text-sm">
              <p><span className="text-[#a3a1a0]">Nom :</span> {user.displayName || "Non renseigné"}</p>
              <p><span className="text-[#a3a1a0]">Email :</span> {user.email}</p>
            </div>
          </div>

          <div className="border border-[#3a3a3a] bg-[#1a1a1a] p-6">
            <h2 className="font-mono text-[10px] uppercase tracking-widest text-[#a3a1a0] mb-4">
              Mes commandes
            </h2>

            {loadingOrders ? (
              <p className="text-sm text-[#a3a1a0]">Chargement des commandes...</p>
            ) : orders.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-[#a3a1a0] mb-4">Aucune commande pour le moment</p>
                <Link
                  href="/boutique"
                  className="inline-block border border-[#ffb59e] px-5 py-3 font-mono text-xs uppercase tracking-widest text-[#ffb59e] transition-colors hover:bg-[#ffb59e] hover:text-[#131313]"
                >
                  Découvrir la boutique
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-[#3a3a3a] p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#a3a1a0]">
                        Commande #{order.id.slice(-6).toUpperCase()}
                      </span>
                      <span
                        className={`font-mono text-[10px] uppercase tracking-widest px-2 py-1 ${
                          order.status === "delivered"
                            ? "bg-green-500/20 text-green-400"
                            : order.status === "shipped"
                            ? "bg-blue-500/20 text-blue-400"
                            : "bg-yellow-500/20 text-yellow-400"
                        }`}
                      >
                        {order.status === "pending" && "En attente"}
                        {order.status === "shipped" && "Expédiée"}
                        {order.status === "delivered" && "Livrée"}
                        {order.status === "cancelled" && "Annulée"}
                      </span>
                    </div>
                    <p className="text-sm text-[#a3a1a0] mb-2">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <p key={idx} className="text-sm">
                          {item.name} × {item.quantity}
                        </p>
                      ))}
                    </div>
                    <p className="mt-2 text-sm font-semibold">
                      Total : {order.total} DH
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomDock mobileMenuOpen={mobileMenuOpen} onOpenMobileMenu={() => setMobileMenuOpen(true)} />
    </div>
  );
}
