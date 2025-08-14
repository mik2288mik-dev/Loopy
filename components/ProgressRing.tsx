"use client"

import React from "react"

interface ProgressRingProps {
	size?: number
	stroke?: number
	progress: number // 0..1
	className?: string
}

export default function ProgressRing({ size = 64, stroke = 4, progress, className }: ProgressRingProps) {
	const r = (size - stroke) / 2
	const c = 2 * Math.PI * r
	const dash = Math.max(0, Math.min(1, progress)) * c
	return (
		<svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={className} aria-hidden>
			<defs>
				<linearGradient id="loopiGrad" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stopColor="#F0ABFC" />
					<stop offset="100%" stopColor="#99F6E4" />
				</linearGradient>
			</defs>
			<circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={stroke} />
			<circle
				cx={size / 2}
				cy={size / 2}
				r={r}
				fill="none"
				stroke="url(#loopiGrad)"
				strokeWidth={stroke}
				strokeDasharray={`${dash} ${c}`}
				strokeLinecap="round"
				transform={`rotate(-90 ${size / 2} ${size / 2})`}
			/>
		</svg>
	)
}