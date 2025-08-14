"use client"

import { usePathname, useRouter } from "next/navigation"
import React from "react"
import { Icon } from "@/components/Icon"

const TABS = [
	{ id: "feed", label: "Домой", href: "/feed", icon: "feed" as const },
	{ id: "search", label: "Поиск", href: "/search", icon: "search" as const },
	{ id: "record", label: "Создать", href: "/record", icon: "create" as const },
	{ id: "activity", label: "Активность", href: "/activity", icon: "activity" as const },
	{ id: "me", label: "Профиль", href: "/me", icon: "me" as const },
]

export default function BottomBar() {
	const router = useRouter()
	const pathname = usePathname() || "/"

	const handleNav = (href: string) => {
		if (pathname !== href) router.push(href)
	}

	return (
		<nav className="fixed bottom-0 inset-x-0 h-16 z-50 border-t border-white/10 bg-white/5 backdrop-blur-md">
			<div className="max-w-screen-sm mx-auto h-full px-3">
				<ul className="h-full flex items-center justify-between">
					{TABS.map((tab) => {
						const isActive = pathname === tab.href || (tab.href !== "/feed" && pathname.startsWith(tab.href))
						const isCreate = tab.id === "record"
						return (
							<li key={tab.id} className="flex-1 text-center">
								<button
									type="button"
									onClick={() => handleNav(tab.href)}
									className={
										"mx-auto flex flex-col items-center justify-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-xl"
									}
									style={{ minWidth: 44, minHeight: 44 }}
								>
									{isCreate ? (
										<span className="inline-flex items-center justify-center w-14 h-14 -mt-6 rounded-full shadow-[0_6px_30px_rgba(240,171,252,0.35)]"
											style={{ background: "linear-gradient(90deg,#F0ABFC,#99F6E4)" }}
											aria-label="Создать"
										>
											<Icon name={"create"} active size={24} />
										</span>
									) : (
										<>
											<Icon name={tab.icon} active={isActive} size={22} />
											<span className={`text-[11px] mt-0.5 ${isActive ? "text-white" : "text-white/70"}`}>{tab.label}</span>
										</>
									)}
								</button>
							</li>
						)
					})}
				</ul>
			</div>
		</nav>
	)
}