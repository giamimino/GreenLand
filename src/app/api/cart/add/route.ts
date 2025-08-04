import prisma from "@/lib/prisma"
import { redis } from "@/lib/redis"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

function errorResponse(message: string) {
  return NextResponse.json({
    success: false,
    message
  })
}

export async function POST(req: Request) {
  try {
    const { productId, qty } = await req.json() as { productId: string, qty: number}
    const sessionId = (await cookies()).get("sessionId")?.value
    const sessionRedisKey = `session:${sessionId}`
    const userId = await redis.get(sessionRedisKey) as string

    if(!userId) {
      (await cookies()).delete("sessionId")
      return errorResponse("user can't be found.")
    }

    const cart = await prisma.cartItem.create({
      data: {
        productId,
        userId,
        quantity: qty
      }
    })

    if(!cart) {
      return errorResponse("Failed to add product to your cart")
    }

    return NextResponse.json({
      success: true,
      message: "Successfully added product to cart"
    })

  }catch(err) {
    console.log(err);
    return errorResponse("Something went wrong")
  }
}