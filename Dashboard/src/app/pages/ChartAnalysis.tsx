import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import CandlestickChart from "../components/CandlestickChart";
import AIAnalysis from "../components/AIAnalysis";
import ChartUpload from "../components/ChartUpload";
import { PenTool, Layers, Maximize2 } from "lucide-react";
import { motion } from "motion/react";

const drawingTools = [
  "Trendline",
  "Horizontal Line",
  "Fibonacci",
  "Rectangle",
  "Channel",
  "Arrow",
];

const indicators = [
  { name: "RSI", active: true },
  { name: "MACD", active: true },
  { name: "Moving Average", active: false },
  { name: "Bollinger Bands", active: false },
  { name: "Volume", active: true },
  { name: "Stochastic", active: false },
];

export default function ChartAnalysis() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-white mb-2">Chart Analysis</h1>
        <p className="text-gray-400">Advanced technical analysis tools</p>
      </motion.div>

      {/* Drawing Tools */}
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <PenTool className="w-5 h-5 text-cyan-400" />
            Drawing Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {drawingTools.map((tool) => (
              <Button
                key={tool}
                variant="outline"
                className="border-white/10 bg-white/5 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-500/30"
              >
                {tool}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Indicators */}
      <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan-400" />
            Technical Indicators
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {indicators.map((indicator) => (
              <div
                key={indicator.name}
                className={`p-3 rounded-lg border ${
                  indicator.active
                    ? "bg-cyan-500/20 border-cyan-500/30"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <p className={`text-sm ${indicator.active ? "text-cyan-400" : "text-gray-400"}`}>
                  {indicator.name}
                </p>
                <Badge
                  variant="outline"
                  className={`mt-2 text-xs ${
                    indicator.active
                      ? "border-green-500/50 bg-green-500/10 text-green-400"
                      : "border-gray-600 text-gray-500"
                  }`}
                >
                  {indicator.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Chart and Analysis */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <CandlestickChart />
        </div>
        <div>
          <AIAnalysis />
        </div>
      </div>

      {/* Chart Upload */}
      <ChartUpload />
    </div>
  );
}
