"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-3", className)}>
      <div className="relative">
        {/* Outer ring */}
        <div
          className={cn(
            "rounded-full border-2 border-gray-200 animate-spin",
            sizeClasses[size],
            "border-t-loopy-primary border-r-loopy-accent",
          )}
        />
        {/* Inner ring */}
        <div
          className={cn(
            "absolute inset-2 rounded-full border-2 border-transparent animate-spin",
            "border-b-loopy-primary border-l-loopy-accent",
            "[animation-direction:reverse] [animation-duration:1.5s]",
          )}
        />
      </div>
      {text && <p className="text-sm text-gray-600 animate-pulse">{text}</p>}
    </div>
  )
}
