import type { NextRequest } from "next/server"

export function getRequestUserId(req: NextRequest): string {
	const hdr = req.headers.get('x-loopi-user') || ''
	return hdr || 'anon'
}