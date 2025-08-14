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
    // Here you would typically add the comment to your state/API
  }

  const handleLikeComment = (commentId: number) => {
    console.log("Like comment:", commentId)
    // Here you would typically update the comment like state
  }

  return (
    <>
      <Card className="p-4 bg-white shadow-sm border border-gray-100 rounded-2xl hover:shadow-md transition-shadow duration-300">
        {/* User info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-rose-500 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">{post.author.charAt(0)}</span>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{post.author}</p>
              <p className="text-gray-500 text-xs">{post.timestamp}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-600">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Video player */}
        <div className="flex justify-center mb-4">
          <VideoCirclePlayer src={post.src} poster={post.poster} size="lg" className="mx-auto" />
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 text-center leading-relaxed">{post.description}</p>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors ${
                isLiked ? "text-loopy-accent hover:text-loopy-accent/80" : "text-gray-600 hover:text-loopy-accent"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
              <span className="text-sm font-medium">{likesCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleComment}
              className="flex items-center gap-2 text-gray-600 hover:text-loopy-primary transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-sm font-medium">{post.comments}</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookmark}
              className={`transition-colors ${
                isBookmarked
                  ? "text-loopy-primary hover:text-loopy-primary/80"
                  : "text-gray-600 hover:text-loopy-primary"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.(post.id)}
              className="text-gray-600 hover:text-loopy-primary transition-colors"
            >
              <Share className="w-4 h-4" />
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
