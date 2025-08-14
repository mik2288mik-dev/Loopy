"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ArrowLeft, Heart, MessageCircle, UserPlus, Play } from "lucide-react"
import { useRouter } from "next/navigation"

interface ActivityItem {
  id: number
  type: "like" | "comment" | "follow" | "mention"
  user: string
  avatar?: string
  content?: string
  timestamp: string
  videoThumbnail?: string
  isRead: boolean
}

export default function ActivityPage() {
  const router = useRouter()
  const [filter, setFilter] = useState("all")

  const activities: ActivityItem[] = []

  const filteredActivities = activities.filter((activity) => {
    if (filter === "all") return true
    if (filter === "unread") return !activity.isRead
    return activity.type === filter
  })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "like":
        return <Heart className="w-4 h-4 text-loopy-accent fill-current" />
      case "comment":
        return <MessageCircle className="w-4 h-4 text-loopy-primary" />
      case "follow":
        return <UserPlus className="w-4 h-4 text-green-500" />
      case "mention":
        return <span className="w-4 h-4 text-orange-500 text-sm font-bold">@</span>
      default:
        return null
    }
  }

  const getActivityText = (activity: ActivityItem) => {
    switch (activity.type) {
      case "like":
        return "оценил ваше видео"
      case "comment":
        return "прокомментировал ваше видео"
      case "follow":
        return "подписался на вас"
      case "mention":
        return "упомянул вас в комментарии"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full text-gray-600 hover:text-loopy-primary hover:bg-loopy-primary/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-heading font-bold text-lg text-gray-900">Активность</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {[
              { id: "all", label: "Все" },
              { id: "unread", label: "Непрочитанные" },
              { id: "like", label: "Лайки" },
              { id: "comment", label: "Комментарии" },
              { id: "follow", label: "Подписки" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={filter === tab.id ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(tab.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  filter === tab.id
                    ? "bg-loopy-primary hover:bg-loopy-accent text-white shadow-md"
                    : "border-gray-200 text-gray-600 hover:border-loopy-primary hover:text-loopy-primary hover:bg-loopy-primary/5"
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="max-w-md mx-auto p-4">
        {filteredActivities.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Нет активности</h3>
            <p className="text-gray-600 text-sm">Здесь будут отображаться уведомления о взаимодействиях с вашим контентом</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivities.map((activity) => (
              <Card key={activity.id} className={`p-4 cursor-pointer hover:shadow-md transition-shadow ${!activity.isRead ? "bg-loopy-primary/5 border-loopy-primary/20" : "bg-white"}`}>
                <div className="flex items-start gap-3">
                  {/* User Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-sm">{activity.user.charAt(0)}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          <span className="font-semibold">{activity.user}</span> <span className="text-gray-600">{getActivityText(activity)}</span>
                        </p>
                        {activity.content && <p className="text-sm text-gray-700 mt-1 bg-gray-50 rounded-lg px-3 py-2">"{activity.content}"</p>}
                        <p className="text-xs text-gray-500 mt-2">{activity.timestamp}</p>
                      </div>

                      {/* Activity Icon */}
                      <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>
                    </div>
                  </div>

                  {/* Video Thumbnail */}
                  {activity.videoThumbnail && (
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 relative group">
                      <img src={activity.videoThumbnail || "/placeholder.svg"} alt="Video thumbnail" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
