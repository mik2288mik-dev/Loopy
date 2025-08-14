"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

interface VideoCirclePlayerProps {
  src: string
  poster?: string
  size?: "sm" | "md" | "lg"
  autoPlay?: boolean
  muted?: boolean
  className?: string
}

export function VideoCirclePlayer({
  src,
  poster,
  size = "md",
  autoPlay = false,
  muted = true,
  className = "",
}: VideoCirclePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isMuted, setIsMuted] = useState(muted)
  const [progress, setProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-48 h-48",
    lg: "w-64 h-64",
  }

  const controlSizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateProgress = () => {
      const progress = (video.currentTime / video.duration) * 100
      setProgress(progress)
    }

    const handleLoadedData = () => {
      setIsLoading(false)
      setHasError(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setProgress(0)
    }

    const handleError = () => {
      setIsLoading(false)
      setHasError(true)
    }

    const handleLoadStart = () => {
      setIsLoading(true)
      setHasError(false)
    }

    video.addEventListener("timeupdate", updateProgress)
    video.addEventListener("loadeddata", handleLoadedData)
    video.addEventListener("ended", handleEnded)
    video.addEventListener("error", handleError)
    video.addEventListener("loadstart", handleLoadStart)

    return () => {
      video.removeEventListener("timeupdate", updateProgress)
      video.removeEventListener("loadeddata", handleLoadedData)
      video.removeEventListener("ended", handleEnded)
      video.removeEventListener("error", handleError)
      video.removeEventListener("loadstart", handleLoadStart)
    }
  }, [])

  const togglePlay = () => {
    const video = videoRef.current
    if (!video || hasError) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video || hasError) return

    video.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Circular container with gradient border */}
      <div className="relative w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-cyan-500 to-rose-500 p-1 animate-pulse-gentle hover:scale-105 transition-transform duration-300">
        <div className="w-full h-full rounded-full overflow-hidden bg-black relative">
          {/* Video element */}
          {!hasError ? (
            <video
              ref={videoRef}
              src={src}
              poster={poster}
              muted={isMuted}
              loop
              playsInline
              className="w-full h-full object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-2 text-gray-400">⚠️</div>
                <p className="text-xs text-gray-500">Ошибка загрузки</p>
              </div>
            </div>
          )}

          {/* Loading spinner */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <LoadingSpinner size="sm" />
            </div>
          )}

          {/* Progress ring */}
          {!hasError && (
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
              <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${progress * 3.01} 301`}
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0891b2" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          )}

          {/* Controls overlay */}
          {!hasError && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/30">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className={`${controlSizes[size]} rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0`}
              >
                {isPlaying ? <Pause className="w-1/2 h-1/2" /> : <Play className="w-1/2 h-1/2 ml-1" />}
              </Button>
            </div>
          )}

          {/* Mute button */}
          {!hasError && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white border-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
