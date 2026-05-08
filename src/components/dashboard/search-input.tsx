"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { Search, X } from "lucide-react"

export function SearchInput({ placeholder = "Rechercher..." }: { placeholder?: string }) {
  const router = useRouter()
  const params = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const value = params.get("q") ?? ""

  function update(next: string) {
    const sp = new URLSearchParams(params.toString())
    if (next) sp.set("q", next)
    else sp.delete("q")
    startTransition(() => {
      router.replace(`?${sp.toString()}`)
    })
  }

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => update(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-64 rounded-lg border border-zinc-200 bg-white pl-8 pr-8 text-sm placeholder:text-zinc-400 focus:border-zinc-400 focus:outline-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => update("")}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-zinc-400 hover:bg-zinc-100"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
      {isPending && (
        <div className="absolute right-7 top-1/2 h-3 w-3 -translate-y-1/2 animate-pulse rounded-full bg-zinc-300" />
      )}
    </div>
  )
}
