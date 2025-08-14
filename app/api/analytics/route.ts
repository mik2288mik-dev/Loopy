import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	try {
		const { events } = await req.json()
		// In MVP, we simply acknowledge receipt
		return NextResponse.json({ ok: true, received: Array.isArray(events) ? events.length : 0 })
	} catch (e: any) {
		return NextResponse.json({ ok: false, error: e?.message || "Bad request" }, { status: 400 })
	}
}