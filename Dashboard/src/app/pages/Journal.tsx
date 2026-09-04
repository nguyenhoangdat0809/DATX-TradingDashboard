import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { BookOpen, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "motion/react";

const journalEntries = [
  {
    date: "May 20, 2026",
    symbol: "BTC/USD",
    type: "Long",
    entry: 45200,
    exit: 45823,
    pnl: 623,
    notes: "Perfect breakout above resistance. Volume confirmed the move. Followed my strategy perfectly.",
    emotion: "Confident",
    lessons: "Patience paid off. Waiting for confirmation was key.",
  },
  {
    date: "May 19, 2026",
    symbol: "ETH/USD",
    type: "Short",
    entry: 2500,
    exit: 2520,
    pnl: -40,
    notes: "Entered too early. Should have waited for better confirmation. Cut losses quickly as planned.",
    emotion: "Disciplined",
    lessons: "Don't rush into trades. Wait for proper setup.",
  },
  {
    date: "May 18, 2026",
    symbol: "NVDA",
    type: "Long",
    entry: 880,
    exit: 892,
    pnl: 120,
    notes: "AI sector momentum trade. News catalyst triggered the entry. Took profit at resistance.",
    emotion: "Excited",
    lessons: "News-driven moves can be profitable but manage risk carefully.",
  },
];

export default function Journal() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-white mb-2">Trading Journal</h1>
          <p className="text-gray-400">Track your trades and improve your strategy</p>
        </div>
        <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          New Entry
        </Button>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Trades", value: "24", color: "cyan" },
          { label: "Win Rate", value: "68%", color: "green" },
          { label: "Avg Win", value: "₹845", color: "blue" },
          { label: "Avg Loss", value: "₹320", color: "red" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
              <CardContent className="p-4">
                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                <p className={`text-2xl font-bold text-${stat.color}-400`}>{stat.value}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Journal Entries */}
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Recent Entries
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {journalEntries.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-lg p-5 hover:bg-white/10 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-white font-medium">{entry.symbol}</h4>
                    <Badge
                      variant="outline"
                      className={
                        entry.type === "Long"
                          ? "border-green-500/50 bg-green-500/10 text-green-400"
                          : "border-red-500/50 bg-red-500/10 text-red-400"
                      }
                    >
                      {entry.type}
                    </Badge>
                    <Badge
                      className={
                        entry.pnl > 0
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                      }
                    >
                      {entry.pnl > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {entry.pnl > 0 ? "+" : ""}₹{entry.pnl}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">{entry.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-400">Entry</p>
                  <p className="text-white">${entry.entry}</p>
                </div>
                <div>
                  <p className="text-gray-400">Exit</p>
                  <p className="text-white">${entry.exit}</p>
                </div>
                <div>
                  <p className="text-gray-400">P&L</p>
                  <p className={entry.pnl > 0 ? "text-green-400" : "text-red-400"}>
                    {entry.pnl > 0 ? "+" : ""}₹{entry.pnl}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Emotion</p>
                  <p className="text-cyan-400">{entry.emotion}</p>
                </div>
              </div>

              <div className="space-y-3 bg-white/5 rounded-lg p-3">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Trade Notes</p>
                  <p className="text-sm text-gray-300">{entry.notes}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Lessons Learned</p>
                  <p className="text-sm text-cyan-400">{entry.lessons}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
