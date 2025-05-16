"use client"

import { useState, useRef, useEffect } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, Calendar, ChevronDown, Filter, MoreHorizontal, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AssignDriverModal } from "../modals/assign-driver-modal"
import { LoadDetailsModal } from "../modals/load-details-modal"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

// Enhanced Load type with RPM-related fields and comments
export type Load = {
  id: string
  reference: string
  customer: string
  origin: string
  destination: string
  pickupDate: string
  deliveryDate: string
  status: "NEW" | "ASSIGNED" | "ACCEPTED" | "REFUSED" | "IN_PROGRESS" | "COMPLETED"
  driver?: {
    name: string
    avatar: string
  }
  timeline?: {
    arrivedPickup?: string
    departedPickup?: string
    arrivedDelivery?: string
    delivered?: string
  }
  rate?: string
  distance?: number // Miles
  rpm?: number // Revenue Per Mile
  weight?: string
  commodity?: string
  equipment?: string
  notes?: string
  comments?: string // Manager feedback
  createdAt?: string
  isHighlighted?: boolean
}

// Sample data with RPM and distance information
const initialData: Load[] = [
  {
    id: "L-1001",
    reference: "REF-12345",
    customer: "Acme Logistics",
    origin: "Los Angeles, CA",
    destination: "Phoenix, AZ",
    pickupDate: "2025-05-16",
    deliveryDate: "2025-05-17",
    status: "NEW",
    rate: "$1,850",
    distance: 370,
    rpm: 5.0,
    createdAt: "2025-05-14T14:30:00",
  },
  {
    id: "L-1002",
    reference: "REF-23456",
    customer: "Global Transport Inc.",
    origin: "Chicago, IL",
    destination: "Indianapolis, IN",
    pickupDate: "2025-05-16",
    deliveryDate: "2025-05-16",
    status: "ASSIGNED",
    driver: {
      name: "John Smith",
      avatar: "/javascript-code.png",
    },
    rate: "$950",
    distance: 180,
    rpm: 5.28,
    comments: "Driver requested early pickup",
    createdAt: "2025-05-14T12:15:00",
  },
  {
    id: "L-1003",
    reference: "REF-34567",
    customer: "FastFreight Co.",
    origin: "Dallas, TX",
    destination: "Houston, TX",
    pickupDate: "2025-05-15",
    deliveryDate: "2025-05-15",
    status: "ACCEPTED",
    driver: {
      name: "Sarah Johnson",
      avatar: "/stylized-letters-sj.png",
    },
    timeline: {
      arrivedPickup: "2025-05-15T08:30:00",
    },
    rate: "$750",
    distance: 240,
    rpm: 3.13,
    comments: "Waiting on POD",
    createdAt: "2025-05-14T10:45:00",
  },
  {
    id: "L-1004",
    reference: "REF-45678",
    customer: "Prime Shipping LLC",
    origin: "Miami, FL",
    destination: "Orlando, FL",
    pickupDate: "2025-05-15",
    deliveryDate: "2025-05-16",
    status: "IN_PROGRESS",
    driver: {
      name: "Mike Williams",
      avatar: "/intertwined-letters.png",
    },
    timeline: {
      arrivedPickup: "2025-05-15T09:15:00",
      departedPickup: "2025-05-15T10:30:00",
    },
    rate: "$650",
    distance: 235,
    rpm: 2.77,
    createdAt: "2025-05-14T09:20:00",
  },
  {
    id: "L-1005",
    reference: "REF-56789",
    customer: "Acme Logistics",
    origin: "Seattle, WA",
    destination: "Portland, OR",
    pickupDate: "2025-05-14",
    deliveryDate: "2025-05-15",
    status: "COMPLETED",
    driver: {
      name: "Tom Davis",
      avatar: "/abstract-geometric-TD.png",
    },
    timeline: {
      arrivedPickup: "2025-05-14T08:00:00",
      departedPickup: "2025-05-14T09:30:00",
      arrivedDelivery: "2025-05-15T11:00:00",
      delivered: "2025-05-15T11:45:00",
    },
    rate: "$580",
    distance: 174,
    rpm: 3.33,
    comments: "POD received, invoice sent",
    createdAt: "2025-05-13T16:30:00",
  },
  {
    id: "L-1006",
    reference: "REF-67890",
    customer: "Global Transport Inc.",
    origin: "Denver, CO",
    destination: "Salt Lake City, UT",
    pickupDate: "2025-05-15",
    deliveryDate: "2025-05-16",
    status: "REFUSED",
    driver: {
      name: "Sarah Johnson",
      avatar: "/stylized-letters-sj.png",
    },
    rate: "$1,100",
    distance: 525,
    rpm: 2.1,
    comments: "Driver refused due to maintenance issues",
    createdAt: "2025-05-13T14:10:00",
  },
  {
    id: "L-1007",
    reference: "REF-78901",
    customer: "FastFreight Co.",
    origin: "San Francisco, CA",
    destination: "San Diego, CA",
    pickupDate: "2025-05-17",
    deliveryDate: "2025-05-18",
    status: "NEW",
    rate: "$1,250",
    distance: 500,
    rpm: 2.5,
    createdAt: "2025-05-15T09:45:00",
  },
  {
    id: "L-1008",
    reference: "REF-89012",
    customer: "Prime Shipping LLC",
    origin: "Boston, MA",
    destination: "New York, NY",
    pickupDate: "2025-05-16",
    deliveryDate: "2025-05-16",
    status: "NEW",
    rate: "$650",
    distance: 215,
    rpm: 3.02,
    createdAt: "2025-05-15T11:20:00",
  },
  {
    id: "L-1009",
    reference: "REF-90123",
    customer: "Acme Logistics",
    origin: "Atlanta, GA",
    destination: "Nashville, TN",
    pickupDate: "2025-05-17",
    deliveryDate: "2025-05-18",
    status: "ASSIGNED",
    driver: {
      name: "Mike Williams",
      avatar: "/intertwined-letters.png",
    },
    rate: "$780",
    distance: 250,
    rpm: 3.12,
    createdAt: "2025-05-15T13:10:00",
  },
  {
    id: "L-1010",
    reference: "REF-01234",
    customer: "Global Transport Inc.",
    origin: "Detroit, MI",
    destination: "Cleveland, OH",
    pickupDate: "2025-05-16",
    deliveryDate: "2025-05-17",
    status: "NEW",
    rate: "$520",
    distance: 170,
    rpm: 3.06,
    createdAt: "2025-05-15T14:30:00",
  },
]

