import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Newspaper, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "motion/react";

const newsItems = [
  {
    title: "Fed Keeps Interest Rates Unchanged",
    explanation: "The Federal Reserve maintained rates at 5.25%, signaling stable monetary policy",
    impact: "Bullish",
    strength: "High",
    sectors: ["Technology", "Finance", "Real Estate"],
    time: "2h ago",
  },
  {
    title: "Major Bitcoin ETF Inflows Hit $500M",
    explanation: "Institutional investors continue accumulating BTC through spot ETFs",
    impact: "Bullish",
    strength: "Medium",
    sectors: ["Crypto", "Finance"],
    time: "4h ago",
  },
  {
    title: "Global Tech Stocks Under Pressure",
    explanation: "Regulatory concerns in Asia causing selloff in tech sector",
    impact: "Bearish",
    strength: "Medium",
    sectors: ["Technology", "Communication"],
    time: "6h ago",
  },
];

export default function NewsImpact() {
  return (
    <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-cyan-400" />
          <CardTitle className="text-white">News Impact Center</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {newsItems.map((news, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-white text-sm font-medium flex-1">{news.title}</h4>
              <span className="text-xs text-gray-500">{news.time}</span>
            </div>

            <p className="text-sm text-gray-400 mb-3">{news.explanation}</p>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge
                className={
                  news.impact === "Bullish"
                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                    : "bg-red-500/20 text-red-400 border-red-500/30"
                }
              >
                {news.impact === "Bullish" ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {news.impact}
              </Badge>

              <Badge
                variant="outline"
                className={
                  news.strength === "High"
                    ? "border-orange-500/50 bg-orange-500/10 text-orange-400"
                    : "border-blue-500/50 bg-blue-500/10 text-blue-400"
                }
              >
                {news.strength} Impact
              </Badge>

              {news.sectors.map((sector) => (
                <Badge
                  key={sector}
                  variant="outline"
                  className="border-gray-600 text-gray-400 text-xs"
                >
                  {sector}
                </Badge>
              ))}
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
