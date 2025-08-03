import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { redis } from '@/lib/redis';
import { cookies } from 'next/headers';

function errorResponse(message: string) {
  return NextResponse.json({
    success: false,
    message
  })
}

export async function POST(req: Request) {
  try {
    const { productId, qty } = await req.json();

    const sessionId = (await cookies()).get('sessionId')?.value;
    if (!sessionId) {
      return errorResponse("Not authenticated.")
    }

    const userId = await redis.get(`session:${sessionId}`) as string;
    if (!userId) {
      return errorResponse("You must sign up before you can add products to your cart.")
    }

    if (!productId || !qty || qty <= 0) {
      return errorResponse("Invalid product or quantity")
    }

    await prisma.cartItem.create({
      data: { productId, userId, quantity: qty }
    });

    return NextResponse.json({ success: true, message: 'Successfully added product to your cart.' });
  } catch (error) {
    console.error(error);
    return errorResponse("Something went")
  }
}
