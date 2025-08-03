import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type CacheType = {
  totalProducts: number;
  maxViewResult: { _max: { view: number | null } };
  bestSellingProducts: Array<{
    image: string;
    view: number;
    title: string;
    slug: string;
    price: number;
    prevPrice: number | null;
    isBestSelling: boolean;
  }>;
};

let cache: CacheType | null = null;
let lastFetched = 0;
const CACHE_DURATION = 30 * 60 * 1000;

export async function GET() {
  try {
    const now = Date.now();

    if (cache && now - lastFetched < CACHE_DURATION) {
      return NextResponse.json({
        success: true,
        totalProducts: cache.totalProducts,
        maxViews: cache.maxViewResult._max.view ?? 0,
        bestSellingProducts: cache.bestSellingProducts,
        cached: true,
      });
    }

    const [totalProducts, maxViewResult, bestSellingProducts] = await Promise.all([
      prisma.product.count(),
      prisma.product.aggregate({ _max: { view: true } }),
      prisma.product.findMany({
        where: { isBestSelling: true },
        take: 5,
        select: {
          image: true,
          view: true,
          title: true,
          slug: true,
          price: true,
          prevPrice: true,
          isBestSelling: true,
        },
      }),
    ]);

    cache = {
      totalProducts,
      maxViewResult,
      bestSellingProducts,
    };
    lastFetched = now;

    return NextResponse.json({
      success: true,
      totalProducts,
      maxViews: maxViewResult._max.view ?? 0,
      bestSellingProducts,
      cached: false,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}