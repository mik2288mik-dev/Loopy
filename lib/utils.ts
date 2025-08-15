import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const formatDuration = (ms: number) => {
	const s = Math.round(ms / 1000)
	const m = Math.floor(s / 60).toString().padStart(2, '0')
	const sec = (s % 60).toString().padStart(2, '0')
	return `${m}:${sec}`
}

export const formatBytes = (bytes: number) => {
	if (bytes === 0) return '0 B'
	const k = 1024, sizes = ['B','KB','MB','GB','TB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

export const timeAgo = (date: Date) => {
	const diff = Date.now() - date.getTime()
	const s = Math.floor(diff/1000), m = Math.floor(s/60), h = Math.floor(m/60), d = Math.floor(h/24)
	if (d>0) return `${d}д назад`
	if (h>0) return `${h}ч назад`
	if (m>0) return `${m}м назад`
	return `${s}с назад`
}
