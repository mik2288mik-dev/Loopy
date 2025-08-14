"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import BottomBar from "@/components/BottomBar"
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
    <div className="min-h-screen bg-[#0B0D10] pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-heading font-bold text-lg text-white">Активность</h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="bg-white/5 border-b border-white/10 sticky top-16 z-40">
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
                    ? "bg-gradient-to-r from-[#F0ABFC] to-[#99F6E4] text-black"
                    : "border-white/10 text-white/80 hover:border-white/20 hover:text-white hover:bg-white/5"
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
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-white/50" />
            </div>
            <h3 className="font-semibold text-white mb-2">Нет активности</h3>
            <p className="text-white/70 text-sm">Здесь будут уведомления о взаимодействиях с вашим контентом</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredActivities.map((activity) => (
              <Card key={activity.id} className={`p-4 cursor-pointer transition-shadow bg-white/5 border-white/10 ${!activity.isRead ? "ring-1 ring-white/10" : ""}`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F0ABFC] to-[#99F6E4] flex items-center justify-center flex-shrink-0">
                    <span className="text-black font-semibold text-sm">{activity.user.charAt(0)}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <p className="text-sm text-white">
                          <span className="font-semibold">{activity.user}</span> <span className="text-white/70">{getActivityText(activity)}</span>
                        </p>
                        {activity.content && <p className="text-sm text-white/80 mt-1 bg-white/5 rounded-lg px-3 py-2">"{activity.content}"</p>}
                        <p className="text-xs text-white/60 mt-2">{activity.timestamp}</p>
                      </div>

                      <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>
                    </div>
                  </div>

                  {activity.videoThumbnail && (
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-white/5 flex-shrink-0 relative group">
                      <img src={activity.videoThumbnail} alt="Video thumbnail" className="w-full h-full object-cover" />
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

      <BottomBar />
    </div>
  )
}
