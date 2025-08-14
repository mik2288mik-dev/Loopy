"use client"

import { useState } from "react"
import { UserProfileHeader } from "@/components/user-profile-header"
import { UserVideoGrid } from "@/components/user-video-grid"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Bookmark, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [profileTab, setProfileTab] = useState("videos")

  // TODO: fetch current user from API/Telegram
  const currentUser = {
    id: "1",
    username: "user",
    displayName: "Пользователь",
    avatar: undefined,
    isVerified: false,
    followersCount: 0,
    followingCount: 0,
    videosCount: 0,
    isOwnProfile: true,
  }

  const userVideos: any[] = []
  const likedVideos: any[] = []
  const savedVideos: any[] = []

  const handleVideoClick = (videoId: number) => {
    console.log("Open video:", videoId)
  }

  const handleEdit = () => {
    router.push("/profile/edit")
  }

  const handleShare = () => {
    console.log("Share profile")
  }

  const getVideosForTab = () => {
    switch (profileTab) {
      case "videos":
        return userVideos
      case "liked":
        return likedVideos
      case "saved":
        return savedVideos
      default:
        return userVideos
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-loopy-bg via-white to-loopy-bg/30 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-4 w-16 h-16 bg-loopy-primary/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute top-40 right-8 w-12 h-12 bg-loopy-accent/15 rounded-full blur-lg animate-float-delayed"></div>
        <div className="absolute bottom-40 left-8 w-20 h-20 bg-loopy-primary/8 rounded-full blur-2xl animate-float-slow"></div>
      </div>

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-loopy-primary/20">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full text-loopy-primary hover:text-loopy-accent hover:bg-loopy-primary/10 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-heading font-bold text-lg bg-gradient-to-r from-loopy-primary to-loopy-accent bg-clip-text text-transparent">
            @{currentUser.username}
          </h1>
          <div className="w-10" />
        </div>
      </header>

      {/* Profile Header */}
      <UserProfileHeader user={currentUser} onEdit={handleEdit} onShare={handleShare} />

      <div className="bg-white/60 backdrop-blur-md border-b border-loopy-primary/10 sticky top-16 z-40">
        <div className="max-w-md mx-auto px-4">
          <div className="flex relative">
            {/* Floating tab indicator */}
            <div
              className={`absolute bottom-0 h-1 bg-gradient-to-r from-loopy-primary to-loopy-accent rounded-full transition-all duration-500 ease-out ${
                profileTab === "videos" ? "left-0 w-1/3" : profileTab === "liked" ? "left-1/3 w-1/3" : "left-2/3 w-1/3"
              }`}
            />

            <Button
              variant="ghost"
              onClick={() => setProfileTab("videos")}
              className={`flex-1 py-4 rounded-none transition-all duration-300 ${
                profileTab === "videos" ? "text-loopy-primary bg-loopy-primary/5" : "text-gray-600 hover:text-loopy-primary hover:bg-loopy-primary/5"
              }`}
            >
              <div className={`p-2 rounded-full mr-2 transition-all duration-300 ${profileTab === "videos" ? "bg-loopy-primary/20" : "bg-gray-100"}`}>
                <Play className="w-4 h-4" />
              </div>
              Видео
            </Button>

            <Button
              variant="ghost"
              onClick={() => setProfileTab("liked")}
              className={`flex-1 py-4 rounded-none transition-all duration-300 ${
                profileTab === "liked" ? "text-loopy-primary bg-loopy-primary/5" : "text-gray-600 hover:text-loopy-primary hover:bg-loopy-primary/5"
              }`}
            >
              <div className={`p-2 rounded-full mr-2 transition-all duration-300 ${profileTab === "liked" ? "bg-loopy-primary/20" : "bg-gray-100"}`}>
                <Heart className="w-4 h-4" />
              </div>
              Понравилось
            </Button>

            <Button
              variant="ghost"
              onClick={() => setProfileTab("saved")}
              className={`flex-1 py-4 rounded-none transition-all duration-300 ${
                profileTab === "saved" ? "text-loopy-primary bg-loopy-primary/5" : "text-gray-600 hover:text-loopy-primary hover:bg-loopy-primary/5"
              }`}
            >
              <div className={`p-2 rounded-full mr-2 transition-all duration-300 ${profileTab === "saved" ? "bg-loopy-primary/20" : "bg-gray-100"}`}>
                <Bookmark className="w-4 h-4" />
              </div>
              Сохраненное
            </Button>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <UserVideoGrid videos={getVideosForTab()} onVideoClick={handleVideoClick} />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
