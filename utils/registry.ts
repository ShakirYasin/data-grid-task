import { RegistryItem, CellRendererProps, CellEditorProps, MultiSelectOption, SelectableItem, MultiSelectValue } from "@/types/grid"
import { TextRenderer } from "@/components/data-grid/renderers/TextRenderer"
import { MultiSelectRenderer } from "@/components/data-grid/renderers/MultiSelectRenderer"
import { TextEditor } from "@/components/data-grid/editors/TextEditor"
import { MultiSelectEditor } from "@/components/data-grid/editors/MultiSelectEditor"

type EditorWithProps<T> = React.ComponentType<CellEditorProps<T> & Record<string, unknown>>

class ComponentRegistry {
  private renderers: Map<string, RegistryItem> = new Map()
  private editors: Map<string, RegistryItem> = new Map()

  registerRenderer<T>(name: string, component: React.ComponentType<CellRendererProps<T>>) {
    this.renderers.set(name, { name, component })
  }

  registerEditor<T>(name: string, component: EditorWithProps<T>) {
    this.editors.set(name, { name, component })
  }

  getRenderer(name: string) {
    return this.renderers.get(name)?.component
  }

  getEditor(name: string) {
    return this.editors.get(name)?.component
  }
}

export const registry = new ComponentRegistry()

// Register default renderers and editors
registry.registerRenderer("text", TextRenderer)
registry.registerRenderer<MultiSelectValue<SelectableItem>>("multiSelect", MultiSelectRenderer)
registry.registerEditor("text", TextEditor)
registry.registerEditor<MultiSelectValue<SelectableItem>>(
  "multiSelect", 
  MultiSelectEditor as unknown as EditorWithProps<MultiSelectValue<SelectableItem>>
) 