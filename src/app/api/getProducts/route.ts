import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { redis } from "@/lib/redis"; // optional caching

export async function GET() {
  try {
    const cacheKey = "products:all";
    const cached = await redis.get(cacheKey);

    if (cached) {
      return NextResponse.json({
        success: true,
        products: cached,
      });
    }

    const start = Date.now();

    const products = await prisma.product.findMany({
      select: {
        slug: true,
        title: true,
        image: true,
        price: true,
        prevPrice: true,
        category: true,
        createdAt: true,
        isSale: true,
        view: true,
      },
      take: 50,
    });

    const duration = Date.now() - start;
    console.log("DB fetch duration:", duration, "ms");

    await redis.set(cacheKey, products, {ex: 60 * 5});

    return NextResponse.json({
      success: true,
      duration,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ success: false, error }, { status: 500 });
  }
}
