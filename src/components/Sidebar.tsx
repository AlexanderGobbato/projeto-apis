"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

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
    { name: "Importar Swagger", href: "/dashboard/apis/import", icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg> },
  ];

  if (user?.role === 'ADMIN') {
    menuItems.push({ name: "Usuários", href: "/dashboard/usuarios", icon: <IconUsers /> });
  }

  return (
    <aside
      className={`relative z-20 flex flex-col bg-white border-r border-[#e0e0e0] transition-all duration-300 ${
        collapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="flex items-center justify-between p-7 h-20">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#1a73e8] flex items-center justify-center font-bold text-white">G</div>
            <span className="font-semibold text-xl tracking-tight text-[#1f1f1f]">Governance</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1 px-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-full transition-all duration-200 group relative ${
                isActive
                  ? "bg-[#e8f0fe] text-[#1a73e8]"
                  : "text-[#444746] hover:bg-[#f1f3f4] hover:text-[#1f1f1f]"
              }`}
            >
              <span className={isActive ? "text-[#1a73e8]" : "text-[#444746] group-hover:text-[#1f1f1f]"}>
                {item.icon}
              </span>
              {!collapsed && <span className={`font-medium text-sm ${isActive ? "font-bold" : ""}`}>{item.name}</span>}
              {isActive && !collapsed && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[#1a73e8] rounded-r-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#e0e0e0] flex flex-col gap-4">
        {!collapsed && (
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-[#f1f3f4] flex items-center justify-center text-[#1a73e8] font-bold border border-[#e0e0e0]">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-[#1f1f1f] truncate">{user?.name}</span>
              <span className="text-[11px] text-gray-500 font-medium">
                {user?.role === 'ADMIN' ? 'Administrador' : 'Visualizador'}
              </span>
            </div>
          </div>
        )}
        
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className={`flex items-center gap-4 px-5 py-3 rounded-full text-[#444746] hover:bg-[#fde8e8] hover:text-[#d93025] transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <IconLogout />
          {!collapsed && <span className="font-medium text-sm">Sair da conta</span>}
        </button>
      </div>
    </aside>
  );
}
