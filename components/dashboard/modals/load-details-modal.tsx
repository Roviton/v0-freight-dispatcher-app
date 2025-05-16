"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, FileText, MapPin, MessageSquare, Package, Truck, User } from "lucide-react"

type Load = {
  id: string
  reference: string
  customer: string
  origin: string
  destination: string
  pickupDate: string
  deliveryDate: string
  status: string
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
}

interface LoadDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  load: Load
}

export function LoadDetailsModal({ isOpen, onClose, load }: LoadDetailsModalProps) {
  // Sample activity data
  const activities = [
    {
      id: 1,
      type: "status_change",
      description: "Load created",
      timestamp: "2025-05-14T14:30:00",
      user: "System",
    },
    {
      id: 2,
      type: "status_change",
      description: "Driver assigned",
      timestamp: "2025-05-14T15:45:00",
      user: "Jane Dispatcher",
    },
    {
      id: 3,
      type: "message",
      description: "Driver accepted the load",
      timestamp: "2025-05-14T16:10:00",
      user: load.driver?.name || "Driver",
    },
    ...(load.timeline?.arrivedPickup
      ? [
          {
            id: 4,
            type: "status_change",
            description: "Driver arrived at pickup",
            timestamp: load.timeline.arrivedPickup,
            user: load.driver?.name || "Driver",
          },
        ]
      : []),
    ...(load.timeline?.departedPickup
      ? [
          {
            id: 5,
            type: "status_change",
            description: "Driver departed from pickup",
            timestamp: load.timeline.departedPickup,
            user: load.driver?.name || "Driver",
          },
        ]
      : []),
    ...(load.timeline?.arrivedDelivery
      ? [
          {
            id: 6,
            type: "status_change",
            description: "Driver arrived at delivery",
            timestamp: load.timeline.arrivedDelivery,
            user: load.driver?.name || "Driver",
          },
        ]
      : []),
    ...(load.timeline?.delivered
      ? [
          {
            id: 7,
            type: "status_change",
            description: "Load delivered",
            timestamp: load.timeline.delivered,
            user: load.driver?.name || "Driver",
          },
        ]
      : []),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  // Format the timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Load {load.id}
            <Badge className="ml-2">{load.status}</Badge>
          </DialogTitle>
          <DialogDescription>
            {load.reference} • {load.customer}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    Locations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Origin</div>
                    <div className="font-medium">{load.origin}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Destination</div>
                    <div className="font-medium">{load.destination}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Pickup Date</div>
                    <div className="font-medium">{new Date(load.pickupDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Delivery Date</div>
                    <div className="font-medium">{new Date(load.deliveryDate).toLocaleDateString()}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <FileText className="mr-2 h-4 w-4" />
                    Load Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Customer</div>
                    <div className="font-medium">{load.customer}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Reference</div>
                    <div className="font-medium">{load.reference}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Status</div>
                    <div className="font-medium">{load.status}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Truck className="mr-2 h-4 w-4" />
                    Driver Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {load.driver ? (
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={load.driver.avatar || "/placeholder.svg"} alt={load.driver.name} />
                        <AvatarFallback>
                          {load.driver.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{load.driver.name}</div>
                        <div className="text-xs text-muted-foreground">Assigned Driver</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No driver assigned</div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Load Progress</CardTitle>
                <CardDescription>Current status and timeline of the load</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full ${
                        load.status !== "NEW"
                          ? "bg-primary text-primary-foreground"
                          : "border border-muted-foreground text-muted-foreground"
                      }`}
                    >
                      1
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium">Load Created</div>
                      <div className="text-xs text-muted-foreground">
                        {activities.find((a) => a.description === "Load created")?.timestamp
                          ? formatTimestamp(activities.find((a) => a.description === "Load created")!.timestamp)
                          : "N/A"}
                      </div>
                    </div>
                  </div>

                  <div className="relative ml-4 border-l border-muted-foreground/30 pl-8 pb-2">
                    <div className="absolute -left-[4px] top-0 h-2 w-2 rounded-full bg-muted-foreground"></div>
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          load.status !== "NEW"
                            ? "bg-primary text-primary-foreground"
                            : "border border-muted-foreground text-muted-foreground"
                        }`}
                      >
                        2
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Driver Assigned</div>
                        <div className="text-xs text-muted-foreground">
                          {activities.find((a) => a.description === "Driver assigned")?.timestamp
                            ? formatTimestamp(activities.find((a) => a.description === "Driver assigned")!.timestamp)
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative ml-4 border-l border-muted-foreground/30 pl-8 pb-2">
                    <div className="absolute -left-[4px] top-0 h-2 w-2 rounded-full bg-muted-foreground"></div>
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          load.status === "ACCEPTED" || load.status === "IN_PROGRESS" || load.status === "COMPLETED"
                            ? "bg-primary text-primary-foreground"
                            : "border border-muted-foreground text-muted-foreground"
                        }`}
                      >
                        3
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Driver Accepted</div>
                        <div className="text-xs text-muted-foreground">
                          {activities.find((a) => a.description === "Driver accepted the load")?.timestamp
                            ? formatTimestamp(
                                activities.find((a) => a.description === "Driver accepted the load")!.timestamp,
                              )
                            : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative ml-4 border-l border-muted-foreground/30 pl-8 pb-2">
                    <div className="absolute -left-[4px] top-0 h-2 w-2 rounded-full bg-muted-foreground"></div>
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          load.timeline?.arrivedPickup
                            ? "bg-primary text-primary-foreground"
                            : "border border-muted-foreground text-muted-foreground"
                        }`}
                      >
                        4
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Arrived at Pickup</div>
                        <div className="text-xs text-muted-foreground">
                          {load.timeline?.arrivedPickup ? formatTimestamp(load.timeline.arrivedPickup) : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative ml-4 border-l border-muted-foreground/30 pl-8 pb-2">
                    <div className="absolute -left-[4px] top-0 h-2 w-2 rounded-full bg-muted-foreground"></div>
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          load.timeline?.departedPickup
                            ? "bg-primary text-primary-foreground"
                            : "border border-muted-foreground text-muted-foreground"
                        }`}
                      >
                        5
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Departed from Pickup</div>
                        <div className="text-xs text-muted-foreground">
                          {load.timeline?.departedPickup ? formatTimestamp(load.timeline.departedPickup) : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative ml-4 border-l border-muted-foreground/30 pl-8 pb-2">
                    <div className="absolute -left-[4px] top-0 h-2 w-2 rounded-full bg-muted-foreground"></div>
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          load.timeline?.arrivedDelivery
                            ? "bg-primary text-primary-foreground"
                            : "border border-muted-foreground text-muted-foreground"
                        }`}
                      >
                        6
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Arrived at Delivery</div>
                        <div className="text-xs text-muted-foreground">
                          {load.timeline?.arrivedDelivery ? formatTimestamp(load.timeline.arrivedDelivery) : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative ml-4 pl-8">
                    <div className="absolute -left-[4px] top-0 h-2 w-2 rounded-full bg-muted-foreground"></div>
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          load.timeline?.delivered
                            ? "bg-primary text-primary-foreground"
                            : "border border-muted-foreground text-muted-foreground"
                        }`}
                      >
                        7
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium">Delivered</div>
                        <div className="text-xs text-muted-foreground">
                          {load.timeline?.delivered ? formatTimestamp(load.timeline.delivered) : "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activity Log</CardTitle>
                <CardDescription>Recent activities related to this load</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {activity.type === "status_change" ? (
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <MessageSquare className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm">{activity.description}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>{activity.user}</span>
                          <span>•</span>
                          <span>{formatTimestamp(activity.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {load.status === "NEW" && <Button>Assign Driver</Button>}
          {load.status === "ASSIGNED" && <Button>Send Reminder</Button>}
          {(load.status === "ACCEPTED" || load.status === "IN_PROGRESS") && <Button>Contact Driver</Button>}
          {load.status === "COMPLETED" && <Button>View POD</Button>}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
