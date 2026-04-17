"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiLayout, FiHeart, FiSettings, FiLogOut, FiZap } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/dashboard", label: "Дашборд", icon: FiLayout },
  { href: "/dashboard/weddings", label: "Мои свадьбы", icon: FiHeart },
  { href: "/dashboard/settings", label: "Настройки", icon: FiSettings },
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
    <aside className="w-[260px] min-h-screen bg-white flex flex-col border-r border-gray-100">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center">
            <FiHeart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-display text-gray-900">SnapWed</h1>
            <p className="text-xs text-gray-400">Свадебные фото</p>
          </div>
        </Link>
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
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium",
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="px-4 py-4 border-t border-gray-100 space-y-3">
        {plan === "free" && (
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
            <p className="text-xs text-amber-600 font-medium mb-1">Free план</p>
            <p className="text-xs text-gray-400 mb-2">Ограничено 1 свадьбой</p>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-1.5 text-xs text-amber-600 font-medium hover:text-amber-700 transition-colors"
            >
              <FiZap size={12} />
              Перейти на Starter
            </Link>
          </div>
        )}

        <div className="flex items-center gap-3 px-1">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-100 to-rose-100 flex items-center justify-center text-amber-600 text-sm font-semibold">
            {userName?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900 truncate font-medium">{userName || "Пользователь"}</p>
            <p className="text-xs text-gray-400 capitalize">{plan} план</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            title="Выйти"
          >
            <FiLogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}
