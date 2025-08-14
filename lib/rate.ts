const publishMap = new Map<string, number>()

export async function rateLimitPublish(userId: string) {
	const now = Date.now()
	const last = publishMap.get(userId) || 0
	if (now - last < 120_000) throw new Error("rate: публикация слишком часто (подождите 120с)")
	publishMap.set(userId, now)
}