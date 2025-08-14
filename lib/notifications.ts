export class NotificationSystem {
	private permission: NotificationPermission = "default"
	private lastLikeNotificationAt = 0

	async initialize() {
		try {
			if (typeof window !== "undefined" && "Notification" in window) {
				this.permission = await Notification.requestPermission()
			}
			if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
				const registration = await navigator.serviceWorker.register("/sw.js")
				await this.subscribeToPush(registration)
			}
		} catch {}
	}

	async sendSmartNotification(type: string, data: any) {
		const userPrefs = await this.getUserNotificationPreferences()
		const now = new Date()
		const hour = now.getHours()
		if (userPrefs.quietHours && hour >= userPrefs.quietHours.start && hour <= userPrefs.quietHours.end) {
			await this.scheduleForLater(type, data)
			return
		}
		if (type === "likes" && this.hasRecentLikeNotification()) {
			await this.updateLikeCount(data)
			return
		}
		this.showNotification(type, data)
	}

	private showNotification(type: string, data: any) {
		const notifications: Record<string, { title: string; body: string; icon?: string; badge?: string }> = {
			new_follower: {
				title: "🔥 Новый подписчик!",
				body: `${data.username} подписался на ваши лупы`,
				icon: "/icons/follower.png",
				badge: "/icons/badge.png",
			},
			trending_loop: {
				title: "🚀 Ваш луп в тренде!",
				body: `Луп "${data.title}" набирает популярность`,
				icon: "/icons/trending.png",
			},
			daily_streak: {
				title: `🔥 ${data.days} дней подряд!`,
				body: "Вы поддерживаете активность в LOOPI",
				icon: "/icons/streak.png",
			},
		}
		const config = notifications[type]
		if (config && this.permission === "granted") {
			try {
				new Notification(config.title, { body: config.body, icon: config.icon, badge: config.badge, data, tag: type })
			} catch {}
		}
	}

	private async getUserNotificationPreferences(): Promise<{ quietHours?: { start: number; end: number } }> {
		return { quietHours: undefined }
	}

	private hasRecentLikeNotification(): boolean {
		const now = Date.now()
		if (now - this.lastLikeNotificationAt < 60_000) return true
		this.lastLikeNotificationAt = now
		return false
	}

	private async updateLikeCount(_data: any) {
		// Intentionally left simple: could update existing Notification via Service Worker
		return
	}

	private async scheduleForLater(_type: string, _data: any) {
		// Persist to IndexedDB/localStorage for later scheduling if needed
		return
	}

	private async subscribeToPush(registration: ServiceWorkerRegistration) {
		try {
			const vapid = (typeof process !== "undefined" ? (process as any).env?.NEXT_PUBLIC_VAPID_KEY : undefined) || undefined
			if (!registration.pushManager || !vapid) return
			const existing = await registration.pushManager.getSubscription()
			if (existing) return
			const sub = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: this.urlBase64ToUint8Array(vapid) })
			await fetch("/api/push/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(sub) })
		} catch {}
	}

	private urlBase64ToUint8Array(base64String: string) {
		const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
		const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
		const rawData = atob(base64)
		const outputArray = new Uint8Array(rawData.length)
		for (let i = 0; i < rawData.length; ++i) {
			outputArray[i] = rawData.charCodeAt(i)
		}
		return outputArray
	}
}