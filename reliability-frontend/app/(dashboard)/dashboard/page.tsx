"use client"

import { Server, AlertTriangle, CheckCircle2, Clock } from "lucide-react"
import useSWR from "swr"
import { Header } from "@/components/layout/header"
import { StatsCard } from "@/components/dashboard/stats-card"
import { UptimeChart } from "@/components/dashboard/uptime-chart"
import { ResponseTimeChart } from "@/components/dashboard/response-time-chart"
import { ServiceStatusList } from "@/components/dashboard/service-status-list"
import { fetcher } from "@/lib/api"
import type { Service } from "@/lib/types"

// Mock data for charts (in real app, this would come from API)
const mockUptimeData = [
  { time: "12h ago", uptime: 100 },
  { time: "10h ago", uptime: 99.5 },
  { time: "8h ago", uptime: 100 },
  { time: "6h ago", uptime: 98 },
  { time: "4h ago", uptime: 100 },
  { time: "2h ago", uptime: 100 },
  { time: "Now", uptime: 99.9 },
]

const mockResponseTimeData = [
  { time: "12h ago", responseTime: 245 },
  { time: "10h ago", responseTime: 289 },
  { time: "8h ago", responseTime: 256 },
  { time: "6h ago", responseTime: 312 },
  { time: "4h ago", responseTime: 278 },
  { time: "2h ago", responseTime: 234 },
  { time: "Now", responseTime: 251 },
]

export default function DashboardPage() {
  const { data: services, error, isLoading } = useSWR<Service[]>("/services/", fetcher)

  const totalServices = services?.length || 0
  const activeServices = services?.filter((s) => s.is_active).length || 0
  const upServices = services?.filter((s) => s.is_active).length || 0 // In real app, check actual status
  const avgResponseTime = 251 // Mock value, calculate from real data

  return (
    <div className="flex flex-col">
      <Header
        title="Dashboard"
        description="Monitor your services at a glance"
      />

      <div className="flex-1 space-y-6 p-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Services"
            value={totalServices}
            subtitle="Monitored endpoints"
            icon={Server}
          />
          <StatsCard
            title="Services Up"
            value={upServices}
            subtitle={`${totalServices > 0 ? Math.round((upServices / totalServices) * 100) : 0}% uptime`}
            icon={CheckCircle2}
            trend={{ value: 2.5, isPositive: true }}
          />
          <StatsCard
            title="Active Alerts"
            value={0}
            subtitle="Unresolved issues"
            icon={AlertTriangle}
          />
          <StatsCard
            title="Avg Response Time"
            value={`${avgResponseTime}ms`}
            subtitle="Last 24 hours"
            icon={Clock}
            trend={{ value: 5.2, isPositive: false }}
          />
        </div>

        {/* Charts Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          <UptimeChart data={mockUptimeData} />
          <ResponseTimeChart data={mockResponseTimeData} />
        </div>

        {/* Service Status List */}
        <ServiceStatusList
          services={
            services?.slice(0, 5).map((s) => ({
              ...s,
              is_up: s.is_active,
              response_time_ms: Math.random() * 300 + 100,
            })) || []
          }
        />
      </div>
    </div>
  )
}
