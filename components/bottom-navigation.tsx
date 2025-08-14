"use client"

import { Home, Search, Plus, Heart, User } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BottomNavigationProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function BottomNavigation({ activeTab = "home", onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: "home", icon: Home, label: "Главная" },
    { id: "search", icon: Search, label: "Поиск" },
    { id: "create", icon: Plus, label: "Создать" },
    { id: "activity", icon: Heart, label: "Активность" },
    { id: "profile", icon: User, label: "Профиль" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            const isCreate = tab.id === "create"

            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => onTabChange?.(tab.id)}
                className={`flex flex-col items-center gap-1 p-2 h-auto ${
                  isCreate
                    ? "bg-loopy-primary hover:bg-loopy-accent text-white rounded-full w-12 h-12"
                    : isActive
                      ? "text-loopy-primary"
                      : "text-gray-500 hover:text-loopy-primary"
                }`}
              >
                <Icon className={`${isCreate ? "w-6 h-6" : "w-5 h-5"}`} />
                {!isCreate && <span className="text-xs font-medium">{tab.label}</span>}
              </Button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
