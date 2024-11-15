import { ColumnDef } from "@tanstack/react-table"
import { ReactNode } from "react"

// Create a base column type that includes only the properties we want to extend
type BaseColumnDef<T> = Omit<ColumnDef<T, unknown>, 'cell' | 'header'>

export interface GridColumn<T> extends BaseColumnDef<T> {
  accessorKey: keyof T;
  editable?: boolean
  renderer?: string
  editor?: string
  width?: number
  minWidth?: number
  maxWidth?: number
  cell?: ColumnDef<T, unknown>['cell']
  header?: ColumnDef<T, unknown>['header']
  editorProps?: Record<string, unknown>
}

export interface CellRendererProps<T> {
  value: T
  row: any
  column: GridColumn<any>
}

export interface CellEditorProps<T> {
  value: T
  onChange: (value: T) => void
  onComplete: () => void
  onCancel: () => void
}

export interface RegistryItem {
  name: string
  component: React.ComponentType<any>
}

export interface GridState {
  selectedRows: string[]
  editingCell?: {
    rowId: string
    columnId: string
  }
  sortBy?: {
    id: string
    desc: boolean
  }
  pagination: {
    pageIndex: number
    pageSize: number
  }
}

export interface MultiSelectOption<T = any> {
  label: string
  value: string
  data?: T
}

export interface SelectableItem {
  id: string
  name: string
  avatar?: string
}

export interface MultiSelectValue<T extends SelectableItem = SelectableItem> {
  items: T[]
} 