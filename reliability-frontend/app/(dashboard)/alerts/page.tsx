"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { Header } from "@/components/layout/header"
import { AlertItem } from "@/components/alerts/alert-item"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import type { Alert } from "@/lib/types"

type FilterType = "all" | "active" | "resolved"

export default function AlertsPage() {
  const [filter, setFilter] = useState<FilterType>("all")
  const [alerts, setAlerts] = useState<(Alert & { serviceName: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await api.getAlerts()
        setAlerts(data)
      } catch (err) {
        console.log("[v0] Error fetching alerts:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch alerts")
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [])

  const filteredAlerts = alerts.filter((alert) => {
    if (filter === "active") return !alert.resolved_at
    if (filter === "resolved") return !!alert.resolved_at
    return true
  })

  const activeCount = alerts.filter((a) => !a.resolved_at).length

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

        {/* Error State */}
        {error && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Bell className="h-8 w-8 animate-pulse text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">Loading alerts...</h3>
          </div>
        )}

        {/* Alerts List */}
        {!loading && filteredAlerts.length === 0 ? (
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
          !loading && (
            <div className="space-y-3">
              {filteredAlerts.map((alert) => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  serviceName={alert.serviceName}
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}
