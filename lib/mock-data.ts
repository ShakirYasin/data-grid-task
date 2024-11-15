import { Project } from "@/types/project"
import { User } from "@/types/user"

export const mockUsers: User[] = [
  { id: "1", name: "John Doe", email: "john@example.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" },
  { id: "3", name: "Bob Johnson", email: "bob@example.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" },
  { id: "4", name: "Alice Brown", email: "alice@example.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" },
  { id: "5", name: "Charlie Wilson", email: "charlie@example.com", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie" },
]

export const mockProjects: Project[] = [
  {
    id: "1",
    name: "Website Redesign",
    description: "Redesign company website with modern UI",
    status: "active",
    assignees: { items: [mockUsers[0], mockUsers[1]] },
    startDate: "2024-01-01",
    endDate: "2024-06-30"
  },
  {
    id: "2",
    name: "Mobile App Development",
    description: "Develop iOS and Android apps",
    status: "on-hold",
    assignees: { items: [mockUsers[2], mockUsers[3]] },
    startDate: "2024-02-15",
    endDate: "2024-08-15"
  },
  {
    id: "3",
    name: "Database Migration",
    description: "Migrate from MySQL to PostgreSQL",
    status: "completed",
    assignees: { items: [mockUsers[4]] },
    startDate: "2024-03-01",
    endDate: "2024-04-30"
  },
]

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export async function getProjects(): Promise<Project[]> {
  await delay(300) // Simulate network delay
  return mockProjects
}

export async function searchUsers(query: string): Promise<User[]> {
  await delay(500) // Simulate network delay
  return mockUsers.filter(user => 
    user.name.toLowerCase().includes(query.toLowerCase()) ||
    user.email.toLowerCase().includes(query.toLowerCase())
  )
}

export async function updateProject(
  projectId: string, 
  columnId: string, 
  value: unknown
): Promise<Project> {
  await delay(300) // Simulate network delay

  const projectIndex = mockProjects.findIndex(p => p.id === projectId)
  if (projectIndex === -1) {
    throw new Error(`Project with id ${projectId} not found`)
  }

  const updatedProject = { ...mockProjects[projectIndex] }
  
  if (columnId === 'assignees') {
    updatedProject.assignees = value as Project['assignees']
  } else {
    ;(updatedProject as any)[columnId] = value
  }

  mockProjects[projectIndex] = updatedProject

  return updatedProject
} 