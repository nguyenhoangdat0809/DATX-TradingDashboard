import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Layers, Plus, Play, Settings as SettingsIcon } from "lucide-react";
import { motion } from "motion/react";

const strategies = [
  {
    name: "Breakout Strategy",
    status: "Active",
    winRate: 72,
    trades: 45,
    avgProfit: "₹1,250",
    description: "Trades breakouts above key resistance levels with volume confirmation",
  },
  {
    name: "Mean Reversion",
    status: "Paused",
    winRate: 65,
    trades: 32,
    avgProfit: "₹890",
    description: "Buys oversold conditions and sells overbought levels",
  },
  {
    name: "Trend Following",
    status: "Active",
    winRate: 68,
    trades: 58,
    avgProfit: "₹1,120",
    description: "Follows strong trends with momentum indicators",
  },
];

const indicators = [
  "Moving Average (MA)",
  "RSI",
  "MACD",
  "Bollinger Bands",
  "Volume",
  "Stochastic",
  "ATR",
  "Fibonacci",
];

export default function StrategyBuilder() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-white mb-2">Strategy Builder</h1>
          <p className="text-gray-400">Create and backtest trading strategies</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Strategy
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strategy Builder Form */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              Build New Strategy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Strategy Name</Label>
              <Input
                placeholder="e.g. My Breakout Strategy"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Description</Label>
              <Textarea
                placeholder="Describe your strategy..."
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Entry Conditions</Label>
              <div className="space-y-2">
                {indicators.slice(0, 4).map((indicator) => (
                  <div
                    key={indicator}
                    className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3"
                  >
                    <span className="text-white text-sm">{indicator}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Risk Per Trade</Label>
                <Input
                  type="number"
                  placeholder="1-5%"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Risk:Reward</Label>
                <Input
                  type="text"
                  placeholder="1:2"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
                <Play className="w-4 h-4 mr-2" />
                Backtest
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                Save Strategy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Saved Strategies */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Saved Strategies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {strategies.map((strategy, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-white font-medium mb-1">{strategy.name}</h4>
                    <p className="text-sm text-gray-400 mb-2">{strategy.description}</p>
                  </div>
                  <Badge
                    className={
                      strategy.status === "Active"
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                    }
                  >
                    {strategy.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Win Rate</p>
                    <p className="text-cyan-400">{strategy.winRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Trades</p>
                    <p className="text-white">{strategy.trades}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Avg Profit</p>
                    <p className="text-green-400">{strategy.avgProfit}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20"
                  >
                    <Play className="w-3 h-3 mr-1" />
                    Run
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-white/10 text-gray-400 hover:bg-white/10"
                  >
                    <SettingsIcon className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Strategy Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Strategies", value: "3", color: "cyan" },
              { label: "Active", value: "2", color: "green" },
              { label: "Combined Win Rate", value: "68.3%", color: "blue" },
              { label: "Total Trades", value: "135", color: "purple" },
            ].map((stat, index) => (
              <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
