"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export function Sessions6mBarChart(props: {
  data: { monthLabel: string; count: number }[]
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={props.data} margin={{ top: 8, right: 12, bottom: 0, left: -16 }}>
        <XAxis dataKey="monthLabel" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
        <Tooltip
          cursor={{ fill: "transparent" }}
          contentStyle={{
            fontSize: 11,
            padding: "4px 8px",
            border: "1px solid #e4e4e7",
            borderRadius: 6,
          }}
          formatter={(value) => [
            `${value} séance${Number(value) !== 1 ? "s" : ""}`,
            "Sessions",
          ]}
        />
        <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={44} />
      </BarChart>
    </ResponsiveContainer>
  )
}

