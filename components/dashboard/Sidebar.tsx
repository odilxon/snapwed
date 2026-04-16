"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Heart, Settings, LogOut, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", label: "Дашборд", icon: LayoutDashboard },
  { href: "/dashboard/weddings", label: "Мои свадьбы", icon: Heart },
  { href: "/dashboard/settings", label: "Настройки", icon: Settings },
];

interface SidebarProps {
  userName?: string;
  plan?: string;
}

export default function Sidebar({ userName, plan = "free" }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="w-[260px] min-h-screen bg-dark-sidebar flex flex-col border-r border-white/5">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/5">
        <h1 className="text-xl font-display text-gold-400">SnapWed</h1>
        <p className="text-xs text-gray-600 mt-0.5 font-sans">Свадебные фото</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-sans text-sm",
                isActive
                  ? "text-gold-400 bg-gold-400/10 border-l-2 border-gold-400 pl-[10px]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-4 py-4 border-t border-white/5 space-y-3">
        {plan === "free" && (
          <div className="bg-gold-400/10 rounded-xl p-3 border border-gold-400/20">
            <p className="text-xs text-gold-400 font-semibold font-sans mb-1">Free план</p>
            <p className="text-xs text-gray-500 font-sans mb-2">Ограничено 1 свадьбой</p>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-1.5 text-xs text-gold-400 font-semibold font-sans hover:text-gold-600 transition-colors"
            >
              <Sparkles size={12} />
              Перейти на Starter
            </Link>
          </div>
        )}

        <div className="flex items-center gap-3 px-1">
          <div className="w-8 h-8 rounded-full bg-gold-400/20 flex items-center justify-center text-gold-400 text-sm font-semibold font-sans">
            {userName?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white truncate font-sans">{userName || "Пользователь"}</p>
            <p className="text-xs text-gray-600 capitalize font-sans">{plan} план</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-red-400 transition-colors"
            title="Выйти"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
