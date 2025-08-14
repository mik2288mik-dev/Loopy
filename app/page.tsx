"use client"

import { redirect } from "next/navigation"

export default function HomePage() {
  redirect("/feed")
  return <div className="min-h-screen" />
}
