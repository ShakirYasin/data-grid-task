import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cn } from "@/lib/utils"
import { MultiSelectOption } from "@/types/user"

interface ComboboxProps<T extends any[]> {
  options: MultiSelectOption[]
  value: T
  onChange: (value: string) => void
  onRemove?: (value: string) => void
  onSearch?: (query: string) => void
  multiple?: boolean
  autoFocus?: boolean
  renderOption?: (option: MultiSelectOption) => React.ReactNode
}

export function Combobox<T extends any[]>({
  options,
  value,
  onChange,
  onRemove,
  onSearch,
  multiple = false,
  autoFocus = false,
  renderOption,
}: ComboboxProps<T>) {
  const [query, setQuery] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const selectedValues = Array.isArray(value) ? value : [value]

  console.log("selectedValues", selectedValues)
  console.log("options", options)

  React.useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus()
    }
  }, [autoFocus])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    onSearch?.(newQuery)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !query && selectedValues.length > 0) {
      const lastValue = selectedValues[selectedValues.length - 1]
      onRemove?.(lastValue)
    }
  }

  return (
    <PopoverPrimitive.Root open={true}>
      <PopoverPrimitive.Trigger asChild>
        <div className="flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
          <div className="flex flex-wrap gap-1">
            {selectedValues.map((val) => {
              return (
                <span
                  key={val.id}
                  className="inline-flex items-center gap-1 rounded bg-secondary px-2 py-1 text-sm"
                >
                  {val.name}
                  {multiple && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRemove?.(val.id)
                      }}
                      className="ml-1 rounded-full hover:bg-secondary-foreground/20"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              )
            })}
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={handleSearch}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
              placeholder="Search..."
            />
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </div>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          className="w-[--radix-popover-trigger-width] rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
          align="start"
        >
          <div className="max-h-[300px] overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none",
                  "hover:bg-accent hover:text-accent-foreground",
                  "data-[selected=true]:bg-accent/50"
                )}
                data-selected={selectedValues.some((val) => val.id === option.value)}
                onClick={() => {
                  onChange(option.value)
                
                }}
              >
                <div className="flex items-center gap-2">
                  {renderOption ? renderOption(option) : option.label}
                </div>
                {selectedValues.some((val) => val.id === option.value) && (
                  <Check className="h-4 w-4" />
                )}
              </div>
            ))}
            {options.length === 0 && (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                No results found
              </div>
            )}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
} 