import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { cart } = await req.json();

  if (!cart || !Array.isArray(cart)) {
    return NextResponse.json({ error: 'Cart must be an array of product IDs' }, { status: 400 });
  }

  const products = await prisma.products.findMany({
    where: {
      id: {
        in: cart,
      },
    },
  });

  return NextResponse.json({ products });
}
