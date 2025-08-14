"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { WifiOff, Wifi } from "lucide-react"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      setShowIndicator(true)
      setTimeout(() => setShowIndicator(false), 3000)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setShowIndicator(true)
    }

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (!showIndicator) return null

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-2 duration-300">
      <Card
        className={`px-4 py-2 shadow-lg border-0 ${isOnline ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
      >
        <div className="flex items-center gap-2">
          {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          <span className="text-sm font-medium">
            {isOnline ? "Подключение восстановлено" : "Нет подключения к интернету"}
          </span>
        </div>
      </Card>
    </div>
  )
}
