"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export type AnalyticsMetric = {
  label: string
  value: string
  percentage: string
  isPositive: boolean
}

export function AnalyticsCard(props: {
  title: string
  description: string
  metrics: AnalyticsMetric[]
  imageUrl?: string
}) {
  return (
    <Card className="relative mx-auto h-full w-full max-w-xl rounded-2xl border p-0 ring-0">
      <CardContent className="p-0">
        <div className="flex flex-col justify-between gap-9 py-4 ps-6">
          <div>
            <p className="text-lg font-medium text-card-foreground">
              {props.title}
            </p>
            <p className="text-xs font-normal text-muted-foreground">
              {props.description}
            </p>
          </div>
          <div className="flex items-center gap-6">
            {props.metrics.map((metric, index) => (
              <div key={metric.label} className="flex items-center gap-6">
                <div>
                  <p className="text-xs font-normal text-muted-foreground">
                    {metric.label}
                  </p>
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-medium text-card-foreground">
                      {metric.value}
                    </p>
                    <Badge
                      className={cn(
                        "font-normal text-muted-foreground",
                        metric.isPositive ? "bg-teal-400/10" : "bg-red-500/10"
                      )}
                    >
                      {metric.percentage}
                    </Badge>
                  </div>
                </div>
                {index < props.metrics.length - 1 && (
                  <Separator orientation="vertical" className="h-12" />
                )}
              </div>
            ))}
          </div>
        </div>

        <img
          src={
            props.imageUrl ??
            "https://images.shadcnspace.com/assets/backgrounds/stats-01.webp"
          }
          alt="Illustration"
          width={211}
          height={168}
          className="absolute bottom-0 right-0 hidden sm:block"
        />
      </CardContent>
    </Card>
  )
}

