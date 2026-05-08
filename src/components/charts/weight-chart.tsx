"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

type DataPoint = { date: Date; weight: number }

export function WeightChart({ data }: { data: DataPoint[] }) {
  const chartData = [...data]
    .reverse()
    .map((d) => ({
      date: new Date(d.date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
      }),
      weight: d.weight,
    }))

  if (chartData.length < 2) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-zinc-400">
        Ajoutez au moins 2 mesures pour voir l&apos;évolution du poids.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f4f4f5" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
        <Tooltip
          formatter={(value) => [`${value} kg`, "Poids"]}
          contentStyle={{ fontSize: 12 }}
        />
        <Line
          type="monotone"
          dataKey="weight"
          stroke="#4f46e5"
          strokeWidth={2}
          dot={{ r: 3, fill: "#4f46e5" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
