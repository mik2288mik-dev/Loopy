"use client"

import { VideoCirclePlayer } from "@/components/video-circle-player"
import { Button } from "@/components/ui/button"
import { Play, Heart, MessageCircle } from "lucide-react"

interface UserVideo {
  id: number
  src: string
  poster?: string
  likes: number
  comments: number
  views: number
  timestamp: string
}

interface UserVideoGridProps {
  videos: UserVideo[]
  onVideoClick?: (videoId: number) => void
}

export function UserVideoGrid({ videos, onVideoClick }: UserVideoGridProps) {
  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <Play className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="font-semibold text-gray-800 mb-2">Пока нет видео</h3>
        <p className="text-gray-600 text-sm">Создайте свое первое видео-кружочек!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {videos.map((video) => (
        <div key={video.id} className="relative group cursor-pointer" onClick={() => onVideoClick?.(video.id)}>
          {/* Video thumbnail */}
          <div className="aspect-square">
            <VideoCirclePlayer src={video.src} poster={video.poster} size="md" className="w-full h-full" />
          </div>

          {/* Overlay with stats */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full flex items-center justify-center">
            <div className="text-white text-center">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">{video.likes}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{video.comments}</span>
                </div>
              </div>
              <p className="text-xs opacity-80">{video.views} просмотров</p>
            </div>
          </div>

          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="icon"
              className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
            >
              <Play className="w-6 h-6 ml-1" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
