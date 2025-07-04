"use server";

import prisma from "@/lib/prisma";
import cuid from "cuid";
import bcrypt from "bcrypt";
import backUpProducts from "@/data/json/backup.json"

export async function createProduct(formData: FormData) {
  try {
    const category = formData.get("category") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const price = Number(formData.get("price"));
    const isSale = formData.get("isSale") === "on";
    const prevPrice = isSale? Number(formData.get("prevPrice")) : null
    const stock = Number(formData.get("stock"));

    const categoryArr = [
      "indoor_plants",
      "outdoor_plants",
      "succulents_cacti",
      "air_purifying_plants",
      "flowering_plants",
      "pet-friendly_plants",
      "herbs",
      "hanging_plants",
      "rare_exotic_plants",
      "low_maintenance_plants",
    ];

    const errors: string[] = [];

    if (!categoryArr.includes(category.toLowerCase())) {
      errors.push("Invalid category.");
    }

    if (!title || !description || price <= 0 || stock <= 0) {
      errors.push("Some fields are missing. Please fill in all required information.");
    }

    if (/[<>]/.test(title) || /[<>]/.test(description)) {
      errors.push("title or description contain illegal characters.")
    }

    if (errors.length > 0) {
      return { success: false, errors };
    }

    await prisma.products.create({
      data: {
        title,
        slug: title.replace(/\s+/g, "-").toLowerCase(),
        Description: description,
        image: title.replace(/\s+/g, "-").toLowerCase(),
        price,
        category,
        isSale,
        isBestSelling: false,
        view: 0,
        prevPrice,
        stock,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Create product failed:", error);
    return {
      success: false,
      errors: ["Something went wrong. Please try again."],
    };
  }
}

export async function deleteProduct(formData: FormData) {
  await prisma.products.delete({
    where: {
      id: formData.get("id") as string,
    }
  })
}

export async function addView(formData: FormData) {
  
  try {
    const id = formData.get("id") as string;

    await prisma.products.update({
      where: { id },
      data: {
        view: {
          increment: 1,
        },
      },
    });

    return {success: true}
  } catch (error) {
    const id = formData.get("id") as string;
    console.log("enter to product failed:", error);
    return {
      success: false,
      errors: ["Something went wrong. Please try again."],
      id: id
    };
  }

}

export async function signUp(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
      return { success: false, error: "All fields are required" };
    }

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        cart: [],
      },
    });

    return {
      success: true,
      token: user.token,
    };

  } catch (error) {
    console.error("sign up error:", error);
    return {
      success: false,
      error: "Something went wrong",
    };
  }
}

export async function signIn(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const user = await prisma.users.findUnique({
      where: { email }
    })
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return {
        success: false,
        error: "Invalid email or password"
      }
    }

    return {
      success: true,
      token: user.token
    }
  } catch(error) {
    console.error("sign in error:", error);
    return {
      success: false,
      error: "Something went wrong",
    };
  }

}

type CartItem = {
  product_id: string;
  qty: number;
}

export async function addCart(formData: FormData) {
  try {
    const productId = formData.get('id') as string;
    const product_qty = Number(formData.get("qty")) || 1;
    const token = formData.get('token') as string;

    if (!productId || !token) {
      throw new Error("Missing productId or token");
    }

    const user = await prisma.users.findUnique({
      where: { token },
      select: { cart: true }
    });

    let currentCart = Array.isArray(user?.cart) ? (user.cart as CartItem[]) : [];

    const existingIndex = currentCart.findIndex(item => item.product_id === productId);

    if (existingIndex >= 0) {
      currentCart[existingIndex].qty += product_qty;
    } else {
      currentCart.push({ product_id: productId, qty: product_qty });
    }

    await prisma.users.update({
      where: { token },
      data: { cart: currentCart }
    });

    return { success: true };
  } catch(error) {
    console.log("error cant add product", error);
    return { success: false };
  }
}


export async function LogOut(formData: FormData) {
  try {
    const id = formData.get("id") as string

    await prisma.users.update({
      where: {id},
      data: {
        token: cuid()
      }
    })

    return {success: true}
  } catch(err) {
    console.log("error cant logout:", err);
    return {
      success: false
    }
  }
}

export async function deleteCart(formData: FormData) {
  const product_id = formData.get("id") as string;
  const token = formData.get("token") as string;
  try {

    if (!product_id || !token) {
      return { success: false, error: "Missing id or token" };
    }

    const user = await prisma.users.findUnique({
      where: { token },
      select: { cart: true }
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const currentCart: string[] = Array.isArray(user?.cart)
      ? (user.cart as unknown[]).filter((id): id is string => typeof id === "string")
      : [];

    const updatedCart = currentCart.filter(id => id !== product_id);

    await prisma.users.update({
      where: { token },
      data: { cart: updatedCart }
    });

    return { success: true };
  } catch (error) {
    console.error("Something went wrong deleting from cart:", error);
    return { success: false, error, resurces: [product_id, token] };
  }
}

export async function editName(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const id = formData.get("id") as string

    await prisma.users.update({
      where: { id },
      data: {
        name
      }
    })

    return {success: true}
  } catch (err) {
    console.log("somthing went wrong edit name:", err);
    return {
      success: false
    }
  }
}

export async function editEmail(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const id = formData.get("id") as string

    await prisma.users.update({
      where: { id },
      data: {
        email
      }
    })

    return {success: true}
  } catch (err) {
    console.log("somthing went wrong edit email:", err);
    return {
      success: false
    }
  }
}

export async function backupDatabase() {
  try {
    const result = await prisma.products.createMany({
      data: backUpProducts,
      skipDuplicates: true,
    });

    console.log(`✅ Backup done: ${result.count} products inserted.`);
  } catch (error) {
    console.error("❌ Backup failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}
