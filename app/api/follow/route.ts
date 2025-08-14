import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getUserId } from "@/lib/auth"

export async function POST(req: NextRequest) {
	const followerId = await getUserId(req)
	const { userId } = await req.json()
	if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 })
	const following = await db.toggleFollow({ followerId, followingId: userId })
	return NextResponse.json({ following })
}