import { useState } from "react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Plus, Eye, Copy, TrendingUp, GitBranch } from "lucide-react";
import { motion } from "motion/react";

interface Strategy {
  id: number;
  name: string;
  version: string;
  description: string;
  tags: string[];
  pair: string;
  timeframe: string;
  versions: number;
  winRate: number;
  trades: number;
  profit: number;
}

const strategies: Strategy[] = [
  {
    id: 1,
    name: "Momentum Breakout Strategy",
    version: "v1.2",
    description: "Identifies strong momentum breakouts with volume confirmation",
    tags: ["Breakout", "Volume", "Momentum"],
    pair: "BTC/USD",
    timeframe: "4H",
    versions: 3,
    winRate: 72,
    trades: 145,
    profit: 12450,
  },
  {
    id: 2,
    name: "Mean Reversion RSI",
    version: "v2.0",
    description: "RSI-based mean reversion with Bollinger Bands confirmation",
    tags: ["RSI", "Mean Reversion", "Bollinger Bands"],
    pair: "ETH/USD",
    timeframe: "1H",
    versions: 2,
    winRate: 68,
    trades: 189,
    profit: 8920,
  },
  {
    id: 3,
    name: "EMA Crossover Trend",
    version: "v1.5",
    description: "Dual EMA crossover with ADX trend strength filter",
    tags: ["EMA", "Trend", "ADX"],
    pair: "SOL/USD",
    timeframe: "1D",
    versions: 5,
    winRate: 61,
    trades: 97,
    profit: 5340,
  },
  {
    id: 4,
    name: "VWAP Scalping System",
    version: "v3.1",
    description: "Intraday VWAP deviation entries with tight risk management",
    tags: ["VWAP", "Scalping", "Intraday"],
    pair: "AAPL",
    timeframe: "5M",
    versions: 4,
    winRate: 58,
    trades: 412,
    profit: 3870,
  },
];

function winRateColor(rate: number) {
  if (rate >= 70) return "text-green-400";
  if (rate >= 60) return "text-yellow-400";
  return "text-orange-400";
}

export default function Watchlist() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-white text-2xl font-bold mb-1">Strategy Library</h1>
          <p className="text-gray-400 text-sm">Manage, version, and analyze your trading strategies</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium px-4 py-2 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New Strategy
        </Button>
      </motion.div>

      {/* Strategy Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {strategies.map((strategy, index) => (
          <motion.div
            key={strategy.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: index * 0.07 }}
            onMouseEnter={() => setHoveredId(strategy.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`rounded-xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/80 backdrop-blur-xl p-5 flex flex-col gap-4 transition-all duration-200 ${
              hoveredId === strategy.id ? "border-white/20 shadow-lg shadow-black/30" : ""
            }`}
          >
            {/* Card header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-white font-semibold text-base leading-tight">{strategy.name}</h3>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {strategy.version}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-snug">{strategy.description}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {strategy.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-xs border border-white/15 text-gray-300 bg-white/5"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Meta */}
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span className="font-medium text-gray-300">{strategy.pair}</span>
              <span className="text-white/20">·</span>
              <span>{strategy.timeframe}</span>
              <span className="text-white/20">·</span>
              <GitBranch className="w-3 h-3 text-indigo-400" />
              <span className="text-indigo-300">{strategy.versions} versions</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Win Rate", value: `${strategy.winRate}%`, color: winRateColor(strategy.winRate) },
                { label: "Trades", value: strategy.trades.toString(), color: "text-white" },
                {
                  label: "Profit",
                  value: `+$${strategy.profit.toLocaleString()}`,
                  color: "text-green-400",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/5 border border-white/8 rounded-lg px-3 py-2.5"
                >
                  <p className="text-gray-400 text-xs mb-1">{stat.label}</p>
                  <p className={`font-bold text-base leading-none ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-white/15 text-gray-300 hover:text-white hover:border-white/30 bg-transparent hover:bg-white/5 text-sm gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                View Details
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-indigo-600/80 hover:bg-indigo-600 text-white border border-indigo-500/40 text-sm gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                Duplicate
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="w-8 h-8 border-white/15 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/40 bg-transparent hover:bg-cyan-500/10 flex-shrink-0"
              >
                <TrendingUp className="w-3.5 h-3.5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
