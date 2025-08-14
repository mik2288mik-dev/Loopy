import { LoadingSpinner } from "@/components/loading-spinner"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
      <LoadingSpinner size="lg" text="Загружаем Loopy..." />
    </div>
  )
}
