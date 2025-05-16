import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, CheckCircle2, Clock, Truck, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Loads</CardTitle>
          <Truck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">24</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 dark:text-emerald-400 flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4" />
              +8% from last week
            </span>
          </p>
        </CardContent>
      </Card>
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Assignment</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">7</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-amber-500 dark:text-amber-400 flex items-center">
              <ArrowRightIcon className="mr-1 h-4 w-4" />
              Same as yesterday
            </span>
          </p>
        </CardContent>
      </Card>
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500 dark:text-emerald-400 flex items-center">
              <ArrowUpIcon className="mr-1 h-4 w-4" />
              +3 from yesterday
            </span>
          </p>
        </CardContent>
      </Card>
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Refused Loads</CardTitle>
          <XCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">2</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-rose-500 dark:text-rose-400 flex items-center">
              <ArrowDownIcon className="mr-1 h-4 w-4" />
              -1 from yesterday
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
