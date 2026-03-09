"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface UptimeChartProps {
  data: Array<{
    time: string
    uptime: number
  }>
  title?: string
}

export function UptimeChart({ data, title = "Uptime Overview" }: UptimeChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#141414",
                  border: "1px solid #262626",
                  borderRadius: "8px",
                  color: "#fafafa",
                }}
                labelStyle={{ color: "#a1a1aa" }}
                formatter={(value: number) => [`${value}%`, "Uptime"]}
              />
              <Area
                type="monotone"
                dataKey="uptime"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#uptimeGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