// Status badge component
function StatusBadge({ status }: { status: Load["status"] }) {
  const statusConfig = {
    NEW: { variant: "outline" as const, label: "New" },
    ASSIGNED: { variant: "secondary" as const, label: "Assigned" },
    ACCEPTED: { variant: "default" as const, label: "Accepted" },
    REFUSED: { variant: "destructive" as const, label: "Refused" },
    IN_PROGRESS: { variant: "default" as const, label: "In Progress" },
    COMPLETED: { variant: "success" as const, label: "Completed" },
  }

  const config = statusConfig[status]

  return <Badge variant={config.variant}>{config.label}</Badge>
}

// RPM Indicator component
function RpmIndicator({ rpm }: { rpm: number | undefined }) {
  if (rpm === undefined) return <span className="text-muted-foreground">N/A</span>

  let color = "text-green-600 dark:text-green-400"
  if (rpm < 2.0) {
    color = "text-red-600 dark:text-red-400"
  } else if (rpm < 3.0) {
    color = "text-amber-600 dark:text-amber-400"
  }

  return (
    <div className="flex items-center">
      <span className={`font-medium ${color}`}>${rpm.toFixed(2)}</span>
      <span className="ml-1 text-xs text-muted-foreground">/mi</span>
    </div>
  )
}

// Inline Editable Comment component
function InlineEditableComment({
  initialValue,
  loadId,
  onSave,
}: {
  initialValue?: string
  loadId: string
  onSave: (loadId: string, comment: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState(initialValue || "")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isEditing])

  const handleSave = () => {
    onSave(loadId, value)
    setIsEditing(false)
    toast({
      title: "Comment saved",
      description: "Your comment has been saved successfully",
    })
  }

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="min-h-[80px] w-full text-sm"
          placeholder="Add a comment..."
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="cursor-pointer rounded-md p-2 text-sm hover:bg-muted/50" onClick={() => setIsEditing(true)}>
      {value ? value : <span className="text-muted-foreground italic">Add comment...</span>}
    </div>
  )
}

