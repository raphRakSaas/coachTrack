export function startOfDay(date = new Date()) {
  const normalized = new Date(date)
  normalized.setHours(0, 0, 0, 0)
  return normalized
}

export function startOfWeek() {
  const date = startOfDay()
  const diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1)
  date.setDate(diff)
  return date
}

export function startOfMonth() {
  const date = startOfDay()
  date.setDate(1)
  return date
}

export function startOfPreviousWeek() {
  const date = startOfWeek()
  date.setDate(date.getDate() - 7)
  return date
}

export function startOfPreviousMonth() {
  const date = startOfMonth()
  date.setMonth(date.getMonth() - 1)
  return date
}

export function startOfMonthsAgo(monthsAgo: number) {
  const date = startOfMonth()
  date.setMonth(date.getMonth() - monthsAgo)
  return date
}

export function greetingByHour() {
  const hour = new Date().getHours()
  if (hour < 12) return "Bonjour"
  if (hour < 18) return "Bon après-midi"
  return "Bonsoir"
}

export function percentChange(current: number, previous: number) {
  if (previous <= 0) return current > 0 ? 100 : 0
  return Math.round(((current - previous) / previous) * 100)
}

import { redirect } from "next/navigation"

import { getCurrentUser } from "@/lib/auth"

export async function getCoachId() {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")
  return user
}
