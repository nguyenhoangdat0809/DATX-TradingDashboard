import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Wallet, TrendingUp, Target, BarChart3 } from "lucide-react";
import { motion } from "motion/react";

const equityCurveData = [
  { day: "Mon", balance: 100000 },
  { day: "Tue", balance: 102500 },
  { day: "Wed", balance: 101800 },
  { day: "Thu", balance: 104200 },
  { day: "Fri", balance: 108500 },
  { day: "Sat", balance: 107900 },
  { day: "Sun", balance: 110250 },
];

const stats = [
  { label: "Virtual Balance", value: "₹110,250", icon: Wallet, color: "cyan" },
  { label: "Total P&L", value: "+₹10,250", icon: TrendingUp, color: "green", percent: "+10.25%" },
  { label: "Win Rate", value: "68%", icon: Target, color: "blue" },
  { label: "Total Trades", value: "24", icon: BarChart3, color: "purple" },
];

const colorClasses = {
  cyan: "from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 text-cyan-400",
  green: "from-green-500/20 to-green-600/20 border-green-500/30 text-green-400",
  blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400",
  purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400",
};

export default function PaperTradingCard() {
  return (
    <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">Paper Trading Dashboard</CardTitle>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClass = colorClasses[stat.color as keyof typeof colorClasses];

            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`bg-gradient-to-br ${colorClass} border rounded-lg p-4`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4" />
                  <p className="text-xs text-gray-300">{stat.label}</p>
                </div>
                <p className="text-xl font-medium">{stat.value}</p>
                {stat.percent && (
                  <p className="text-xs text-green-400 mt-1">{stat.percent}</p>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Equity Curve */}
        <div>
          <h4 className="text-sm text-gray-400 mb-3">Equity Curve (Last 7 Days)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={equityCurveData}>
              <defs>
                <linearGradient id="papertrading-equityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="day"
                stroke="rgba(255,255,255,0.3)"
                tick={{ fill: "rgba(255,255,255,0.5)" }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.3)"
                tick={{ fill: "rgba(255,255,255,0.5)" }}
                domain={[98000, 112000]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#06b6d4"
                strokeWidth={2}
                fill="url(#papertrading-equityGradient)"
                dot={{ fill: "#06b6d4", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Trades */}
        <div>
          <h4 className="text-sm text-gray-400 mb-3">Recent Trades</h4>
          <div className="space-y-2">
            {[
              { symbol: "BTC/USD", type: "Long", pnl: "+₹2,450", status: "closed" },
              { symbol: "ETH/USD", type: "Short", pnl: "-₹580", status: "closed" },
              { symbol: "SPY", type: "Long", pnl: "+₹1,230", status: "open" },
            ].map((trade, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant="outline"
                    className={
                      trade.type === "Long"
                        ? "border-green-500/50 bg-green-500/10 text-green-400"
                        : "border-red-500/50 bg-red-500/10 text-red-400"
                    }
                  >
                    {trade.type}
                  </Badge>
                  <span className="text-white text-sm">{trade.symbol}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm ${
                      trade.pnl.startsWith("+") ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {trade.pnl}
                  </span>
                  <Badge
                    variant="outline"
                    className="border-gray-600 text-gray-400 text-xs"
                  >
                    {trade.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
