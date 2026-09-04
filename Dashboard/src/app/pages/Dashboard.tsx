import { useState } from "react";
import ChartUpload from "../components/ChartUpload";
import ScenarioCards from "../components/ScenarioCards";
import NewsImpact from "../components/NewsImpact";
import MarketWidgets from "../components/MarketWidgets";
import PaperTradingCard from "../components/PaperTradingCard";
import { motion } from "motion/react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, ShieldCheck } from "lucide-react";

const equityDatasets: Record<string, { date: string; value: number }[]> = {
  "7D": [
    { date: "Jul 25", value: 108200 },
    { date: "Jul 26", value: 108600 },
    { date: "Jul 27", value: 108900 },
    { date: "Jul 28", value: 109100 },
    { date: "Jul 29", value: 109000 },
    { date: "Jul 30", value: 109300 },
    { date: "Jul 31", value: 109420 },
  ],
  "30D": [
    { date: "Jun 25", value: 104200 },
    { date: "Jun 27", value: 104650 },
    { date: "Jun 29", value: 105100 },
    { date: "Jul 1", value: 104800 },
    { date: "Jul 5", value: 105900 },
    { date: "Jul 9", value: 106800 },
    { date: "Jul 13", value: 107500 },
    { date: "Jul 15", value: 107300 },
    { date: "Jul 17", value: 107700 },
    { date: "Jul 19", value: 108100 },
    { date: "Jul 21", value: 108400 },
    { date: "Jul 23", value: 108700 },
    { date: "Jul 25", value: 109000 },
    { date: "Jul 27", value: 109200 },
    { date: "Jul 29", value: 109350 },
    { date: "Jul 31", value: 109420 },
  ],
  "All": [
    { date: "Jan", value: 98000 },
    { date: "Feb", value: 99500 },
    { date: "Mar", value: 101200 },
    { date: "Apr", value: 100400 },
    { date: "May", value: 102800 },
    { date: "Jun", value: 104200 },
    { date: "Jul", value: 109420 },
  ],
};

function RiskBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function EquityDashboard() {
  const [period, setPeriod] = useState<"7D" | "30D" | "All">("30D");
  const [guardian, setGuardian] = useState(true);
  const data = equityDatasets[period];
  const minVal = Math.min(...data.map((d) => d.value));
  const yDomain = [Math.floor(minVal * 0.998 / 1000) * 1000, 111000];

  const stats = [
    {
      label: "WIN RATE",
      value: "67.4%",
      sub: "83 of 123 trades won",
      delta: "+2.1%",
      up: true,
    },
    {
      label: "PROFIT FACTOR",
      value: "2.18",
      sub: "Gross profit / gross loss",
      delta: "+0.12",
      up: true,
    },
    {
      label: "AVERAGE R",
      value: "1.42R",
      sub: "Risk-reward per trade",
      delta: "-0.06",
      up: false,
    },
    {
      label: "BEST DAY",
      value: "+$1,840",
      sub: "Jul 25 · Worst: -$310",
      delta: null,
      up: true,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Top row: Equity chart + Risk limits */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Equity Chart */}
        <div className="xl:col-span-2 rounded-xl border border-white/10 bg-[#0a0f1e] p-5 flex flex-col gap-3">
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <p className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase mb-1">Current Equity</p>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-white tracking-tight">$109,420</span>
                <span className="flex items-center gap-1 text-sm font-medium text-cyan-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +$9,420 (9.42%)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
              {(["7D", "30D", "All"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                    period === p
                      ? "bg-cyan-500 text-white shadow"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Profit target bar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-500 tracking-wider uppercase">Profit Target</span>
              <span className="text-[10px] font-semibold text-cyan-400">94.2% / 10.0%</span>
            </div>
            <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-400" style={{ width: "94.2%" }} />
            </div>
          </div>

          {/* Area Chart */}
          <div className="h-40 -mx-1">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={yDomain}
                  tick={{ fill: "#6b7280", fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                  width={36}
                />
                <Tooltip
                  contentStyle={{ background: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#94a3b8" }}
                  itemStyle={{ color: "#06b6d4" }}
                  formatter={(v: number) => [`$${v.toLocaleString()}`, "Equity"]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill="url(#equityGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#06b6d4", stroke: "#0a0f1e", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Limits */}
        <div className="rounded-xl border border-white/10 bg-[#0a0f1e] p-5 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase">Risk Limits</p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Guardian</span>
              <button
                onClick={() => setGuardian((g) => !g)}
                className={`relative w-9 h-5 rounded-full transition-colors ${guardian ? "bg-blue-500" : "bg-white/20"}`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${guardian ? "translate-x-4" : "translate-x-0.5"}`} />
              </button>
            </div>
          </div>

          {/* Max Daily Loss */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400" />
                <span className="text-sm text-gray-300">Max Daily Loss</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-white">$828</span>
                <span className="text-xs text-gray-500 ml-1">/ $3,000</span>
              </div>
            </div>
            <RiskBar pct={27.6} color="bg-gradient-to-r from-yellow-500 to-amber-400" />
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>27.6% used</span>
              <span className="text-cyan-400">$2,180 remaining</span>
            </div>
          </div>

          {/* Max Overall Loss */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                <span className="text-sm text-gray-300">Max Overall Loss</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-white">$2,100</span>
                <span className="text-xs text-gray-500 ml-1">/ $10,000</span>
              </div>
            </div>
            <RiskBar pct={21} color="bg-gradient-to-r from-red-500 to-rose-400" />
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>21.0% used</span>
              <span className="text-cyan-400">$7,900 remaining</span>
            </div>
          </div>

          {/* Min Trading Days */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span className="text-sm text-gray-300">Min Trading Days</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-white">12</span>
                <span className="text-xs text-gray-500 ml-1">/ 10 req.</span>
              </div>
            </div>
            <RiskBar pct={100} color="bg-gradient-to-r from-cyan-500 to-teal-400" />
            <div className="flex justify-between text-[10px] text-gray-500">
              <span>Requirement met</span>
              <span className="text-cyan-400 flex items-center gap-1">✓ Complete</span>
            </div>
          </div>

          {/* Guardian Mode Active */}
          <div className="mt-auto rounded-lg bg-blue-600/15 border border-blue-500/25 px-4 py-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span className="text-sm text-blue-300 font-medium">Guardian Mode Active</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-white/10 bg-[#0a0f1e] px-5 py-4 flex flex-col gap-1.5">
            <p className="text-[10px] font-semibold tracking-widest text-gray-500 uppercase">{s.label}</p>
            <p className="text-2xl font-bold text-white tracking-tight">{s.value}</p>
            <p className="text-xs text-gray-500">{s.sub}</p>
            {s.delta && (
              <div className={`flex items-center gap-1 text-xs font-medium ${s.up ? "text-green-400" : "text-red-400"}`}>
                {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {s.delta}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">AI-powered trading analysis and insights</p>
      </motion.div>

      {/* Equity Chart + Risk Limits + Stats */}
      <EquityDashboard />


      {/* Scenario Cards */}
      <ScenarioCards />

      {/* News Impact */}
      <NewsImpact />

      {/* Paper Trading Dashboard */}
      <PaperTradingCard />

      {/* Market Widgets */}
      <MarketWidgets />
    </div>
  );
}
