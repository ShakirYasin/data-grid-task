'use client'

import { DataGrid } from "@/components/DataGrid"
import { GridColumn, MultiSelectOption } from "@/types/grid"
import { Project } from "@/types/project"
import { getProjects, searchUsers, updateProject, mockUsers } from "@/lib/mock-data"
import { useState, useEffect } from "react"
import { User } from "@/types/user"

const getUserOption = (user: User): MultiSelectOption<User> => ({
  label: user.name,
  value: user.id,
  data: user
})

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Initial load and refresh function
  const loadProjects = async () => {
    try {
      setIsLoading(true)
      const data = await getProjects()
      console.log('Projects loaded:', data)
      setProjects(data)
    } catch (error) {
      console.error('Failed to load projects:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Load projects on mount
  useEffect(() => {
    console.log("running useEffect")
    loadProjects()
  }, [])

  const columns: GridColumn<Project>[] = [
    {
      accessorKey: "name",
      header: "Project Name",
      renderer: "text",
      editor: "text",
      editable: true,
    },
    {
      accessorKey: "description",
      header: "Description",
      renderer: "text",
      editor: "text",
      editable: true,
    },
    {
      accessorKey: "status",
      header: "Status",
      renderer: "text",
      editable: true,
    },
    {
      accessorKey: "assignees",
      header: "Assignees",
      renderer: "multiSelect",
      editor: "multiSelect",
      editable: true,
      editorProps: {
        onSearch: searchUsers,
        getOption: getUserOption,
      }
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      renderer: "text",
      editable: true,
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      renderer: "text",
      editable: true,
    },
  ]

  const handleCellEdit = async (rowId: string, columnId: string, value: unknown) => {
    try {
      // Update the project
      const updatedProject = await updateProject(rowId, columnId, value)
      console.log('Project updated:', updatedProject)
      // Refresh the projects list
      await loadProjects()
    } catch (error) {
      console.error('Failed to update project:', error)
    }
  }

  if (isLoading && projects.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Project Management</h1>
      <DataGrid
        data={projects}
        columns={columns}
        onCellEdit={handleCellEdit}
      />
    </div>
  )
}
