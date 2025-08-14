"use client"

import { useEffect, useState } from "react"

interface TelegramUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

interface TelegramWebApp {
  initData: string
  initDataUnsafe: {
    user?: TelegramUser
    chat_type?: string
    chat_instance?: string
    start_param?: string
  }
  version: string
  platform: string
  colorScheme: "light" | "dark"
  themeParams: {
    bg_color?: string
    text_color?: string
    hint_color?: string
    link_color?: string
    button_color?: string
    button_text_color?: string
    secondary_bg_color?: string
  }
  isExpanded: boolean
  viewportHeight: number
  viewportStableHeight: number
  headerColor: string
  backgroundColor: string
  isClosingConfirmationEnabled: boolean
  BackButton: {
    isVisible: boolean
    show(): void
    hide(): void
    onClick(callback: () => void): void
    offClick(callback: () => void): void
  }
  MainButton: {
    text: string
    color: string
    textColor: string
    isVisible: boolean
    isActive: boolean
    isProgressVisible: boolean
    setText(text: string): void
    onClick(callback: () => void): void
    offClick(callback: () => void): void
    show(): void
    hide(): void
    enable(): void
    disable(): void
    showProgress(leaveActive?: boolean): void
    hideProgress(): void
    setParams(params: {
      text?: string
      color?: string
      text_color?: string
      is_active?: boolean
      is_visible?: boolean
    }): void
  }
  HapticFeedback: {
    impactOccurred(style: "light" | "medium" | "heavy" | "rigid" | "soft"): void
    notificationOccurred(type: "error" | "success" | "warning"): void
    selectionChanged(): void
  }
  expand(): void
  disableVerticalSwipe(): void
  enableVerticalSwipe(): void
  close(): void
  ready(): void
  sendData(data: string): void
  openLink(url: string, options?: { try_instant_view?: boolean }): void
  openTelegramLink(url: string): void
  showPopup(params: {
    title?: string
    message: string
    buttons?: Array<{
      id?: string
      type?: "default" | "ok" | "close" | "cancel" | "destructive"
      text?: string
    }>
  }): void
  showAlert(message: string, callback?: () => void): void
  showConfirm(message: string, callback?: (confirmed: boolean) => void): void
  showScanQrPopup(params: { text?: string }, callback?: (text: string) => boolean): void
  closeScanQrPopup(): void
  readTextFromClipboard(callback?: (text: string) => void): void
  requestWriteAccess(callback?: (granted: boolean) => void): void
  requestContact(callback?: (granted: boolean) => void): void
  invokeCustomMethod(method: string, params: any, callback?: (error: string, result: any) => void): void
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

export function useTelegram() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null)
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if we're in Telegram Web App environment
    if (typeof window !== "undefined" && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      setWebApp(tg)
      setUser(tg.initDataUnsafe.user || null)

      // Initialize the app
      tg.ready()
      tg.expand()
      tg.disableVerticalSwipe()

      // Set theme colors
      if (tg.themeParams.bg_color) {
        document.documentElement.style.setProperty("--tg-bg-color", tg.themeParams.bg_color)
      }
      if (tg.themeParams.text_color) {
        document.documentElement.style.setProperty("--tg-text-color", tg.themeParams.text_color)
      }

      setIsLoading(false)
    } else {
      // For development/testing outside Telegram
      setIsLoading(false)
    }
  }, [])

  const showMainButton = (text: string, onClick: () => void) => {
    if (webApp?.MainButton) {
      webApp.MainButton.setText(text)
      webApp.MainButton.onClick(onClick)
      webApp.MainButton.show()
    }
  }

  const hideMainButton = () => {
    if (webApp?.MainButton) {
      webApp.MainButton.hide()
    }
  }

  const showBackButton = (onClick: () => void) => {
    if (webApp?.BackButton) {
      webApp.BackButton.onClick(onClick)
      webApp.BackButton.show()
    }
  }

  const hideBackButton = () => {
    if (webApp?.BackButton) {
      webApp.BackButton.hide()
    }
  }

  const hapticFeedback = (type: "light" | "medium" | "heavy" | "success" | "error" | "warning" | "selection") => {
    if (webApp?.HapticFeedback) {
      if (type === "success" || type === "error" || type === "warning") {
        webApp.HapticFeedback.notificationOccurred(type)
      } else if (type === "selection") {
        webApp.HapticFeedback.selectionChanged()
      } else {
        webApp.HapticFeedback.impactOccurred(type)
      }
    }
  }

  const showAlert = (message: string) => {
    if (webApp?.showAlert) {
      webApp.showAlert(message)
    } else {
      alert(message)
    }
  }

  const showConfirm = (message: string, callback: (confirmed: boolean) => void) => {
    if (webApp?.showConfirm) {
      webApp.showConfirm(message, callback)
    } else {
      callback(confirm(message))
    }
  }

  const sendData = (data: any) => {
    if (webApp?.sendData) {
      webApp.sendData(JSON.stringify(data))
    }
  }

  const openLink = (url: string) => {
    if (webApp?.openLink) {
      webApp.openLink(url)
    } else {
      window.open(url, "_blank")
    }
  }

  const close = () => {
    if (webApp?.close) {
      webApp.close()
    }
  }

  return {
    webApp,
    user,
    isLoading,
    isInTelegram: !!webApp,
    colorScheme: webApp?.colorScheme || "light",
    themeParams: webApp?.themeParams || {},
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticFeedback,
    showAlert,
    showConfirm,
    sendData,
    openLink,
    close,
  }
}
