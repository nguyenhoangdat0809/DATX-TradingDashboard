import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "motion/react";

const scenarios = [
  {
    type: "Bullish",
    probability: 65,
    icon: TrendingUp,
    color: "green",
    targets: ["$46,800", "$48,200", "$50,500"],
    description: "Strong upward momentum with volume confirmation",
  },
  {
    type: "Bearish",
    probability: 20,
    icon: TrendingDown,
    color: "red",
    targets: ["$44,200", "$42,800", "$41,000"],
    description: "Potential pullback if support breaks",
  },
  {
    type: "Sideways",
    probability: 15,
    icon: Minus,
    color: "yellow",
    range: "$44,800 - $46,200",
    description: "Consolidation phase before next move",
  },
];

const colorClasses = {
  green: {
    bg: "from-green-500/20 to-emerald-500/20",
    border: "border-green-500/30",
    text: "text-green-400",
    badge: "bg-green-500/20 text-green-400 border-green-500/30",
  },
  red: {
    bg: "from-red-500/20 to-rose-500/20",
    border: "border-red-500/30",
    text: "text-red-400",
    badge: "bg-red-500/20 text-red-400 border-red-500/30",
  },
  yellow: {
    bg: "from-yellow-500/20 to-orange-500/20",
    border: "border-yellow-500/30",
    text: "text-yellow-400",
    badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  },
};

export default function ScenarioCards() {
  return (
    <div className="space-y-4">
      <h3 className="text-white">Future Scenarios</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((scenario, index) => {
          const colors = colorClasses[scenario.color as keyof typeof colorClasses];
          const Icon = scenario.icon;

          return (
            <motion.div
              key={scenario.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card
                className={`bg-gradient-to-br ${colors.bg} border ${colors.border} backdrop-blur-xl hover:scale-105 transition-transform`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                      <CardTitle className={colors.text}>{scenario.type}</CardTitle>
                    </div>
                    <Badge className={colors.badge}>{scenario.probability}%</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-gray-300">{scenario.description}</p>

                  {scenario.targets && (
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Price Targets:</p>
                      <div className="space-y-1">
                        {scenario.targets.map((target, i) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Target {i + 1}</span>
                            <span className={colors.text}>{target}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {scenario.range && (
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Expected Range:</p>
                      <p className={`text-sm ${colors.text}`}>{scenario.range}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
