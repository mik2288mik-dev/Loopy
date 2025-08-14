"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Settings, UserPlus, UserCheck, Share, MoreHorizontal } from "lucide-react"

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
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Avatar and basic info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-rose-500 p-1">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-gray-600">{user.displayName.charAt(0)}</span>
                )}
              </div>
            </div>
            {user.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-loopy-primary rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-heading font-bold text-xl text-gray-900">{user.displayName}</h1>
              {user.isVerified && (
                <Badge variant="secondary" className="text-xs bg-loopy-primary/10 text-loopy-primary">
                  Verified
                </Badge>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-2">@{user.username}</p>

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <span className="font-semibold text-gray-900">{user.videosCount}</span>
                <p className="text-gray-600 text-xs">видео</p>
              </div>
              <div className="text-center">
                <span className="font-semibold text-gray-900">{followersCount}</span>
                <p className="text-gray-600 text-xs">подписчиков</p>
              </div>
              <div className="text-center">
                <span className="font-semibold text-gray-900">{user.followingCount}</span>
                <p className="text-gray-600 text-xs">подписок</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onShare} className="text-gray-600 hover:text-loopy-primary">
              <Share className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-600 hover:text-loopy-primary">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Bio */}
        {user.bio && <p className="text-gray-700 text-sm mb-4 leading-relaxed">{user.bio}</p>}

        {/* Action buttons */}
        <div className="flex gap-3">
          {user.isOwnProfile ? (
            <Button
              onClick={onEdit}
              variant="outline"
              className="flex-1 rounded-full border-gray-200 hover:border-loopy-primary hover:text-loopy-primary bg-transparent"
            >
              <Settings className="w-4 h-4 mr-2" />
              Редактировать
            </Button>
          ) : (
            <>
              <Button
                onClick={handleFollow}
                className={`flex-1 rounded-full transition-all ${
                  isFollowing
                    ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    : "bg-loopy-primary hover:bg-loopy-accent text-white"
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
              <Button
                variant="outline"
                className="px-4 rounded-full border-gray-200 hover:border-loopy-primary hover:text-loopy-primary bg-transparent"
              >
                Сообщение
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
