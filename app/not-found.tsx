import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Home, Search } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-500 to-rose-500 flex items-center justify-center">
          <span className="text-3xl font-bold text-white">404</span>
        </div>
        <h1 className="font-heading font-bold text-2xl text-gray-900 mb-3">Страница не найдена</h1>
        <p className="text-gray-600 text-sm mb-8 leading-relaxed">
          Кажется, вы попали в неизведанную часть Loopy. Давайте вернемся к знакомым кружочкам!
        </p>
        <div className="space-y-3">
          <Button asChild className="w-full bg-loopy-primary hover:bg-loopy-accent text-white rounded-full">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              На главную
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="w-full rounded-full border-gray-200 hover:border-loopy-primary hover:text-loopy-primary bg-transparent"
          >
            <Link href="/search">
              <Search className="w-4 h-4 mr-2" />
              Поиск
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  )
}
