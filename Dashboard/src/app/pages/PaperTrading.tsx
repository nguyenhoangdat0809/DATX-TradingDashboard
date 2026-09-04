import PaperTradingCard from "../components/PaperTradingCard";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { motion } from "motion/react";

const openPositions = [
  {
    symbol: "BTC/USD",
    type: "Long",
    entry: 45200,
    current: 45823,
    quantity: 0.5,
    pnl: 311.5,
    pnlPercent: 1.38,
  },
  {
    symbol: "ETH/USD",
    type: "Short",
    entry: 2500,
    current: 2456,
    quantity: 2,
    pnl: 88,
    pnlPercent: 1.76,
  },
  {
    symbol: "SPY",
    type: "Long",
    entry: 510.5,
    current: 512.45,
    quantity: 10,
    pnl: 19.5,
    pnlPercent: 0.38,
  },
];

export default function PaperTrading() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-white mb-2">Paper Trading</h1>
        <p className="text-gray-400">Practice trading with virtual money</p>
      </motion.div>

      {/* Main Dashboard */}
      <PaperTradingCard />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Trade Form */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Open New Position</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Symbol</Label>
              <Input
                placeholder="e.g. BTC/USD"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Position Type</Label>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30">
                    Long
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-white/10 text-gray-400 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30"
                  >
                    Short
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Quantity</Label>
                <Input
                  type="number"
                  placeholder="0.00"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Entry Price</Label>
                <Input
                  type="number"
                  placeholder="Market Price"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Stop Loss</Label>
                <Input
                  type="number"
                  placeholder="Optional"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Take Profit</Label>
              <Input
                type="number"
                placeholder="Optional"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>

            <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
              Open Position
            </Button>
          </CardContent>
        </Card>

        {/* Open Positions */}
        <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Open Positions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {openPositions.map((position, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-white font-medium">{position.symbol}</h4>
                      <Badge
                        variant="outline"
                        className={
                          position.type === "Long"
                            ? "border-green-500/50 bg-green-500/10 text-green-400"
                            : "border-red-500/50 bg-red-500/10 text-red-400"
                        }
                      >
                        {position.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">Qty: {position.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-lg font-medium ${
                        position.pnl > 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {position.pnl > 0 ? "+" : ""}${position.pnl.toFixed(2)}
                    </p>
                    <p
                      className={`text-sm ${
                        position.pnl > 0 ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {position.pnl > 0 ? "+" : ""}
                      {position.pnlPercent.toFixed(2)}%
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-gray-400">Entry</p>
                    <p className="text-white">${position.entry.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Current</p>
                    <p className="text-white">${position.current.toFixed(2)}</p>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full border-red-500/50 text-red-400 hover:bg-red-500/20"
                >
                  Close Position
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
