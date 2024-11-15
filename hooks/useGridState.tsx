import { GridState } from "@/types/grid"
import { useReducer, useCallback } from "react"

type GridAction =
  | { type: "SET_SELECTED_ROWS"; payload: string[] }
  | { type: "SET_EDITING_CELL"; payload: { rowId: string; columnId: string } | undefined }
  | { type: "SET_SORT"; payload: { id: string; desc: boolean } }
  | { type: "SET_PAGE"; payload: { pageIndex: number; pageSize: number } }

const initialState: GridState = {
  selectedRows: [],
  editingCell: undefined,
  pagination: {
    pageIndex: 0,
    pageSize: 10,
  },
}

function gridReducer(state: GridState, action: GridAction): GridState {
  switch (action.type) {
    case "SET_SELECTED_ROWS":
      return { ...state, selectedRows: action.payload }
    case "SET_EDITING_CELL":
      return { ...state, editingCell: action.payload }
    case "SET_SORT":
      return { ...state, sortBy: action.payload }
    case "SET_PAGE":
      return { ...state, pagination: action.payload }
    default:
      return state
  }
}

export function useGridState() {
  const [state, dispatch] = useReducer(gridReducer, initialState)
  return { state, dispatch }
} 