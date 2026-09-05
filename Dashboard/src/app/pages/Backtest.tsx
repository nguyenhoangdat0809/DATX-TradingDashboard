import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine, BarChart, Bar,
} from "recharts";
import { Play, ChevronDown, ChevronUp, Minus, TrendingUp, TrendingDown, ChartLine as LineChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { motion } from "motion/react";

// ─── Data Generation ─────────────────────────────────────────────────────────

function makeLCG(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

interface OHLC { date: string; open: number; high: number; low: number; close: number; }

function generateOHLC(startPrice: number, days: number, annualDrift: number, annualVol: number, seed: number): OHLC[] {
  const rng = makeLCG(seed);
  const out: OHLC[] = [];
  let prev = startPrice;
  for (let i = 0; i < days; i++) {
    const drift = annualDrift / 252;
    const vol = annualVol / Math.sqrt(252);
    const u1 = rng(), u2 = rng();
    const z = Math.sqrt(-2 * Math.log(u1 + 1e-9)) * Math.cos(2 * Math.PI * u2);
    const close = prev * Math.exp(drift + vol * z);
    const openDrift = (rng() - 0.5) * vol * 0.5;
    const open = prev * Math.exp(openDrift);
    const spread = (Math.abs(close - open) + close * vol * rng() * 0.5);
    const high = Math.max(open, close) + spread * rng() * 0.4;
    const low = Math.max(0.01, Math.min(open, close) - spread * rng() * 0.4);
    out.push({ date: "", open: +open.toFixed(2), high: +high.toFixed(2), low: +low.toFixed(2), close: +close.toFixed(2) });
    prev = close;
  }
  return out;
}

function sma(prices: number[], period: number): (number | null)[] {
  return prices.map((_, i) =>
    i < period - 1 ? null : prices.slice(i - period + 1, i + 1).reduce((a, b) => a + b) / period
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Trade { id: number; date: string; symbol: string; side: "BUY" | "SELL"; qty: number; price: number; pnl: number | null; pnlPct: number | null; cumPnl: number; }
interface EquityPoint { date: string; equity: number; drawdown: number; benchmark: number; }
interface BacktestResult {
  ohlc: OHLC[]; fastSma: (number | null)[]; slowSma: (number | null)[];
  trades: Trade[]; equity: EquityPoint[];
  metrics: { totalReturn: number; cagr: number; sharpe: number; maxDrawdown: number; winRate: number; profitFactor: number; totalTrades: number; avgWin: number; avgLoss: number; bestTrade: number; worstTrade: number; benchmarkReturn: number; };
  monthlyReturns: { month: string; return: number }[];
}

// ─── Backtester ───────────────────────────────────────────────────────────────

const SEED_MAP: Record<string, number> = { AAPL: 42, MSFT: 137, NVDA: 99, SPY: 17, QQQ: 56 };
const PRICE_MAP: Record<string, number> = { AAPL: 148, MSFT: 285, NVDA: 220, SPY: 415, QQQ: 340 };

function runBacktest(p: { symbol: string; fastPeriod: number; slowPeriod: number; initialCapital: number; positionSize: number; startDate: string; endDate: string; stopLoss: number; takeProfit: number; }): BacktestResult {
  const start = new Date(p.startDate), end = new Date(p.endDate);
  const days: string[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) days.push(d.toISOString().slice(0, 10));
  }
  const n = days.length;
  const seed = SEED_MAP[p.symbol] ?? 42;
  const sp = PRICE_MAP[p.symbol] ?? 150;
  const ohlcRaw = generateOHLC(sp, n, 0.12, 0.22, seed);
  const ohlc: OHLC[] = ohlcRaw.map((c, i) => ({ ...c, date: days[i] }));
  const closes = ohlc.map(c => c.close);
  const benchRaw = generateOHLC(415, n, 0.08, 0.14, 999);
  const benchCloses = benchRaw.map(c => c.close);
  const fastSma = sma(closes, p.fastPeriod);
  const slowSma = sma(closes, p.slowPeriod);

  let capital = p.initialCapital, pos = 0, entry = 0, cumPnl = 0, tradeId = 1;
  const trades: Trade[] = [];
  const equity: EquityPoint[] = [];
  let peak = p.initialCapital;

  for (let i = 1; i < n; i++) {
    const f = fastSma[i], fp = fastSma[i - 1], s = slowSma[i], sp2 = slowSma[i - 1];
    const price = closes[i];
    if (f != null && fp != null && s != null && sp2 != null) {
      if (pos > 0) {
        const pct = (price - entry) / entry;
        if ((p.stopLoss > 0 && pct < -p.stopLoss / 100) || (p.takeProfit > 0 && pct > p.takeProfit / 100) || (fp > sp2 && f <= s)) {
          const pnl = (price - entry) * pos;
          cumPnl += pnl; capital += pnl;
          trades.push({ id: tradeId++, date: days[i], symbol: p.symbol, side: "SELL", qty: pos, price, pnl, pnlPct: pct * 100, cumPnl });
          pos = 0; entry = 0;
        }
      }
      if (pos === 0 && fp <= sp2 && f > s) {
        const qty = Math.floor((capital * p.positionSize / 100) / price);
        if (qty > 0) { pos = qty; entry = price; trades.push({ id: tradeId++, date: days[i], symbol: p.symbol, side: "BUY", qty, price, pnl: null, pnlPct: null, cumPnl }); }
      }
    }
    const totalEq = capital + (pos > 0 ? (price - entry) * pos : 0);
    peak = Math.max(peak, totalEq);
    equity.push({ date: days[i], equity: +totalEq.toFixed(2), drawdown: -+((peak - totalEq) / peak * 100).toFixed(2), benchmark: +(p.initialCapital * benchCloses[i] / benchCloses[0]).toFixed(2) });
  }

  const closed = trades.filter(t => t.pnl != null);
  const wins = closed.filter(t => (t.pnl ?? 0) > 0);
  const losses = closed.filter(t => (t.pnl ?? 0) <= 0);
  const lastEqItem = equity[equity.length - 1];
  const lastEq = lastEqItem ? lastEqItem.equity : p.initialCapital;
  const totalReturn = (lastEq - p.initialCapital) / p.initialCapital * 100;
  const years = n / 252;
  const cagr = (Math.pow(lastEq / p.initialCapital, 1 / years) - 1) * 100;
  const maxDD = Math.min(...equity.map(e => e.drawdown));
  const winRate = closed.length > 0 ? wins.length / closed.length * 100 : 0;
  const avgWin = wins.length > 0 ? wins.reduce((a, t) => a + (t.pnl ?? 0), 0) / wins.length : 0;
  const avgLoss = losses.length > 0 ? losses.reduce((a, t) => a + (t.pnl ?? 0), 0) / losses.length : 0;
  const gp = wins.reduce((a, t) => a + (t.pnl ?? 0), 0);
  const gl = Math.abs(losses.reduce((a, t) => a + (t.pnl ?? 0), 0));
  const profitFactor = gl > 0 ? gp / gl : gp > 0 ? 99 : 0;
  const bestTrade = closed.length > 0 ? Math.max(...closed.map(t => t.pnl ?? 0)) : 0;
  const worstTrade = closed.length > 0 ? Math.min(...closed.map(t => t.pnl ?? 0)) : 0;
  const lastEqBench = equity[equity.length - 1];
  const benchRet = ((lastEqBench ? lastEqBench.benchmark : p.initialCapital) - p.initialCapital) / p.initialCapital * 100;
  const dr = equity.slice(1).map((e, i) => (e.equity - equity[i].equity) / equity[i].equity);
  const meanD = dr.reduce((a, b) => a + b, 0) / (dr.length || 1);
  const stdD = Math.sqrt(dr.reduce((a, b) => a + (b - meanD) ** 2, 0) / (dr.length || 1));
  const sharpe = stdD > 0 ? (meanD / stdD) * Math.sqrt(252) : 0;

  const moMap: Record<string, number[]> = {};
  equity.forEach(e => { const mo = e.date.slice(0, 7); if (!moMap[mo]) moMap[mo] = []; moMap[mo].push(e.equity); });
  const moKeys = Object.keys(moMap).sort();
  const monthlyReturns = moKeys.slice(1).map((mo, i) => {
    const prevArr = moMap[moKeys[i]];
    const currArr = moMap[mo];
    const pv = prevArr[prevArr.length - 1];
    const cv = currArr[currArr.length - 1];
    return { month: mo, return: pv ? (cv - pv) / pv * 100 : 0 };
  });

  return { ohlc, fastSma, slowSma, trades, equity, metrics: { totalReturn, cagr, sharpe, maxDrawdown: maxDD, winRate, profitFactor, totalTrades: closed.length, avgWin, avgLoss, bestTrade, worstTrade, benchmarkReturn: benchRet }, monthlyReturns };
}

// ─── SVG Candlestick Chart ────────────────────────────────────────────────────

interface CandleChartProps {
  ohlc: OHLC[]; fastSma: (number | null)[]; slowSma: (number | null)[];
  fastPeriod: number; slowPeriod: number; trades: Trade[];
}

function CandleChart({ ohlc, fastSma, slowSma, fastPeriod, slowPeriod, trades }: CandleChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 380 });
  const [crosshair, setCrosshair] = useState<{ x: number; y: number; i: number } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const maxCandles = 200;
  const step = Math.max(1, Math.floor(ohlc.length / maxCandles));
  const visible = useMemo(() => ohlc.filter((_, i) => i % step === 0), [ohlc, step]);
  const visIdx = useMemo(() => visible.map((_, vi) => vi * step), [visible, step]);

  const PAD = { l: 56, r: 8, t: 12, b: 28 };
  const W = size.w, H = size.h;
  const chartW = W - PAD.l - PAD.r;
  const chartH = H - PAD.t - PAD.b;

  const allPrices = visible.flatMap(c => [c.high, c.low]);
  const [minP, maxP] = [Math.min(...allPrices) * 0.998, Math.max(...allPrices) * 1.002];
  const priceRange = maxP - minP;

  const xOf = (vi: number) => PAD.l + (vi + 0.5) * (chartW / visible.length);
  const yOf = (price: number) => PAD.t + chartH - ((price - minP) / priceRange) * chartH;
  const candleW = Math.max(1, Math.min(10, (chartW / visible.length) * 0.7));

  const fastPoints = visIdx.map((si, vi) => fastSma[si] != null ? `${xOf(vi)},${yOf(fastSma[si]!)}` : null);
  const slowPoints = visIdx.map((si, vi) => slowSma[si] != null ? `${xOf(vi)},${yOf(slowSma[si]!)}` : null);
  const toPath = (pts: (string | null)[]) => {
    let d = "";
    pts.forEach((p, i) => {
      if (!p) return;
      const prevSlice = pts.slice(0, i);
      let prev: string | null = null;
      for (let j = prevSlice.length - 1; j >= 0; j--) { if (prevSlice[j] != null) { prev = prevSlice[j]; break; } }
      d += prev ? ` L${p}` : `M${p}`;
    });
    return d;
  };

  const yTicks = 5;
  const yTickVals = Array.from({ length: yTicks }, (_, i) => minP + (priceRange * i) / (yTicks - 1));

  const xLabelCount = 6;
  const xLabelIdxs = Array.from({ length: xLabelCount }, (_, i) => Math.round(i * (visible.length - 1) / (xLabelCount - 1)));

  const buyTrades = trades.filter(t => t.side === "BUY");
  const sellTrades = trades.filter(t => t.side === "SELL");
  const tradeToVI = (date: string) => {
    const si = ohlc.findIndex(c => c.date >= date);
    return si >= 0 ? Math.round(si / step) : -1;
  };

  const hoveredCandle = crosshair != null ? visible[crosshair.i] : null;
  const hoveredFast = crosshair != null ? fastSma[visIdx[crosshair.i]] : null;
  const hoveredSlow = crosshair != null ? slowSma[visIdx[crosshair.i]] : null;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    const mx = e.clientX - rect.left - PAD.l;
    const my = e.clientY - rect.top;
    const i = Math.round(mx / (chartW / visible.length) - 0.5);
    if (i >= 0 && i < visible.length) setCrosshair({ x: xOf(i), y: my, i });
    else setCrosshair(null);
  };

  return (
    <div ref={containerRef} className="w-full h-full relative select-none">
      <svg width={W} height={H} onMouseMove={handleMouseMove} onMouseLeave={() => setCrosshair(null)} className="cursor-crosshair">
        {yTickVals.map((v, i) => (
          <g key={i}>
            <line x1={PAD.l} x2={W - PAD.r} y1={yOf(v)} y2={yOf(v)} stroke="rgba(6,182,212,0.06)" strokeWidth={1} />
            <text x={PAD.l - 4} y={yOf(v) + 4} textAnchor="end" fontSize={9} fill="#6b7280" fontFamily="monospace">
              {v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0)}
            </text>
          </g>
        ))}
        {xLabelIdxs.map((vi) => (
          <text key={vi} x={xOf(vi)} y={H - 6} textAnchor="middle" fontSize={9} fill="#6b7280" fontFamily="monospace">
            {visible[vi]?.date.slice(2, 10)}
          </text>
        ))}
        <path d={toPath(slowPoints)} fill="none" stroke="#00b4e8" strokeWidth={1.2} opacity={0.85} />
        <path d={toPath(fastPoints)} fill="none" stroke="#f5a623" strokeWidth={1.2} opacity={0.85} />
        {visible.map((c, vi) => {
          const x = xOf(vi);
          const isUp = c.close >= c.open;
          const color = isUp ? "#10b981" : "#ef4444";
          const bodyTop = yOf(Math.max(c.open, c.close));
          const bodyBot = yOf(Math.min(c.open, c.close));
          const bodyH = Math.max(1, bodyBot - bodyTop);
          return (
            <g key={vi}>
              <line x1={x} x2={x} y1={yOf(c.high)} y2={yOf(c.low)} stroke={color} strokeWidth={1} />
              <rect x={x - candleW / 2} y={bodyTop} width={candleW} height={bodyH} fill={color} opacity={isUp ? 0.9 : 0.85} />
            </g>
          );
        })}
        {buyTrades.map((t) => {
          const vi = tradeToVI(t.date);
          if (vi < 0 || vi >= visible.length) return null;
          const x = xOf(vi);
          const y = yOf(visible[vi].low) + 12;
          return <polygon key={`b${t.id}`} points={`${x},${y - 8} ${x - 5},${y} ${x + 5},${y}`} fill="#10b981" opacity={0.9} />;
        })}
        {sellTrades.map((t) => {
          const vi = tradeToVI(t.date);
          if (vi < 0 || vi >= visible.length) return null;
          const x = xOf(vi);
          const y = yOf(visible[vi].high) - 12;
          const color = (t.pnl ?? 0) >= 0 ? "#f5a623" : "#ef4444";
          return <polygon key={`s${t.id}`} points={`${x},${y + 8} ${x - 5},${y} ${x + 5},${y}`} fill={color} opacity={0.9} />;
        })}
        {crosshair && (
          <>
            <line x1={crosshair.x} x2={crosshair.x} y1={PAD.t} y2={H - PAD.b} stroke="rgba(6,182,212,0.3)" strokeWidth={1} strokeDasharray="3 3" />
            <line x1={PAD.l} x2={W - PAD.r} y1={crosshair.y} y2={crosshair.y} stroke="rgba(6,182,212,0.3)" strokeWidth={1} strokeDasharray="3 3" />
          </>
        )}
      </svg>
      {crosshair && hoveredCandle && (
        <div className="absolute pointer-events-none bg-slate-900 border border-white/10 px-3 py-2 text-[10px] font-mono z-10 rounded-md" style={{ left: crosshair.x + 12 > W - 160 ? crosshair.x - 148 : crosshair.x + 12, top: 16 }}>
          <div className="text-gray-400 mb-1.5">{hoveredCandle.date}</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
            <span className="text-gray-400">O</span><span className="text-white">{hoveredCandle.open.toFixed(2)}</span>
            <span className="text-gray-400">H</span><span className="text-green-400">{hoveredCandle.high.toFixed(2)}</span>
            <span className="text-gray-400">L</span><span className="text-red-400">{hoveredCandle.low.toFixed(2)}</span>
            <span className="text-gray-400">C</span><span className={hoveredCandle.close >= hoveredCandle.open ? "text-green-400" : "text-red-400"}>{hoveredCandle.close.toFixed(2)}</span>
            {hoveredFast != null && <><span className="text-amber-400">SMA{fastPeriod}</span><span className="text-white">{hoveredFast.toFixed(2)}</span></>}
            {hoveredSlow != null && <><span className="text-cyan-400">SMA{slowPeriod}</span><span className="text-white">{hoveredSlow.toFixed(2)}</span></>}
          </div>
        </div>
      )}
      <div className="absolute top-2 right-3 flex items-center gap-4 text-[10px] font-mono text-gray-400 pointer-events-none">
        <span className="flex items-center gap-1.5"><span className="inline-block w-4 h-px bg-amber-400" />SMA {fastPeriod}</span>
        <span className="flex items-center gap-1.5"><span className="inline-block w-4 h-px bg-cyan-400" />SMA {slowPeriod}</span>
        <span className="flex items-center gap-1.5"><span className="text-green-400">▲</span>Entry</span>
        <span className="flex items-center gap-1.5"><span className="text-amber-400">▼</span>Exit+</span>
        <span className="flex items-center gap-1.5"><span className="text-red-400">▼</span>Exit−</span>
      </div>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

type SortDir = "asc" | "desc";
function fmt(n: number, dec = 2) { return n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
function fmtPct(n: number) { return `${n >= 0 ? "+" : ""}${fmt(n)}%`; }
function fmtUSD(n: number) { return `$${fmt(Math.abs(n))}`; }

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-white/10 px-3 py-2 text-[11px] font-mono rounded-md">
      <div className="text-gray-400 mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex gap-3 justify-between">
          <span style={{ color: p.color }}>{p.name}</span>
          <span className="text-white">{p.dataKey === "drawdown" ? `${fmt(p.value)}%` : `$${fmt(p.value)}`}</span>
        </div>
      ))}
    </div>
  );
};

