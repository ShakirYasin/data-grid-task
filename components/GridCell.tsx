import { Cell } from "@tanstack/react-table"
import { GridColumn } from "@/types/grid"
import { registry } from "@/utils/registry"
import { GridErrorBoundary as ErrorBoundary } from "./data-grid/ErrorBoundary"

interface GridCellProps<T> {
  cell: Cell<T, unknown>
  isEditing: boolean
  onEdit: (value: unknown) => void
  onEditComplete: () => void
  onEditCancel: () => void
  onStartEdit: () => void
}

export default function GridCell<T>({ 
  cell, 
  isEditing, 
  onEdit,
  onEditComplete,
  onEditCancel,
  onStartEdit
}: GridCellProps<T>) {
  const column = cell.column.columnDef as GridColumn<T>
  const value = cell.getValue()

  if (cell.column.id === 'description') {
    console.log({value})
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (column.editable && !isEditing) {
      onStartEdit()
    }
  }

  const CustomRenderer = column.renderer 
    ? registry.getRenderer(column.renderer)
    : null

  const CustomEditor = isEditing && column.editor 
    ? registry.getEditor(column.editor)
    : null

  const renderContent = () => {
    if (isEditing && CustomEditor) {
      const editorProps = {
        value,
        onChange: onEdit,
        onComplete: onEditComplete,
        onCancel: onEditCancel,
        ...(column.editorProps || {})
      }

      return <CustomEditor {...editorProps} />
    }

    return CustomRenderer ? (
      <CustomRenderer
        value={value}
        row={cell.row.original}
        column={column}
      />
    ) : (
      String(value ?? '')
    )
  }

  return (
    <td 
      className="p-2 border cursor-pointer"
      onDoubleClick={handleDoubleClick}
    >
      <ErrorBoundary
        fallback={
          <div className="text-sm text-destructive">
            Failed to render cell
          </div>
        }
      >
        {renderContent()}
      </ErrorBoundary>
    </td>
  )
}