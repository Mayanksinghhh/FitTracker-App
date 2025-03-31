"use client"

import { useState } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import ProgressCharts from "@/components/progress-charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, LineChart, PieChart } from "lucide-react"

export default function Progress() {
  const [timeRange, setTimeRange] = useState("week")

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Your Progress</h1>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="workouts" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              Workouts
            </TabsTrigger>
            <TabsTrigger value="types" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Workout Types
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Duration Over Time</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ProgressCharts />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Calories Burned</CardTitle>
                </CardHeader>
                <CardContent className="h-[350px]">
                  <ProgressCharts />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workouts">
            <Card>
              <CardHeader>
                <CardTitle>Workout History</CardTitle>
              </CardHeader>
              <CardContent className="h-[500px]">
                <ProgressCharts />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="types">
            <Card>
              <CardHeader>
                <CardTitle>Workout Types Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-[500px]">
                <ProgressCharts />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

