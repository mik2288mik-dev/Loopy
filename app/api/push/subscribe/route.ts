import { NextRequest, NextResponse } from "next/server"

const subscriptions = new Set<string>()

export async function POST(req: NextRequest) {
	try {
		const sub = await req.json()
		subscriptions.add(JSON.stringify(sub))
		return NextResponse.json({ ok: true })
	} catch (e: any) {
		return NextResponse.json({ ok: false, error: e?.message || "Bad request" }, { status: 400 })
	}
}