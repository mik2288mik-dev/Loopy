"use client"

import React from "react"
import BottomBar from "@/components/BottomBar"
import Link from "next/link"

export default function MePage() {
	return (
		<div className="min-h-screen bg-[#0B0D10] pb-20">
			<header className="sticky top-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
				<div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
					<h1 className="font-heading font-bold text-lg text-white">Профиль</h1>
					<Link href="/profile/edit" className="text-sm text-white/80 underline">Редактировать</Link>
				</div>
			</header>
			<main className="max-w-md mx-auto px-4 py-4 text-white/80">
				<p>Здесь будет ваш профиль. В ближайших коммитах подключим реальные данные /api/profile.</p>
			</main>
			<BottomBar />
		</div>
	)
}