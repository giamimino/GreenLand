import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { cart } = await req.json();
  const productIds = cart.map((item: {product_id: string; qty: number}) => item.product_id)


  const products = await prisma.products.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  return NextResponse.json({ products });
}
