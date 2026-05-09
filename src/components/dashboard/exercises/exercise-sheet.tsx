"use client"

import { useMemo, useRef, useState, useTransition } from "react"
import { Plus } from "lucide-react"
import { MuscleGroup } from "@prisma/client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { createExercise } from "@/app/dashboard/exercises/actions"
import { MUSCLE_GROUPS } from "@/lib/constants"

export function ExerciseSheet() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>("CHEST")
  const formRef = useRef<HTMLFormElement>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)
  const [uploadedImagePublicId, setUploadedImagePublicId] = useState<
    string | null
  >(null)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const isBusy = isPending || isUploadingImage

  function handleSubmit(formData: FormData) {
    formData.set("muscleGroup", muscleGroup)
    if (uploadedImageUrl) formData.set("imageUrl", uploadedImageUrl)
    if (uploadedImagePublicId) {
      formData.set("imagePublicId", uploadedImagePublicId)
    }
    startTransition(async () => {
      await createExercise(formData)
      formRef.current?.reset()
      setMuscleGroup("CHEST")
      setUploadedImageUrl(null)
      setUploadedImagePublicId(null)
      setUploadError(null)
      setOpen(false)
    })
  }

  const resolvedFolder = useMemo(() => "coachtrack/exercises", [])

  async function uploadToCloudinary(file: File) {
    setIsUploadingImage(true)
    setUploadError(null)
    try {
      const publicId =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `${Date.now()}`

      const signatureResponse = await fetch(
        "/api/uploads/cloudinary-signature",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ folder: resolvedFolder, publicId }),
        }
      )

      if (!signatureResponse.ok) {
        throw new Error("Impossible de préparer l’upload Cloudinary.")
      }

      const signed = (await signatureResponse.json()) as {
        cloudName: string
        apiKey: string
        timestamp: number
        signature: string
        folder: string
        publicId: string
      }

      const uploadUrl = `https://api.cloudinary.com/v1_1/${signed.cloudName}/auto/upload`
      const payload = new FormData()
      payload.set("file", file)
      payload.set("api_key", signed.apiKey)
      payload.set("timestamp", String(signed.timestamp))
      payload.set("signature", signed.signature)
      payload.set("folder", signed.folder)
      payload.set("public_id", signed.publicId)

      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        body: payload,
      })

      if (!uploadResponse.ok) {
        throw new Error("Upload Cloudinary échoué.")
      }

      const uploaded = (await uploadResponse.json()) as {
        secure_url?: string
        public_id?: string
      }

      if (!uploaded.secure_url || !uploaded.public_id) {
        throw new Error("Réponse Cloudinary invalide.")
      }

      setUploadedImageUrl(uploaded.secure_url)
      setUploadedImagePublicId(uploaded.public_id)
    } catch (error) {
      setUploadedImageUrl(null)
      setUploadedImagePublicId(null)
      setUploadError(
        error instanceof Error ? error.message : "Erreur lors de l’upload."
      )
    } finally {
      setIsUploadingImage(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button />}>
        <Plus />
        Ajouter un exercice
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Nouvel exercice</SheetTitle>
        </SheetHeader>
        <form
          ref={formRef}
          action={handleSubmit}
          className="flex flex-col gap-4 px-4 py-2"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Nom</Label>
            <Input
              id="name"
              name="name"
              placeholder="Développé couché"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Groupe musculaire</Label>
            <Select
              value={muscleGroup}
              onValueChange={(v) => setMuscleGroup(v as MuscleGroup)}
            >
              <SelectTrigger className="w-full">
                <SelectValue>{MUSCLE_GROUPS[muscleGroup]}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {(Object.entries(MUSCLE_GROUPS) as [MuscleGroup, string][]).map(
                  ([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">
              Description{" "}
              <span className="text-muted-foreground">(optionnel)</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Instructions ou conseils..."
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="imageFile">
              Image{" "}
              <span className="text-muted-foreground">(optionnel)</span>
            </Label>
            <Input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/*"
              disabled={isBusy}
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) void uploadToCloudinary(file)
              }}
            />
            {/* These are persisted in the FormData at submit time */}
            <input type="hidden" name="imageUrl" value={uploadedImageUrl ?? ""} />
            <input
              type="hidden"
              name="imagePublicId"
              value={uploadedImagePublicId ?? ""}
            />
            {uploadedImageUrl && (
              <div className="mt-2 overflow-hidden rounded-xl border border-border">
                <img
                  src={uploadedImageUrl}
                  alt="Aperçu"
                  className="aspect-video w-full object-cover"
                />
              </div>
            )}
            {uploadError && (
              <p className="text-xs font-medium text-red-600">{uploadError}</p>
            )}
          </div>
          <SheetFooter>
            <Button type="submit" disabled={isBusy} className="w-full">
              {isUploadingImage
                ? "Upload de l’image..."
                : isPending
                  ? "Enregistrement..."
                  : "Enregistrer"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
