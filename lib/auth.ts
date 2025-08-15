export function isTWA(): boolean {
	// @ts-ignore
	return typeof window !== 'undefined' && !!(window as any)?.Telegram?.WebApp
}

const KEY = 'loopi_user_id'

export function getOrCreateLocalUserId(): string {
	if (typeof window === 'undefined') return ''
	let id = localStorage.getItem(KEY)
	if (!id) {
		id = crypto.randomUUID()
		localStorage.setItem(KEY, id)
	}
	return id
}