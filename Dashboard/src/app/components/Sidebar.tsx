import { NavLink } from "react-router";
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  Library,
  Newspaper,
  Grid3x3,
  BookOpen,
  Layers,
  Settings,
} from "lucide-react";
import { motion } from "motion/react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: TrendingUp, label: "Chart Analysis", path: "/chart-analysis" },
  { icon: Wallet, label: "Paper Trading", path: "/paper-trading" },
  { icon: Library, label: "Strategy Library", path: "/watchlist" },
  { icon: Newspaper, label: "News Center", path: "/news" },
  { icon: Grid3x3, label: "Market Heatmap", path: "/heatmap" },
  { icon: BookOpen, label: "Journal", path: "/journal" },
  { icon: Layers, label: "Strategy Builder", path: "/strategy-builder" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-white/10 bg-gradient-to-b from-slate-950 to-slate-900 h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
