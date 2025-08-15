import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getRequestUserId } from "@/lib/server-auth"

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const mode = (searchParams.get("mode") as "global" | "friends") || "global"
	const category = searchParams.get("category") || undefined
	const cursor = searchParams.get("cursor") || undefined
	const limit = Math.min(50, parseInt(searchParams.get("limit") || "20", 10))
	const userId = getRequestUserId(req)

	const { items, nextCursor } = await db.getFeed({ mode, category, cursor, limit, viewerId: userId })
	return NextResponse.json({ items, nextCursor })
}