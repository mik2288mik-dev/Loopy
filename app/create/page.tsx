"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { TelegramUserInfo } from "@/components/telegram-user-info"
import { useTelegramContext } from "@/components/telegram-provider"
import { ArrowLeft, Camera, Video, Upload, Send } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CreatePage() {
  const router = useRouter()
  const { showMainButton, hideMainButton, hapticFeedback, sendData, showAlert } = useTelegramContext()
  const [step, setStep] = useState<"record" | "edit" | "publish">("record")
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [description, setDescription] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file)
      setStep("edit")
      hapticFeedback("success")
    } else {
      showAlert("Пожалуйста, выберите видео файл")
      hapticFeedback("error")
    }
  }

  const handlePublish = async () => {
    if (!videoFile || !description.trim()) {
      showAlert("Пожалуйста, добавьте описание к видео")
      hapticFeedback("error")
      return
    }

    setIsUploading(true)
    hapticFeedback("medium")

    // Simulate upload process
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Send data back to Telegram bot
      sendData({
        action: "video_published",
        description: description.trim(),
        video_size: videoFile.size,
        video_type: videoFile.type,
      })

      hapticFeedback("success")
      showAlert("Видео успешно опубликовано!")
      router.push("/")
    } catch (error) {
      hapticFeedback("error")
      showAlert("Ошибка при публикации видео")
    } finally {
      setIsUploading(false)
    }
  }

  // Set up Telegram main button based on current step
  useState(() => {
    if (step === "edit" && videoFile && description.trim()) {
      showMainButton("Опубликовать", handlePublish)
    } else {
      hideMainButton()
    }

    return () => hideMainButton()
  }, [step, videoFile, description])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full text-gray-600 hover:text-loopy-primary hover:bg-loopy-primary/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-heading font-bold text-lg text-gray-900">Создать видео</h1>
          <div className="w-10" />
        </div>
      </header>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Telegram User Info */}
        <TelegramUserInfo />

        {step === "record" && (
          <div className="space-y-6">
            {/* Recording Options */}
            <Card className="p-6 text-center">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-rose-500 flex items-center justify-center">
                <Video className="w-10 h-10 text-white" />
              </div>
              <h2 className="font-heading font-semibold text-xl text-gray-900 mb-2">Создайте видео-кружочек</h2>
              <p className="text-gray-600 text-sm mb-6">Поделитесь своим моментом в круглом формате</p>

              <div className="space-y-3">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-loopy-primary hover:bg-loopy-accent text-white rounded-full py-3"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Загрузить видео
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-full py-3 border-gray-200 hover:border-loopy-primary hover:text-loopy-primary bg-transparent"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Записать новое
                </Button>
              </div>

              <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileSelect} className="hidden" />
            </Card>

            {/* Tips */}
            <Card className="p-4 bg-gradient-to-r from-cyan-50 to-rose-50 border border-cyan-200">
              <h3 className="font-semibold text-gray-900 mb-2">Советы для лучшего видео:</h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Держите телефон вертикально</li>
                <li>• Максимальная длительность: 60 секунд</li>
                <li>• Хорошее освещение улучшит качество</li>
                <li>• Будьте креативными!</li>
              </ul>
            </Card>
          </div>
        )}

        {step === "edit" && videoFile && (
          <div className="space-y-6">
            {/* Video Preview */}
            <Card className="p-6 text-center">
              <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <Video className="w-16 h-16 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 mb-2">Видео выбрано:</p>
              <p className="font-medium text-gray-900">{videoFile.name}</p>
              <p className="text-xs text-gray-500">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
            </Card>

            {/* Description */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Описание</h3>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Расскажите о своем видео..."
                rows={4}
                className="rounded-lg resize-none"
                maxLength={150}
              />
              <p className="text-xs text-gray-500 mt-2">{description.length}/150 символов</p>
            </Card>

            {/* Category Selection */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Категория</h3>
              <div className="flex flex-wrap gap-2">
                {["Танцы", "Кулинария", "Природа", "Спорт", "Музыка", "Путешествия"].map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    size="sm"
                    className="rounded-full border-gray-200 hover:border-loopy-primary hover:text-loopy-primary bg-transparent"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Publish Button for non-Telegram */}
            <Button
              onClick={handlePublish}
              disabled={!description.trim() || isUploading}
              className="w-full bg-loopy-primary hover:bg-loopy-accent text-white rounded-full py-3"
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Публикуем...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Опубликовать
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
