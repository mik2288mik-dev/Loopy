"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, UserPlus, UserCheck, Share, MoreHorizontal, Sparkles } from "lucide-react"

interface UserProfileHeaderProps {
  user: {
    id: string
    username: string
    displayName: string
    bio?: string
    avatar?: string
    isVerified?: boolean
    followersCount: number
    followingCount: number
    videosCount: number
    isFollowing?: boolean
    isOwnProfile?: boolean
  }
  onFollow?: () => void
  onEdit?: () => void
  onShare?: () => void
}

export function UserProfileHeader({ user, onFollow, onEdit, onShare }: UserProfileHeaderProps) {
  const [isFollowing, setIsFollowing] = useState(user.isFollowing || false)
  const [followersCount, setFollowersCount] = useState(user.followersCount)

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1))
    onFollow?.()
  }

  return (
    <div className="bg-gradient-to-br from-white via-loopy-bg/20 to-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-4 right-8 w-24 h-24 bg-loopy-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-8 left-4 w-32 h-32 bg-loopy-accent/8 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            <div className="relative">
              <div className="w-28 h-28 rounded-full bg-gradient-to-br from-loopy-primary via-loopy-accent to-loopy-primary p-1 animate-spin-slow">
                <div className="w-full h-full rounded-full bg-white p-1">
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-loopy-primary/20 to-loopy-accent/20 p-1">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.displayName}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-loopy-primary to-loopy-accent flex items-center justify-center">
                        <span className="text-3xl font-bold text-white">{user.displayName.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {user.isVerified && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-loopy-primary to-loopy-accent rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <h1 className="font-heading font-bold text-2xl bg-gradient-to-r from-loopy-primary to-loopy-accent bg-clip-text text-transparent">
                {user.displayName}
              </h1>
              {user.isVerified && (
                <Badge className="bg-gradient-to-r from-loopy-primary to-loopy-accent text-white border-0 text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-loopy-primary/70 text-sm font-medium">@{user.username}</p>
          </div>

          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-loopy-primary/20 to-loopy-accent/20 flex items-center justify-center mb-2">
                <span className="font-heading font-bold text-lg text-loopy-primary">{user.videosCount}</span>
              </div>
              <p className="text-gray-600 text-xs font-medium">видео</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-loopy-primary/20 to-loopy-accent/20 flex items-center justify-center mb-2">
                <span className="font-heading font-bold text-lg text-loopy-primary">{followersCount}</span>
              </div>
              <p className="text-gray-600 text-xs font-medium">подписчиков</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-loopy-primary/20 to-loopy-accent/20 flex items-center justify-center mb-2">
                <span className="font-heading font-bold text-lg text-loopy-primary">{user.followingCount}</span>
              </div>
              <p className="text-gray-600 text-xs font-medium">подписок</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={onShare}
              className="rounded-full bg-white/80 backdrop-blur-sm text-loopy-primary hover:text-loopy-accent hover:bg-loopy-primary/10 shadow-lg transition-all duration-300"
            >
              <Share className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-white/80 backdrop-blur-sm text-loopy-primary hover:text-loopy-accent hover:bg-loopy-primary/10 shadow-lg transition-all duration-300"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Bio */}
        {user.bio && (
          <div className="text-center mb-6">
            <p className="text-gray-700 text-sm leading-relaxed bg-white/60 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-sm">
              {user.bio}
            </p>
          </div>
        )}

        <div className="flex gap-3">
          {user.isOwnProfile ? (
            <Button
              onClick={onEdit}
              className="flex-1 rounded-full bg-gradient-to-r from-loopy-primary/10 to-loopy-accent/10 border border-loopy-primary/30 text-loopy-primary hover:from-loopy-primary hover:to-loopy-accent hover:text-white transition-all duration-300 shadow-lg backdrop-blur-sm"
            >
              <Settings className="w-4 h-4 mr-2" />
              Редактировать
            </Button>
          ) : (
            <>
              <Button
                onClick={handleFollow}
                className={`flex-1 rounded-full transition-all duration-300 shadow-lg ${
                  isFollowing
                    ? "bg-white/80 backdrop-blur-sm hover:bg-gray-100 text-gray-700 border border-gray-200"
                    : "bg-gradient-to-r from-loopy-primary to-loopy-accent hover:from-loopy-accent hover:to-loopy-primary text-white"
                }`}
              >
                {isFollowing ? (
                  <>
                    <UserCheck className="w-4 h-4 mr-2" />
                    Подписан
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Подписаться
                  </>
                )}
              </Button>
              <Button className="px-6 rounded-full bg-white/80 backdrop-blur-sm border border-loopy-primary/30 text-loopy-primary hover:bg-loopy-primary/10 transition-all duration-300 shadow-lg">
                Сообщение
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
