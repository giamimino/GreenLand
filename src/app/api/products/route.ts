import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const allProducts = await prisma.products.findMany();

    const totalProducts = allProducts.length;

    const maxViews = allProducts.reduce(
      (acc, product) => (product.view > acc ? product.view : acc),
      0
    );

    const bestSellingProducts = await prisma.products.findMany({
      where: {
        isBestSelling: true,
      },
      take: 5,
    });

    return NextResponse.json({
      bestSellingProducts,
      totalProducts,
      maxViews,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
