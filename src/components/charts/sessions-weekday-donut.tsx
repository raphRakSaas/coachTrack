"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const COLORS = ["#059669", "#10b981", "#34d399", "#a7f3d0", "#86efac", "#6ee7b7", "#047857"]

export function SessionsWeekdayDonut(props: {
  data: { label: string; count: number }[]
}) {
  const total = props.data.reduce((acc, it) => acc + it.count, 0)
  if (total === 0) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-zinc-400">
        Aucune donnée à afficher.
      </div>
    )
  }

  return (
    <div className="relative h-56">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            formatter={(value, name) => [
              `${value} séance${Number(value) !== 1 ? "s" : ""}`,
              name,
            ]}
            contentStyle={{
              fontSize: 12,
              border: "1px solid #e4e4e7",
              borderRadius: 10,
            }}
          />
          <Pie
            data={props.data}
            dataKey="count"
            nameKey="label"
            innerRadius={58}
            outerRadius={82}
            paddingAngle={3}
          >
            {props.data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-xs font-medium text-zinc-500">Total</p>
        <p className="text-2xl font-bold text-zinc-900">{total}</p>
        <p className="text-xs text-zinc-500">séances</p>
      </div>
    </div>
  )
}

