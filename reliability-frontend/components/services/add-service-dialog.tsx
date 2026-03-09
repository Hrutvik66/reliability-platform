"use client"

import { useState } from "react"
import { Plus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { api } from "@/lib/api"
import type { ServiceCreate } from "@/lib/types"

interface AddServiceDialogProps {
  onSuccess: () => void
}

export function AddServiceDialog({ onSuccess }: AddServiceDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState<ServiceCreate>({
    name: "",
    url: "",
    check_interval: 5,
    timeout: 5,
    is_active: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await api.createService(formData)
      setOpen(false)
      setFormData({
        name: "",
        url: "",
        check_interval: 5,
        timeout: 5,
        is_active: true,
      })
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create service")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
          <DialogDescription>
            Add a new service or API endpoint to monitor.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {error && (
              <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                placeholder="My API"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://api.example.com/health"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="check_interval">Check Interval (min)</Label>
                <Input
                  id="check_interval"
                  type="number"
                  min={1}
                  max={60}
                  value={formData.check_interval}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      check_interval: parseInt(e.target.value) || 5,
                    })
                  }
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeout">Timeout (sec)</Label>
                <Input
                  id="timeout"
                  type="number"
                  min={1}
                  max={30}
                  value={formData.timeout}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      timeout: parseInt(e.target.value) || 5,
                    })
                  }
                  disabled={isLoading}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Active Monitoring</Label>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Service
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
