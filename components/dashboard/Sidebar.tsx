"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiLayout, FiHeart, FiSettings, FiLogOut, FiZap, FiMenu, FiX } from "react-icons/fi";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: any;
}

const navItems: NavItem[] = [
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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [mobileOpen]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  function closeMenu() {
    setMobileOpen(false);
  }

  return (
    <>
      <aside className="hidden md:flex w-[260px] min-h-screen bg-white flex-col border-r border-gray-100 fixed left-0 top-0">
        <NavContent userName={userName} plan={plan} navItems={navItems} pathname={pathname} onLogout={handleLogout} />
      </aside>

      <MobileHeader onMenuClick={() => setMobileOpen(true)} />

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black/50" onClick={closeMenu} />
          <aside className="w-[280px] min-h-screen bg-white flex flex-col border-r border-gray-100 fixed left-0 top-0 h-full">
            <NavContent userName={userName} plan={plan} navItems={navItems} pathname={pathname} onLogout={handleLogout} isMobile onClose={closeMenu} />
          </aside>
        </div>
      )}
    </>
  );
}

function NavContent({ userName, plan, navItems, pathname, onLogout, isMobile, onClose }: { userName?: string; plan?: string; navItems: NavItem[]; pathname: string; onLogout: () => void; isMobile?: boolean; onClose?: () => void }) {
  return (
    <>
      <div className={`px-6 py-5 border-b border-gray-100 ${isMobile ? "flex items-center justify-between" : ""}`}>
        <Link href="/" className="flex items-center gap-2" onClick={onClose}>
          <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center">
            <FiHeart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-display text-gray-900">SnapWed</h1>
            {!isMobile && <p className="text-xs text-gray-400">Свадебные фото</p>}
          </div>
        </Link>
        {isMobile && onClose && (
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900">
            <FiX className="w-6 h-6" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium",
                isActive ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-gray-100 space-y-3">
        {plan === "free" && (
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
            <p className="text-xs text-amber-600 font-medium mb-1">Free план</p>
            <p className="text-xs text-gray-400 mb-2">Ограничено 1 свадьбой</p>
            <Link href="/dashboard/settings" onClick={onClose} className="flex items-center gap-1.5 text-xs text-amber-600 font-medium hover:text-amber-700 transition-colors">
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
          <button onClick={onLogout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Выйти">
            <FiLogOut size={16} />
          </button>
        </div>
      </div>
    </>
  );
}

function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-100 z-30 flex items-center px-4">
      <button onClick={onMenuClick} className="p-2 -ml-2 text-gray-500 hover:text-gray-900">
        <FiMenu className="w-6 h-6" />
      </button>
      <Link href="/dashboard" className="flex items-center gap-2 ml-3">
        <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center">
          <FiHeart className="w-4 h-4 text-white" />
        </div>
        <span className="font-display text-gray-900">SnapWed</span>
      </Link>
    </header>
  );
}
