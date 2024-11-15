import { User } from "./user"

export interface Project {
  id: string
  name: string
  description: string
  status: "active" | "completed" | "on-hold"
  assignees: {
    items: User[]
  }
  startDate: string
  endDate: string
} 