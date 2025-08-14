"use client"

import React from "react"

interface ToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	checked: boolean
	onCheckedChange: (checked: boolean) => void
}

export default function Toggle({ checked, onCheckedChange, className, ...rest }: ToggleProps) {
	return (
		<button
			role="switch"
			aria-checked={checked}
			onClick={() => onCheckedChange(!checked)}
			className={`inline-flex items-center w-12 h-7 rounded-full px-1 transition-colors ${
				checked ? "bg-gradient-to-r from-[#F0ABFC] to-[#99F6E4]" : "bg-white/10"
			} ${className || ""}`}
			style={{ minWidth: 44, minHeight: 44 }}
			{...rest}
		>
			<span className={`w-5 h-5 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`} />
		</button>
	)
}