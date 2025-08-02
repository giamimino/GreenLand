"use server";

import prisma from "@/lib/prisma";
import cuid from "cuid";
import bcrypt from "bcrypt";
import backUpProducts from "@/data/json/backup.json"
import { sendVerificationCodeEmail } from "@/lib/sendVerificationCode";
import { sendContact } from "@/lib/sendContact";
import { redis } from "@/lib/redis";
import { cookies } from "next/headers";

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

    await prisma.product.create({
      data: {
        title,
        slug: title.replace(/\s+/g, "-").toLowerCase(),
        description: description,
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
  await prisma.product.delete({
    where: {
      id: formData.get("id") as string,
    }
  })
}

export async function addView(formData: FormData) {
  
  try {
    const id = formData.get("id") as string;

    await prisma.product.update({
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
      return { success: false, message: "All fields are required" };
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, message: "Email already in use" };
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true
      }
    });

    if(!user) {
      return {
        success: false,
        message: "SomeThing went wrong."
      }
    }
    const cookieStore = await cookies()
    cookieStore.set("sessionId", cuid(), {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 3
    })
    const sessionId = cookieStore.get("sessionId")
    const userSessionRedisKey = `session:${sessionId?.value}`
    await redis.set(userSessionRedisKey, user.id, { ex: 60 * 60 * 24 * 3 })

    return {
      success: true,
      message: "Successfully created user"
    };

  } catch (error) {
    console.error("sign up error:", error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }
}

export async function signIn(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true
      }
    })
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return {
        success: false,
        message: "Invalid email or password"
      }
    }

    const cookieStore = await cookies()
    cookieStore.set("sessionId", cuid(), {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 3
    })

    const sessionId = cookieStore.get("sessionId")
    const userSessionRedisKey = `session:${sessionId?.value}`
    await redis.set(userSessionRedisKey, user.id, { ex: 60 * 60 * 24 * 3 })

    return {
      success: true,
      message: "Successfully created user"
    }
  } catch(error) {
    console.error("sign in error:", error);
    return {
      success: false,
      message: "Something went wrong",
    };
  }

}

export async function editName(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const id = formData.get("id") as string

    await prisma.user.update({
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

    await prisma.user.update({
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

export async function sendVerification(formData: FormData) {
  try {
    const email = formData.get('email') as string
    if (!email) return {message: "Email is required"}

    const code = await sendVerificationCodeEmail(email)

    const existingCode = await prisma.emailVerificationCode.findFirst({
      where: { email },
    });

    if (existingCode) {
      return { success: false, message: "Code already sent" };
    }

    await prisma.emailVerificationCode.create({
      data: {
        email,
        code,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000)
      }
    })


    return {
      success: true,
    }
  } catch(error) {
    console.log(error);
    return {
      success: false,
      message: error
    }
  }
}

export async function checkVerifivation(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const code = formData.get('code') as string

    const emailverificationcode = await prisma.emailVerificationCode.findFirst({
      where: {email, code}
    })
    if (!emailverificationcode || !emailverificationcode.expiresAt) {
      return { success: false, message: "Verification code not found or expired." };
    }
    if (new Date(Date.now()) >= emailverificationcode.expiresAt) {
      return { success: false, message: "Verification code has expired." };
    }
    if (code === emailverificationcode.code) {
      await prisma.user.update({
        where: {email},
        data: {
          isVerified: true
        }
      })

      await prisma.emailVerificationCode.deleteMany({
        where: { email }
      })
    } else {
      return { success: false, message: "Verification code is incorect" }
    }

    return { success: true, message: "your veryfied successfully"}
  } catch(error) {
    console.log("verification check error:", error);
    return {
      success: false,
      message: "unknown error"
    }
  }
}

export async function editLocation(formData: FormData) {
  try {
    const location = formData.get("country") as string
    const state = formData.get("state") as string
    const city = formData.get("city") as string
    const address = formData.get("address") as string
    const postalCode = Number(formData.get("postalCode"))
    const token = formData.get("token") as string

    if(!location || !address || !postalCode || !state || !city) return {success: false, error: "Some fields are missing. Please fill in all required information."}

    await prisma.user.update({
      where: { token },
      data: {
        location,
        address,
        postalCode,
        state,
        city
      }
    })

    return { success: true }
  } catch(error) {
    console.log(error);
    return {
      success: false,
      error: "somthing went wrong"
    }
  }
}

export async function sendMessage(formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const name = formData.get('contactName') as string;
    const email = formData.get('contactEmail') as string;
    const topic = formData.get('contactTopic') as string;

    const job = formData.get('job')?.toString() || undefined;
    const reviewText = formData.get('reviewText')?.toString() || undefined;
    const page = formData.get('page')?.toString() || undefined;
    const bugDiscribe = formData.get('bugDiscribe')?.toString() || undefined;
    
    const order_number = formData.get('order_number') ? Number(formData.get('order_number')) : undefined;
    const date = formData.get('date')?.toString() || undefined;
    const paid = formData.get('paid') ? Number(formData.get('paid')) : undefined;

    const describe_cart = formData.get('describe_cart')?.toString() || undefined;
    const issue_description = formData.get('issue_description')?.toString() || undefined;
    const reason = formData.get('reason')?.toString() || undefined;
    const item_condition = formData.get('item_condition')?.toString() || undefined;
    const shipping_concern = formData.get('shipping_concern')?.toString() || undefined;
    const product_name = formData.get('product_name')?.toString() || undefined;
    const product_question = formData.get('product_question')?.toString() || undefined;
    const company_name = formData.get('company_name')?.toString() || undefined;
    const proposal = formData.get('proposal')?.toString() || undefined;

    await sendContact({
      id, name, email, topic,
      job, reviewText, page, bugDiscribe,
      order_number, date, paid, describe_cart,
      issue_description, reason, item_condition,
      shipping_concern, product_name, product_question,
      company_name, proposal,
    });

    return {success: true}
  } catch (error) {
    console.error("Failed to send contact:", error);
    return {
      success: false,
      error: "somthing went wrong"
    }
  }
}


export async function backupDatabase() {
  try {
    const result = await prisma.product.createMany({
      data: backUpProducts,
      skipDuplicates: true,
    });

    if(!result) {
      return {
        success: false
      }
    }

    return {
      success: true,
    }
  }  catch(error) {
    console.error("Verification error:", error);
    return {
      success: false,
      message: "Unknown error"
    };
  }
}
