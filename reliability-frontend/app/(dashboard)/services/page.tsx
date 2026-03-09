"use client"

import useSWR from "swr"
import { Server } from "lucide-react"
import { Header } from "@/components/layout/header"
import { ServiceCard } from "@/components/services/service-card"
import { AddServiceDialog } from "@/components/services/add-service-dialog"
import { fetcher } from "@/lib/api"
import type { Service } from "@/lib/types"

export default function ServicesPage() {
  const { data: services, error, isLoading, mutate } = useSWR<Service[]>(
    "/services/",
    fetcher
  )

  const handleRefresh = () => {
    mutate()
  }

  return (
    <div className="flex flex-col">
      <Header
        title="Services"
        description="Manage your monitored services and endpoints"
        actions={<AddServiceDialog onSuccess={handleRefresh} />}
      />

      <div className="flex-1 p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-destructive">Failed to load services</p>
            <button
              onClick={() => mutate()}
              className="mt-2 text-sm text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        ) : services?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
              <Server className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No services yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Add your first service to start monitoring
            </p>
            <div className="mt-4">
              <AddServiceDialog onSuccess={handleRefresh} />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {services?.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onDelete={handleRefresh}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
