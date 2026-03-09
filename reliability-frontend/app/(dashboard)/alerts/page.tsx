"use client"

import { useState } from "react"
import { Bell, Filter } from "lucide-react"
import { Header } from "@/components/layout/header"
import { AlertItem } from "@/components/alerts/alert-item"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Alert } from "@/lib/types"

// Mock alerts data - in real app, this would come from API
const mockAlerts: (Alert & { serviceName: string })[] = [
  {
    id: "1",
    service_id: "s1",
    serviceName: "Production API",
    type: "DOWN",
    message: "Service returned 503 status code",
    triggered_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    resolved_at: null,
    sent: true,
  },
  {
    id: "2",
    service_id: "s2",
    serviceName: "Authentication Service",
    type: "RECOVERED",
    message: "Service is back online",
    triggered_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    resolved_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    sent: true,
  },
  {
    id: "3",
    service_id: "s2",
    serviceName: "Authentication Service",
    type: "DOWN",
    message: "Connection timeout after 5000ms",
    triggered_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    resolved_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    sent: true,
  },
  {
    id: "4",
    service_id: "s3",
    serviceName: "Payment Gateway",
    type: "RECOVERED",
    message: "Service is back online",
    triggered_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    resolved_at: new Date(Date.now() - 1000 * 60 * 60 * 23).toISOString(),
    sent: true,
  },
]

type FilterType = "all" | "active" | "resolved"

export default function AlertsPage() {
  const [filter, setFilter] = useState<FilterType>("all")

  const filteredAlerts = mockAlerts.filter((alert) => {
    if (filter === "active") return !alert.resolved_at
    if (filter === "resolved") return !!alert.resolved_at
    return true
  })

  const activeCount = mockAlerts.filter((a) => !a.resolved_at).length

  return (
    <div className="flex flex-col">
      <Header
        title="Alerts"
        description="Monitor incidents and service disruptions"
      />

      <div className="flex-1 p-6">
        {/* Filter Tabs */}
        <div className="mb-6 flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-card p-1">
            {(["all", "active", "resolved"] as FilterType[]).map((filterType) => (
              <button
                key={filterType}
                onClick={() => setFilter(filterType)}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  filter === filterType
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                {filterType === "active" && activeCount > 0 && (
                  <Badge variant="destructive" className="h-5 min-w-5 px-1.5">
                    {activeCount}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts List */}
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No alerts</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {filter === "active"
                ? "No active alerts. All services are running smoothly."
                : filter === "resolved"
                ? "No resolved alerts to show."
                : "No alerts have been triggered yet."}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <AlertItem
                key={alert.id}
                alert={alert}
                serviceName={alert.serviceName}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
