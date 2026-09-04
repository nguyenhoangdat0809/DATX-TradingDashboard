import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { motion } from "motion/react";

const gainers = [
  { symbol: "NVDA", name: "NVIDIA Corp", price: 892.45, change: 8.52 },
  { symbol: "TSLA", name: "Tesla Inc", price: 245.67, change: 6.34 },
  { symbol: "AMD", name: "AMD Inc", price: 178.32, change: 5.21 },
];

const losers = [
  { symbol: "AAPL", name: "Apple Inc", price: 185.23, change: -3.45 },
  { symbol: "META", name: "Meta Platforms", price: 456.78, change: -2.87 },
  { symbol: "GOOGL", name: "Alphabet Inc", price: 145.89, change: -2.12 },
];

const watchlist = [
  { symbol: "BTC/USD", price: 45823.45, change: 2.34 },
  { symbol: "ETH/USD", price: 2456.78, change: 3.12 },
  { symbol: "SOL/USD", price: 98.34, change: -1.23 },
  { symbol: "SPY", price: 512.45, change: 0.87 },
];

const economicEvents = [
  { time: "14:30", event: "Fed Interest Rate Decision", impact: "High" },
  { time: "16:00", event: "GDP Growth Rate", impact: "Medium" },
  { time: "Tomorrow", event: "Non-Farm Payrolls", impact: "High" },
];

export default function MarketWidgets() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Top Gainers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-gradient-to-br from-green-900/20 to-green-800/20 border-green-500/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-green-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Top Gainers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {gainers.map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">{stock.symbol}</p>
                  <p className="text-xs text-gray-400">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm">${stock.price}</p>
                  <p className="text-xs text-green-400">+{stock.change}%</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Top Losers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-red-900/20 to-red-800/20 border-red-500/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Top Losers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {losers.map((stock) => (
              <div key={stock.symbol} className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">{stock.symbol}</p>
                  <p className="text-xs text-gray-400">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-white text-sm">${stock.price}</p>
                  <p className="text-xs text-red-400">{stock.change}%</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Watchlist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-cyan-900/20 to-blue-800/20 border-cyan-500/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-cyan-400">My Watchlist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {watchlist.map((asset) => (
              <div key={asset.symbol} className="flex items-center justify-between">
                <p className="text-white text-sm font-medium">{asset.symbol}</p>
                <div className="text-right">
                  <p className="text-white text-sm">${asset.price.toLocaleString()}</p>
                  <p
                    className={`text-xs ${
                      asset.change > 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {asset.change > 0 ? "+" : ""}
                    {asset.change}%
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Economic Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/20 border-purple-500/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Economic Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {economicEvents.map((event, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-white text-sm">{event.event}</p>
                  <Badge
                    variant="outline"
                    className={
                      event.impact === "High"
                        ? "border-red-500/50 bg-red-500/10 text-red-400 text-xs"
                        : "border-yellow-500/50 bg-yellow-500/10 text-yellow-400 text-xs"
                    }
                  >
                    {event.impact}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400">{event.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
