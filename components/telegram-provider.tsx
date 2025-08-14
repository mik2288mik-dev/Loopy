"use client"

import type React from "react"

import { createContext, useContext, useEffect } from "react"
import { useTelegram } from "@/hooks/use-telegram"

interface TelegramContextType {
  webApp: any
  user: any
  isLoading: boolean
  isInTelegram: boolean
  colorScheme: "light" | "dark"
  themeParams: any
  showMainButton: (text: string, onClick: () => void) => void
  hideMainButton: () => void
  showBackButton: (onClick: () => void) => void
  hideBackButton: () => void
  hapticFeedback: (type: "light" | "medium" | "heavy" | "success" | "error" | "warning" | "selection") => void
  showAlert: (message: string) => void
  showConfirm: (message: string, callback: (confirmed: boolean) => void) => void
  sendData: (data: any) => void
  openLink: (url: string) => void
  close: () => void
}

const TelegramContext = createContext<TelegramContextType | null>(null)

export function TelegramProvider({ children }: { children: React.ReactNode }) {
  const telegram = useTelegram()

  useEffect(() => {
    // Apply Telegram theme
    if (telegram.isInTelegram && telegram.themeParams) {
      const root = document.documentElement
      if (telegram.themeParams.bg_color) {
        root.style.setProperty("--telegram-bg", telegram.themeParams.bg_color)
      }
      if (telegram.themeParams.text_color) {
        root.style.setProperty("--telegram-text", telegram.themeParams.text_color)
      }
      if (telegram.themeParams.button_color) {
        root.style.setProperty("--telegram-button", telegram.themeParams.button_color)
      }
    }
  }, [telegram.isInTelegram, telegram.themeParams])

  return <TelegramContext.Provider value={telegram}>{children}</TelegramContext.Provider>
}

export function useTelegramContext() {
  const context = useContext(TelegramContext)
  if (!context) {
    throw new Error("useTelegramContext must be used within TelegramProvider")
  }
  return context
}
