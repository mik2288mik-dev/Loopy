"use client"

import { useEffect, useState } from "react"
import { UserProfileHeader } from "@/components/user-profile-header"
import { UserVideoGrid } from "@/components/user-video-grid"
import BottomBar from "@/components/BottomBar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Play, Bookmark, Heart } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const router = useRouter()
  const [profileTab, setProfileTab] = useState("videos")
  const [profile, setProfile] = useState<any | null>(null)

  useEffect(() => {
    fetch("/api/profile").then(async (r) => setProfile(await r.json())).catch(() => {})
  }, [])

  const userVideos: any[] = profile?.videos || []
  const likedVideos: any[] = profile?.liked || []
  const savedVideos: any[] = profile?.saved || []

  const handleVideoClick = (videoId: number) => {}
  const handleEdit = () => { router.push("/profile/edit") }
  const handleShare = () => {}

  const getVideosForTab = () => {
    switch (profileTab) {
      case "videos": return userVideos
      case "liked": return likedVideos
      case "saved": return savedVideos
      default: return userVideos
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0D10] pb-20">
      <header className="sticky top-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full text-white/80 hover:text-white hover:bg-white/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-heading font-bold text-lg text-white">@{profile?.user?.username || "me"}</h1>
          <div className="w-10" />
        </div>
      </header>

      {profile && <UserProfileHeader user={profile.user} onEdit={handleEdit} onShare={handleShare} />}

      <div className="bg-white/5 border-b border-white/10 sticky top-16 z-40">
        <div className="max-w-md mx-auto px-4">
          <div className="flex relative">
            <div className={`absolute bottom-0 h-1 bg-gradient-to-r from-[#F0ABFC] to-[#99F6E4] rounded-full transition-all duration-500 ease-out ${
              profileTab === "videos" ? "left-0 w-1/3" : profileTab === "liked" ? "left-1/3 w-1/3" : "left-2/3 w-1/3"}`}
            />

            <Button variant="ghost" onClick={() => setProfileTab("videos")} className={`flex-1 py-4 rounded-none ${profileTab === "videos" ? "text-white bg-white/10" : "text-white/70 hover:text-white hover:bg-white/5"}`}>
              <div className={`p-2 rounded-full mr-2 ${profileTab === "videos" ? "bg-white/10" : "bg-white/5"}`}>
                <Play className="w-4 h-4" />
              </div>
              Видео
            </Button>

            <Button variant="ghost" onClick={() => setProfileTab("liked")} className={`flex-1 py-4 rounded-none ${profileTab === "liked" ? "text-white bg-white/10" : "text-white/70 hover:text-white hover:bg-white/5"}`}>
              <div className={`p-2 rounded-full mr-2 ${profileTab === "liked" ? "bg-white/10" : "bg-white/5"}`}>
                <Heart className="w-4 h-4" />
              </div>
              Понравилось
            </Button>

            <Button variant="ghost" onClick={() => setProfileTab("saved")} className={`flex-1 py-4 rounded-none ${profileTab === "saved" ? "text-white bg-white/10" : "text-white/70 hover:text-white hover:bg-white/5"}`}>
              <div className={`p-2 rounded-full mr-2 ${profileTab === "saved" ? "bg-white/10" : "bg-white/5"}`}>
                <Bookmark className="w-4 h-4" />
              </div>
              Сохраненное
            </Button>
          </div>
        </div>
      </div>

      <UserVideoGrid videos={getVideosForTab()} onVideoClick={handleVideoClick} />
      <BottomBar />
    </div>
  )
}
