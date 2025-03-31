"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dumbbell, Flame, Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function WorkoutSummary() {
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState({
    totalWorkouts: 0,
    totalDuration: 0,
    totalCalories: 0,
  })

  useEffect(() => {
    const fetchWorkoutSummary = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          return
        }

        const response = await fetch("http://localhost:5000/api/workouts/summary", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch workout summary")
        }

        const data = await response.json()
        setSummary(data)
      } catch (error) {
        console.error("Error fetching workout summary:", error)
      } finally {
        setLoading(false)
      }
    }

    // For demo purposes, simulate API call
    setTimeout(() => {
      setSummary({
        totalWorkouts: 12,
        totalDuration: 540, // in minutes
        totalCalories: 3200,
      })
      setLoading(false)
    }, 1000)

    // Uncomment to use real API
    // fetchWorkoutSummary();
  }, [])

  const summaryItems = [
    {
      icon: Dumbbell,
      label: "Total Workouts",
      value: summary.totalWorkouts,
      color: "text-blue-500",
    },
    {
      icon: Clock,
      label: "Total Duration",
      value: `${Math.floor(summary.totalDuration / 60)}h ${summary.totalDuration % 60}m`,
      color: "text-green-500",
    },
    {
      icon: Flame,
      label: "Calories Burned",
      value: summary.totalCalories,
      color: "text-orange-500",
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Workout Summary</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryItems.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex flex-col items-center justify-center text-center">
              <item.icon className={`h-8 w-8 mb-2 ${item.color}`} />
              <h3 className="text-sm font-medium text-muted-foreground">{item.label}</h3>
              {loading ? <Skeleton className="h-6 w-16 mt-1" /> : <p className="text-2xl font-bold">{item.value}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

