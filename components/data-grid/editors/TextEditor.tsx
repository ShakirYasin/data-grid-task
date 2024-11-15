import { CellEditorProps } from "@/types/grid"
import { useEffect, useRef, useState } from "react"

export function TextEditor({ 
  value, 
  onChange, 
  onComplete, 
  onCancel 
}: CellEditorProps<string>) {
  const [inputValue, setInputValue] = useState(value || '')
  const inputRef = useRef<HTMLInputElement>(null)
    
  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      await onChange(inputValue)
      onComplete()
    } else if (e.key === 'Escape') {
      onCancel()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleBlur = async () => {
    await onChange(inputValue)
    onComplete()
  }

  return (
    <input
      ref={inputRef}
      type="text"
      value={inputValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className="w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
    />
  )
} 