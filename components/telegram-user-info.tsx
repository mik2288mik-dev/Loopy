"use client"

import { useTelegramContext } from "@/components/telegram-provider"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, User } from "lucide-react"

export function TelegramUserInfo() {
  const { user, isInTelegram, isLoading } = useTelegramContext()

  if (isLoading) {
    return (
      <Card className="p-4 bg-white/50 backdrop-blur-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
          </div>
        </div>
      </Card>
    )
  }

  if (!isInTelegram || !user) {
    return (
      <Card className="p-4 bg-gradient-to-r from-cyan-50 to-rose-50 border border-cyan-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-rose-500 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-gray-900">Демо режим</p>
            <p className="text-sm text-gray-600">Откройте в Telegram для полного функционала</p>
          </div>
        </div>
      </Card>
    )
  }

  const displayName = user.first_name + (user.last_name ? ` ${user.last_name}` : "")

  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
      <div className="flex items-center gap-3">
        <div className="relative">
          {user.photo_url ? (
            <img
              src={user.photo_url || "/placeholder.svg"}
              alt={displayName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">{user.first_name.charAt(0)}</span>
            </div>
          )}
          {user.is_premium && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
              <Crown className="w-3 h-3 text-yellow-800" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-gray-900">{displayName}</p>
            {user.is_premium && (
              <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                Premium
              </Badge>
            )}
          </div>
          {user.username && <p className="text-sm text-gray-600">@{user.username}</p>}
          <p className="text-xs text-blue-600 font-medium">Подключен через Telegram</p>
        </div>
      </div>
    </Card>
  )
}
