"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
	name?: string
	src?: string
	size?: number
}

export default function Avatar({ name, src, size = 40, className, ...rest }: AvatarProps) {
	const initials = (name || "").trim().split(" ").map((s) => s[0]).slice(0, 2).join("") || "?"
	return (
		<div
			className={cn("rounded-full overflow-hidden bg-white/10 border border-white/10 flex items-center justify-center text-white", className)}
			style={{ width: size, height: size }}
			role="img"
			aria-label={name || "avatar"}
			{...rest}
		>
			{src ? <img src={src} alt={name || "avatar"} className="w-full h-full object-cover" /> : <span className="text-xs">{initials}</span>}
		</div>
	)
}