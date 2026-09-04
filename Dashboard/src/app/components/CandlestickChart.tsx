import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { TrendingUp, Maximize2, Settings as SettingsIcon } from "lucide-react";
import { motion } from "motion/react";

const timeframes = ["1m", "5m", "15m", "1H", "4H", "Daily"];

// Generate mock candlestick data
const generateCandleData = () => {
  const data = [];
  let price = 45000;
  for (let i = 0; i < 50; i++) {
    const change = (Math.random() - 0.48) * 500;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * 200;
    const low = Math.min(open, close) - Math.random() * 200;
    
    data.push({
      time: `${i}:00`,
      open,
      close,
      high,
      low,
      volume: Math.random() * 1000000,
      color: close > open ? "#10b981" : "#ef4444",
    });
    
    price = close;
  }
  return data;
};

const data = generateCandleData();

const CustomCandlestick = (props: any) => {
  const { x, y, width, height, payload } = props;
  const isGreen = payload.close > payload.open;
  const color = isGreen ? "#10b981" : "#ef4444";
  
  return (
    <g>
      {/* Wick */}
      <line
        x1={x + width / 2}
        y1={y}
        x2={x + width / 2}
        y2={y + height}
        stroke={color}
        strokeWidth={1}
      />
      {/* Body */}
      <rect
        x={x}
        y={isGreen ? y + (height * 0.3) : y}
        width={width}
        height={Math.max(height * 0.7, 2)}
        fill={color}
      />
    </g>
  );
};

export default function CandlestickChart() {
  const currentPrice = data[data.length - 1].close;
  const priceChange = ((currentPrice - data[0].open) / data[0].open) * 100;
  const isPositive = priceChange > 0;

  return (
    <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-white">BTC/USDT</CardTitle>
            <Badge
              variant={isPositive ? "default" : "destructive"}
              className={
                isPositive
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-red-500/20 text-red-400 border-red-500/30"
              }
            >
              <TrendingUp className="w-3 h-3 mr-1" />
              {isPositive ? "+" : ""}
              {priceChange.toFixed(2)}%
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-white/5 rounded-lg p-1 gap-1">
              {timeframes.map((tf) => (
                <Button
                  key={tf}
                  variant="ghost"
                  size="sm"
                  className={
                    tf === "1H"
                      ? "bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30"
                      : "text-gray-400 hover:text-white hover:bg-white/10"
                  }
                >
                  {tf}
                </Button>
              ))}
            </div>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <SettingsIcon className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Maximize2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-baseline gap-3 mt-2">
          <span className="text-3xl text-white">${currentPrice.toFixed(2)}</span>
          <span className={isPositive ? "text-green-400" : "text-red-400"}>
            {isPositive ? "+" : ""}${(currentPrice - data[0].open).toFixed(2)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={data}>
              <defs>
                <linearGradient id="candlestick-colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="time"
                stroke="rgba(255,255,255,0.3)"
                tick={{ fill: "rgba(255,255,255,0.5)" }}
              />
              <YAxis
                yAxisId="price"
                stroke="rgba(255,255,255,0.3)"
                tick={{ fill: "rgba(255,255,255,0.5)" }}
                domain={["dataMin - 500", "dataMax + 500"]}
              />
              <YAxis
                yAxisId="volume"
                orientation="right"
                stroke="rgba(255,255,255,0.3)"
                tick={{ fill: "rgba(255,255,255,0.5)" }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15, 23, 42, 0.95)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px",
                  color: "white",
                }}
              />
              <ReferenceLine y={45000} stroke="#eab308" strokeDasharray="3 3" yAxisId="price" />
              <ReferenceLine y={46500} stroke="#10b981" strokeDasharray="3 3" yAxisId="price" />
              <Bar dataKey="volume" fill="url(#candlestick-colorVolume)" yAxisId="volume" />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Chart Annotations */}
          <div className="mt-4 flex gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-yellow-500"></div>
              <span className="text-gray-400">Support: $45,000</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-green-500"></div>
              <span className="text-gray-400">Resistance: $46,500</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-cyan-500"></div>
              <span className="text-gray-400">Entry: $45,800</span>
            </div>
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
