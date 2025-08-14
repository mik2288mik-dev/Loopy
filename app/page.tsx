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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-heading font-black text-2xl text-loopy-primary">Loopy</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-600 hover:text-loopy-primary hover:bg-loopy-primary/10"
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Button
              size="icon"
              onClick={handleCreateClick}
              className="rounded-full bg-loopy-primary hover:bg-loopy-accent transition-colors duration-300"
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

      {/* Main content */}
      <main className="max-w-md mx-auto px-4 py-6">
        {/* Telegram User Info - show at top if in Telegram */}
        {isInTelegram && (
          <div className="mb-6">
            <TelegramUserInfo />
          </div>
        )}

        {/* Welcome message - only show when no search/filter */}
        {searchQuery === "" && activeCategory === "Все" && (
          <div className="text-center mb-8">
            <h2 className="font-heading font-bold text-xl text-gray-800 mb-2">Capture Life in Circles</h2>
            <p className="text-gray-600 text-sm">Share your moments, round and vibrant</p>
          </div>
        )}

        {/* Search results info */}
        {(searchQuery !== "" || activeCategory !== "Все") && (
          <div className="mb-6">
            <p className="text-gray-600 text-sm">
              {filteredVideos.length} видео найдено
              {searchQuery && ` по запросу "${searchQuery}"`}
              {activeCategory !== "Все" && ` в категории "${activeCategory}"`}
            </p>
          </div>
        )}

        {/* Video feed */}
        <div className="space-y-6">
          {filteredVideos.length > 0 ? (
            filteredVideos.map((video) => (
              <VideoPostCard
                key={video.id}
                post={video}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
                onBookmark={handleBookmark}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Ничего не найдено</h3>
              <p className="text-gray-600 text-sm mb-4">
                Попробуйте изменить поисковый запрос или выберите другую категорию
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setActiveCategory("Все")
                }}
                className="rounded-full"
              >
                Сбросить фильтры
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  )
}
