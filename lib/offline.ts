export class OfflineManager {
	private syncQueue: Array<{ action: string; data: any; timestamp: Date }> = []

	queueForSync(action: string, data: any) {
		this.syncQueue.push({ action, data, timestamp: new Date() })
		if (typeof window !== "undefined") {
			window.addEventListener("online", () => this.syncWhenOnline(), { once: true })
		}
	}

	async saveLoopForLater(videoBlob: Blob, metadata: any) {
		const loopData = {
			id: `draft_${Date.now()}`,
			videoBlob: await this.blobToBase64(videoBlob),
			metadata,
			status: "draft" as const,
			createdAt: new Date(),
		}
		const drafts = this.getDrafts()
		drafts.push(loopData)
		localStorage.setItem("loopi_drafts", JSON.stringify(drafts))
		return loopData.id
	}

	async publishPendingLoops() {
		const drafts = this.getDrafts()
		for (const draft of drafts) {
			try {
				await this.publishDraft(draft)
				this.removeDraft(draft.id)
			} catch (error) {
				console.log(`Не удалось опубликовать ${draft.id}:`, error)
			}
		}
	}

	private async syncWhenOnline() {
		const queue = [...this.syncQueue]
		this.syncQueue = []
		for (const item of queue) {
			try {
				await fetch("/api/sync", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(item) })
			} catch (e) {
				// requeue on failure
				this.syncQueue.push(item)
			}
		}
	}

	private getDrafts(): any[] {
		try {
			const raw = localStorage.getItem("loopi_drafts")
			return raw ? JSON.parse(raw) : []
		} catch {
			return []
		}
	}

	private removeDraft(id: string) {
		const drafts = this.getDrafts().filter((d) => d.id !== id)
		localStorage.setItem("loopi_drafts", JSON.stringify(drafts))
	}

	private async publishDraft(draft: any) {
		try {
			const body = JSON.stringify({ ...draft.metadata })
			await fetch("/api/video", { method: "POST", headers: { "Content-Type": "application/json" }, body })
		} catch (e) {
			throw e
		}
	}

	private blobToBase64(blob: Blob): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onloadend = () => resolve((reader.result as string) || "")
			reader.onerror = reject
			reader.readAsDataURL(blob)
		})
	}
}