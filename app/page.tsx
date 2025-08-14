"use client"

import { useState } from "react"
import { VideoPostCard } from "@/components/video-post-card"
import { BottomNavigation } from "@/components/bottom-navigation"
import { SearchHeader } from "@/components/search-header"
import { CategoryTabs } from "@/components/category-tabs"
import { TelegramUserInfo } from "@/components/telegram-user-info"
import { useTelegramContext } from "@/components/telegram-provider"
import { Button } from "@/components/ui/button"
import { Plus, Bell } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()
  const { hapticFeedback, isInTelegram } = useTelegramContext()
  const [activeTab, setActiveTab] = useState("home")
  const [activeCategory, setActiveCategory] = useState("Все")
  const [searchQuery, setSearchQuery] = useState("")

  const categories = ["Все", "Танцы", "Кулинария", "Природа", "Спорт", "Музыка", "Путешествия"]

  // Mock video data with more variety
  const mockVideos = [
    {
      id: 1,
      src: "/colorful-dance.png",
      poster: "/dancing-person-preview.png",
      author: "Анна К.",
      likes: 142,
      comments: 23,
      description: "Танцую под любимую песню! Новый челлендж в TikTok 💃",
      timestamp: "2 часа назад",
      isLiked: false,
      isBookmarked: true,
    },
    {
      id: 2,
      src: "/cooking-delicious-food.png",
      poster: "/cooking-preview.png",
      author: "Максим П.",
      likes: 89,
      comments: 12,
      description: "Готовлю борщ по бабушкиному рецепту. Секретный ингредient в комментариях! 🍲",
      timestamp: "4 часа назад",
      isLiked: true,
      isBookmarked: false,
    },
    {
      id: 3,
      src: "/sunset-city-view.png",
      poster: "/vibrant-sunset-preview.png",
      author: "Елена М.",
      likes: 256,
      comments: 45,
      description: "Закат над Москвой сегодня особенно красивый. Снято с крыши небоскреба 🌅",
      timestamp: "6 часов назад",
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: 4,
      src: "/colorful-dance.png",
      poster: "/dancing-person-preview.png",
      author: "Дмитрий Л.",
      likes: 78,
      comments: 15,
      description: "Утренняя пробежка в парке. Кто со мной завтра? 🏃‍♂️",
      timestamp: "8 часов назад",
      isLiked: true,
      isBookmarked: true,
    },
  ]

  const filteredVideos = mockVideos.filter((video) => {
    const matchesSearch =
      searchQuery === "" ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.author.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory =
      activeCategory === "Все" ||
      (activeCategory === "Танцы" && video.description.includes("Танц")) ||
      (activeCategory === "Кулинария" && video.description.includes("Готов")) ||
      (activeCategory === "Природа" && video.description.includes("Закат"))

    return matchesSearch && matchesCategory
  })

  const handleLike = (postId: number) => {
    hapticFeedback("light")
    console.log("Liked post:", postId)
  }

  const handleComment = (postId: number) => {
    hapticFeedback("selection")
    console.log("Comment on post:", postId)
  }

  const handleShare = (postId: number) => {
    hapticFeedback("medium")
    console.log("Share post:", postId)
  }

  const handleBookmark = (postId: number) => {
    hapticFeedback("light")
    console.log("Bookmark post:", postId)
  }

  const handleTabChange = (tab: string) => {
    hapticFeedback("selection")
    setActiveTab(tab)
    if (tab === "profile") {
      router.push("/profile")
    } else if (tab === "search") {
      router.push("/search")
    } else if (tab === "activity") {
      router.push("/activity")
    } else if (tab === "create") {
      router.push("/create")
    }
  }

  const handleCreateClick = () => {
    hapticFeedback("medium")
    router.push("/create")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-loopy-light/30 to-loopy-accent/5 pb-20 relative overflow-hidden">
      <div className="fixed top-20 right-10 w-32 h-32 bg-loopy-primary/5 organic-blob animate-float opacity-60"></div>
      <div
        className="fixed bottom-40 left-5 w-24 h-24 bg-loopy-accent/5 organic-blob-alt animate-float opacity-40"
        style={{ animationDelay: "3s" }}
      ></div>

      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-loopy-primary/10 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-loopy-primary to-loopy-accent rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-full"></div>
            </div>
            <h1 className="font-heading font-black text-2xl bg-gradient-to-r from-loopy-primary to-loopy-accent bg-clip-text text-transparent">
              Loopy
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-600 hover:text-loopy-primary hover:bg-loopy-primary/10 transition-all duration-300"
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              onClick={handleCreateClick}
              className="rounded-full bg-gradient-to-r from-loopy-primary to-loopy-accent hover:from-loopy-accent hover:to-loopy-secondary transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Search Header */}
      <SearchHeader onSearch={setSearchQuery} />

      {/* Category Tabs */}
      <CategoryTabs categories={categories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <main className="max-w-md mx-auto px-4 py-8 relative z-10">
        {/* Telegram User Info */}
        {isInTelegram && (
          <div className="mb-8">
            <TelegramUserInfo />
          </div>
        )}

        {searchQuery === "" && activeCategory === "Все" && (
          <div className="text-center mb-10 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-loopy-primary/5 via-transparent to-loopy-accent/5 organic-blob opacity-50"></div>
            <div className="relative z-10 py-8">
              <h2 className="font-heading font-black text-2xl bg-gradient-to-r from-loopy-primary to-loopy-accent bg-clip-text text-transparent mb-3">
                Share Your World, One Loop at a Time
              </h2>
              <p className="text-loopy-dark/70 text-sm font-medium">Discover endless stories in perfect circles</p>
            </div>
          </div>
        )}

        {/* Video feed */}
        <div className="space-y-8">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video, index) => (
              <div key={video.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <VideoPostCard
                  post={video}
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
                  onBookmark={handleBookmark}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-16 relative">
              <div className="absolute inset-0 bg-loopy-accent/5 organic-blob opacity-30"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-loopy-primary/20 to-loopy-accent/20 flex items-center justify-center animate-pulse-gentle">
                  <Plus className="w-10 h-10 text-loopy-primary" />
                </div>
                <h3 className="font-heading font-bold text-loopy-dark text-lg mb-3">Ничего не найдено</h3>
                <p className="text-loopy-dark/60 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
                  Попробуйте изменить поисковый запрос или выберите другую категорию
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setActiveCategory("Все")
                  }}
                  className="rounded-full border-loopy-primary/30 text-loopy-primary hover:bg-loopy-primary hover:text-white transition-all duration-300"
                >
                  Сбросить фильтры
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  )
}
