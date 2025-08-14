"use client"

import { useState } from "react"
import { UserProfileHeader } from "@/components/user-profile-header"
import { UserVideoGrid } from "@/components/user-video-grid"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Grid3X3, Bookmark, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [profileTab, setProfileTab] = useState("videos")

  // Mock user data
  const currentUser = {
    id: "1",
    username: "anna_k",
    displayName: "Анна К.",
    bio: "Танцую, создаю контент, вдохновляю! 💃\nМосква | Хореограф | DM для коллабораций",
    avatar: "/dancing-person-preview.png",
    isVerified: true,
    followersCount: 12500,
    followingCount: 847,
    videosCount: 156,
    isOwnProfile: true,
  }

  // Mock user videos
  const userVideos = [
    {
      id: 1,
      src: "/colorful-dance.png",
      poster: "/dancing-person-preview.png",
      likes: 142,
      comments: 23,
      views: 1250,
      timestamp: "2 дня назад",
    },
    {
      id: 2,
      src: "/colorful-dance.png",
      poster: "/dancing-person-preview.png",
      likes: 89,
      comments: 12,
      views: 890,
      timestamp: "5 дней назад",
    },
    {
      id: 3,
      src: "/colorful-dance.png",
      poster: "/dancing-person-preview.png",
      likes: 256,
      comments: 45,
      views: 2100,
      timestamp: "1 неделю назад",
    },
    {
      id: 4,
      src: "/colorful-dance.png",
      poster: "/dancing-person-preview.png",
      likes: 178,
      comments: 31,
      views: 1680,
      timestamp: "2 недели назад",
    },
  ]

  const likedVideos = userVideos.slice(0, 2)
  const savedVideos = userVideos.slice(1, 3)

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
          <h1 className="font-heading font-bold text-lg text-gray-900">@{currentUser.username}</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      {/* Profile Header */}
      <UserProfileHeader user={currentUser} onEdit={handleEdit} onShare={handleShare} />

      {/* Profile Tabs */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="max-w-md mx-auto px-4">
          <div className="flex">
            <Button
              variant="ghost"
              onClick={() => setProfileTab("videos")}
              className={`flex-1 py-3 rounded-none border-b-2 transition-colors ${
                profileTab === "videos"
                  ? "border-loopy-primary text-loopy-primary"
                  : "border-transparent text-gray-600 hover:text-loopy-primary"
              }`}
            >
              <Grid3X3 className="w-4 h-4 mr-2" />
              Видео
            </Button>
            <Button
              variant="ghost"
              onClick={() => setProfileTab("liked")}
              className={`flex-1 py-3 rounded-none border-b-2 transition-colors ${
                profileTab === "liked"
                  ? "border-loopy-primary text-loopy-primary"
                  : "border-transparent text-gray-600 hover:text-loopy-primary"
              }`}
            >
              <Heart className="w-4 h-4 mr-2" />
              Понравилось
            </Button>
            <Button
              variant="ghost"
              onClick={() => setProfileTab("saved")}
              className={`flex-1 py-3 rounded-none border-b-2 transition-colors ${
                profileTab === "saved"
                  ? "border-loopy-primary text-loopy-primary"
                  : "border-transparent text-gray-600 hover:text-loopy-primary"
              }`}
            >
              <Bookmark className="w-4 h-4 mr-2" />
              Сохраненное
            </Button>
          </div>
        </div>
      </div>

      {/* Videos Grid */}
      <UserVideoGrid videos={getVideosForTab()} onVideoClick={handleVideoClick} />

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  )
}
