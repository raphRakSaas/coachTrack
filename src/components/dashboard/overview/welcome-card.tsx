"use client"

import { useRef } from "react"
import { TrendingUp } from "lucide-react"
import { useInView } from "motion/react"

import { Card } from "@/components/ui/card"
import { AnimatedCounter } from "@/components/dashboard/overview/animated-counter"

export function WelcomeCard(props: {
  title: string
  leftLabel: string
  leftValue: number
  rightLabel: string
  rightValue: number
  imageUrl?: string
}) {
  const ref = useRef<HTMLDivElement | null>(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })

  return (
    <div ref={ref} className="flex w-full items-center justify-center">
      <Card className="relative mx-auto w-full max-w-[700px] overflow-hidden bg-blue-500 p-7 pb-0 ring-0 dark:bg-blue-500">
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-7">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white">
                <TrendingUp size={24} className="text-neutral-600" />
              </div>
              <h2 className="text-xl text-white">{props.title}</h2>
            </div>

            <div className="mt-6 flex w-full lg:mt-6 sm:mt-12 xl:mt-12">
              <div className="border-e border-white/20 pe-4">
                <p className="mb-1 text-sm text-white/80">{props.leftLabel}</p>
                <p className="text-2xl font-semibold tracking-tight text-white">
                  <AnimatedCounter value={props.leftValue} isInView={isInView} />
                </p>
              </div>
              <div className="ps-4">
                <p className="mb-1 text-sm text-white/80">{props.rightLabel}</p>
                <p className="text-2xl font-semibold tracking-tight text-white">
                  <AnimatedCounter value={props.rightValue} isInView={isInView} />
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-12 ms-auto me-auto md:col-span-5 md:ms-auto">
            <img
              src={
                props.imageUrl ??
                "https://images.shadcnspace.com/assets/backgrounds/welcome-bg-1.png"
              }
              alt="Illustration"
              className="-mb-n5 max-w-32 pt-6 md:max-w-36 md:pt-0 lg:max-w-36 lg:ps-4 xl:max-w-[170px]"
              width={1024}
              height={195}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

