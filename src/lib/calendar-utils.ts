/** Clé locale YYYY-MM-DD (évite les décalages UTC de `toISOString()`). */
export function localDateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function parseLocalDateParam(value: string | undefined): Date {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date()
  }
  const parts = value.split("-").map(Number)
  const year = parts[0]!
  const month = parts[1]!
  const day = parts[2]!
  const parsed = new Date(year, month - 1, day, 12, 0, 0, 0)
  if (Number.isNaN(parsed.getTime())) {
    return new Date()
  }
  return parsed
}

export function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

export function startOfMonth(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), 1)
  d.setHours(0, 0, 0, 0)
  return d
}

export function endOfMonth(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999)
  return d
}

export function addMonths(date: Date, delta: number): Date {
  const d = new Date(date.getFullYear(), date.getMonth() + delta, 1)
  d.setHours(0, 0, 0, 0)
  return d
}

export type MonthGridCell = {
  date: Date
  dateKey: string
  inMonth: boolean
}

/** 6 × 7 cellules, semaine commençant lundi. */
export function getMonthGridCells(monthAnchor: Date): MonthGridCell[] {
  const year = monthAnchor.getFullYear()
  const monthIndex = monthAnchor.getMonth()
  const firstOfMonth = new Date(year, monthIndex, 1)
  const firstMonday = getMonday(firstOfMonth)
  return Array.from({ length: 42 }, (_, cellIndex) => {
    const cellDate = addDays(firstMonday, cellIndex)
    return {
      date: cellDate,
      dateKey: localDateKey(cellDate),
      inMonth: cellDate.getMonth() === monthIndex,
    }
  })
}
