export function trackRecordingStart() {
	console.info('[analytics] recording_start')
}

export function trackRecordingStop(durationMs?: number) {
	console.info('[analytics] recording_stop', { durationMs })
}

export function trackLike(videoId: string, liked: boolean) {
	console.info('[analytics] like', { videoId, liked })
}