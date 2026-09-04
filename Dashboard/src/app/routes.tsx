import { createBrowserRouter } from "react-router";
import Dashboard from "./pages/Dashboard";
import ChartAnalysis from "./pages/ChartAnalysis";
import PaperTrading from "./pages/PaperTrading";
import Watchlist from "./pages/Watchlist";
import NewsCenter from "./pages/NewsCenter";
import MarketHeatmap from "./pages/MarketHeatmap";
import Journal from "./pages/Journal";
import StrategyBuilder from "./pages/StrategyBuilder";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "chart-analysis", Component: ChartAnalysis },
      { path: "paper-trading", Component: PaperTrading },
      { path: "watchlist", Component: Watchlist },
      { path: "news", Component: NewsCenter },
      { path: "heatmap", Component: MarketHeatmap },
      { path: "journal", Component: Journal },
      { path: "strategy-builder", Component: StrategyBuilder },
      { path: "settings", Component: Settings },
    ],
  },
]);
