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
import { createProspect } from "@/app/dashboard/prospects/actions"
import { COUNTRY_CODES } from "@/lib/constants"

const PROSPECT_SOURCES = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "bouche-a-oreille", label: "Bouche à oreille" },
  { value: "site-web", label: "Site web" },
  { value: "evenement", label: "Événement" },
  { value: "autre", label: "Autre" },
]

export function ProspectSheet() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [formError, setFormError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [countryCode, setCountryCode] = useState<string>("+33")
  const [source, setSource] = useState<string>("")

  function handleSubmit(formData: FormData) {
    setFormError(null)
    formData.set("phoneCountryCode", countryCode)
    if (source) formData.set("prospectSource", source)

    startTransition(async () => {
      try {
        await createProspect(formData)
        formRef.current?.reset()
        setCountryCode("+33")
        setSource("")
        setOpen(false)
      } catch (err) {
        setFormError(
          err instanceof Error ? err.message : "Une erreur est survenue."
        )
      }
    })
  }

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode)
  const selectedSource = PROSPECT_SOURCES.find((s) => s.value === source)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button />}>
        <Plus />
        Ajouter un prospect
      </SheetTrigger>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Nouveau prospect</SheetTitle>
        </SheetHeader>
        <form
          ref={formRef}
          action={handleSubmit}
          className="flex flex-col gap-5 px-4 py-2"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Identité
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="prospect-firstName">Prénom *</Label>
              <Input
                id="prospect-firstName"
                name="firstName"
                placeholder="Marie"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="prospect-lastName">Nom *</Label>
              <Input
                id="prospect-lastName"
                name="lastName"
                placeholder="Martin"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="prospect-email">Email</Label>
            <Input
              id="prospect-email"
              name="email"
              type="email"
              placeholder="marie@exemple.fr"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Téléphone</Label>
            <div className="flex gap-2">
              <Select
                value={countryCode}
                onValueChange={(v) => setCountryCode(v ?? "+33")}
              >
                <SelectTrigger className="w-28 shrink-0">
                  <SelectValue>
                    {selectedCountry?.label ?? countryCode}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {COUNTRY_CODES.map((c) => (
                    <SelectItem key={c.code} value={c.code}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input name="phone" type="tel" placeholder="06 12 34 56 78" />
            </div>
          </div>

          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Pipeline
          </p>
          <div className="flex flex-col gap-1.5">
            <Label>Source</Label>
            <Select value={source} onValueChange={(v) => setSource(v ?? "")}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choisir une source">
                  {selectedSource?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {PROSPECT_SOURCES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="prospect-notes">Notes pipeline</Label>
            <Textarea
              id="prospect-notes"
              name="prospectNotes"
              placeholder="Intéressé par du coaching en ligne, budget ~100€/mois..."
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="prospect-general-notes">Notes générales</Label>
            <Textarea
              id="prospect-general-notes"
              name="notes"
              placeholder="Remarques diverses..."
              rows={2}
            />
          </div>

          {formError && (
            <p className="text-xs font-medium text-red-600">{formError}</p>
          )}

          <SheetFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Enregistrement..." : "Ajouter le prospect"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
