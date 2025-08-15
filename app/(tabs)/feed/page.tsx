"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import BottomBar from "@/components/BottomBar"
import CircleCard from "@/components/CircleCard"
import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { getOrCreateLocalUserId } from "@/lib/auth"

const CATEGORIES = ["Все", "Танцы", "Кулинария", "Природа", "Музыка", "Юмор"]

type FeedItem = {
	id: string
	mediaUrl: string
	posterUrl: string
	duration: number
	visibility: "PUBLIC" | "FRIENDS" | "CLOSE"
	category?: string
	author: { id: string; username?: string; avatar?: string }
	stats: { likes: number; comments: number }
	createdAt: Date
}

type FeedResponse = {
	items: FeedItem[]
	nextCursor?: string
}

export default function FeedPage() {
	const router = useRouter()
	const params = useSearchParams()
	const [category, setCategory] = useState<string>(params.get("category") || "Все")
	const [mode, setMode] = useState<"global" | "friends">("global")
	const [items, setItems] = useState<FeedItem[]>([])
	const [cursor, setCursor] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const loadMoreRef = useRef<HTMLDivElement | null>(null)

	useEffect(() => {
		fetchFeed(true)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [category, mode])

	useEffect(() => {
		if (!loadMoreRef.current) return
		const io = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting && !loading && cursor !== null) {
					fetchFeed(false)
				}
			},
			{ rootMargin: "100px" }
		)
		io.observe(loadMoreRef.current)
		return () => io.disconnect()
	}, [cursor, loading])

	const fetchFeed = async (reset: boolean) => {
		try {
			setLoading(true)
			setError(null)
			const url = new URL("/api/feed", window.location.origin)
			url.searchParams.set("mode", mode)
			if (category && category !== "Все") url.searchParams.set("category", category)
			if (!reset && cursor) url.searchParams.set("cursor", cursor)
			const res = await fetch(url.toString(), { cache: "no-store", headers: { "x-loopi-user": getOrCreateLocalUserId() } })
			if (!res.ok) throw new Error("Сбой загрузки ленты")
			const data: FeedResponse = await res.json()
			setItems((prev) => (reset ? data.items : [...prev, ...data.items]))
			setCursor(data.nextCursor ?? null)
		} catch (e: any) {
			setError(e?.message || "Ошибка сети")
		} finally {
			setLoading(false)
		}
	}

	const onLike = async (id: string) => {
		try {
			const res = await fetch("/api/like", { method: "POST", headers: { "Content-Type": "application/json", "x-loopi-user": getOrCreateLocalUserId() }, body: JSON.stringify({ videoId: id }) })
			if (!res.ok) return
			const { liked } = await res.json()
			setItems((prev) => prev.map((it) => (it.id === id ? { ...it, stats: { ...it.stats, likes: it.stats.likes + (liked ? 1 : -1) } } : it)))
		} catch {}
	}

	const onSave = async (id: string) => {
		try {
			await fetch("/api/save", { method: "POST", headers: { "Content-Type": "application/json", "x-loopi-user": getOrCreateLocalUserId() }, body: JSON.stringify({ videoId: id }) })
		} catch {}
	}

	const CategoryTab = ({ name }: { name: string }) => (
		<button
			onClick={() => setCategory(name)}
			className={cn(
				"px-3 py-1.5 rounded-full text-sm border",
				category === name ? "bg-gradient-to-r from-[#F0ABFC] to-[#99F6E4] text-black border-transparent" : "border-white/10 text.white/80 hover:bg-white/5"
			)}
			style={{ minHeight: 36 }}
		>
			{name}
		</button>
	)

	return (
		<div className="min-h-screen bg-[#0B0D10] pb-20">
			<header className="sticky top-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
				<div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
					<h1 className="font-heading font-bold text-lg text-white">LOOPI</h1>
					<div className="flex gap-2">
						<button onClick={() => setMode("global")} className={cn("px-3 py-1.5 rounded-full text-sm border", mode === "global" ? "bg-white/90 text-black" : "border-white/10 text-white/80 hover:bg-white/5")}>Глобал</button>
						<button onClick={() => setMode("friends")} className={cn("px-3 py-1.5 rounded-full text-sm border", mode === "friends" ? "bg-white/90 text-black" : "border-white/10 text-white/80 hover:bg-white/5")}>Друзья</button>
					</div>
				</div>
				<div className="max-w-md mx-auto px-4 pb-3 overflow-x-auto scrollbar-hide">
					<div className="flex items-center gap-2 min-w-max">
						{CATEGORIES.map((c) => (
							<CategoryTab key={c} name={c} />
						))}
					</div>
				</div>
			</header>

			<main className="max-w-md mx.auto px-4 py-4">
				{error && <div className="text-red-400 text-sm mb-3">{error}</div>}
				<div className="grid grid-cols-2 gap-4">
					{items.map((it) => (
						<CircleCard key={it.id} item={it} onLike={() => onLike(it.id)} onSave={() => onSave(it.id)} />
					))}
				</div>
				<div ref={loadMoreRef} className="h-12" />
				{loading && <div className="text-center text-white/60 py-3">Загрузка…</div>}
			</main>

			<BottomBar />
		</div>
	)
}