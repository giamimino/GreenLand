import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function errorResponse(message: string) {
  return NextResponse.json({
    success: false,
    message
  })
}

export async function GET() {
  try {
    const sessionId = (await cookies()).get("sessionId")?.value
    if (!sessionId) return errorResponse("Not authenticated.")
    const cartCacheKey = `cart:${sessionId}`;
    const cachedCart = await redis.get(cartCacheKey);
    if (cachedCart) {
      return NextResponse.json({
        success: true,
        cart: cachedCart,
      });
    }

    const sessionRedisKey = `session:${sessionId}`
    const userId = await redis.get(sessionRedisKey) as string
    if (!userId) return errorResponse("Not authenticated.")



    const cart = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        cart: {
          select: {
            id: true,
            quantity: true,
            product: {
              select: {
                id: true,
                title: true,
                image: true,
                stock: true,
                isBestSelling: true,
                isSale: true,
                description: true,
                price: true,
                prevPrice: true,
                slug: true,
                category: true,
                view: true
              }
            }
          }
        }
      }
    });

    await redis.set(cartCacheKey, cart?.cart, { ex: 1800 });

    return NextResponse.json({
      success: true,
      cart: cart?.cart
    });

  } catch (err) {
    console.log("cart get error", err);
    return errorResponse("Something went wrong.");
  }
}