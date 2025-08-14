"use client"

import { useState } from "react"
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
  const [activeCategory, setActiveCategory] = useState("Все")
  const [searchQuery, setSearchQuery] = useState("")

  const categories = ["Все", "Танцы", "Кулинария", "Природа", "Спорт", "Музыка", "Путешествия"]

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

        {/* Empty state (no demo feed) */}
        <div className="text-center py-16 relative">
          <div className="absolute inset-0 bg-loopy-accent/5 organic-blob opacity-30"></div>
          <div className="relative z-10">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-loopy-primary/20 to-loopy-accent/20 flex items-center justify-center animate-pulse-gentle">
              <Plus className="w-10 h-10 text-loopy-primary" />
            </div>
            <h3 className="font-heading font-bold text-loopy-dark text-lg mb-3">Лента пуста</h3>
            <p className="text-loopy-dark/60 text-sm mb-6 max-w-xs mx-auto leading-relaxed">
              Создайте свой первый видео-кружочек и поделитесь моментом
            </p>
            <Button
              onClick={handleCreateClick}
              className="rounded-full bg-loopy-primary hover:bg-loopy-accent text-white transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Создать видео
            </Button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  )
}
