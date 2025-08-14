import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	// Валидация initData будет подключена с использованием хеша бота в следующей версии
	return NextResponse.json({ ok: true })
}