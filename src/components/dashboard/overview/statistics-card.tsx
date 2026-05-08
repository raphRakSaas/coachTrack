"use client"

import { Icon } from "@iconify/react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export type StatisticItem = {
  title: string
  value: string
  statusLabel: string
  statusValue: string
  isPositive: boolean
  cardIcon: string
  statusIcon: string
}

export function StatisticsCard(props: { items: StatisticItem[] }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4">
      <Card className="p-0">
        <CardContent className="flex w-full flex-wrap items-center px-0 lg:flex-nowrap">
          {props.items.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="w-full border-border last:border-e-0 md:w-6/12 lg:w-3/12 lg:border-e"
            >
              <div className="p-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-start justify-between">
                    <p className="text-base font-medium">{item.title}</p>
                    <div className="rounded-full p-3 text-primary outline outline-border">
                      <Icon icon={item.cardIcon} width={16} height={16} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-2xl font-semibold">{item.value}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground">
                        {item.statusLabel}
                      </p>
                      <Badge
                        className={`text-muted-foreground ${
                          item.isPositive ? "bg-teal-400/10" : "bg-red-500/10"
                        }`}
                      >
                        <span className="flex items-center gap-1">
                          {item.statusValue}
                          <Icon icon={item.statusIcon} width={14} height={14} />
                        </span>
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

