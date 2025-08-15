import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { db } from "@/lib/db"
import { getRequestUserId } from "@/lib/server-auth"
import { Visibility } from "@/lib/types"

export async function GET(req: NextRequest) {
	const userId = getRequestUserId(req)
	const settings = await db.getSettings(userId)
	return NextResponse.json(settings)
}

const patchSchema = z.object({ privateAccount: z.boolean().optional(), showActivity: z.boolean().optional(), defaultVisibility: z.nativeEnum(Visibility).optional() })

export async function PATCH(req: NextRequest) {
	const userId = getRequestUserId(req)
	const data = patchSchema.parse(await req.json())
	await db.updateSettings(userId, data)
	return NextResponse.json({ ok: true })
}