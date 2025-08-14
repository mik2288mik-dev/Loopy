export class DeviceCapabilities {
	static async getDeviceInfo() {
		const ua = typeof navigator !== "undefined" ? navigator.userAgent : ""
		return {
			isIOS: /iPad|iPhone|iPod/.test(ua),
			isAndroid: /Android/.test(ua),
			isMobile: /Mobi|Android/i.test(ua),
			supportsPWA: typeof navigator !== "undefined" && "serviceWorker" in navigator,
			supportsWebGL: typeof window !== "undefined" && !!(window as any).WebGLRenderingContext,
			supportsHaptics: typeof navigator !== "undefined" && "vibrate" in navigator,
			supportsCameraAPI: typeof navigator !== "undefined" && "mediaDevices" in navigator,
			supportsWebRTC: typeof window !== "undefined" && "RTCPeerConnection" in (window as any),
			networkType: (typeof navigator !== "undefined" ? (navigator as any)?.connection?.effectiveType : undefined) || "unknown",
			batteryLevel: await this.getBatteryLevel(),
		}
	}

	static async getBatteryLevel(): Promise<number | null> {
		try {
			const anyNavigator = navigator as any
			if (anyNavigator?.getBattery) {
				const battery = await anyNavigator.getBattery()
				return typeof battery?.level === "number" ? battery.level : null
			}
			return null
		} catch {
			return null
		}
	}

	static getOptimalVideoSettings() {
		const ua = typeof navigator !== "undefined" ? navigator.userAgent : ""
		const isIOS = /iPad|iPhone|iPod/.test(ua)
		const isAndroid = /Android/.test(ua)

		if (isIOS) {
			return {
				codec: 'video/mp4;codecs="avc1.42E01E,mp4a.40.2"',
				bitrate: 2_000_000,
				autoplay: { muted: true, playsInline: true },
			}
		}

		if (isAndroid) {
			return {
				codec: "video/webm;codecs=vp8,opus",
				bitrate: 1_500_000,
				autoplay: { muted: true },
			}
		}

		return {
			codec: "video/webm",
			bitrate: 2_500_000,
			autoplay: { muted: true },
		}
	}
}