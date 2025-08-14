import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getUserId } from "@/lib/auth"

export async function POST(req: NextRequest) {
	const userId = await getUserId(req)
	const body: any = await req.json()
	const { videoId } = body || {}
	if (!videoId) return NextResponse.json({ error: "videoId required" }, { status: 400 })
	const saved = await db.toggleSave({ userId, videoId })
	return NextResponse.json({ saved })
}