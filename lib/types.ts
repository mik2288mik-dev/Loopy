export interface User {
	id: string
	username?: string
	displayName: string
	avatar?: string
	bio?: string
	isPrivate: boolean
	showActivity: boolean
	createdAt: Date
	// Extended fields
	verified: boolean
	creatorLevel: "rookie" | "rising" | "star" | "legend"
	preferredCategories: string[]
	timezone: string
	language: "ru" | "en"
}

export enum Visibility {
	PUBLIC = "PUBLIC",
	FRIENDS = "FRIENDS",
	CLOSE = "CLOSE",
}

export interface Video {
	id: string
	authorId: string
	author: User
	mediaUrl: string
	posterUrl: string
	duration: number
	category?: string
	visibility: Visibility
	expiresAt: Date
	shadowed: boolean
	createdAt: Date
	// Additions
	mood?: "energetic" | "chill" | "funny" | "inspiring" | "mysterious"
	hashtags: string[]
	location?: {
		lat: number
		lng: number
		name?: string
	}
	effects: string[]
	musicTrack?: string
	stats: {
		likes: number
		views: number
		comments: number
		shares: number
		watchTime: number
	}
}

export interface CircleEvent {
	id: string
	type: "like" | "follow" | "comment" | "publish" | "milestone" | "trending"
	actorId: string
	targetUserId?: string
	videoId?: string
	metadata?: Record<string, any>
	createdAt: Date
	importance: "low" | "medium" | "high" | "urgent"
}