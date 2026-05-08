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

export function SessionSheet({ clients }: { clients: Client[] }) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [clientId, setClientId] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  const today = new Date().toISOString().split("T")[0]

  function handleSubmit(formData: FormData) {
    formData.set("clientId", clientId)
    startTransition(async () => {
      await createSession(formData)
      formRef.current?.reset()
      setClientId("")
      setOpen(false)
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button />}>
        <Plus />
        Nouvelle séance
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Nouvelle séance</SheetTitle>
        </SheetHeader>
        <form
          ref={formRef}
          action={handleSubmit}
          className="flex flex-col gap-4 px-4 py-2"
        >
          <div className="flex flex-col gap-1.5">
            <Label>Client</Label>
            <Select value={clientId} onValueChange={(v) => setClientId(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir un client" />
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
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              defaultValue={today}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="duration">
              Durée (minutes){" "}
              <span className="text-muted-foreground">(optionnel)</span>
            </Label>
            <Input
              id="duration"
              name="duration"
              type="number"
              min={1}
              max={300}
              placeholder="60"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">
              Notes <span className="text-muted-foreground">(optionnel)</span>
            </Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Observations, performance..."
              rows={3}
            />
          </div>
          <SheetFooter>
            <Button
              type="submit"
              disabled={isPending || !clientId}
              className="w-full"
            >
              {isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
