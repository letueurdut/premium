"use client";

import { useUser, SignOutButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export function Header() {
  const { user } = useUser();

  return (
    <header className="fixed top-0 left-60 right-0 h-14 bg-roulette-card border-b border-roulette-border px-6 flex items-center justify-between z-10">
      <p className="text-sm text-roulette-muted">{user?.primaryEmailAddress?.emailAddress}</p>
      <div className="flex items-center gap-3">
        <SignOutButton>
          <button className="flex items-center gap-1.5 text-xs text-roulette-muted hover:text-red-400 transition-colors">
            <LogOut size={14} />
            Quitter
          </button>
        </SignOutButton>
      </div>
    </header>
  );
}