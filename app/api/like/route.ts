import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getRequestUserId } from "@/lib/server-auth"

export async function POST(req: NextRequest) {
	const userId = getRequestUserId(req)
	const body: any = await req.json()
	const { videoId } = body || {}
	if (!videoId) return NextResponse.json({ error: "videoId required" }, { status: 400 })
	const liked = await db.toggleLike({ userId, videoId })
	return NextResponse.json({ liked })
}