"use client"

import React, { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

export type CircleItem = {
	id: string
	mediaUrl: string
	posterUrl: string
	duration: number
	category?: string
	author: { id: string; username?: string; avatar?: string }
	stats: { likes: number; comments: number }
	createdAt: string
}

export default function CircleCard({ item, onLike, onSave }: { item: CircleItem; onLike?: () => void; onSave?: () => void }) {
	const videoRef = useRef<HTMLVideoElement | null>(null)
	const [isIntersecting, setIntersecting] = useState(false)
	const [isMuted, setMuted] = useState(true)

	useEffect(() => {
		const el = videoRef.current
		if (!el) return
		const io = new IntersectionObserver(
			([e]) => {
				setIntersecting(e.isIntersecting)
				if (e.isIntersecting) {
					el.play().catch(() => {})
				} else {
					el.pause()
				}
			},
			{ threshold: 0.6 }
		)
		io.observe(el)
		return () => io.disconnect()
	}, [])

	useEffect(() => {
		const el = videoRef.current
		if (!el) return
		el.muted = isMuted
	}, [isMuted])

	return (
		<div className="aspect-square rounded-full overflow-hidden ring-1 ring-white/10 relative">
			<video
				ref={videoRef}
				src={item.mediaUrl}
				poster={item.posterUrl}
				playsInline
				muted
				preload="metadata"
				className="object-cover w-full h-full"
				onClick={() => {
					const v = videoRef.current
					if (!v) return
					if (v.paused) v.play().catch(() => {})
					else v.pause()
				}}
			/>
			<div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/0 to-black/20" />
			<div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-2">
				<button
					className="px-2.5 py-1 rounded-full text-xs bg-white/10 text-white/90 backdrop-blur-md border border-white/10"
					style={{ minHeight: 32, minWidth: 44 }}
					onClick={onLike}
				>
					❤ {item.stats.likes}
				</button>
				<button
					className="px-2.5 py-1 rounded-full text-xs bg-white/10 text-white/90 backdrop-blur-md border border-white/10"
					style={{ minHeight: 32, minWidth: 44 }}
					onClick={onSave}
				>
					✩
				</button>
			</div>
		</div>
	)
}