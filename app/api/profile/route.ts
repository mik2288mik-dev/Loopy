import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { getRequestUserId } from "@/lib/server-auth"

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url)
	const userId = searchParams.get("userId") || getRequestUserId(req)
	const data = await db.getProfile(userId)
	return NextResponse.json(data)
}

const patchSchema = z.object({ displayName: z.string().optional(), bio: z.string().optional(), avatarUrl: z.string().url().optional() })

export async function PATCH(req: NextRequest) {
	const userId = getRequestUserId(req)
	const json = await req.json()
	const data = patchSchema.parse(json)
	await db.updateProfile(userId, data)
	return NextResponse.json({ ok: true })
}