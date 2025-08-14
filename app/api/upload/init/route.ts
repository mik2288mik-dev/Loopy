import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const bodySchema = z.object({ filename: z.string().min(1), contentType: z.string().min(1) })

export async function POST(req: NextRequest) {
	try {
		const json = await req.json()
		const { filename, contentType } = bodySchema.parse(json)
		const isVideo = /^video\/(mp4|webm)$/.test(contentType)
		const isImage = /^image\/(png|jpeg|jpg)$/.test(contentType)
		if (!isVideo && !isImage) return NextResponse.json({ error: "Тип файла не поддерживается" }, { status: 400 })

		// Generate a pseudo key; in prod use S3/R2 SDK to get presigned URL
		const key = `${Date.now()}-${Math.random().toString(36).slice(2)}-${filename}`
		const bucketPublicBase = process.env.PUBLIC_BUCKET_BASE_URL || "https://example-bucket.invalid"
		const uploadBase = process.env.UPLOAD_PROXY_URL || bucketPublicBase
		const uploadUrl = `${uploadBase}/${key}`
		const publicUrl = `${bucketPublicBase}/${key}`

		return NextResponse.json({ uploadUrl, key, publicUrl })
	} catch (e: any) {
		return NextResponse.json({ error: "Bad Request" }, { status: 400 })
	}
}