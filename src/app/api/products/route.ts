import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.products.findMany({
      where: {
        isBestSelling: true
      },
      take: 5
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
