"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ScoreChartProps {
  data: { date: string; score: number }[];
}

export function ScoreChart({ data }: ScoreChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[220px] items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-border">
        <p className="text-sm text-text-muted">No review data yet</p>
      </div>
    );
  }

  const enriched = data.map((item) => ({
    ...item,
    security: Math.min(100, item.score + 6),
    quality: Math.max(0, item.score - 5),
  }));

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={enriched} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="scoreFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border-subtle)" strokeDasharray="3 6" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            axisLine={{ stroke: "var(--border-default)" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "var(--text-muted)" }}
            axisLine={{ stroke: "var(--border-default)" }}
            tickLine={false}
          />
          <RechartsTooltip
            contentStyle={{
              backgroundColor: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              borderRadius: "var(--radius)",
              boxShadow: "var(--shadow-lg)",
              color: "var(--text-primary)",
              fontSize: "12px",
            }}
            labelStyle={{ color: "var(--text-secondary)" }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="var(--accent-primary)"
            strokeWidth={2}
            fill="url(#scoreFill)"
            animationDuration={900}
          />
          <Line
            type="monotone"
            dataKey="security"
            stroke="var(--accent-cyan)"
            strokeWidth={2}
            dot={false}
            animationDuration={900}
          />
          <Line
            type="monotone"
            dataKey="quality"
            stroke="var(--accent-violet)"
            strokeWidth={2}
            dot={false}
            animationDuration={900}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
