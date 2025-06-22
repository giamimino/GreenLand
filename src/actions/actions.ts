"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function createProduct(formData: FormData) {
  await prisma.products.create({
    data: {
      Title: formData.get("title") as string,
      slug: (formData.get("title") as string)
        .replace(/\s+/g, "-")
        .toLowerCase(),
      Description: formData.get("description") as string,
      image: formData.get("image") as string,
      price: Number(formData.get("price")),
    },
  });
}