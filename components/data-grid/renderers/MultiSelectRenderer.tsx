import { CellRendererProps } from "@/types/grid"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface SelectableItem {
  id: string
  name: string
  avatar?: string
}

export interface MultiSelectValue<T extends SelectableItem> {
  items: T[]
}

export function MultiSelectRenderer<T extends SelectableItem>({ 
  value 
}: CellRendererProps<MultiSelectValue<T>>) {
  if (!value?.items?.length) return null

  return (
    <div className="flex flex-wrap gap-1">
      {value.items.slice(0, 3).map((item) => (
        <Tooltip key={item.id}>
          <TooltipTrigger>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-secondary/50 rounded-md text-sm">
              {item.avatar && (
                <img src={item.avatar} alt="" className="w-4 h-4 rounded-full" />
              )}
              <span className="truncate max-w-[100px]">{item.name}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex items-center gap-2">
              {item.avatar && (
                <img src={item.avatar} alt="" className="w-5 h-5 rounded-full" />
              )}
              <span>{item.name}</span>
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
      {value.items.length > 3 && (
        <Tooltip>
          <TooltipTrigger>
            <div className="inline-flex items-center px-2 py-0.5 bg-secondary/50 rounded-md text-sm">
              +{value.items.length - 3}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1">
              {value.items.slice(3).map(item => (
                <div key={item.id} className="flex items-center gap-2">
                  {item.avatar && (
                    <img src={item.avatar} alt="" className="w-5 h-5 rounded-full" />
                  )}
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  )
} 