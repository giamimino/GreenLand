import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  const { token } = await req.json()
  if (!token) {
    return NextResponse.json({ error: 'Token is required' }, { status: 400 })
  }

  const user = await prisma.users.findFirst({
    where: { token }
  })

  return NextResponse.json({ user })
}
