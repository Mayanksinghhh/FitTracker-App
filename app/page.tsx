"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import LoginForm from "@/components/login-form"
import RegisterForm from "@/components/register-form"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [showLogin, setShowLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      router.push("/dashboard")
    } else {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>

        <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg border border-border">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-primary">FitTrack</h1>
            <p className="text-muted-foreground">Track your fitness journey</p>
          </div>

          <div className="flex justify-center space-x-4 mb-6">
            <Button 
              variant={showLogin ? "default" : "outline"} 
              onClick={() => setShowLogin(true)}
              className="w-24"
            >
              Login
            </Button>
            <Button 
              variant={!showLogin ? "default" : "outline"} 
              onClick={() => setShowLogin(false)}
              className="w-24"
            >
              Register
            </Button>
          </div>

          {showLogin ? <LoginForm /> : <RegisterForm />}

          <div className="text-center text-sm text-muted-foreground">
            {showLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button 
              onClick={() => setShowLogin(!showLogin)}
              className="font-medium text-primary hover:underline"
            >
              {showLogin ? "Register" : "Login"}
            </button>
          </div>
        </div>
      </div>
    </ThemeProvider>
  )
}