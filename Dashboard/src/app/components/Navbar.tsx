import { Search, Bell, User, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { useState } from "react";

export default function Navbar() {
  const [isDark, setIsDark] = useState(true);

  return (
    <nav className="h-16 border-b border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl sticky top-0 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">AI</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-none">AI Trading Pro X</h1>
            <p className="text-xs text-cyan-400 leading-none mt-0.5">Chart Analyzer</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search symbols (e.g. AAPL, BTC/USD)..."
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-cyan-500/50 focus:ring-cyan-500/20"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="border-green-500/50 bg-green-500/10 text-green-400 px-3 py-1">
            DEMO TRADING
          </Badge>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-white/10 relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-white/10"
          >
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
