import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { rateLimitPublish } from "@/lib/rate"
import { db } from "@/lib/db"
import { getUserId } from "@/lib/auth"

const bodySchema = z.object({
	mediaUrl: z.string().url(),
	posterUrl: z.string().url(),
	duration: z.number().min(1).max(120),
	visibility: z.enum(["PUBLIC", "FRIENDS", "CLOSE"]),
	category: z.string().optional(),
	geo: z.object({ lat: z.number(), lng: z.number() }).optional(),
})

export async function POST(req: NextRequest) {
	try {
		const userId = await getUserId(req)
		await rateLimitPublish(userId)
		const json = await req.json()
		const data = bodySchema.parse(json)
		const now = new Date()
		const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000)
		const id = await db.createVideo({
			authorId: userId,
			mediaUrl: data.mediaUrl,
			posterUrl: data.posterUrl,
			duration: data.duration,
			visibility: data.visibility,
			category: data.category,
			expiresAt,
		})
		return NextResponse.json({ id })
	} catch (e: any) {
		const msg = e?.message || "Ошибка"
		const code = msg.includes("rate") ? 429 : 400
		return NextResponse.json({ error: msg }, { status: code })
	}
}