export function isIOS(): boolean {
	const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
	return /iPad|iPhone|iPod/.test(ua)
}

export function isAndroid(): boolean {
	const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
	return /Android/.test(ua)
}