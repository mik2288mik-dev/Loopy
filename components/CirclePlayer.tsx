"use client"

import React, { useEffect, useRef, useState } from "react"

interface CirclePlayerProps {
	src: string
	poster?: string
	boomerang?: boolean
	autoPlay?: boolean
	muted?: boolean
	className?: string
}

export default function CirclePlayer({ src, poster, boomerang = false, autoPlay = true, muted = true, className }: CirclePlayerProps) {
	const vRef = useRef<HTMLVideoElement | null>(null)
	const [isMuted, setMuted] = useState(muted)

	useEffect(() => {
		const v = vRef.current
		if (!v) return
		v.muted = isMuted
		if (autoPlay) v.play().catch(() => {})
	}, [isMuted, autoPlay])

	useEffect(() => {
		if (!boomerang) return
		const v = vRef.current
		if (!v) return
		const onEnded = () => {
			const start = performance.now()
			const durationMs = (v.duration || 1) * 1000
			const reverse = (t: number) => {
				const p = Math.min(1, (t - start) / durationMs)
				v.currentTime = v.duration * (1 - p)
				if (p < 1) requestAnimationFrame(reverse)
				else v.play().catch(() => {})
			}
			requestAnimationFrame(reverse)
		}
		v.addEventListener("ended", onEnded)
		return () => v.removeEventListener("ended", onEnded)
	}, [boomerang])

	return (
		<div className={`aspect-square rounded-full overflow-hidden relative ${className || ""}`}>
			<video ref={vRef} src={src} poster={poster} playsInline muted={isMuted} className="w-full h-full object-cover" />
			<button
				onClick={() => setMuted((m) => !m)}
				className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs bg-black/50 text-white"
				style={{ minWidth: 44, minHeight: 32 }}
			>
				{isMuted ? "🔇" : "🔊"}
			</button>
		</div>
	)
}