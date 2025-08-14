"use client"

import React from "react"
import BottomBar from "@/components/BottomBar"
import CircleRecorder from "@/components/CircleRecorder"

export default function RecordPage() {
	return (
		<div className="min-h-screen bg-[#0B0D10] pb-20">
			<header className="sticky top-0 z-50 bg-white/5 backdrop-blur-md border-b border-white/10">
				<div className="max-w-md mx-auto px-4 py-3">
					<h1 className="font-heading font-bold text-lg text-white">Создать луп</h1>
					<p className="text-white/60 text-sm">Луп живёт 24 часа</p>
				</div>
			</header>
			<main className="max-w-md mx-auto">
				<CircleRecorder />
			</main>
			<BottomBar />
		</div>
	)
}