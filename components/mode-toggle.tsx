"use client"
import { Moon, Sun, Palette, Monitor } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
  const { setTheme, theme, systemTheme } = useTheme()
  
  // Define theme configurations
  const themes = [
    { 
      value: "light", 
      label: "Light", 
      icon: <Sun className="mr-2 h-4 w-4" />,
      displayIcon: <Sun className="h-[1.2rem] w-[1.2rem]" />
    },
    { 
      value: "dark", 
      label: "Dark", 
      icon: <Moon className="mr-2 h-4 w-4" />,
      displayIcon: <Moon className="h-[1.2rem] w-[1.2rem]" />
    },
    { 
      value: "ocean", 
      label: "Ocean", 
      icon: <Palette className="mr-2 h-4 w-4" />,
      displayIcon: <Palette className="h-[1.2rem] w-[1.2rem] text-blue-400" />
    },
    { 
      value: "forest", 
      label: "Forest", 
      icon: <Palette className="mr-2 h-4 w-4" />,
      displayIcon: <Palette className="h-[1.2rem] w-[1.2rem] text-green-400" />
    },
    { 
      value: "system", 
      label: "System", 
      icon: <Monitor className="mr-2 h-4 w-4" />,
      displayIcon: systemTheme === "dark" 
        ? <Moon className="h-[1.2rem] w-[1.2rem]" /> 
        : <Sun className="h-[1.2rem] w-[1.2rem]" />
    }
  ]

  // Get current theme configuration
  const currentTheme = themes.find(t => t.value === theme) || themes[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative hover:bg-accent/50"
          aria-label="Theme toggle"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {currentTheme.displayIcon}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-40"
        sideOffset={8}
      >
        <DropdownMenuLabel className="font-normal text-muted-foreground">
          Theme
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.value}
            onClick={() => setTheme(themeOption.value)}
            className="flex items-center cursor-pointer"
            aria-selected={theme === themeOption.value}
          >
            {themeOption.icon}
            <span className="flex-1">{themeOption.label}</span>
            {theme === themeOption.value && (
              <span className="h-2 w-2 rounded-full bg-primary ml-2" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}