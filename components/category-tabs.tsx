"use client"

import { Button } from "@/components/ui/button"

interface CategoryTabsProps {
  categories: string[]
  activeCategory?: string
  onCategoryChange?: (category: string) => void
}

export function CategoryTabs({ categories, activeCategory = "Все", onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="sticky top-32 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 px-4 py-3">
      <div className="max-w-md mx-auto">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((category) => {
            const isActive = activeCategory === category
            return (
              <Button
                key={category}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange?.(category)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-loopy-primary hover:bg-loopy-accent text-white shadow-md"
                    : "border-gray-200 text-gray-600 hover:border-loopy-primary hover:text-loopy-primary hover:bg-loopy-primary/5"
                }`}
              >
                {category}
              </Button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
