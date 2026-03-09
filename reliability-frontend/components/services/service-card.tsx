"use client"

import { useState } from "react"
import { MoreVertical, Trash2, ExternalLink, Clock, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { api } from "@/lib/api"
import type { Service } from "@/lib/types"

interface ServiceCardProps {
  service: Service
  onDelete: () => void
}

export function ServiceCard({ service, onDelete }: ServiceCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await api.deleteService(service.id)
      onDelete()
    } catch (error) {
      console.error("Failed to delete service:", error)
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  return (
    <Card className="relative overflow-hidden">
      <div
        className={cn(
          "absolute left-0 top-0 h-full w-1",
          service.is_active ? "bg-accent" : "bg-muted"
        )}
      />
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1">
          <h3 className="font-semibold">{service.name}</h3>
          <a
            href={service.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            {service.url}
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={service.is_active ? "success" : "secondary"}>
            {service.is_active ? "Active" : "Paused"}
          </Badge>
          {showConfirm ? (
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Confirm"
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowConfirm(true)}
            >
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Every {service.check_interval} min</span>
          </div>
          <div>
            <span>Timeout: {service.timeout}s</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
