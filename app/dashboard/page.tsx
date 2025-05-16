"use client"

import { useState, useRef } from "react"
import { LoadsDataTable, type Load } from "@/components/dashboard/loads-data-table"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { DashboardFilters } from "@/components/dashboard/dashboard-filters"
import { NewLoadModal } from "@/components/dashboard/modals/new-load-modal"

export default function DashboardPage() {
  const [showNewLoadModal, setShowNewLoadModal] = useState(false)
  const loadsDataTableRef = useRef<{ addNewLoad: (loadData: Omit<Load, "id" | "status" | "createdAt">) => Load }>(null)

  const handleAddNewLoad = (loadData: Omit<Load, "id" | "status" | "createdAt">) => {
    if (loadsDataTableRef.current) {
      const newLoad = loadsDataTableRef.current.addNewLoad(loadData)
      return newLoad
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      <DashboardStats />
      <DashboardFilters onNewLoad={() => setShowNewLoadModal(true)} />
      <LoadsDataTable ref={loadsDataTableRef} />
      <NewLoadModal isOpen={showNewLoadModal} onClose={() => setShowNewLoadModal(false)} onAddLoad={handleAddNewLoad} />
    </div>
  )
}
