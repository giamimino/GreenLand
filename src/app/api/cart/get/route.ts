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

type ProductProps = {
  id: string,
  title: string,
  image: string,
  price: number,
  prevPrice?: number | null,
  slug: string,
  category: string,
  isSale: boolean,
  isBestSelling: boolean,
  description: string,
  view: number,
  stock: number
}

type ProductType = {
  quantity: number
  product: ProductProps
  id: string
}

let cache: ProductType[] = [];
let lastFetched = 0;
const CACHE_DURATION = 30 * 60 * 1000;

export async function GET() {
  const now = Date.now();
  
    if (cache && now - lastFetched < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        cart: cache,
      });
    }
  try {
    const sessionId = (await cookies()).get("sessionId")?.value
    const sessionRedisKey = `session:${sessionId}`
    const userId = await redis.get(sessionRedisKey) as string
    if(!userId) return errorResponse("Not authenticated.")
    
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
    })

    if(!cart) return errorResponse("no any product in your cart list")
    cache = cart.cart || [];
    lastFetched = now;

    return NextResponse.json({
      success: true,
      cart
    })
  }catch(err) {
    console.log("cart get error", err);
    return errorResponse("Something went wrong.")
  }
}