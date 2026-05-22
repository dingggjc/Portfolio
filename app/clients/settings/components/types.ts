export interface MentorInfo {
  school: string
  dateOfGraduation: string
  schoolControlNo: string
  iapoanNo: string
  dateIssued: string
  expiryDate: string
  deanName: string
}

export const EMPTY_MENTOR: MentorInfo = {
  school: "",
  dateOfGraduation: "",
  schoolControlNo: "",
  iapoanNo: "",
  dateIssued: "",
  expiryDate: "",
  deanName: "",
}

export type SavingSection = "requirements" | "mentor" | "fields" | "schedule" | null
