"use client"

import { useRef, useState, useTransition } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { createClient } from "@/app/dashboard/clients/actions"

export function ClientSheet() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await createClient(formData)
      formRef.current?.reset()
      setOpen(false)
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button />}>
        <Plus />
        Ajouter un client
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Nouveau client</SheetTitle>
        </SheetHeader>
        <form
          ref={formRef}
          action={handleSubmit}
          className="flex flex-col gap-4 px-4 py-2"
        >
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                name="firstName"
                placeholder="Jean"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                name="lastName"
                placeholder="Dupont"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">
              Email <span className="text-muted-foreground">(optionnel)</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jean@exemple.fr"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone">
              Téléphone{" "}
              <span className="text-muted-foreground">(optionnel)</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+33 6 12 34 56 78"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="goal">
              Objectif{" "}
              <span className="text-muted-foreground">(optionnel)</span>
            </Label>
            <Input
              id="goal"
              name="goal"
              placeholder="Prise de masse, perte de poids..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="notes">
              Notes <span className="text-muted-foreground">(optionnel)</span>
            </Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Blessures, disponibilités..."
              rows={3}
            />
          </div>
          <SheetFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
