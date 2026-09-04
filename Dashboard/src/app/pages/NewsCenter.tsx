import NewsImpact from "../components/NewsImpact";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Newspaper, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { motion } from "motion/react";

const newsCategories = ["All", "Crypto", "Stocks", "Forex", "Commodities"];

const newsFeed = [
  {
    id: 1,
    title: "Bitcoin ETF Sees Record Inflows of $500M in Single Day",
    category: "Crypto",
    impact: "Bullish",
    time: "2 hours ago",
    summary: "Institutional investors continue to pour money into Bitcoin spot ETFs, signaling strong demand.",
    source: "Bloomberg",
  },
  {
    id: 2,
    title: "Federal Reserve Maintains Interest Rates at 5.25%",
    category: "Stocks",
    impact: "Neutral",
    time: "3 hours ago",
    summary: "The Fed keeps rates steady, maintaining their data-dependent approach to monetary policy.",
    source: "Reuters",
  },
  {
    id: 3,
    title: "NVIDIA Announces New AI Chip Platform",
    category: "Stocks",
    impact: "Bullish",
    time: "5 hours ago",
    summary: "New chip architecture promises 2x performance improvement for AI workloads.",
    source: "TechCrunch",
  },
  {
    id: 4,
    title: "USD Strengthens Against Major Currencies",
    category: "Forex",
    impact: "Bearish",
    time: "6 hours ago",
    summary: "Dollar index rises as investors seek safe haven amid global uncertainty.",
    source: "Financial Times",
  },
  {
    id: 5,
    title: "Gold Prices Hit New All-Time High",
    category: "Commodities",
    impact: "Bullish",
    time: "8 hours ago",
    summary: "Gold surges past $2,400 as inflation concerns persist.",
    source: "CNBC",
  },
];

export default function NewsCenter() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-white mb-2">News Center</h1>
        <p className="text-gray-400">Stay updated with market-moving news</p>
      </motion.div>

      <NewsImpact />

      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Newspaper className="w-5 h-5 text-cyan-400" />
            Latest News Feed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="All" className="space-y-4">
            <TabsList className="bg-white/5 border border-white/10">
              {newsCategories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="All" className="space-y-4">
              {newsFeed.map((news, index) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-5 hover:bg-white/10 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className="border-cyan-500/50 bg-cyan-500/10 text-cyan-400 text-xs"
                        >
                          {news.category}
                        </Badge>
                        <Badge
                          className={
                            news.impact === "Bullish"
                              ? "bg-green-500/20 text-green-400 border-green-500/30 text-xs"
                              : news.impact === "Bearish"
                              ? "bg-red-500/20 text-red-400 border-red-500/30 text-xs"
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 text-xs"
                          }
                        >
                          {news.impact === "Bullish" ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : news.impact === "Bearish" ? (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          ) : null}
                          {news.impact}
                        </Badge>
                      </div>
                      <h4 className="text-white font-medium mb-2">{news.title}</h4>
                      <p className="text-sm text-gray-400 mb-3">{news.summary}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {news.time}
                        </span>
                        <span>Source: {news.source}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </TabsContent>

            {newsCategories.slice(1).map((category) => (
              <TabsContent key={category} value={category} className="space-y-4">
                {newsFeed
                  .filter((news) => news.category === category)
                  .map((news, index) => (
                    <motion.div
                      key={news.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-lg p-5"
                    >
                      <h4 className="text-white font-medium mb-2">{news.title}</h4>
                      <p className="text-sm text-gray-400">{news.summary}</p>
                    </motion.div>
                  ))}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
