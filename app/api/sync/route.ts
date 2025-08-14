import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	try {
		const payload = await req.json()
		return NextResponse.json({ ok: true })
	} catch (e: any) {
		return NextResponse.json({ ok: false, error: e?.message || "Bad request" }, { status: 400 })
	}
}