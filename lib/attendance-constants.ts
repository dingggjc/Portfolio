export interface PracticeField {
  id: string
  description: string
  percentage: number
  minHours: number
}

export const DEFAULT_PRACTICE_FIELDS: PracticeField[] = [
  {
    id: "A",
    description:
      "Architectural Designing/Drafting, Structural Conceptualization, Planning & The Like",
    percentage: 30,
    minHours: 1152,
  },
  {
    id: "B",
    description:
      "Preparation of Contract Documents, Specifications Writing, Bill of Materials, Cost Estimates, General Conditions, Bidding Documents, Clerk of Works and The Like",
    percentage: 25,
    minHours: 960,
  },
  {
    id: "C",
    description:
      "Field Superintendence, Project Management, Administration & The Like",
    percentage: 15,
    minHours: 576,
  },
  {
    id: "D",
    description:
      "Technical, Economic and Financial Feasibility Studies, Project Promotional, Pre-Design & The Like",
    percentage: 10,
    minHours: 384,
  },
  {
    id: "E",
    description:
      "Architectural Lay-outing of Mechanical, Electrical, Electronic, Sanitary, Plumbing, Communications and Other Utility Systems Equipment and Fixtures, Arch'l Lighting, Acoustics and Allied Fields of Practice",
    percentage: 10,
    minHours: 384,
  },
  {
    id: "F",
    description:
      "Architectural Interiors/Space Planning, Restoration/Preservation and Other Ancillary Services",
    percentage: 10,
    minHours: 384,
  },
]
