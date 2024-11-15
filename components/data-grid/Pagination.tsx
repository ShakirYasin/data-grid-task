import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaginationProps {
  pageIndex: number
  pageSize: number
  pageCount: number
  totalRows: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

const PAGE_SIZES = [10, 20, 30, 50, 100]

export function Pagination({
  pageIndex,
  pageSize,
  pageCount,
  totalRows,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-8 w-16 rounded border bg-transparent px-2 text-sm"
        >
          {PAGE_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span>
          Showing {pageIndex * pageSize + 1} to{" "}
          {Math.min((pageIndex + 1) * pageSize, totalRows)} of {totalRows}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded",
            "hover:bg-accent hover:text-accent-foreground",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
          onClick={() => onPageChange(0)}
          disabled={pageIndex === 0}
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <button
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded",
            "hover:bg-accent hover:text-accent-foreground",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
          onClick={() => onPageChange(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-1">
          {[...Array(pageCount)].map((_, i) => {
            // Show first page, last page, current page, and pages around current
            if (
              i === 0 ||
              i === pageCount - 1 ||
              (i >= pageIndex - 1 && i <= pageIndex + 1)
            ) {
              return (
                <button
                  key={i}
                  className={cn(
                    "inline-flex h-8 w-8 items-center justify-center rounded",
                    "hover:bg-accent hover:text-accent-foreground",
                    pageIndex === i && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => onPageChange(i)}
                >
                  {i + 1}
                </button>
              )
            }
            // Show ellipsis for skipped pages
            if (i === pageIndex - 2 || i === pageIndex + 2) {
              return (
                <span
                  key={i}
                  className="inline-flex h-8 w-8 items-center justify-center"
                >
                  ...
                </span>
              )
            }
            return null
          })}
        </div>

        <button
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded",
            "hover:bg-accent hover:text-accent-foreground",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={pageIndex === pageCount - 1}
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          className={cn(
            "inline-flex h-8 w-8 items-center justify-center rounded",
            "hover:bg-accent hover:text-accent-foreground",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
          onClick={() => onPageChange(pageCount - 1)}
          disabled={pageIndex === pageCount - 1}
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
} 