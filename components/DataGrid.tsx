import { useGridState } from "@/hooks/useGridState"
import { GridColumn } from "@/types/grid"
import { ColumnDef, getCoreRowModel, getPaginationRowModel, TableOptions, useReactTable } from "@tanstack/react-table"
import { useCallback, useMemo, useState } from "react"
import { GridErrorBoundary } from "./data-grid/ErrorBoundary"
import { Pagination } from "./data-grid/Pagination"
import GridCell from "./GridCell"
import GridHeader from "./GridHeader"

interface DataGridProps<T extends { id: string }> {
  data: T[]
  columns: GridColumn<T>[]
  onRowSelectionChange?: (selectedRows: string[]) => void
  onCellEdit?: (rowId: string, columnId: string, value: unknown) => Promise<void>
}

export function DataGrid<T extends { id: string }>({
  data,
  columns,
  onRowSelectionChange,
  onCellEdit,
}: DataGridProps<T>) {
  const { state, dispatch } = useGridState()

  const [forceUpdate, setForceUpdate] = useState(0)

  // Memoize the table options to prevent unnecessary re-renders
  const tableOptions = useMemo(() => {
    const options: TableOptions<T> = {
    data: [...data] ,
    initialState: {
        pagination: state.pagination,
    },
    enableRowSelection: true,
    columns: columns as ColumnDef<T, unknown>[],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    // state: {
      
    // },
    onPaginationChange: (updater: any) => {
      if (typeof updater === 'function') {
        const newPagination = updater(state.pagination)
        dispatch({ type: "SET_PAGE", payload: newPagination })
      } else {
        dispatch({ type: "SET_PAGE", payload: updater })
      }
    },
    manualPagination: true,
    manualFiltering: true,
    pageCount: Math.ceil(data.length / state.pagination.pageSize),
  }

  return options;

}, [data, columns, state.pagination, dispatch, forceUpdate])

  const table = useReactTable(tableOptions)

  console.log({table: table.getRowModel().rows[0].getValue('description')})

  const handleEditComplete = useCallback(() => {

      dispatch({ 
        type: "SET_EDITING_CELL", 
        payload: undefined 
      })

  }, [dispatch])

  const handleEditCancel = useCallback(() => {
    dispatch({ 
      type: "SET_EDITING_CELL", 
      payload: undefined 
    })
  }, [dispatch])

  const handleStartEdit = useCallback((rowId: string, columnId: string) => {
    dispatch({ 
      type: "SET_EDITING_CELL", 
      payload: { rowId, columnId }
    })
  }, [dispatch])

  const handleCellEdit = useCallback(async (rowId: string, columnId: string, value: unknown) => {
    if (onCellEdit) {
      try {
        await onCellEdit(rowId, columnId, value)
        handleEditComplete()
        setForceUpdate(forceUpdate + 1)
      } catch (error) {
        console.error('Failed to update cell:', error)
      }
    }
  }, [onCellEdit, handleEditComplete])


  return (
    <GridErrorBoundary>
      <div className="w-full overflow-auto">
        <table className="w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <GridHeader key={header.id} header={header} />
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const rowData = row.original as T
                  const isEditing = 
                    state.editingCell?.rowId === rowData.id && 
                    state.editingCell?.columnId === cell.column.id

                  return (
                    <GridCell
                      key={cell.id}
                      cell={cell}
                      isEditing={isEditing}
                      onEdit={(value: unknown) => {
                        handleCellEdit(rowData.id, cell.column.id, value)
                      }}
                      onEditComplete={handleEditComplete}
                      onEditCancel={handleEditCancel}
                      onStartEdit={() => handleStartEdit(rowData.id, cell.column.id)}
                    />
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <Pagination
          pageIndex={table.getState().pagination.pageIndex}
          pageSize={table.getState().pagination.pageSize}
          pageCount={table.getPageCount()}
          totalRows={data.length}
          onPageChange={(pageIndex) => {
            table.setPageIndex(pageIndex)
          }}
          onPageSizeChange={(pageSize) => {
            table.setPageSize(pageSize)
          }}
        />
      </div>
    </GridErrorBoundary>
  )
}