export function LoadsTable() {
  const [data, setData] = useState<Load[]>(initialData)
  const [sorting, setSorting] = useState<SortingState>([{ id: "createdAt", desc: true }])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedLoad, setSelectedLoad] = useState<Load | null>(null)
  const [globalFilter, setGlobalFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [customerFilter, setCustomerFilter] = useState<string[]>([])
  const [driverFilter, setDriverFilter] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{
    from?: Date
    to?: Date
  }>({})

  // Get unique customers for filtering
  const uniqueCustomers = Array.from(new Set(data.map((load) => load.customer)))

  // Get unique drivers for filtering
  const uniqueDrivers = Array.from(new Set(data.filter((load) => load.driver).map((load) => load.driver?.name)))

  // Handle comment save
  const handleCommentSave = (loadId: string, comment: string) => {
    setData((prevData) => prevData.map((load) => (load.id === loadId ? { ...load, comments: comment } : load)))
  }

  const columns: ColumnDef<Load>[] = [
    {
      accessorKey: "id",
      header: "Load ID",
      cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "reference",
      header: "Reference",
    },
    {
      accessorKey: "customer",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Customer
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
    },
    {
      accessorKey: "origin",
      header: "Origin",
    },
    {
      accessorKey: "destination",
      header: "Destination",
    },
    {
      accessorKey: "pickupDate",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Pickup
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("pickupDate"))
        return <div>{date.toLocaleDateString()}</div>
      },
    },
    {
      accessorKey: "deliveryDate",
      header: "Delivery",
      cell: ({ row }) => {
        const date = new Date(row.getValue("deliveryDate"))
        return <div>{date.toLocaleDateString()}</div>
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
    },
    {
      accessorKey: "driver",
      header: "Driver",
      cell: ({ row }) => {
        const driver = row.original.driver

        if (!driver) {
          return (
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => {
                setSelectedLoad(row.original)
                setShowAssignModal(true)
              }}
            >
              <UserPlus className="mr-2 h-3.5 w-3.5" />
              Assign
            </Button>
          )
        }

        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={driver.avatar || "/placeholder.svg"} alt={driver.name} />
              <AvatarFallback>
                {driver.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span>{driver.name}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "rate",
      header: "Rate",
      cell: ({ row }) => <div>{row.getValue("rate") || "N/A"}</div>,
    },
    {
      accessorKey: "distance",
      header: "Distance",
      cell: ({ row }) => {
        const distance = row.getValue("distance") as number | undefined
        return <div>{distance ? `${distance} mi` : "N/A"}</div>
      },
    },
    {
      accessorKey: "rpm",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            RPM
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <RpmIndicator rpm={row.getValue("rpm")} />,
    },
    {
      accessorKey: "comments",
      header: "Comments",
      cell: ({ row }) => (
        <InlineEditableComment
          initialValue={row.original.comments}
          loadId={row.original.id}
          onSave={handleCommentSave}
        />
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const load = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedLoad(load)
                  setShowDetailsModal(true)
                }}
              >
                View details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {load.status === "NEW" && (
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedLoad(load)
                    setShowAssignModal(true)
                  }}
                >
                  Assign driver
                </DropdownMenuItem>
              )}
              {load.status === "ASSIGNED" && <DropdownMenuItem>Send reminder</DropdownMenuItem>}
              {(load.status === "ACCEPTED" || load.status === "IN_PROGRESS") && (
                <DropdownMenuItem>Contact driver</DropdownMenuItem>
              )}
              {load.status === "REFUSED" && <DropdownMenuItem>Reassign load</DropdownMenuItem>}
              <DropdownMenuItem>Edit load</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Export details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Apply filters
  useEffect(() => {
    let filteredData = [...initialData]

    // Apply status filter
    if (statusFilter.length > 0) {
      filteredData = filteredData.filter((load) => statusFilter.includes(load.status))
    }

    // Apply customer filter
    if (customerFilter.length > 0) {
      filteredData = filteredData.filter((load) => customerFilter.includes(load.customer))
    }

    // Apply driver filter
    if (driverFilter.length > 0) {
      filteredData = filteredData.filter((load) => load.driver && driverFilter.includes(load.driver.name))
    }

    // Apply date range filter
    if (dateRange.from) {
      filteredData = filteredData.filter((load) => {
        const pickupDate = new Date(load.pickupDate)
        return pickupDate >= dateRange.from!
      })
    }

    if (dateRange.to) {
      filteredData = filteredData.filter((load) => {
        const pickupDate = new Date(load.pickupDate)
        return pickupDate <= dateRange.to!
      })
    }

    // Apply global filter (search)
    if (globalFilter) {
      const searchTerm = globalFilter.toLowerCase()
      filteredData = filteredData.filter(
        (load) =>
          load.id.toLowerCase().includes(searchTerm) ||
          load.reference.toLowerCase().includes(searchTerm) ||
          load.customer.toLowerCase().includes(searchTerm) ||
          load.origin.toLowerCase().includes(searchTerm) ||
          load.destination.toLowerCase().includes(searchTerm) ||
          load.driver?.name.toLowerCase().includes(searchTerm) ||
          false,
      )
    }

    setData(filteredData)
  }, [statusFilter, customerFilter, driverFilter, dateRange, globalFilter])

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-72">
          <Input
            placeholder="Search loads..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="mr-2 h-3.5 w-3.5" />
                Status
                <ChevronDown className="ml-2 h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("NEW")}
                onCheckedChange={(checked) => {
                  setStatusFilter((prev) => (checked ? [...prev, "NEW"] : prev.filter((s) => s !== "NEW")))
                }}
              >
                New
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("ASSIGNED")}
                onCheckedChange={(checked) => {
                  setStatusFilter((prev) => (checked ? [...prev, "ASSIGNED"] : prev.filter((s) => s !== "ASSIGNED")))
                }}
              >
                Assigned
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("ACCEPTED")}
                onCheckedChange={(checked) => {
                  setStatusFilter((prev) => (checked ? [...prev, "ACCEPTED"] : prev.filter((s) => s !== "ACCEPTED")))
                }}
              >
                Accepted
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("IN_PROGRESS")}
                onCheckedChange={(checked) => {
                  setStatusFilter((prev) =>
                    checked ? [...prev, "IN_PROGRESS"] : prev.filter((s) => s !== "IN_PROGRESS"),
                  )
                }}
              >
                In Progress
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("COMPLETED")}
                onCheckedChange={(checked) => {
                  setStatusFilter((prev) => (checked ? [...prev, "COMPLETED"] : prev.filter((s) => s !== "COMPLETED")))
                }}
              >
                Completed
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter.includes("REFUSED")}
                onCheckedChange={(checked) => {
                  setStatusFilter((prev) => (checked ? [...prev, "REFUSED"] : prev.filter((s) => s !== "REFUSED")))
                }}
              >
                Refused
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setStatusFilter([])} className="justify-center text-center">
                Clear Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="mr-2 h-3.5 w-3.5" />
                Customer
                <ChevronDown className="ml-2 h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Filter by Customer</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {uniqueCustomers.map((customer) => (
                <DropdownMenuCheckboxItem
                  key={customer}
                  checked={customerFilter.includes(customer)}
                  onCheckedChange={(checked) => {
                    setCustomerFilter((prev) => (checked ? [...prev, customer] : prev.filter((c) => c !== customer)))
                  }}
                >
                  {customer}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setCustomerFilter([])} className="justify-center text-center">
                Clear Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <Filter className="mr-2 h-3.5 w-3.5" />
                Driver
                <ChevronDown className="ml-2 h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Filter by Driver</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {uniqueDrivers.map((driver) => (
                <DropdownMenuCheckboxItem
                  key={driver}
                  checked={driverFilter.includes(driver!)}
                  onCheckedChange={(checked) => {
                    setDriverFilter((prev) => (checked ? [...prev, driver!] : prev.filter((d) => d !== driver)))
                  }}
                >
                  {driver}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setDriverFilter([])} className="justify-center text-center">
                Clear Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-8 justify-start text-left font-normal",
                  !dateRange.from && !dateRange.to && "text-muted-foreground",
                )}
              >
                <Calendar className="mr-2 h-3.5 w-3.5" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  "Date Range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
              <div className="flex items-center justify-between border-t p-3">
                <Button variant="outline" size="sm" onClick={() => setDateRange({})}>
                  Clear
                </Button>
                <Button
                  size="sm"
                  onClick={() => document.body.click()} // Close the popover
                >
                  Apply
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={
                    row.original.status === "REFUSED"
                      ? "row-status-refused"
                      : row.original.status === "COMPLETED"
                        ? "row-status-completed"
                        : row.original.isHighlighted
                          ? "bg-blue-50/50 dark:bg-blue-950/20"
                          : ""
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} load(s) total
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>

      {/* Modals */}
      {selectedLoad && (
        <>
          <AssignDriverModal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} load={selectedLoad} />
          <LoadDetailsModal isOpen={showDetailsModal} onClose={() => setShowDetailsModal(false)} load={selectedLoad} />
        </>
      )}
    </div>
  )
}
