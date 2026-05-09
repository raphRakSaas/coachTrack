"use client"

import { useRef, useState, useTransition } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { createSession } from "@/app/dashboard/sessions/actions"

type Client = { id: string; firstName: string; lastName: string }

const RPE_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1)
const MOOD_OPTIONS = [
  { value: 1, label: "1 – Épuisé" },
  { value: 2, label: "2 – Fatigué" },
  { value: 3, label: "3 – Neutre" },
  { value: 4, label: "4 – Bien" },
  { value: 5, label: "5 – Excellent" },
]

export function SessionSheet({ clients }: { clients: Client[] }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [clientId, setClientId] = useState("")
  const [rpe, setRpe] = useState("")
  const [mood, setMood] = useState("")
  const [energy, setEnergy] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  const today = new Date().toISOString().split("T")[0]

  const selectedClient = clients.find((c) => c.id === clientId)

  function handleSubmit(formData: FormData) {
    formData.set("clientId", clientId)
    if (rpe) formData.set("rpe", rpe)
    if (mood) formData.set("mood", mood)
    if (energy) formData.set("energy", energy)

    startTransition(async () => {
      await createSession(formData)
      formRef.current?.reset()
      setClientId("")
      setRpe("")
      setMood("")
      setEnergy("")
      setOpen(false)
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button />}>
        <Plus />
        Nouvelle séance
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Nouvelle séance</SheetTitle>
        </SheetHeader>
        <form
          ref={formRef}
          action={handleSubmit}
          className="flex flex-col gap-4 px-4 py-2"
        >
          <div className="flex flex-col gap-1.5">
            <Label>Client *</Label>
            <Select value={clientId} onValueChange={(v) => setClientId(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir un client">
                  {selectedClient
                    ? `${selectedClient.firstName} ${selectedClient.lastName}`
                    : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.firstName} {client.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="date">Date *</Label>
            <Input id="date" name="date" type="date" defaultValue={today} required />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="duration">Durée (min)</Label>
            <Input id="duration" name="duration" type="number" min={1} max={300} placeholder="60" />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="location">Lieu</Label>
            <Input id="location" name="location" placeholder="Salle, domicile, extérieur…" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="sessionFocus">Objectif ou thème</Label>
            <Input id="sessionFocus" name="sessionFocus" placeholder="Ex. tirage, jambes, mobilité…" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Ressenti
          </p>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>RPE (1-10)</Label>
              <Select value={rpe} onValueChange={(v) => setRpe(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="—">
                    {rpe || undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {RPE_OPTIONS.map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Humeur (1-5)</Label>
              <Select value={mood} onValueChange={(v) => setMood(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="—">
                    {mood || undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {MOOD_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={String(o.value)}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>Énergie (1-5)</Label>
              <Select value={energy} onValueChange={(v) => setEnergy(v ?? "")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="—">
                    {energy || undefined}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {MOOD_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={String(o.value)}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Observations..." rows={3} />
          </div>
          <SheetFooter>
            <Button type="submit" disabled={isPending || !clientId} className="w-full">
              {isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
