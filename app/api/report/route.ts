import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { getUserId } from "@/lib/auth"

const schema = z.object({ videoId: z.string().min(1), reason: z.string().min(3) })

export async function POST(req: NextRequest) {
	const reporterId = await getUserId(req)
	const data = schema.parse(await req.json())
	await db.addReport({ reporterId, videoId: data.videoId, reason: data.reason })
	return NextResponse.json({ ok: true })
}