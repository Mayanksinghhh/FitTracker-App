"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { UserPlus, Users } from "lucide-react"
import ActivityFeed from "@/components/activity-feed"

interface User {
  id: string
  name: string
  avatar: string
  isFollowing: boolean
}

export default function Social() {
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [followingUsers, setFollowingUsers] = useState<User[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          router.push("/")
          return
        }

        const response = await fetch("http://localhost:5000/api/social/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }

        const data = await response.json()
        setUsers(data.users)
        setFollowingUsers(data.following)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    // For demo purposes, simulate API call
    setTimeout(() => {
      const demoUsers = [
        {
          id: "user1",
          name: "Jane Smith",
          avatar: "/placeholder-user.jpg",
          isFollowing: true,
        },
        {
          id: "user2",
          name: "John Doe",
          avatar: "/placeholder-user.jpg",
          isFollowing: true,
        },
        {
          id: "user3",
          name: "Alex Johnson",
          avatar: "/placeholder-user.jpg",
          isFollowing: false,
        },
        {
          id: "user4",
          name: "Sarah Williams",
          avatar: "/placeholder-user.jpg",
          isFollowing: false,
        },
        {
          id: "user5",
          name: "Michael Brown",
          avatar: "/placeholder-user.jpg",
          isFollowing: false,
        },
      ]

      setUsers(demoUsers)
      setFollowingUsers(demoUsers.filter((user) => user.isFollowing))
      setLoading(false)
    }, 1000)

    // Uncomment to use real API
    // fetchUsers();
  }, [router])

  const handleFollow = async (userId: string) => {
    try {
      const token = localStorage.getItem("token")

      if (!token) {
        return
      }

      // Update UI optimistically
      const updatedUsers = users.map((user) => {
        if (user.id === userId) {
          return { ...user, isFollowing: !user.isFollowing }
        }
        return user
      })

      setUsers(updatedUsers)
      setFollowingUsers(updatedUsers.filter((user) => user.isFollowing))

      // Send request to API
      const response = await fetch(`http://localhost:5000/api/social/follow/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to follow/unfollow user")
      }
    } catch (error) {
      console.error("Error following/unfollowing user:", error)
      // Revert UI change on error
    }
  }

  const filteredUsers = users.filter((user) => user.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Social</h1>

        <Tabs defaultValue="feed" className="space-y-4">
          <TabsList>
            <TabsTrigger value="feed">Activity Feed</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="discover">Discover Users</TabsTrigger>
          </TabsList>

          <TabsContent value="feed">
            <Card>
              <CardContent className="p-6">
                <ActivityFeed />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="following">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">People You Follow</h2>

                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-9 w-24" />
                      </div>
                    ))}
                  </div>
                ) : followingUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">You are not following anyone yet</p>
                    <Button variant="link" onClick={() => document.querySelector('[data-value="discover"]')?.click()}>
                      Discover users to follow
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {followingUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                        <Button
                          variant={user.isFollowing ? "outline" : "default"}
                          size="sm"
                          onClick={() => handleFollow(user.id)}
                        >
                          {user.isFollowing ? "Unfollow" : "Follow"}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="discover">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Discover Users</h2>

                <div className="mb-6">
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                        <Skeleton className="h-9 w-24" />
                      </div>
                    ))}
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No users found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                        <Button
                          variant={user.isFollowing ? "outline" : "default"}
                          size="sm"
                          onClick={() => handleFollow(user.id)}
                        >
                          {user.isFollowing ? "Unfollow" : "Follow"}
                          {!user.isFollowing && <UserPlus className="ml-1 h-4 w-4" />}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

