"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  id: string
  user: {
    id: string
    name: string
    avatar: string
  }
  type: string
  workout?: {
    type: string
    duration: number
    calories: number
  }
  content?: string
  likes: number
  comments: number
  createdAt: string
  isLiked: boolean
}

export default function ActivityFeed() {
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          return
        }

        console.log("Making API call to:", `${process.env.NEXT_PUBLIC_APP_BASE_URL}api/social/feed`)
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL}api/social/feed`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch activity feed")
        }

        const data = await response.json()
        setActivities(data)
      } catch (error) {
        console.error("Error fetching activity feed:", error)
      } finally {
        setLoading(false)
      }
    }

    // For demo purposes, simulate API call
    

    // Uncomment to use real API
    fetchActivities();
  }, [])

  const handleLike = async (activityId: string) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        return
      }

      // Update UI optimistically
      setActivities(
        activities.map((activity) => {
          if (activity.id === activityId) {
            return {
              ...activity,
              likes: activity.isLiked ? activity.likes - 1 : activity.likes + 1,
              isLiked: !activity.isLiked,
            }
          }
          return activity
        }),
      )

      // Send request to API
      console.log("Making API call to:", `${process.env.NEXT_PUBLIC_APP_BASE_URL}api/social/like/${activityId}`)
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL}api/social/like/${activityId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to like activity")
        
      }
    } catch (error) {
      console.error("Error liking activity:", error)
      // Revert UI change on error
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Activity Feed</h2>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-4 p-4 border rounded-lg">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Activity Feed</h2>

      {activities.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">No activities yet</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="p-4 border rounded-lg">
              <div className="flex items-start gap-3">
                <Avatar>
                  <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                  <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{activity.user.name}</h3>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  {activity.type === "workout" && activity.workout && (
                    <div className="mt-2">
                      <p>
                        Completed a <span className="font-medium">{activity.workout.type}</span> workout
                      </p>
                      <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                        <span>{activity.workout.duration} min</span>
                        <span>{activity.workout.calories} calories</span>
                      </div>
                    </div>
                  )}

                  {activity.type === "post" && activity.content && <p className="mt-2">{activity.content}</p>}

                  <div className="flex items-center gap-4 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1 h-auto p-1"
                      onClick={() => handleLike(activity.id)}
                    >
                      <Heart className={`h-4 w-4 ${activity.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                      <span>{activity.likes}</span>
                    </Button>

                    <Button variant="ghost" size="sm" className="flex items-center gap-1 h-auto p-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{activity.comments}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

