export type Visibility = "PUBLIC" | "FRIENDS" | "CLOSE"

export interface User {
	id: string
	username?: string
	displayName?: string
	avatar?: string
	bio?: string
	isPrivate?: boolean
	showActivity?: boolean
	createdAt: string
}

export interface Video {
	id: string
	authorId: string
	mediaUrl: string
	posterUrl: string
	duration: number
	category?: string
	visibility: Visibility
	expiresAt: string
	shadowed?: boolean
	createdAt: string
}