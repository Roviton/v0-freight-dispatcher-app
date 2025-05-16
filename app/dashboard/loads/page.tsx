"use client"

import { useState } from "react"
import { LoadsTable } from "@/components/dashboard/loads/loads-table"
import { NewLoadModal } from "@/components/dashboard/modals/new-load-modal"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"

export default function LoadsPage() {
  const [showNewLoadModal, setShowNewLoadModal] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Loads Management</h1>
        <Button onClick={() => setShowNewLoadModal(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Load
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <div className="p-6">
          <LoadsTable />
        </div>
      </div>

      <NewLoadModal isOpen={showNewLoadModal} onClose={() => setShowNewLoadModal(false)} />
    </div>
  )
}
