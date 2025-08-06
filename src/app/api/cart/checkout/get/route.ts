import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function errorResponse(message: string) {
  return NextResponse.json({
    succes: false,
    message
  })
}

export async function POST(req: Request) {
  try {
    const { userId } = await req.json()
    const sessionId = (await cookies()).get("sessionId")?.value
    const cartCacheKey = `cart:${sessionId}`
    const cachedCart = await redis.get(cartCacheKey)
    if(cachedCart) {
      return NextResponse.json({
        success: true,
        cart: cachedCart
      })
    }
    if(!userId) {
      return errorResponse("Not authenticated.")
    }
    const cart = await prisma.cartItem.findMany({
      where: { userId },
      select: {
        quantity: true,
        product: {
          select: {
            slug: true,
            title: true,
            price: true,
            prevPrice: true,
          }
        }
      }
    })
    if(!cart) {
      errorResponse("User's cart is empty")
    }
    return NextResponse.json({
      success: true,
      cart
    })
  }catch(err) {
    console.log("error get carts", err);
    return errorResponse("Something went wrong.")
  }
}