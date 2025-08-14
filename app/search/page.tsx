"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { BottomNavigation } from "@/components/bottom-navigation"
import { ArrowLeft, Search, UserPlus, UserCheck, Verified } from "lucide-react"
import { useRouter } from "next/navigation"

interface SearchUser {
  id: string
  username: string
  displayName: string
  bio?: string
  avatar?: string
  isVerified?: boolean
  followersCount: number
  isFollowing: boolean
}

export default function SearchPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("search")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchUser[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Mock users data
  const mockUsers: SearchUser[] = [
    {
      id: "1",
      username: "anna_k",
      displayName: "Анна К.",
      bio: "Танцую, создаю контент, вдохновляю! 💃",
      isVerified: true,
      followersCount: 12500,
      isFollowing: false,
    },
    {
      id: "2",
      username: "maxim_chef",
      displayName: "Максим П.",
      bio: "Шеф-повар | Рецепты каждый день",
      followersCount: 8900,
      isFollowing: true,
    },
    {
      id: "3",
      username: "elena_photo",
      displayName: "Елена М.",
      bio: "Фотограф | Москва | Закаты и рассветы",
      followersCount: 15600,
      isFollowing: false,
    },
    {
      id: "4",
      username: "dmitry_sport",
      displayName: "Дмитрий Л.",
      bio: "Фитнес-тренер | Здоровый образ жизни",
      followersCount: 5400,
      isFollowing: false,
    },
    {
      id: "5",
      username: "maria_travel",
      displayName: "Мария В.",
      bio: "Путешествую по миру ✈️",
      isVerified: true,
      followersCount: 23100,
      isFollowing: true,
    },
  ]

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setIsSearching(true)
      // Simulate API call
      setTimeout(() => {
        const filtered = mockUsers.filter(
          (user) =>
            user.displayName.toLowerCase().includes(query.toLowerCase()) ||
            user.username.toLowerCase().includes(query.toLowerCase()) ||
            user.bio?.toLowerCase().includes(query.toLowerCase()),
        )
        setSearchResults(filtered)
        setIsSearching(false)
      }, 500)
    } else {
      setSearchResults([])
    }
  }

  const handleFollow = (userId: string) => {
    setSearchResults((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user)),
    )
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (tab === "home") {
      router.push("/")
    } else if (tab === "profile") {
      router.push("/profile")
    } else if (tab === "activity") {
      router.push("/activity")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full text-gray-600 hover:text-loopy-primary hover:bg-loopy-primary/10 flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Поиск пользователей..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 rounded-full border-gray-200 focus:border-loopy-primary focus:ring-loopy-primary/20"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-md mx-auto p-4">
        {/* Popular Users - show when no search */}
        {!searchQuery && (
          <div className="mb-6">
            <h2 className="font-heading font-semibold text-lg text-gray-900 mb-4">Популярные пользователи</h2>
            <div className="space-y-3">
              {mockUsers.slice(0, 3).map((user) => (
                <Card key={user.id} className="p-4 bg-white hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-rose-500 flex items-center justify-center">
                      <span className="text-white font-semibold">{user.displayName.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 truncate">{user.displayName}</h3>
                        {user.isVerified && <Verified className="w-4 h-4 text-loopy-primary flex-shrink-0" />}
                      </div>
                      <p className="text-gray-600 text-sm">@{user.username}</p>
                      <p className="text-gray-500 text-xs">{user.followersCount.toLocaleString()} подписчиков</p>
                    </div>
                    <Button
                      onClick={() => handleFollow(user.id)}
                      size="sm"
                      className={`rounded-full px-4 transition-all ${
                        user.isFollowing
                          ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          : "bg-loopy-primary hover:bg-loopy-accent text-white"
                      }`}
                    >
                      {user.isFollowing ? (
                        <>
                          <UserCheck className="w-4 h-4 mr-1" />
                          Подписан
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-1" />
                          Подписаться
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchQuery && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg text-gray-900">
                Результаты поиска {searchQuery && `"${searchQuery}"`}
              </h2>
              {isSearching && (
                <div className="w-5 h-5 border-2 border-loopy-primary border-t-transparent rounded-full animate-spin" />
              )}
            </div>

            {searchResults.length === 0 && !isSearching ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">Ничего не найдено</h3>
                <p className="text-gray-600 text-sm">Попробуйте изменить поисковый запрос</p>
              </div>
            ) : (
              <div className="space-y-3">
                {searchResults.map((user) => (
                  <Card key={user.id} className="p-4 bg-white hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-semibold">{user.displayName.charAt(0)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{user.displayName}</h3>
                          {user.isVerified && <Verified className="w-4 h-4 text-loopy-primary flex-shrink-0" />}
                        </div>
                        <p className="text-gray-600 text-sm mb-1">@{user.username}</p>
                        {user.bio && <p className="text-gray-700 text-sm mb-2 line-clamp-2">{user.bio}</p>}
                        <p className="text-gray-500 text-xs">{user.followersCount.toLocaleString()} подписчиков</p>
                      </div>
                      <Button
                        onClick={() => handleFollow(user.id)}
                        size="sm"
                        className={`rounded-full px-4 transition-all flex-shrink-0 ${
                          user.isFollowing
                            ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            : "bg-loopy-primary hover:bg-loopy-accent text-white"
                        }`}
                      >
                        {user.isFollowing ? (
                          <>
                            <UserCheck className="w-4 h-4 mr-1" />
                            Подписан
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-4 h-4 mr-1" />
                            Подписаться
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  )
}
