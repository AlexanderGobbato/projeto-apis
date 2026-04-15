"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

// Usando herocons SVG
const IconHome = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const IconAPI = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>;
const IconUsers = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
const IconLogout = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

export default function Sidebar({ user }: { user?: any }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { name: "Projetos", href: "/dashboard", icon: <IconHome /> },
    { name: "Global APIs", href: "/dashboard/apis", icon: <IconAPI /> },
  ];

  if (user?.role === 'ADMIN') {
    menuItems.push({ name: "Usuários", href: "/dashboard/usuarios", icon: <IconUsers /> });
  }

  return (
    <aside
      className={`relative z-20 flex flex-col bg-gray-900/50 backdrop-blur-2xl border-r border-gray-800/60 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <div className="flex items-center justify-between p-6 border-b border-gray-800/60">
        {!collapsed && <span className="font-bold text-xl tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Governance</span>}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 py-8 flex flex-col gap-2 px-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                isActive
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.15)]"
                  : "text-gray-400 hover:bg-gray-800/40 hover:text-gray-200"
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md"></div>
              )}
              {item.icon}
              {!collapsed && <span className="font-medium">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800/60 flex items-center justify-between">
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold text-gray-200 truncate">{user?.name}</span>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
              {user?.role || "USER"}
            </span>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          title="Sair"
          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-colors"
        >
          <IconLogout />
        </button>
      </div>
    </aside>
  );
}
