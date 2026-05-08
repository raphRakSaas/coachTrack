"use client"

import {
  CartesianGrid,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export function Sessions30dChart(props: {
  data: { dateLabel: string; count: number }[]
}) {
  if (props.data.length < 2) {
    return (
      <div className="flex h-52 items-center justify-center text-sm text-zinc-400">
        Pas assez de données pour afficher un graphique.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart
        data={props.data}
        margin={{ top: 8, right: 12, bottom: 0, left: -16 }}
      >
        <defs>
          <linearGradient id="sessionsArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#059669" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
        <XAxis dataKey="dateLabel" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
        <Tooltip
          formatter={(value) => [
            `${value} séance${Number(value) !== 1 ? "s" : ""}`,
            "Sessions",
          ]}
          contentStyle={{
            fontSize: 12,
            border: "1px solid #e4e4e7",
            borderRadius: 10,
          }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#059669"
          strokeWidth={2}
          fill="url(#sessionsArea)"
          dot={{ r: 2, fill: "#059669" }}
          activeDot={{ r: 4 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

