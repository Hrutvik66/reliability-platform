"use client"

import Link from "next/link"
import { ChevronRight, Circle, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Service } from "@/lib/types"

interface ServiceStatusListProps {
  services: Array<Service & { is_up?: boolean; response_time_ms?: number }>
}

export function ServiceStatusList({ services }: ServiceStatusListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base font-medium">Service Status</CardTitle>
        <Link
          href="/services"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No services monitored yet
          </p>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <div className="flex items-center gap-3">
                <Circle
                  className={cn(
                    "h-3 w-3 fill-current",
                    service.is_up !== false ? "text-accent" : "text-destructive"
                  )}
                />
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-xs text-muted-foreground">{service.url}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {service.response_time_ms && (
                  <span className="text-sm text-muted-foreground">
                    {Math.round(service.response_time_ms)}ms
                  </span>
                )}
                <Badge variant={service.is_up !== false ? "success" : "destructive"}>
                  {service.is_up !== false ? "Up" : "Down"}
                </Badge>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
