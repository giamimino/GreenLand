import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redis } from '@/lib/redis'

function errorResponse(message: string) {
  return NextResponse.json({ success: false, message }, { status: 401 })
}

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get("sessionId")?.value

    if (!sessionId) {
      return errorResponse("No session ID found.")
    }

    const cachedUserKey = `cachedUser:${sessionId}`
    const cachedUser = await redis.get(cachedUserKey)
    if(cachedUser) {
      return NextResponse.json({
        success: true,
        user: cachedUser
      })
    }

    const sessionKey = `session:${sessionId}`
    const userId = await redis.get(sessionKey)

    if (!userId || typeof userId !== "string") {
      cookieStore.delete("sessionId")
      return errorResponse("Session expired or invalid.")
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        location: true,
        state: true,
        isVerified: true,
        city: true,
        address: true,
        role: true
      }
    })

    if (!user) {
      return errorResponse("User not found.")
    }

    await redis.set(cachedUserKey, user, { ex: 1800 })

    return NextResponse.json({
      success: true,
      user,
    })

  } catch (err) {
    console.error("Error:", err)
    return errorResponse("Internal server error.")
  }
}
