"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import ProgressRing from "@/components/ProgressRing"

const MIME_PREFER = [
	'video/mp4;codecs="avc1.42E01E,mp4a.40.2"',
	"video/webm;codecs=vp8,opus",
	"video/webm",
]

type Visibility = "PUBLIC" | "FRIENDS" | "CLOSE"

const CATEGORIES = ["Все", "Танцы", "Кулинария", "Природа", "Музыка", "Юмор"]

export default function CircleRecorder({ defaultVisibility = "FRIENDS" as Visibility }: { defaultVisibility?: Visibility }) {
	const [stream, setStream] = useState<MediaStream | null>(null)
	const [recorder, setRecorder] = useState<MediaRecorder | null>(null)
	const chunksRef = useRef<Blob[]>([])
	const [recording, setRecording] = useState(false)
	const [elapsed, setElapsed] = useState(0)
	const [blobUrl, setBlobUrl] = useState<string | null>(null)
	const [file, setFile] = useState<File | null>(null)
	const [visibility, setVisibility] = useState<Visibility>(defaultVisibility)
	const [category, setCategory] = useState<string | undefined>(undefined)
	const [uploading, setUploading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const tickerRef = useRef<number | null>(null)

	const supportedMime = useMemo(() => {
		if (typeof window === "undefined" || typeof MediaRecorder === "undefined") return undefined
		for (const t of MIME_PREFER) if (MediaRecorder.isTypeSupported(t)) return t
		return undefined
	}, [])

	useEffect(() => {
		if (videoRef.current && stream && !blobUrl) {
			try {
				;(videoRef.current as any).srcObject = stream
				videoRef.current.play().catch(() => {})
			} catch {}
		}
	}, [stream, blobUrl])

	useEffect(() => {
		return () => {
			if (stream) stream.getTracks().forEach((t) => t.stop())
			if (blobUrl) URL.revokeObjectURL(blobUrl)
		}
	}, [stream, blobUrl])

	const start = async () => {
		try {
			setError(null)
			const media = await navigator.mediaDevices.getUserMedia({
				video: { width: { ideal: 720 }, height: { ideal: 1280 }, facingMode: "user" },
				audio: true,
			})
			setStream(media)
			const rec = new MediaRecorder(media, supportedMime ? { mimeType: supportedMime, bitsPerSecond: 2_500_000 } : undefined)
			chunksRef.current = []
			rec.ondataavailable = (e) => e.data && e.data.size && chunksRef.current.push(e.data)
			rec.onstop = () => {
				const blob = new Blob(chunksRef.current, { type: rec.mimeType || "video/webm" })
				const f = new File([blob], `loopi-${Date.now()}.${blob.type.includes("mp4") ? "mp4" : "webm"}`, { type: blob.type })
				const url = URL.createObjectURL(f)
				setFile(f)
				setBlobUrl(url)
			}
			setRecorder(rec)
			rec.start()
			setRecording(true)
			const started = performance.now()
			const tick = () => {
				const s = Math.min(20, Math.floor((performance.now() - started) / 1000))
				setElapsed(s)
				if (s >= 20) stop()
				else tickerRef.current = requestAnimationFrame(tick)
			}
			tickerRef.current = requestAnimationFrame(tick)
		} catch (e: any) {
			setError(e?.message || "Камера недоступна")
		}
	}

	const stop = () => {
		if (tickerRef.current) cancelAnimationFrame(tickerRef.current)
		setRecording(false)
		recorder?.stop()
	}

	const minReached = elapsed >= 8
	const progress = recording ? elapsed / 20 : file ? 1 : 0

	const circlePosterFromVideo = useCallback(async (): Promise<string> => {
		return new Promise((resolve) => {
			const v = document.createElement("video")
			v.src = blobUrl || ""
			v.muted = true
			v.playsInline = true
			v.addEventListener("loadeddata", () => {
				const size = 512
				const c = document.createElement("canvas")
				c.width = c.height = size
				const x = c.getContext("2d")!
				x.save()
				x.beginPath()
				x.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
				x.clip()
				const { videoWidth: w, videoHeight: h } = v
				const s = Math.min(w, h)
				x.drawImage(v, (w - s) / 2, (h - s) / 2, s, s, 0, 0, size, size)
				x.restore()
				resolve(c.toDataURL("image/png"))
			})
		})
	}, [blobUrl])

	const doPublish = async () => {
		if (!file) return
		try {
			setUploading(true)
			setError(null)
			// Validate type and size on client
			if (!/^video\/(mp4|webm)$/.test(file.type)) throw new Error("Тип файла не поддерживается")
			if (file.size > 30 * 1024 * 1024) throw new Error("Слишком большой файл")

			const initRes = await fetch("/api/upload/init", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ filename: file.name, contentType: file.type }),
			})
			if (!initRes.ok) throw new Error("Сбой инициализации загрузки")
			const { uploadUrl, key, publicUrl } = await initRes.json()

			await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } })

			const posterDataUrl = await circlePosterFromVideo()
			// upload poster via same init
			const posterBlob = await (await fetch(posterDataUrl)).blob()
			const posterInit = await fetch("/api/upload/init", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ filename: `poster-${Date.now()}.png`, contentType: "image/png" }),
			})
			if (!posterInit.ok) throw new Error("Сбой инициализации постера")
			const posterInitJson = await posterInit.json()
			await fetch(posterInitJson.uploadUrl, { method: "PUT", body: posterBlob, headers: { "Content-Type": "image/png" } })

			const vRes = await fetch("/api/video", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					mediaUrl: publicUrl,
					posterUrl: posterInitJson.publicUrl,
					duration: Math.max(8, Math.min(20, elapsed)),
					visibility,
					category,
				}),
			})
			if (!vRes.ok) throw new Error("Ошибка публикации")
			window.location.href = "/feed"
		} catch (e: any) {
			setError(e?.message || "Сбой сети")
		} finally {
			setUploading(false)
		}
	}

	return (
		<div className="px-4 py-6">
			<div className="mx-auto" style={{ width: 280 }}>
				<div className="relative">
					<div className="aspect-square rounded-full overflow-hidden bg-black" style={{ WebkitMaskImage: "radial-gradient(circle, #000 99%, transparent 100%)", maskImage: "radial-gradient(circle, #000 99%, transparent 100%)" }}>
						{blobUrl ? (
							<video ref={videoRef} src={blobUrl} playsInline muted loop className="w-full h-full object-cover" />
						) : (
							<video ref={videoRef} playsInline muted autoPlay className="w-full h-full object-cover" />
						)}
					</div>
					<div className="absolute inset-0 flex items-center justify-center">
						<ProgressRing size={220} stroke={6} progress={progress} />
					</div>
				</div>

				<div className="mt-6 flex items-center justify-center gap-3">
					<button onClick={recording ? stop : start} className="w-14 h-14 rounded-full" style={{ background: "linear-gradient(90deg,#F0ABFC,#99F6E4)" }} aria-label={recording ? "Стоп" : "Старт"} />
					<span className="text-white/80 text-sm">{elapsed}s • 8–20с</span>
				</div>

				{blobUrl && (
					<div className="mt-6 space-y-4">
						<div className="flex gap-2 justify-center">
							{(["PUBLIC", "FRIENDS", "CLOSE"] as Visibility[]).map((v) => (
								<button key={v} onClick={() => setVisibility(v)} className={`px-3 py-1.5 rounded-full text-sm border ${visibility === v ? "bg-white text-black border-transparent" : "border-white/10 text-white/80"}`} style={{ minHeight: 36 }}>
									{v}
								</button>
							))}
						</div>
						<div className="flex gap-2 overflow-x-auto">
							{CATEGORIES.map((c) => (
								<button key={c} onClick={() => setCategory(c === "Все" ? undefined : c)} className={`px-3 py-1.5 rounded-full text-sm border ${category === c ? "bg-white/90 text-black border-transparent" : "border-white/10 text-white/80"}`} style={{ minHeight: 36 }}>
									{c}
								</button>
							))}
						</div>
						<button disabled={!file || !visibility || uploading} onClick={doPublish} className="w-full mt-2 px-4 py-3 rounded-full text-black font-medium disabled:opacity-50" style={{ background: "linear-gradient(90deg,#F0ABFC,#99F6E4)" }}>
							{uploading ? "Публикация…" : "Опубликовать"}
						</button>
						{error && <div className="text-red-400 text-sm text-center">{error}</div>}
					</div>
				)}
			</div>
		</div>
	)
}