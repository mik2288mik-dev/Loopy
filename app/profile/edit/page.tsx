"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Camera, Save } from "lucide-react"
import { useRouter } from "next/navigation"

export default function EditProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    displayName: "Анна К.",
    username: "anna_k",
    bio: "Танцую, создаю контент, вдохновляю! 💃\nМосква | Хореограф | DM для коллабораций",
    website: "",
    location: "Москва, Россия",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    router.back()
  }

  return (
    <div className="min-h-screen bg-gray-50">
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
          <h1 className="font-heading font-bold text-lg text-gray-900">Редактировать профиль</h1>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            size="sm"
            className="bg-loopy-primary hover:bg-loopy-accent text-white rounded-full px-4"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Сохранить
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Avatar Section */}
        <Card className="p-6">
          <div className="text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500 to-rose-500 p-1">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-600">А</span>
                </div>
              </div>
              <Button
                size="icon"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-loopy-primary hover:bg-loopy-accent text-white"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600">Нажмите, чтобы изменить фото</p>
          </div>
        </Card>

        {/* Profile Information */}
        <Card className="p-6 space-y-4">
          <h2 className="font-heading font-semibold text-lg text-gray-900 mb-4">Информация профиля</h2>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Имя</label>
            <Input
              value={formData.displayName}
              onChange={(e) => handleInputChange("displayName", e.target.value)}
              placeholder="Ваше имя"
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Имя пользователя</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">@</span>
              <Input
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                placeholder="username"
                className="pl-8 rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">О себе</label>
            <Textarea
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Расскажите о себе..."
              rows={4}
              className="rounded-lg resize-none"
            />
            <p className="text-xs text-gray-500">{formData.bio.length}/150 символов</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Веб-сайт</label>
            <Input
              value={formData.website}
              onChange={(e) => handleInputChange("website", e.target.value)}
              placeholder="https://yourwebsite.com"
              className="rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Местоположение</label>
            <Input
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Город, Страна"
              className="rounded-lg"
            />
          </div>
        </Card>

        {/* Privacy Settings */}
        <Card className="p-6">
          <h2 className="font-heading font-semibold text-lg text-gray-900 mb-4">Настройки приватности</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Приватный аккаунт</p>
                <p className="text-sm text-gray-600">Только подписчики видят ваши видео</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                Выкл
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Показывать активность</p>
                <p className="text-sm text-gray-600">Другие видят, когда вы были онлайн</p>
              </div>
              <Button variant="outline" size="sm" className="rounded-full bg-transparent">
                Вкл
              </Button>
            </div>
          </div>
        </Card>

        {/* Bottom spacing */}
        <div className="h-8" />
      </div>
    </div>
  )
}
