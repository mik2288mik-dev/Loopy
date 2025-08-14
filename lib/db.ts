import type { Visibility } from "@/lib/types"

// Simple in-memory stores for MVP
const videos: any[] = []
const likes = new Set<string>() // `${userId}:${videoId}`
const saves = new Set<string>()
const follows = new Set<string>() // `${followerId}:${followingId}`
const users = new Map<string, any>()
const settings = new Map<string, any>()
const reports: { videoId: string; reporterId: string; reason: string; createdAt: number }[] = []

function ensureUser(userId: string) {
	if (!users.has(userId)) users.set(userId, { id: userId, username: userId, displayName: userId, avatar: undefined, bio: "", createdAt: new Date().toISOString() })
	if (!settings.has(userId)) settings.set(userId, { privateAccount: false, showActivity: true, defaultVisibility: "FRIENDS" as Visibility })
}

export const db = {
	async createVideo(input: { authorId: string; mediaUrl: string; posterUrl: string; duration: number; visibility: Visibility; category?: string; expiresAt: Date }) {
		ensureUser(input.authorId)
		const v = {
			id: Math.random().toString(36).slice(2),
			authorId: input.authorId,
			mediaUrl: input.mediaUrl,
			posterUrl: input.posterUrl,
			duration: input.duration,
			visibility: input.visibility,
			category: input.category,
			expiresAt: input.expiresAt.toISOString(),
			shadowed: false,
			createdAt: new Date().toISOString(),
		}
		videos.unshift(v)
		return v.id as string
	},
	async getFeed({ mode, category, cursor, limit, viewerId }: { mode: "global" | "friends"; category?: string; cursor?: string; limit: number; viewerId: string }) {
		const now = Date.now()
		let items = videos.filter((v) => !v.shadowed && Date.parse(v.expiresAt) > now)
		if (category) items = items.filter((v) => v.category === category)
		if (mode === "friends") {
			items = items.filter((v) => follows.has(`${viewerId}:${v.authorId}`) || v.authorId === viewerId)
		}
		// simple pagination by createdAt descending
		items.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
		let start = 0
		if (cursor) {
			const idx = items.findIndex((v) => v.id === cursor)
			start = Math.max(0, idx + 1)
		}
		const slice = items.slice(start, start + limit)
		const nextCursor = slice.length === limit ? slice[slice.length - 1].id : undefined
		const withStats = slice.map((v) => ({
			id: v.id,
			mediaUrl: v.mediaUrl,
			posterUrl: v.posterUrl,
			duration: v.duration,
			visibility: v.visibility,
			category: v.category,
			author: { id: v.authorId, username: users.get(v.authorId)?.username, avatar: users.get(v.authorId)?.avatar },
			stats: { likes: Array.from(likes).filter((k) => k.endsWith(`:${v.id}`)).length, comments: 0 },
			createdAt: v.createdAt,
		}))
		return { items: withStats, nextCursor }
	},
	async toggleLike({ userId, videoId }: { userId: string; videoId: string }) {
		const key = `${userId}:${videoId}`
		if (likes.has(key)) {
			likes.delete(key)
			return false
		}
		likes.add(key)
		return true
	},
	async toggleSave({ userId, videoId }: { userId: string; videoId: string }) {
		const key = `${userId}:${videoId}`
		if (saves.has(key)) {
			saves.delete(key)
			return false
		}
		saves.add(key)
		return true
	},
	async toggleFollow({ followerId, followingId }: { followerId: string; followingId: string }) {
		const key = `${followerId}:${followingId}`
		if (follows.has(key)) {
			follows.delete(key)
			return false
		}
		follows.add(key)
		return true
	},
	async getProfile(userId: string) {
		ensureUser(userId)
		const user = users.get(userId)
		const vids = videos.filter((v) => v.authorId === userId)
		const liked = videos.filter((v) => likes.has(`${userId}:${v.id}`))
		const saved = videos.filter((v) => saves.has(`${userId}:${v.id}`))
		return {
			user,
			stats: { followers: Array.from(follows).filter((k) => k.endsWith(`:${userId}`)).length, following: Array.from(follows).filter((k) => k.startsWith(`${userId}:`)).length, videos: vids.length },
			videos: vids,
			liked: liked,
			saved: saved,
		}
	},
	async updateProfile(userId: string, data: any) {
		ensureUser(userId)
		users.set(userId, { ...users.get(userId), ...data })
	},
	async getSettings(userId: string) {
		ensureUser(userId)
		return settings.get(userId)
	},
	async updateSettings(userId: string, data: any) {
		ensureUser(userId)
		settings.set(userId, { ...settings.get(userId), ...data })
	},
	async addReport({ reporterId, videoId, reason }: { reporterId: string; videoId: string; reason: string }) {
		reports.push({ reporterId, videoId, reason, createdAt: Date.now() })
		const oneHourAgo = Date.now() - 60 * 60 * 1000
		const count = reports.filter((r) => r.videoId === videoId && r.createdAt > oneHourAgo).length
		if (count >= 3) {
			const v = videos.find((x) => x.id === videoId)
			if (v) v.shadowed = true
		}
	},
}