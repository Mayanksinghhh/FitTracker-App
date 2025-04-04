"use client"

import { useState, useEffect } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { useTheme } from "next-themes"

export default function ProgressCharts() {
  const [loading, setLoading] = useState(true)
  const [workoutData, setWorkoutData] = useState<any[]>([])
  const { theme } = useTheme()

  // Determine colors based on theme
  const getColors = () => {
    return theme === "dark"
      ? {
          primary: "#a855f7", // purple-500
          secondary: "#3b82f6", // blue-500
          tertiary: "#10b981", // emerald-500
          grid: "#333333",
          text: "#ffffff",
        }
      : {
          primary: "#8b5cf6", // violet-500
          secondary: "#3b82f6", // blue-500
          tertiary: "#10b981", // emerald-500
          grid: "#e5e7eb",
          text: "#000000",
        }
  }

  const colors = getColors()

  useEffect(() => {
    const fetchWorkoutData = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          return
        }

        console.log("Making API call to:", `${process.env.NEXT_PUBLIC_APP_BASE_URL}api/workouts/stats`)
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL}api/workouts/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch workout data")
        }

        const data = await response.json()
        setWorkoutData(data)
      } catch (error) {
        console.error("Error fetching workout data:", error)
      } finally {
        setLoading(false)
      }
    }

    // For demo purposes, simulate API call
    // setTimeout(() => {
    //   const demoData = [
    //     { date: "Mon", duration: 30, calories: 250, type: "Cardio" },
    //     { date: "Tue", duration: 45, calories: 350, type: "Strength" },
    //     { date: "Wed", duration: 20, calories: 150, type: "Yoga" },
    //     { date: "Thu", duration: 60, calories: 450, type: "Cardio" },
    //     { date: "Fri", duration: 50, calories: 400, type: "Strength" },
    //     { date: "Sat", duration: 40, calories: 300, type: "HIIT" },
    //     { date: "Sun", duration: 30, calories: 200, type: "Yoga" },
    //   ]
    //   setWorkoutData(demoData)
    //   setLoading(false)
    // }, 1000)

    // Uncomment to use real API
    fetchWorkoutData();
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Progress</h2>
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Your Progress</h2>

      <Tabs defaultValue="duration" className="space-y-4">
        <TabsList>
          <TabsTrigger value="duration">Duration</TabsTrigger>
          <TabsTrigger value="calories">Calories</TabsTrigger>
          <TabsTrigger value="types">Workout Types</TabsTrigger>
        </TabsList>

        <TabsContent value="duration" className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={workoutData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis dataKey="date" stroke={colors.text} />
              <YAxis stroke={colors.text} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                  color: colors.text,
                  border: `1px solid ${colors.grid}`,
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="duration"
                stroke={colors.primary}
                activeDot={{ r: 8 }}
                name="Duration (min)"
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="calories" className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={workoutData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis dataKey="date" stroke={colors.text} />
              <YAxis stroke={colors.text} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                  color: colors.text,
                  border: `1px solid ${colors.grid}`,
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="calories"
                stroke={colors.secondary}
                activeDot={{ r: 8 }}
                name="Calories Burned"
              />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>

        <TabsContent value="types" className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workoutData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
              <XAxis dataKey="date" stroke={colors.text} />
              <YAxis stroke={colors.text} />
              <Tooltip
                contentStyle={{
                  backgroundColor: theme === "dark" ? "#1f2937" : "#ffffff",
                  color: colors.text,
                  border: `1px solid ${colors.grid}`,
                }}
              />
              <Legend />
              <Bar dataKey="duration" fill={colors.tertiary} name="Duration (min)" />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </div>
  )
}

