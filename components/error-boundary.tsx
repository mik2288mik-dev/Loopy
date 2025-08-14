"use client"

import { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="font-heading font-semibold text-xl text-gray-900 mb-2">Что-то пошло не так</h2>
            <p className="text-gray-600 text-sm mb-6">
              Произошла неожиданная ошибка. Попробуйте обновить страницу или вернуться позже.
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => window.location.reload()}
                className="w-full bg-loopy-primary hover:bg-loopy-accent text-white rounded-full"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Обновить страницу
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/")}
                className="w-full rounded-full border-gray-200 hover:border-loopy-primary hover:text-loopy-primary bg-transparent"
              >
                На главную
              </Button>
            </div>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-gray-500 cursor-pointer">Детали ошибки</summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
