import { CellRendererProps } from "@/types/grid"

export function TextRenderer({ value }: CellRendererProps<string>) {
  if (!value) return null
  return (
    <div className="w-full overflow-hidden">
      <span className="block truncate">{value}</span>
    </div>
  )
} 