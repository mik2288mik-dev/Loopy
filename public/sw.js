self.addEventListener("install", (event) => {
	self.skipWaiting()
})

self.addEventListener("activate", (event) => {
	self.clients.claim()
})

self.addEventListener("push", (event) => {
	try {
		const data = event.data ? event.data.json() : {}
		event.waitUntil(
			self.registration.showNotification(data.title || "LOOPI", {
				body: data.body,
				icon: data.icon || "/icon-192.png",
				badge: data.badge || "/icon-192.png",
				data: data.data,
				tag: data.tag,
			})
		)
	} catch {}
})