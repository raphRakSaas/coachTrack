"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import { MuscleGroup } from "@prisma/client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getExerciseImageUrl } from "@/lib/exercise-images"

interface CardTransform {
  rotateX: number
  rotateY: number
  scale: number
}

export function ExerciseCard3d(props: {
  href: string
  name: string
  description: string | null
  muscleGroup: MuscleGroup
  imageUrl: string | null
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const lastMousePositionRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const container = containerRef.current
    const image = imageRef.current
    if (!container || !image) return

    let rect: DOMRect | null = null
    let centerX = 0
    let centerY = 0

    const updateTransform = (mouseX: number, mouseY: number) => {
      if (!rect) {
        rect = container.getBoundingClientRect()
        centerX = rect.left + rect.width / 2
        centerY = rect.top + rect.height / 2
      }

      const relativeX = mouseX - centerX
      const relativeY = mouseY - centerY

      const containerTransform: CardTransform = {
        rotateX: -relativeY * 0.03,
        rotateY: relativeX * 0.03,
        scale: 1.02,
      }

      const imageTransform: CardTransform = {
        rotateX: -relativeY * 0.02,
        rotateY: relativeX * 0.02,
        scale: 1.04,
      }

      return { containerTransform, imageTransform }
    }

    const animate = () => {
      const { containerTransform, imageTransform } = updateTransform(
        lastMousePositionRef.current.x,
        lastMousePositionRef.current.y
      )

      container.style.transform = `perspective(1000px) rotateX(${containerTransform.rotateX}deg) rotateY(${containerTransform.rotateY}deg) scale3d(${containerTransform.scale}, ${containerTransform.scale}, ${containerTransform.scale})`
      container.style.boxShadow = "0 10px 35px rgba(0, 0, 0, 0.18)"

      image.style.transform = `perspective(1000px) rotateX(${imageTransform.rotateX}deg) rotateY(${imageTransform.rotateY}deg) scale3d(${imageTransform.scale}, ${imageTransform.scale}, ${imageTransform.scale})`

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    const handleMouseMove = (event: MouseEvent) => {
      lastMousePositionRef.current = { x: event.clientX, y: event.clientY }
    }

    const handleMouseEnter = () => {
      rect = null
      container.style.transition = "transform 0.2s ease, box-shadow 0.2s ease"
      image.style.transition = "transform 0.2s ease"
      animate()
    }

    const handleMouseLeave = () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)

      container.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)"
      container.style.boxShadow = "none"
      container.style.transition = "transform 0.5s ease, box-shadow 0.5s ease"

      image.style.transform =
        "perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)"
      image.style.transition = "transform 0.5s ease"
    }

    container.addEventListener("mouseenter", handleMouseEnter)
    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      container.removeEventListener("mouseenter", handleMouseEnter)
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  const resolvedImageUrl = getExerciseImageUrl({
    imageUrl: props.imageUrl,
    muscleGroup: props.muscleGroup,
  })

  return (
    <Link href={props.href} className="block w-[280px] shrink-0">
      <div ref={containerRef} className="rounded-xl">
        <Card className="cursor-pointer select-none">
          <CardHeader className="pb-0">
            <CardTitle className="line-clamp-1">{props.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <img
              ref={imageRef}
              src={resolvedImageUrl}
              alt={props.name}
              className="aspect-video w-full rounded-md object-cover"
              width={700}
              height={394}
              loading="lazy"
            />
            {props.description ? (
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {props.description}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">Aucune description.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Link>
  )
}

