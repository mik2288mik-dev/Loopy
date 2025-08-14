"use client"

import { Home, Search, Plus, Heart, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"

interface BottomNavigationProps {
  activeTab?: string
  onTabChange?: (tab: string) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    { id: "home", icon: Home, label: "Главная", path: "/" },
    { id: "search", icon: Search, label: "Поиск", path: "/search" },
    { id: "create", icon: Plus, label: "Создать", path: "/create" },
    { id: "activity", icon: Heart, label: "Активность", path: "/activity" },
    { id: "profile", icon: User, label: "Профиль", path: "/profile" },
  ]

  const getIsActive = (tabId: string, tabPath: string) => {
    if (activeTab) return activeTab === tabId
    if (!pathname) return false
    if (tabPath === "/") return pathname === "/"
    return pathname.startsWith(tabPath)
  }

  const handleClick = (tabId: string, path: string) => {
    onTabChange?.(tabId)
    if (pathname !== path) router.push(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-around">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = getIsActive(tab.id, tab.path)
            const isCreate = tab.id === "create"

            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                onClick={() => handleClick(tab.id, tab.path)}
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
