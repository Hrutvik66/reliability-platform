"use client"

import { Server, ExternalLink, Clock } from "lucide-react"
import useSWR from "swr"
import { Header } from "@/components/layout/header"
import { Badge } from "@/components/ui/badge"
import { fetcher } from "@/lib/api"
import type { Service } from "@/lib/types"

export default function AdminServicesPage() {
  const { data: services, error, isLoading } = useSWR<Service[]>(
    "/admin/services",
    fetcher
  )

  return (
    <div className="flex flex-col">
      <Header
        title="All Services"
        description="View all services across all users"
      />

      <div className="flex-1 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-destructive">
              Failed to load services. You may not have admin permissions.
            </p>
          </div>
        ) : services?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Server className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No services found</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No services have been registered yet.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-border">
            <div className="grid grid-cols-5 gap-4 border-b border-border bg-secondary/50 p-4 text-sm font-medium text-muted-foreground">
              <div>Service</div>
              <div>URL</div>
              <div>Owner</div>
              <div>Interval</div>
              <div>Status</div>
            </div>
            {services?.map((service) => (
              <div
                key={service.id}
                className="grid grid-cols-5 gap-4 border-b border-border p-4 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                    <Server className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="font-medium">{service.name}</p>
                </div>
                <div className="flex items-center">
                  <a
                    href={service.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <span className="max-w-[200px] truncate">{service.url}</span>
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  {service.user_id ? `${service.user_id.slice(0, 8)}...` : "N/A"}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Every {service.check_interval} min</span>
                </div>
                <div className="flex items-center">
                  <Badge variant={service.is_active ? "success" : "secondary"}>
                    {service.is_active ? "Active" : "Paused"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
