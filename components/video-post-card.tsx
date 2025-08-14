"use client"

import { useState } from "react"
import { VideoCirclePlayer } from "@/components/video-circle-player"
import { CommentsModal } from "@/components/comments-modal"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle, Share, MoreHorizontal, Bookmark } from "lucide-react"

interface VideoPost {
  id: number
  src: string
  poster?: string
  author: string
  avatar?: string
  likes: number
  comments: number
  description: string
  timestamp: string
  isLiked?: boolean
  isBookmarked?: boolean
}

interface VideoPostCardProps {
  post: VideoPost
  onLike?: (postId: number) => void
  onComment?: (postId: number) => void
  onShare?: (postId: number) => void
  onBookmark?: (postId: number) => void
}

export function VideoPostCard({ post, onLike, onComment, onShare, onBookmark }: VideoPostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false)
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [showComments, setShowComments] = useState(false)

  // Mock comments data
  const mockComments = [
    {
      id: 1,
      author: "Максим П.",
      content: "Потрясающие движения! Где учились танцевать?",
      timestamp: "2 часа назад",
      likes: 5,
      isLiked: false,
      replies: [
        {
          id: 11,
          author: "Анна К.",
          content: "Спасибо! Занимаюсь в студии 'Движение'",
          timestamp: "1 час назад",
          likes: 2,
          isLiked: true,
        },
      ],
    },
    {
      id: 2,
      author: "Елена М.",
      content: "Обожаю эту песню! 🎵",
      timestamp: "1 час назад",
      likes: 3,
      isLiked: true,
    },
    {
      id: 3,
      author: "Дмитрий Л.",
      content: "Круто! Можно урок?",
      timestamp: "30 минут назад",
      likes: 1,
      isLiked: false,
    },
  ]

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1))
    onLike?.(post.id)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
    onBookmark?.(post.id)
  }

  const handleComment = () => {
    setShowComments(true)
    onComment?.(post.id)
  }

  const handleAddComment = (content: string) => {
    console.log("Add comment:", content)
  }

  const handleLikeComment = (commentId: number) => {
    console.log("Like comment:", commentId)
  }

  return (
    <>
      <Card className="relative p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0 flowing-border hover:shadow-xl transition-all duration-500 animate-fade-in overflow-hidden">
        <div className="absolute -top-4 -right-4 w-16 h-16 bg-loopy-accent/10 organic-blob animate-float"></div>
        <div
          className="absolute -bottom-2 -left-2 w-12 h-12 bg-loopy-primary/10 organic-blob-alt animate-float"
          style={{ animationDelay: "2s" }}
        ></div>

        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-loopy-primary via-loopy-accent to-loopy-secondary flex items-center justify-center shadow-lg animate-pulse-gentle">
                <span className="text-white font-bold text-sm">{post.author.charAt(0)}</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="font-heading font-bold text-loopy-dark text-base">{post.author}</p>
              <p className="text-gray-500 text-xs font-medium">{post.timestamp}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-loopy-primary rounded-full hover:bg-loopy-primary/10 transition-all duration-300"
          >
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex justify-center mb-6 relative">
          <div className="relative">
            <VideoCirclePlayer src={post.src} poster={post.poster} size="lg" className="mx-auto shadow-2xl" />
            <div
              className="absolute inset-0 rounded-full border-2 border-loopy-accent/20 animate-pulse-gentle"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute -inset-2 rounded-full border border-loopy-primary/10 animate-pulse-gentle"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>
        </div>

        <div className="text-center mb-6 relative z-10">
          <p className="text-loopy-dark text-sm leading-relaxed font-medium px-2">{post.description}</p>
        </div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center gap-3 rounded-full px-4 py-2 transition-all duration-300 ${
                isLiked
                  ? "text-loopy-accent bg-loopy-accent/10 hover:bg-loopy-accent/20"
                  : "text-gray-600 hover:text-loopy-accent hover:bg-loopy-accent/10"
              }`}
            >
              <Heart className={`w-5 h-5 ${isLiked ? "fill-current animate-bounce-gentle" : ""}`} />
              <span className="text-sm font-bold">{likesCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComment}
              className="flex items-center gap-3 text-gray-600 hover:text-loopy-primary hover:bg-loopy-primary/10 rounded-full px-4 py-2 transition-all duration-300"
            >
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm font-bold">{post.comments}</span>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={`rounded-full p-2 transition-all duration-300 ${
                isBookmarked
                  ? "text-loopy-primary bg-loopy-primary/10 hover:bg-loopy-primary/20"
                  : "text-gray-600 hover:text-loopy-primary hover:bg-loopy-primary/10"
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.(post.id)}
              className="text-gray-600 hover:text-loopy-secondary hover:bg-loopy-secondary/10 rounded-full p-2 transition-all duration-300"
            >
              <Share className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Comments Modal */}
      <CommentsModal
        isOpen={showComments}
        onClose={() => setShowComments(false)}
        postId={post.id}
        comments={mockComments}
        onAddComment={handleAddComment}
        onLikeComment={handleLikeComment}
      />
    </>
  )
}
