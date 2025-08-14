"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Heart, Reply, MoreHorizontal, Send } from "lucide-react"

interface Comment {
  id: number
  author: string
  avatar?: string
  content: string
  timestamp: string
  likes: number
  isLiked: boolean
  replies?: Comment[]
}

interface CommentsModalProps {
  isOpen: boolean
  onClose: () => void
  postId: number
  comments: Comment[]
  onAddComment?: (content: string) => void
  onLikeComment?: (commentId: number) => void
}

export function CommentsModal({ isOpen, onClose, postId, comments, onAddComment, onLikeComment }: CommentsModalProps) {
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      onAddComment?.(newComment.trim())
      setNewComment("")
      setReplyingTo(null)
    }
  }

  const handleLike = (commentId: number) => {
    onLikeComment?.(commentId)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
      <div className="bg-white w-full max-w-md h-[80vh] sm:h-[600px] rounded-t-2xl sm:rounded-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h2 className="font-heading font-semibold text-lg text-gray-900">Комментарии</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 text-sm">Пока нет комментариев</p>
              <p className="text-gray-500 text-xs mt-1">Будьте первым, кто оставит комментарий!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="space-y-2">
                {/* Main Comment */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-xs">{comment.author.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="bg-gray-50 rounded-2xl px-3 py-2">
                      <p className="font-semibold text-sm text-gray-900">{comment.author}</p>
                      <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{comment.timestamp}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleLike(comment.id)}
                        className={`h-auto p-0 text-xs ${
                          comment.isLiked ? "text-loopy-accent" : "text-gray-500 hover:text-loopy-accent"
                        }`}
                      >
                        <Heart className={`w-3 h-3 mr-1 ${comment.isLiked ? "fill-current" : ""}`} />
                        {comment.likes > 0 && comment.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingTo(comment.id)}
                        className="h-auto p-0 text-xs text-gray-500 hover:text-loopy-primary"
                      >
                        Ответить
                      </Button>
                      <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-gray-500">
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-11 space-y-2">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-xs">{reply.author.charAt(0)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="bg-gray-50 rounded-2xl px-3 py-2">
                            <p className="font-semibold text-xs text-gray-900">{reply.author}</p>
                            <p className="text-xs text-gray-700 mt-1">{reply.content}</p>
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                            <span>{reply.timestamp}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-xs text-gray-500 hover:text-loopy-accent"
                            >
                              <Heart className="w-3 h-3 mr-1" />
                              {reply.likes > 0 && reply.likes}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-gray-100">
          {replyingTo && (
            <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
              <Reply className="w-4 h-4" />
              <span>Ответ пользователю</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(null)}
                className="h-auto p-0 text-xs text-gray-500 hover:text-gray-700"
              >
                Отмена
              </Button>
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-rose-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-xs">Я</span>
            </div>
            <div className="flex-1 flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={replyingTo ? "Написать ответ..." : "Добавить комментарий..."}
                className="rounded-full border-gray-200 focus:border-loopy-primary focus:ring-loopy-primary/20"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!newComment.trim()}
                className="rounded-full bg-loopy-primary hover:bg-loopy-accent text-white flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
