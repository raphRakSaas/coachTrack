"use client"

import { useEffect } from "react"
import { animate, motion, useMotionValue, useTransform } from "motion/react"

export function AnimatedCounter(props: {
  value: number
  prefix?: string
  suffix?: string
  isInView?: boolean
}) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString("fr-FR")
  )

  useEffect(() => {
    if (props.isInView === false) return
    const controls = animate(count, props.value, { duration: 1.5 })
    return controls.stop
  }, [count, props.value, props.isInView])

  return (
    <span>
      {props.prefix}
      <motion.span>{rounded}</motion.span>
      {props.suffix}
    </span>
  )
}

