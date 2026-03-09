"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

interface ResponseTimeChartProps {
  data: Array<{
    time: string
    responseTime: number
  }>
  title?: string
}

export function ResponseTimeChart({ data, title = "Response Time" }: ResponseTimeChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#71717a", fontSize: 12 }}
                tickFormatter={(value) => `${value}ms`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#141414",
                  border: "1px solid #262626",
                  borderRadius: "8px",
                  color: "#fafafa",
                }}
                labelStyle={{ color: "#a1a1aa" }}
                formatter={(value: number) => [`${value}ms`, "Response Time"]}
              />
              <Line
                type="monotone"
                dataKey="responseTime"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
