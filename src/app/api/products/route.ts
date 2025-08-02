import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
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
        }
      })
    ]);

    return NextResponse.json({
      bestSellingProducts,
      totalProducts,
      maxViews: maxViewResult._max.view ?? 0,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}