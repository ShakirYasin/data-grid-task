import { CellEditorProps, MultiSelectOption } from "@/types/grid"
import { useMultiSelect } from "../hooks/useMultiSelect"
import { useState, useEffect, useRef } from "react"
import { Combobox } from "@/components/ui/combobox"
import { Spinner } from "@/components/ui/spinner"
import { SelectableItem, MultiSelectValue } from "../renderers/MultiSelectRenderer"

interface MultiSelectEditorProps<T extends SelectableItem = SelectableItem> 
  extends CellEditorProps<MultiSelectValue<T>> {
  onSearch: (query: string) => Promise<T[]>
  getOption: (item: T) => MultiSelectOption<T>
}


export function MultiSelectEditor<T extends SelectableItem = SelectableItem>({
  value,
  onChange,
  onComplete,
  onCancel,
  onSearch,
  getOption,
}: MultiSelectEditorProps<T>) {
  const [selectedItems, setSelectedItems] = useState<T[]>(value?.items || [])
  const editorRef = useRef<HTMLDivElement>(null)
  const { options, isLoading, error, searchItems } = useMultiSelect({
    onSearch: async (query) => {
      const items = await onSearch(query)
      return items
    },
    getOption,
    initialItems: value?.items || []
  })

  useEffect(() => {
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        await onChange({ items: selectedItems })
        onComplete()
      } else if (e.key === 'Escape') {
        onCancel()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel, onChange, onComplete, selectedItems])

  const handleSelect = (itemId: string) => {
    const item = options.find(opt => opt.value === itemId)?.data as T
    if (item) {
      // Just update local state, don't persist yet
      const newItems = [...selectedItems, item]
      setSelectedItems(newItems)
    }
  }

  const handleRemove = (itemId: string) => {
    // Just update local state, don't persist yet
    const newItems = selectedItems.filter(item => item.id !== itemId)
    setSelectedItems(newItems)
  }

  // Force focus on the input when the editor mounts
  useEffect(() => {
    const input = editorRef.current?.querySelector('input')
    if (input) {
        console.log("input", input)
        // Trigger a click to open the dropdown
    
       
          input.focus()
       
    }
  }, [editorRef])

  useEffect(() => {
    console.log("selectedItems: 1", value?.items)
    console.log("options: 1", options)
  }, [value?.items, options])

  return (
    <div ref={editorRef} className="relative w-full">
      <Combobox
        options={options}
        value={selectedItems}
        onSearch={searchItems}
        onChange={handleSelect}
        onRemove={handleRemove}
        multiple
        autoFocus
        renderOption={(option) => (
          <div className="flex items-center gap-2">
            {option.data?.avatar && (
              <img src={option.data.avatar} alt="" className="w-5 h-5 rounded-full" />
            )}
            <span>{option.label}</span>
          </div>
        )}
      />
      {isLoading && (
        <div className="absolute right-2 top-2">
          <Spinner size="sm" />
        </div>
      )}
      {error && (
        <div className="text-sm text-destructive mt-1">
          {error.message}
        </div>
      )}
    </div>
  )
}