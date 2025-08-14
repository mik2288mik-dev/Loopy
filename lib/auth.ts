import { cookies, headers } from "next/headers"
import type { NextRequest } from "next/server"

export async function getUserId(req: NextRequest): Promise<string> {
	const hdrs = req.headers
	const cookie = req.cookies
	// Prefer Telegram auth in future; for now fallback to guest id
	let uid = cookie.get("loopi_uid")?.value || hdrs.get("x-loopi-guest") || ""
	if (!uid) {
		uid = `guest_${Math.random().toString(36).slice(2)}`
		// Can't set cookie from here using headers(); the route should set, but we return uid
	}
	return uid
}