export interface User {
	id: string
	username?: string
	displayName: string
	avatar?: string
	bio?: string
	isPrivate: boolean
	showActivity: boolean
	createdAt: Date
	preferredCategories?: string[]
}

export enum Visibility {
	PUBLIC = 'PUBLIC',
	FRIENDS = 'FRIENDS',
	CLOSE = 'CLOSE',
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
	stats: {
		likes: number
		views: number
		comments: number
	}
}

export interface CircleEvent {
	id: string
	type: 'like' | 'follow' | 'comment' | 'publish'
	actorId: string
	targetUserId?: string
	videoId?: string
	createdAt: Date
}