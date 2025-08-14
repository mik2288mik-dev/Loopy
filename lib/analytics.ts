import { DeviceCapabilities } from "@/lib/device"
import type { Video } from "@/lib/types"

export class LoopAnalytics {
	private events: Array<{
		name: string
		properties: Record<string, any>
		timestamp: Date
	}> = []

	private getSessionId(): string {
		try {
			if (typeof window !== "undefined") {
				let sid = sessionStorage.getItem("loopi_session_id")
				if (!sid) {
					sid = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`
					sessionStorage.setItem("loopi_session_id", sid)
				}
				return sid
			}
		} catch {}
		return `sess_${Math.random().toString(36).slice(2)}`
	}

	async track(eventName: string, properties: Record<string, any> = {}): Promise<void> {
		const deviceInfo = await DeviceCapabilities.getDeviceInfo()
		const now = new Date()
		this.events.push({
			name: eventName,
			properties: {
				...properties,
				sessionId: this.getSessionId(),
				deviceInfo,
				timestamp: now,
			},
			timestamp: now,
		})

		if (this.events.length >= 10) {
			void this.flush()
		}
	}

	async flush(): Promise<void> {
		if (this.events.length === 0) return
		const payload = this.events.slice()
		this.events = []
		try {
			const body = JSON.stringify({ events: payload })
			if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
				const ok = (navigator as any).sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }))
				if (ok) return
			}
			await fetch("/api/analytics", { method: "POST", headers: { "Content-Type": "application/json" }, body })
		} catch {
			// Re-queue on failure
			this.events.unshift(...payload)
		}
	}

	trackRecordingStart(duration: number) {
		void this.track("recording_started", { expectedDuration: duration, cameraFacing: "user" })
	}

	trackLoopComplete(videoData: Partial<Video>) {
		void this.track("loop_published", {
			duration: videoData.duration,
			category: videoData.category,
			effects: videoData.effects,
			hasLocation: !!videoData.location,
		})
	}

	trackViewingBehavior(videoId: string, watchTime: number, completed: boolean) {
		void this.track("loop_viewed", {
			videoId,
			watchTime,
			completed,
			engagementRate: watchTime / 20,
		})
	}
}