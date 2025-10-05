"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiBook, FiBarChart2, FiSettings, FiCopy } from "react-icons/fi";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Repository", href: "/repository", icon: FiBook },
    { name: "Compare", href: "/compare", icon: FiCopy },
    { name: "Insights", href: "/insights", icon: FiBarChart2 },
    { name: "Process Generator", href: "/process-generator", icon: FiSettings },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <FiBook className="text-2xl" />
            PM Standards Platform
          </Link>

          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive ? "bg-white/20 font-semibold" : "hover:bg-white/10"
                  }`}
                >
                  <Icon />
                  <span className="hidden sm:inline">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
