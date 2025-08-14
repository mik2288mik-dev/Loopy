"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import BottomBar from "@/components/BottomBar"
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
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchUser[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setIsSearching(true)
      // поиск будет подключен к реальному API в следующих релизах
      setSearchResults([])
      setIsSearching(false)
    } else {
      setSearchResults([])
    }
  }

  const handleFollow = (userId: string) => {
    setSearchResults((prev) => prev.map((user) => (user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user)))
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
        {!searchQuery && (
          <div className="mb-6 text-center text-gray-600 text-sm">Введите запрос, чтобы найти пользователей</div>
        )}

        {/* Search Results */}
        {searchQuery && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg text-gray-900">
                Результаты поиска {searchQuery && `"${searchQuery}"`}
              </h2>
              {isSearching && <div className="w-5 h-5 border-2 border-loopy-primary border-t-transparent rounded-full animate-spin" />}
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
                          user.isFollowing ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-loopy-primary hover:bg-loopy-accent text-white"
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

      <BottomBar />
    </div>
  )
}
