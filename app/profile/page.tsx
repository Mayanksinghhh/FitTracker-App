"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { set } from "date-fns"

interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  bio: string
  fitnessGoal: string
  stats: {
    workouts: number
    following: number
    followers: number
  }
}

export default function Profile() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    fitnessGoal: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [tab, setTab] = useState("profile")
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          router.push("/")
          return
        }

        console.log("Making API call to:", `${process.env.NEXT_PUBLIC_APP_BASE_URL}api/users/profile`)
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL}api/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch profile")
        }

        const data = await response.json()
        setProfile(data)
        setFormData({
          name: data.name,
          bio: data.bio || "",
          fitnessGoal: data.fitnessGoal || "",
        })
      } catch (error) {
        console.error("Error fetching profile:", error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchProfile();
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    try {
      const token = localStorage.getItem("token")

      if (!token) {
        return
      }

      console.log("Making API call to:", `${process.env.NEXT_PUBLIC_APP_BASE_URL}api/users/profile`)
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_BASE_URL}api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update profile")
      }

      // Update profile state with new data
      setProfile((prev) => {
        if (!prev) return null
        return { ...prev, ...formData }
      })

      setSuccess(true)
      setIsEditing(false)
    } catch (err: any) {
      setError(err.message || "Something went wrong")
    }
  }

  if (loading || !profile) {
    return (
      <DashboardLayout>
        <div className="p-6 flex justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader className="skeleton h-20" />
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center gap-4">
                <div className="skeleton h-24 w-24 rounded-full" />
                <div className="skeleton h-8 w-48" />
                <div className="skeleton h-4 w-64" />
              </div>
              <div className="grid grid-cols-3 gap-4 py-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="skeleton h-6 w-12 mb-1" />
                    <div className="skeleton h-4 w-20" />
                  </div>
                ))}
              </div>
              <div className="space-y-4 pt-4">
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <Tabs value={tab} onValueChange={setTab} className="w-full max-w-2xl mx-auto">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4 mb-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar} alt={profile.name} />
                    <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <p className="text-muted-foreground">{profile.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 py-4 border-y">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold">{profile.stats.workouts}</span>
                    <span className="text-sm text-muted-foreground">Workouts</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold">{profile.stats.following}</span>
                    <span className="text-sm text-muted-foreground">Following</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-bold">{profile.stats.followers}</span>
                    <span className="text-sm text-muted-foreground">Followers</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">Bio</h3>
                    <p>{profile.bio || "No bio added yet"}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-1">Fitness Goal</h3>
                    <p>{profile.fitnessGoal || "No fitness goal added yet"}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <Button onClick={() => {setTab("settings")
                    
                  }}>Edit Profile</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert className="mb-6 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-50">
                    <AlertDescription>Profile updated successfully!</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea id="bio" name="bio" value={formData.bio} onChange={handleInputChange} rows={4} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fitnessGoal">Fitness Goal</Label>
                    <Textarea
                      id="fitnessGoal"
                      name="fitnessGoal"
                      value={formData.fitnessGoal}
                      onChange={handleInputChange}
                      rows={2}
                    />
                  </div>

                  <Button type="submit">Save Changes</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

