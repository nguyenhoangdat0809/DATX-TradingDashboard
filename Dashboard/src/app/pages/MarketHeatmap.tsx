import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Grid3x3, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "motion/react";

const sectors = [
  {
    name: "Technology",
    change: 2.34,
    stocks: [
      { symbol: "AAPL", change: 1.2, size: 40 },
      { symbol: "MSFT", change: 2.5, size: 38 },
      { symbol: "NVDA", change: 5.7, size: 35 },
      { symbol: "GOOGL", change: -0.8, size: 32 },
      { symbol: "META", change: 3.2, size: 28 },
    ],
  },
  {
    name: "Finance",
    change: 0.87,
    stocks: [
      { symbol: "JPM", change: 0.5, size: 30 },
      { symbol: "BAC", change: 1.2, size: 28 },
      { symbol: "GS", change: -1.1, size: 25 },
      { symbol: "WFC", change: 0.8, size: 22 },
    ],
  },
  {
    name: "Healthcare",
    change: -0.45,
    stocks: [
      { symbol: "JNJ", change: -0.3, size: 28 },
      { symbol: "UNH", change: 0.9, size: 26 },
      { symbol: "PFE", change: -1.2, size: 24 },
      { symbol: "ABBV", change: 0.4, size: 22 },
    ],
  },
  {
    name: "Energy",
    change: 1.56,
    stocks: [
      { symbol: "XOM", change: 2.1, size: 32 },
      { symbol: "CVX", change: 1.8, size: 28 },
      { symbol: "COP", change: 0.9, size: 24 },
    ],
  },
  {
    name: "Consumer",
    change: 0.23,
    stocks: [
      { symbol: "AMZN", change: 1.5, size: 35 },
      { symbol: "TSLA", change: 4.2, size: 30 },
      { symbol: "WMT", change: -0.5, size: 25 },
      { symbol: "HD", change: 0.8, size: 22 },
    ],
  },
  {
    name: "Crypto",
    change: 3.45,
    stocks: [
      { symbol: "BTC", change: 2.3, size: 45 },
      { symbol: "ETH", change: 3.1, size: 40 },
      { symbol: "SOL", change: 5.6, size: 28 },
      { symbol: "BNB", change: 1.8, size: 25 },
    ],
  },
];

const getChangeColor = (change: number) => {
  if (change > 2) return "bg-green-500";
  if (change > 0) return "bg-green-600";
  if (change > -2) return "bg-red-600";
  return "bg-red-500";
};

const getChangeOpacity = (change: number) => {
  const abs = Math.abs(change);
  if (abs > 3) return "opacity-100";
  if (abs > 2) return "opacity-90";
  if (abs > 1) return "opacity-75";
  return "opacity-60";
};

export default function MarketHeatmap() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-white mb-2">Market Heatmap</h1>
        <p className="text-gray-400">Visual representation of market performance</p>
      </motion.div>

      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Grid3x3 className="w-5 h-5 text-cyan-400" />
              Sector Performance
            </CardTitle>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-gray-400">Positive</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-gray-400">Negative</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((sector, sectorIndex) => (
              <motion.div
                key={sector.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: sectorIndex * 0.1 }}
              >
                <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-medium">{sector.name}</h3>
                    <Badge
                      className={
                        sector.change > 0
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }
                    >
                      {sector.change > 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {sector.change > 0 ? "+" : ""}
                      {sector.change}%
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {sector.stocks.map((stock, stockIndex) => (
                      <motion.div
                        key={stock.symbol}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: sectorIndex * 0.1 + stockIndex * 0.05,
                        }}
                        className={`${getChangeColor(stock.change)} ${getChangeOpacity(
                          stock.change
                        )} rounded-lg p-3 flex flex-col items-center justify-center hover:scale-105 transition-transform cursor-pointer`}
                        style={{
                          aspectRatio: "1",
                          height: `${stock.size * 2}px`,
                        }}
                      >
                        <p className="text-white font-bold text-sm">{stock.symbol}</p>
                        <p className="text-white text-xs">
                          {stock.change > 0 ? "+" : ""}
                          {stock.change}%
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "S&P 500", value: "+0.87%", color: "green" },
          { label: "Nasdaq", value: "+1.45%", color: "green" },
          { label: "Dow Jones", value: "-0.23%", color: "red" },
          { label: "Russell 2000", value: "+0.56%", color: "green" },
        ].map((index, i) => (
          <motion.div
            key={index.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Card
              className={`bg-gradient-to-br ${
                index.color === "green"
                  ? "from-green-900/20 to-green-800/20 border-green-500/30"
                  : "from-red-900/20 to-red-800/20 border-red-500/30"
              } backdrop-blur-xl`}
            >
              <CardContent className="p-4">
                <p className="text-gray-400 text-sm mb-1">{index.label}</p>
                <p
                  className={`text-2xl font-bold ${
                    index.color === "green" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {index.value}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
