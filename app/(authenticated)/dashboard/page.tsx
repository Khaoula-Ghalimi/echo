"use client"

import { useUser } from "@auth0/nextjs-auth0/client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
    const { user, error, isLoading } = useUser()
    const router = useRouter()

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/auth/login?returnTo=/dashboard")
        }
    }, [isLoading, user, router])

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error.message}</div>
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Welcome, {user?.name}!</p>
        </div>
    )
}
