"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts"

export function SessionsSparkline({
  data,
}: {
  data: { day: string; count: number }[]
}) {
  return (
    <ResponsiveContainer width="100%" height={60}>
      <BarChart data={data}>
        <Tooltip
          cursor={{ fill: "transparent" }}
          contentStyle={{
            fontSize: 11,
            padding: "4px 8px",
            border: "1px solid #e4e4e7",
            borderRadius: 6,
          }}
          formatter={(value) => [
            `${value} séance${value !== 1 ? "s" : ""}`,
            "",
          ]}
        />
        <Bar
          dataKey="count"
          fill="#10b981"
          radius={[3, 3, 0, 0]}
          maxBarSize={20}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
