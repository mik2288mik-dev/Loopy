"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchHeaderProps {
  onSearch?: (query: string) => void
  onFilterToggle?: () => void
}

export function SearchHeader({ onSearch, onFilterToggle }: SearchHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchActive, setIsSearchActive] = useState(false)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setIsSearchActive(false)
    onSearch?.("")
  }

  return (
    <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Поиск видео..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setIsSearchActive(true)}
              className="pl-10 pr-10 rounded-full border-gray-200 focus:border-loopy-primary focus:ring-loopy-primary/20"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 p-0 hover:bg-gray-100 rounded-full"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onFilterToggle}
            className="rounded-full border-gray-200 hover:border-loopy-primary hover:text-loopy-primary bg-transparent"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
