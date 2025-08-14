import { cookies, headers } from "next/headers"
import type { NextRequest } from "next/server"

export async function getUserId(req: NextRequest): Promise<string> {
	const hdrs = req.headers
	const cookie = req.cookies
	// Prefer Telegram auth in future; for now fallback to guest id
	let uid = cookie.get("loopi_uid")?.value || hdrs.get("x-loopi-guest") || ""
	if (!uid) {
		uid = `guest_${Math.random().toString(36).slice(2)}`
		// Can't set cookie from here using headers(); the route should set, but we return uid
	}
	return uid
}

// Client-side authentication helper for Telegram WebApp (TWA) + Guest fallback
export class LoopAuth {
	private static instance: LoopAuth

	static getInstance(): LoopAuth {
		if (!this.instance) {
			this.instance = new LoopAuth()
		}
		return this.instance
	}

	async initialize(): Promise<{ id: string; displayName: string; isGuest?: boolean; username?: string; avatar?: string }> {
		if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
			return this.initTelegram()
		}
		return this.initGuest()
	}

	private async initTelegram(): Promise<{ id: string; displayName: string; isGuest?: boolean; username?: string; avatar?: string }> {
		const tg = (window as any).Telegram.WebApp
		try {
			tg.ready()
			const initData: string | undefined = tg.initData
			if (initData) {
				const auth = await this.authenticateWithTelegram(initData)
				if (auth) return auth
			}
			const user = tg.initDataUnsafe?.user
			if (user) {
				return {
					id: String(user.id),
					displayName: `${user.first_name}${user.last_name ? ` ${user.last_name}` : ""}`,
					username: user.username,
					avatar: (user as any).photo_url,
					isGuest: false,
				}
			}
		} catch {}
		return this.initGuest()
	}

	private async authenticateWithTelegram(initData: string): Promise<{ id: string; displayName: string; isGuest?: boolean; username?: string; avatar?: string } | null> {
		try {
			// Try to send to backend if available; fall back to local parsing
			const url = "/api/auth/telegram"
			if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
				const payload = new Blob([JSON.stringify({ initData })], { type: "application/json" })
				;(navigator as any).sendBeacon(url, payload)
			}
			// Use initDataUnsafe for immediate user info
			const tg = (window as any).Telegram.WebApp
			const user = tg.initDataUnsafe?.user
			if (!user) return null
			return {
				id: String(user.id),
				displayName: `${user.first_name}${user.last_name ? ` ${user.last_name}` : ""}`,
				username: user.username,
				avatar: (user as any).photo_url,
				isGuest: false,
			}
		} catch {
			return null
		}
	}

	private async initGuest(): Promise<{ id: string; displayName: string; isGuest: boolean }> {
		try {
			let guestId = ""
			if (typeof window !== "undefined") {
				guestId = localStorage.getItem("loopi_guest_id") || ""
				if (!guestId) {
					guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
					localStorage.setItem("loopi_guest_id", guestId)
				}
			}
			return { id: guestId || `guest_${Math.random().toString(36).slice(2)}`, displayName: "Гость", isGuest: true }
		} catch {
			return { id: `guest_${Math.random().toString(36).slice(2)}`, displayName: "Гость", isGuest: true }
		}
	}
}