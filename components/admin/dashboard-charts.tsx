"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"
import { useEffect, useState } from "react"
import axios from "axios"

interface OrderStats {
  date: string
  orders: number
  revenue: number
}

interface StatusDistribution {
  status: string
  count: number
}

const COLORS = ["#2563eb", "#16a34a", "#ca8a04", "#dc2626", "#7c3aed"]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {label}
            </span>
            <span className="font-bold text-muted-foreground">
              Orders: {payload[0].value}
            </span>
            <span className="font-bold text-muted-foreground">
              Revenue: ${payload[1].value.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="flex flex-col">
          <span className="text-[0.70rem] uppercase text-muted-foreground">
            {payload[0].name}
          </span>
          <span className="font-bold text-muted-foreground">
            Count: {payload[0].value}
          </span>
        </div>
      </div>
    )
  }
  return null
}

export default function DashboardCharts() {
  const [orderStats, setOrderStats] = useState<OrderStats[]>([])
  const [statusDistribution, setStatusDistribution] = useState<StatusDistribution[]>([])

  useEffect(() => {
    fetchOrderStats()
  }, [])

  const fetchOrderStats = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:8080/api/admin/getAllOrders", {
        headers: { Authorization: `Bearer ${token}` }
      })

      // Process orders for the last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i)
        return date.toISOString().split("T")[0]
      }).reverse()

      const stats = last7Days.map(date => {
        const dayOrders = response.data.filter((order: any) => 
          order.createdAt.split("T")[0] === date
        )
        return {
          date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
          orders: dayOrders.length,
          revenue: dayOrders.reduce((sum: number, order: any) => sum + order.totalAmount, 0)
        }
      })

      setOrderStats(stats)

      // Process status distribution
      const statusCounts = response.data.reduce((acc: any, order: any) => {
        acc[order.status] = (acc[order.status] || 0) + 1
        return acc
      }, {})

      const distribution = Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count
      }))

      setStatusDistribution(distribution)
    } catch (error) {
      console.error("Error fetching order stats:", error)
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Orders & Revenue (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={orderStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  yAxisId="left"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="orders"
                  fill="#2563eb"
                  name="Orders"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  yAxisId="right"
                  dataKey="revenue"
                  fill="#16a34a"
                  name="Revenue"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Status Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  innerRadius={80}
                  paddingAngle={2}
                  label={({ name, percent }) => 
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="white"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 