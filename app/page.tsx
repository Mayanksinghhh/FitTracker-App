"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import LoginForm from "@/components/login-form"
import RegisterForm from "@/components/register-form"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [showLogin, setShowLogin] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("token")
    if (token) {
      router.push("/dashboard")
    }
  }, [router])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold">FitTrack</h1>
            <p className="text-muted-foreground mt-2">Track your fitness journey</p>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <Button variant={showLogin ? "default" : "outline"} onClick={() => setShowLogin(true)}>
              Login
            </Button>
            <Button variant={!showLogin ? "default" : "outline"} onClick={() => setShowLogin(false)}>
              Register
            </Button>
          </div>

          {showLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </ThemeProvider>
  )
}