function MetricCard({ label, value, sub, positive }: { label: string; value: string; sub?: string; positive?: boolean }) {
  const color = positive === undefined ? "text-white" : positive ? "text-green-400" : "text-red-400";
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col gap-1">
      <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono">{label}</span>
      <span className={`text-lg font-mono font-semibold leading-none ${color}`}>{value}</span>
      {sub && <span className="text-[10px] text-gray-500 font-mono">{sub}</span>}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const STRATEGIES = [{ label: "SMA Crossover", value: "sma_cross" }, { label: "EMA Crossover", value: "ema_cross" }, { label: "RSI Mean Reversion", value: "rsi_rev" }, { label: "Momentum Breakout", value: "momentum" }];
const SYMBOLS = [{ label: "AAPL — Apple Inc.", value: "AAPL" }, { label: "MSFT — Microsoft Corp.", value: "MSFT" }, { label: "NVDA — NVIDIA Corp.", value: "NVDA" }, { label: "SPY — S&P 500 ETF", value: "SPY" }, { label: "QQQ — Nasdaq-100 ETF", value: "QQQ" }];
type Tab = "candles" | "equity" | "drawdown" | "monthly";

export default function Backtest() {
  const [symbol, setSymbol] = useState("AAPL");
  const [strategy, setStrategy] = useState("sma_cross");
  const [fastPeriod, setFastPeriod] = useState(20);
  const [slowPeriod, setSlowPeriod] = useState(50);
  const [initialCapital, setInitialCapital] = useState(100000);
  const [positionSize, setPositionSize] = useState(95);
  const [stopLoss, setStopLoss] = useState(5);
  const [takeProfit, setTakeProfit] = useState(20);
  const [startDate, setStartDate] = useState("2021-01-01");
  const [endDate, setEndDate] = useState("2024-12-31");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [tab, setTab] = useState<Tab>("candles");
  const [tradeSort, setTradeSort] = useState<{ key: string; dir: SortDir }>({ key: "id", dir: "desc" });
  const [tradePage, setTradePage] = useState(0);
  const PAGE = 20;

  const handleRun = useCallback(() => {
    setRunning(true);
    setTimeout(() => {
      setResult(runBacktest({ symbol, fastPeriod, slowPeriod, initialCapital, positionSize, stopLoss, takeProfit, startDate, endDate }));
      setRunning(false);
      setTradePage(0);
    }, 400);
  }, [symbol, fastPeriod, slowPeriod, initialCapital, positionSize, stopLoss, takeProfit, startDate, endDate]);

  const closedTrades = useMemo(() => result?.trades.filter(t => t.pnl != null) ?? [], [result]);
  const sortedTrades = useMemo(() => {
    const arr = [...closedTrades];
    arr.sort((a, b) => { const av = (a as any)[tradeSort.key], bv = (b as any)[tradeSort.key]; return tradeSort.dir === "asc" ? (av > bv ? 1 : -1) : av < bv ? 1 : -1; });
    return arr;
  }, [closedTrades, tradeSort]);
  const pagedTrades = sortedTrades.slice(tradePage * PAGE, (tradePage + 1) * PAGE);
  const totalPages = Math.ceil(sortedTrades.length / PAGE);
  const toggleSort = (key: string) => setTradeSort(p => p.key === key ? { key, dir: p.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" });

  const equityData = useMemo(() => {
    if (!result) return [];
    const step = Math.max(1, Math.floor(result.equity.length / 300));
    return result.equity.filter((_, i) => i % step === 0);
  }, [result]);

  const m = result?.metrics;
  const TABS: { id: Tab; label: string }[] = [{ id: "candles", label: "Candles" }, { id: "equity", label: "Equity Curve" }, { id: "drawdown", label: "Drawdown" }, { id: "monthly", label: "Monthly P&L" }];

  return (
    <div className="p-6 space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-white mb-2">Backtester</h1>
        <p className="text-gray-400">Test trading strategies with historical data · v2.4.1 · Synthetic data</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Config Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl sticky top-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <LineChart className="w-5 h-5 text-cyan-400" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Instrument */}
              <div className="space-y-3">
                <p className="text-[10px] text-cyan-400 uppercase tracking-[0.2em] font-semibold">Instrument</p>
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs">Symbol</Label>
                  <select value={symbol} onChange={e => setSymbol(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2 rounded-md focus:outline-none focus:border-cyan-500/50">
                    {SYMBOLS.map(o => <option key={o.value} value={o.value} className="bg-slate-900">{o.label}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs">Start Date</Label>
                  <Input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg-white/5 border-white/10 text-white font-mono text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs">End Date</Label>
                  <Input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-white/5 border-white/10 text-white font-mono text-sm" />
                </div>
              </div>

              {/* Strategy */}
              <div className="space-y-3">
                <p className="text-[10px] text-cyan-400 uppercase tracking-[0.2em] font-semibold">Strategy</p>
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs">Type</Label>
                  <select value={strategy} onChange={e => setStrategy(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 text-white text-sm px-3 py-2 rounded-md focus:outline-none focus:border-cyan-500/50">
                    {STRATEGIES.map(o => <option key={o.value} value={o.value} className="bg-slate-900">{o.label}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Fast Period</Label>
                    <Input type="number" value={fastPeriod} min={2} max={200} onChange={e => setFastPeriod(Number(e.target.value))} className="bg-white/5 border-white/10 text-white font-mono text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Slow Period</Label>
                    <Input type="number" value={slowPeriod} min={2} max={500} onChange={e => setSlowPeriod(Number(e.target.value))} className="bg-white/5 border-white/10 text-white font-mono text-sm" />
                  </div>
                </div>
              </div>

              {/* Risk */}
              <div className="space-y-3">
                <p className="text-[10px] text-cyan-400 uppercase tracking-[0.2em] font-semibold">Risk Management</p>
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs">Capital ($)</Label>
                  <Input type="number" value={initialCapital} min={1000} onChange={e => setInitialCapital(Number(e.target.value))} className="bg-white/5 border-white/10 text-white font-mono text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Position (%)</Label>
                    <Input type="number" value={positionSize} min={1} max={100} onChange={e => setPositionSize(Number(e.target.value))} className="bg-white/5 border-white/10 text-white font-mono text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-400 text-xs">Stop Loss (%)</Label>
                    <Input type="number" value={stopLoss} min={0} max={50} onChange={e => setStopLoss(Number(e.target.value))} className="bg-white/5 border-white/10 text-white font-mono text-sm" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-400 text-xs">Take Profit (%)</Label>
                  <Input type="number" value={takeProfit} min={0} max={200} onChange={e => setTakeProfit(Number(e.target.value))} className="bg-white/5 border-white/10 text-white font-mono text-sm" />
                </div>
              </div>

              <Button onClick={handleRun} disabled={running}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white">
                {running ? (<><div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />Running...</>) : (<><Play className="w-4 h-4" />Run Backtest</>)}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {!result ? (
            <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
              <CardContent className="flex items-center justify-center flex-col gap-4 py-24">
                <div className="border border-white/10 w-16 h-16 flex items-center justify-center rounded-lg">
                  <Play size={24} className="text-gray-400 ml-1" />
                </div>
                <p className="text-gray-400 text-sm">Configure strategy and run backtest</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Metrics */}
              <div>
                <p className="text-[10px] text-cyan-400 uppercase tracking-[0.2em] font-semibold mb-3">Performance Summary</p>
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-2">
                  <MetricCard label="Total Return" value={fmtPct(m!.totalReturn)} sub={`vs ${fmtPct(m!.benchmarkReturn)} benchmark`} positive={m!.totalReturn > 0} />
                  <MetricCard label="CAGR" value={fmtPct(m!.cagr)} positive={m!.cagr > 0} />
                  <MetricCard label="Sharpe Ratio" value={fmt(m!.sharpe)} sub={m!.sharpe > 1 ? "Good" : m!.sharpe > 0.5 ? "Fair" : "Poor"} positive={m!.sharpe > 1} />
                  <MetricCard label="Max Drawdown" value={`${fmt(m!.maxDrawdown)}%`} positive={false} />
                  <MetricCard label="Win Rate" value={`${fmt(m!.winRate)}%`} sub={`${closedTrades.filter(t => (t.pnl ?? 0) > 0).length}W / ${closedTrades.filter(t => (t.pnl ?? 0) <= 0).length}L`} positive={m!.winRate > 50} />
                  <MetricCard label="Profit Factor" value={fmt(m!.profitFactor)} positive={m!.profitFactor > 1} />
                  <MetricCard label="Total Trades" value={String(m!.totalTrades)} />
                  <MetricCard label="Avg Win" value={fmtUSD(m!.avgWin)} positive={true} />
                  <MetricCard label="Avg Loss" value={fmtUSD(m!.avgLoss)} positive={false} />
                  <MetricCard label="Best Trade" value={fmtUSD(m!.bestTrade)} positive={true} />
                  <MetricCard label="Worst Trade" value={fmtUSD(m!.worstTrade)} positive={false} />
                  <MetricCard label="Final Equity" value={`$${fmt(result.equity[result.equity.length - 1] ? result.equity[result.equity.length - 1].equity : initialCapital, 0)}`} />
                </div>
              </div>

              {/* Charts */}
              <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl">
                <div className="flex items-center gap-0 border-b border-white/10">
                  {TABS.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                      className={`px-4 py-2 text-[11px] uppercase tracking-widest border-b-2 transition-colors ${tab === t.id ? "border-cyan-500 text-cyan-400" : "border-transparent text-gray-400 hover:text-white"}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
                <div style={{ height: tab === "candles" ? 400 : 260 }}>
                  {tab === "candles" && (
                    <CandleChart ohlc={result.ohlc} fastSma={result.fastSma} slowSma={result.slowSma} fastPeriod={fastPeriod} slowPeriod={slowPeriod} trades={result.trades} />
                  )}
                  {tab === "equity" && (
                    <div className="p-4 h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={equityData}>
                          <defs>
                            <linearGradient id="eq" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06b6d4" stopOpacity={0.2} /><stop offset="100%" stopColor="#06b6d4" stopOpacity={0} /></linearGradient>
                            <linearGradient id="bm" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6b7280" stopOpacity={0.15} /><stop offset="100%" stopColor="#6b7280" stopOpacity={0} /></linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="1 4" stroke="rgba(6,182,212,0.06)" />
                          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#6b7280", fontFamily: "monospace" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                          <YAxis tick={{ fontSize: 10, fill: "#6b7280", fontFamily: "monospace" }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="benchmark" name="Benchmark" stroke="#6b7280" strokeWidth={1} fill="url(#bm)" dot={false} />
                          <Area type="monotone" dataKey="equity" name="Strategy" stroke="#06b6d4" strokeWidth={1.5} fill="url(#eq)" dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  {tab === "drawdown" && (
                    <div className="p-4 h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={equityData}>
                          <defs>
                            <linearGradient id="dd" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ef4444" stopOpacity={0} /><stop offset="100%" stopColor="#ef4444" stopOpacity={0.25} /></linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="1 4" stroke="rgba(6,182,212,0.06)" />
                          <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#6b7280", fontFamily: "monospace" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                          <YAxis tick={{ fontSize: 10, fill: "#6b7280", fontFamily: "monospace" }} tickLine={false} axisLine={false} tickFormatter={v => `${v.toFixed(1)}%`} />
                          <ReferenceLine y={0} stroke="rgba(6,182,212,0.2)" strokeDasharray="2 4" />
                          <Tooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="drawdown" name="Drawdown" stroke="#ef4444" strokeWidth={1.5} fill="url(#dd)" dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  {tab === "monthly" && (
                    <div className="p-4 h-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={result.monthlyReturns} barCategoryGap="20%">
                          <CartesianGrid strokeDasharray="1 4" stroke="rgba(6,182,212,0.06)" />
                          <XAxis dataKey="month" tick={{ fontSize: 9, fill: "#6b7280", fontFamily: "monospace" }} tickLine={false} axisLine={false} interval={2} />
                          <YAxis tick={{ fontSize: 10, fill: "#6b7280", fontFamily: "monospace" }} tickLine={false} axisLine={false} tickFormatter={v => `${v.toFixed(1)}%`} />
                          <ReferenceLine y={0} stroke="rgba(6,182,212,0.2)" />
                          <Tooltip content={<CustomTooltip />} />
                          <Bar dataKey="return" name="Monthly Return" radius={[1, 1, 0, 0]} fill="#06b6d4" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              </Card>

              {/* Trade log */}
              <div>
                <p className="text-[10px] text-cyan-400 uppercase tracking-[0.2em] font-semibold mb-3">Trade Log · {closedTrades.length} closed trades</p>
                <Card className="bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-white/10 backdrop-blur-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px] font-mono">
                      <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                          {[{ key: "id", label: "#" }, { key: "date", label: "Date" }, { key: "side", label: "Side" }, { key: "qty", label: "Qty" }, { key: "price", label: "Price" }, { key: "pnl", label: "P&L ($)" }, { key: "pnlPct", label: "P&L (%)" }, { key: "cumPnl", label: "Cum. P&L" }].map(col => (
                            <th key={col.key} onClick={() => toggleSort(col.key)}
                              className="px-3 py-2 text-left text-gray-400 uppercase tracking-widest cursor-pointer hover:text-white select-none whitespace-nowrap">
                              <span className="flex items-center gap-1">
                                {col.label}
                                {tradeSort.key === col.key ? (tradeSort.dir === "asc" ? <ChevronUp size={10} /> : <ChevronDown size={10} />) : <Minus size={10} className="opacity-20" />}
                              </span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {pagedTrades.map((t, i) => (
                          <tr key={t.id} className={`border-b border-white/10 hover:bg-white/5 transition-colors ${i % 2 === 0 ? "" : "bg-white/[0.02]"}`}>
                            <td className="px-3 py-1.5 text-gray-400">{t.id}</td>
                            <td className="px-3 py-1.5 text-white">{t.date}</td>
                            <td className="px-3 py-1.5">
                              <span className={`flex items-center gap-1 ${(t.pnl ?? 0) > 0 ? "text-green-400" : "text-red-400"}`}>
                                {(t.pnl ?? 0) > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}CLOSE
                              </span>
                            </td>
                            <td className="px-3 py-1.5 text-white">{t.qty}</td>
                            <td className="px-3 py-1.5 text-white">${fmt(t.price)}</td>
                            <td className={`px-3 py-1.5 font-semibold ${(t.pnl ?? 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                              {t.pnl != null ? `${(t.pnl ?? 0) >= 0 ? "+" : ""}${fmtUSD(t.pnl)}` : "—"}
                            </td>
                            <td className={`px-3 py-1.5 ${(t.pnlPct ?? 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                              {t.pnlPct != null ? fmtPct(t.pnlPct) : "—"}
                            </td>
                            <td className={`px-3 py-1.5 ${t.cumPnl >= 0 ? "text-green-400" : "text-red-400"}`}>
                              {t.cumPnl >= 0 ? "+" : ""}{fmtUSD(t.cumPnl)}
                            </td>
                          </tr>
                        ))}
                        {pagedTrades.length === 0 && (
                          <tr><td colSpan={8} className="px-3 py-6 text-center text-gray-400">No trades</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-3 py-2 border-t border-white/10 bg-white/5">
                      <span className="text-[10px] text-gray-400">Showing {tradePage * PAGE + 1}–{Math.min((tradePage + 1) * PAGE, sortedTrades.length)} of {sortedTrades.length}</span>
                      <div className="flex gap-1">
                        <button onClick={() => setTradePage(p => Math.max(0, p - 1))} disabled={tradePage === 0} className="px-2 py-1 text-[10px] border border-white/10 rounded hover:border-cyan-500/50 disabled:opacity-30 transition-colors text-gray-300">Prev</button>
                        <button onClick={() => setTradePage(p => Math.min(totalPages - 1, p + 1))} disabled={tradePage >= totalPages - 1} className="px-2 py-1 text-[10px] border border-white/10 rounded hover:border-cyan-500/50 disabled:opacity-30 transition-colors text-gray-300">Next</button>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
