import { flexRender, Header } from "@tanstack/react-table"
import { GridColumn } from "@/types/grid"

interface GridHeaderProps<T> {
  header: Header<T, unknown>
}

export default function GridHeader<T>({ header }: GridHeaderProps<T>) {
  const column = header.column.columnDef as GridColumn<T>
  
  return (
    <th 
      className="p-2 border bg-gray-100 font-semibold text-left"
      style={{
        width: column.width,
        minWidth: column.minWidth,
        maxWidth: column.maxWidth,
      }}
    >
      {flexRender(header.column.columnDef.header, header.getContext())}
    </th>
  )
} 