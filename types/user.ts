export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface MultiSelectOption {
  label: string
  value: string
  data?: User
} 