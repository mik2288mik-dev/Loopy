"use client"

import React from "react"
import { cn } from "@/lib/utils"

export type IconName = "feed" | "search" | "create" | "activity" | "me"

interface IconProps extends React.HTMLAttributes<HTMLSpanElement> {
	name: IconName
	active?: boolean
	size?: number
}

export function Icon({ name, active = false, size = 24, className, ...rest }: IconProps) {
	const maskUrl = `/brand/icon-${name}.svg`
	const style: React.CSSProperties = {
		WebkitMaskImage: `url(${maskUrl})`,
		maskImage: `url(${maskUrl})`,
		WebkitMaskRepeat: "no-repeat",
		maskRepeat: "no-repeat",
		WebkitMaskPosition: "center",
		maskPosition: "center",
		WebkitMaskSize: "contain",
		maskSize: "contain",
		background: active ? "linear-gradient(90deg, #F0ABFC 0%, #99F6E4 100%)" : "rgba(255,255,255,0.9)",
		opacity: active ? 1 : 0.75,
		width: size,
		height: size,
		display: "inline-block",
	}
	return <span aria-hidden style={style} className={cn("align-middle", className)} {...rest} />
}