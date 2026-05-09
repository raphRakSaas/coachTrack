/** Formulaires client : champs considérés comme données de santé / sensibles (RGPD art. 9). */

export function formHasMedicalNotesFields(formData: FormData): boolean {
  const injuries = String(formData.get("injuries") ?? "").trim()
  const medicalNotes = String(formData.get("medicalNotes") ?? "").trim()
  return injuries.length > 0 || medicalNotes.length > 0
}

export function isSensitiveDataConsentChecked(formData: FormData): boolean {
  return formData.get("sensitiveDataConsent") === "on"
}

export function isMeasurementConsentChecked(formData: FormData): boolean {
  return formData.get("measurementConsent") === "on"
}
