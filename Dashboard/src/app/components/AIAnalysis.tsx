import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { TrendingUp, TrendingDown, Target, Shield, DollarSign } from "lucide-react";
import { motion } from "motion/react";

const analysisData = {
  trend: "Bullish",
  confidence: 87,
  support: 45000,
  resistance: 46500,
  entry: 45800,
  stopLoss: 44500,
  target1: 46800,
  target2: 48200,
  riskReward: "1:3.2",
};

export default function AIAnalysis() {
  return (
    <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white">AI Analysis</CardTitle>
          <Badge className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30">
            GPT-4 Powered
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Trend Direction</span>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              <TrendingUp className="w-3 h-3 mr-1" />
              {analysisData.trend}
            </Badge>
          </div>
        </motion.div>

        {/* Confidence */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">AI Confidence</span>
              <span className="text-cyan-400">{analysisData.confidence}%</span>
            </div>
            <Progress value={analysisData.confidence} className="h-2 bg-slate-700">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all"
                style={{ width: `${analysisData.confidence}%` }}
              />
            </Progress>
          </div>
        </motion.div>

        {/* Key Levels */}
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-yellow-400" />
              <span className="text-xs text-gray-400">Support</span>
            </div>
            <p className="text-lg text-yellow-400">${analysisData.support.toLocaleString()}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-red-500/10 border border-red-500/30 rounded-lg p-3"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-red-400" />
              <span className="text-xs text-gray-400">Resistance</span>
            </div>
            <p className="text-lg text-red-400">${analysisData.resistance.toLocaleString()}</p>
          </motion.div>
        </div>

        {/* Trading Setup */}
        <div className="space-y-3 bg-white/5 rounded-lg p-4">
          <h4 className="text-sm text-cyan-400 mb-3">Recommended Setup</h4>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Entry Point</span>
            <span className="text-green-400">${analysisData.entry.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Stop Loss</span>
            <span className="text-red-400">${analysisData.stopLoss.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Target 1</span>
            <span className="text-blue-400">${analysisData.target1.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Target 2</span>
            <span className="text-purple-400">${analysisData.target2.toLocaleString()}</span>
          </div>

          <div className="border-t border-white/10 pt-3 mt-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Risk:Reward Ratio</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                {analysisData.riskReward}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
