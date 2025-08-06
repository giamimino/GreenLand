import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type ProductsType = {
  slug: string
  title: string
  image: string
  price: number
  prevPrice: number | null
  category: string
  createdAt: Date
  isSale: boolean
  view: number
}

let cache: ProductsType[] = [];
let lastFetched = 0;
const CACHE_DURATION = 30 * 60 * 1000;

export async function GET() {
  const now = Date.now();

  if (cache && now - lastFetched < CACHE_DURATION) {
    return NextResponse.json({
      success: true,
      products: cache,
      cached: true,
    });
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
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
    });

    cache = products || [];
    lastFetched = now;

    return NextResponse.json({
      success: true,
      products,
      cached: false,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}
