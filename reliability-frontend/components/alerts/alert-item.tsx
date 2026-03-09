"use client"

import { AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn, formatDate, formatRelativeTime } from "@/lib/utils"
import type { Alert } from "@/lib/types"

interface AlertItemProps {
  alert: Alert
  serviceName?: string
}

export function AlertItem({ alert, serviceName }: AlertItemProps) {
  const isDown = alert.type === "DOWN"

  return (
    <Card className={cn("transition-colors", isDown && !alert.resolved_at && "border-destructive/50")}>
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              isDown ? "bg-destructive/10" : "bg-accent/10"
            )}
          >
            {isDown ? (
              <AlertTriangle className={cn("h-5 w-5", isDown ? "text-destructive" : "text-accent")} />
            ) : (
              <CheckCircle2 className="h-5 w-5 text-accent" />
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="font-medium">{serviceName || "Unknown Service"}</p>
              <Badge variant={isDown ? "destructive" : "success"}>
                {alert.type}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{alert.message}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-right">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{formatRelativeTime(alert.triggered_at)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatDate(alert.triggered_at)}
            </p>
          </div>
          {alert.resolved_at && (
            <Badge variant="outline" className="text-accent">
              Resolved
            </Badge>
          )}
          {!alert.resolved_at && isDown && (
            <Badge variant="outline" className="text-destructive">
              Active
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
