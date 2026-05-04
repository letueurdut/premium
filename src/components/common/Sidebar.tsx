"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, PlusCircle, BookOpen, CheckCircle, AlertTriangle, Gift, MessageCircle } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const isAdmin = pathname.startsWith('/admin');
  const items = isAdmin ? [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Utilisateurs", icon: Users },
    { href: "/admin/catalog", label: "Catalogue", icon: BookOpen },
    { href: "/admin/create-task", label: "Créer une tâche", icon: PlusCircle },
    { href: "/admin/proofs", label: "Preuves", icon: CheckCircle },
    { href: "/admin/overdue", label: "Retards", icon: AlertTriangle },
    { href: "/admin/chat", label: "Chat", icon: MessageCircle },
    { href: "/admin/rewards", label: "Vault", icon: Gift },
  ] : [
    { href: "/user/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/user/tasks", label: "Mes tâches", icon: CheckCircle },
    { href: "/user/vault", label: "Vault", icon: Gift },
    { href: "/user/chat", label: "Chat", icon: Users },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-roulette-card border-r border-roulette-border flex flex-col">
      <div className="p-5 border-b border-roulette-border">
        <h1 className="text-xl font-display text-roulette-red font-bold tracking-tight">PREMIUM</h1>
        <p className="text-xs text-roulette-muted mt-0.5">gestion de tâches</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                active
                  ? 'bg-red-900/20 text-white border border-red-900/30'
                  : 'text-roulette-muted hover:bg-roulette-dark hover:text-white'
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}