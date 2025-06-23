"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function createProduct(formData: FormData) {
  try {
    const category = formData.get("category") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;
    const price = Number(formData.get("price"));
    const isSale = formData.get("isSale") === "on";

    const categoryArr = [
      "indoor_plants",
      "outdoor_plants",
      "succulents_cacti",
      "flowering_plants",
      "air_purifying_plants",
      "herbs_edibles",
      "bonsai",
    ];

    const errors: string[] = [];

    if (!categoryArr.includes(category.toLowerCase())) {
      errors.push("Invalid category.");
    }

    if (!title || !description || !image || price <= 0) {
      errors.push("Some fields are missing. Please fill in all required information.");
    }

    if (/[<>]/.test(title) || /[<>]/.test(description) || /[<>]/.test(image)) {
      errors.push("Some fields contain illegal characters.")
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    await prisma.products.create({
      data: {
        title,
        slug: title.replace(/\s+/g, "-").toLowerCase(),
        Description: description,
        image,
        price,
        category,
        isSale,
        isBestSelling: false,
        view: 0,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Create product failed:", error);
    return {
      success: false,
      errors: ["Something went wrong. Please try again."],
    };
  }
}
