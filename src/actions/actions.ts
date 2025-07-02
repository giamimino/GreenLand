"use server";

import prisma from "@/lib/prisma";
import cuid from "cuid";

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

    // Check if email already exists
    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "Email already in use" };
    }

    const user = await prisma.users.create({
      data: {
        name,
        email,
        password,
        cart: [],
      },
    });

    await prisma.sessionToken.create({
      data: {
        userId: user.id,
        token: user.token,
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

    const user = await prisma.users.findFirst({
      where: {
        email,
        password
      }
    })
    
    if (!user) {
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

export async function addCart(formData: FormData) {
  try {
    const productId = formData.get('id') as string
    const token = formData.get('token') as string

    const user = await prisma.users.findUnique({
      where: { token: token },
      select: { cart: true }
    });

    const currentCart = Array.isArray(user?.cart) ? user.cart : [];

    await prisma.users.update({
      where: {
        token: token
      },
      data: {
        cart: [...currentCart, productId].filter((id) => id !== null)
      }
    })

    return { success: true }
  } catch(error) {
    console.log("error cant add product", error);
    return {
      success: false
    }
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
  await prisma.products.createMany({
    data: [
      {
        id: 'cmcapqdcv0001j7kb32kuqk7h',
        image: 'snake-plant',
        title: 'Snake Plant',
        Description: 'Hardy, low-light tolerant plant with upright sword-like leaves.',
        price: 15,
        slug: 'snake-plant',
        isSale: false,
        isBestSelling: false,
        category: 'indoor_plants',
        createAt: new Date(1750780880671),
        view: 0,
        prevPrice: null,
        stock: 12,
      },
      {
        id: 'cmcaqaz350002j7kbe50e07pc',
        image: 'zz-plant',
        title: 'ZZ Plant',
        Description: 'Glossy leaves, very drought-tolerant, perfect for beginners.',
        price: 18,
        slug: 'zz-plant',
        isSale: false,
        isBestSelling: false,
        category: 'indoor_plants',
        createAt: new Date(1750781841954),
        view: 0,
        prevPrice: null,
        stock: 12,
      },
      {
        id: 'cmcaqbhtf0003j7kb5yqsvi1y',
        image: 'peace-lily',
        title: 'Peace Lily',
        Description: 'Lush leaves with white blooms, purifies air, needs indirect light.',
        price: 20,
        slug: 'peace-lily',
        isSale: false,
        isBestSelling: false,
        category: 'indoor_plants',
        createAt: new Date(1750781866227),
        view: 1,
        prevPrice: null,
        stock: 12,
      },
      {
        id: 'cmcaqbyx50004j7kbutazgwdq',
        image: 'pothos',
        title: 'Pothos',
        Description: 'Fast-growing vine, trailing or hanging, adaptable to many conditions.',
        price: 12,
        slug: 'pothos',
        isSale: true,
        isBestSelling: false,
        category: 'indoor_plants',
        createAt: new Date(1750781888393),
        view: 1,
        prevPrice: null,
        stock: 12,
      },
      {
        id: 'cmcaqci5p0005j7kb05qvwo12',
        image: 'spider-plant',
        title: 'Spider Plant',
        Description: 'Produces baby "spiderettes", good air purifier, easy to grow',
        price: 10,
        slug: 'spider-plant',
        isSale: false,
        isBestSelling: false,
        category: 'indoor_plants',
        createAt: new Date(1750781913325),
        view: 1,
        prevPrice: null,
        stock: 12,
      },
      {
        id: 'cmcaqcvkg0008j7kbmt19lj8z',
        image: 'rubber-plant',
        title: 'Rubber Plant',
        Description: 'Bold foliage, prefers bright indirect light, fast-growing.',
        price: 22,
        slug: 'rubber-plant',
        isSale: true,
        isBestSelling: false,
        category: 'indoor_plants',
        createAt: new Date(1750781930704),
        view: 3,
        prevPrice: 24,
        stock: 12,
      },
      {
        id: 'cmcaqd6fj0009j7kb9fqv61ju',
        image: 'chinese-evergreen',
        title: 'Chinese Evergreen',
        Description: 'Colorful foliage, very tolerant of low light and humidity.',
        price: 14,
        slug: 'chinese-evergreen',
        isSale: false,
        isBestSelling: false,
        category: 'indoor_plants',
        createAt: new Date(1750781944783),
        view: 1,
        prevPrice: null,
        stock: 12,
      },
      {
        id: 'cmcaqdghv000aj7kbesmuetxr',
        image: 'parlor-palm',
        title: 'Parlor Palm',
        Description: 'Elegant feathery fronds, thrives in low-light indoor spaces.',
        price: 16,
        slug: 'parlor-palm',
        isSale: false,
        isBestSelling: false,
        category: 'indoor_plants',
        createAt: new Date(1750781957827),
        view: 0,
        prevPrice: null,
        stock: 12,
      },
      {
        id: 'cmcaqduxw000bj7kbzr3y5ie2',
        image: 'dieffenbachia',
        title: 'Dieffenbachia',
        Description: 'Broad variegated leaves, needs medium light, fast-growing.',
        price: 13,
        slug: 'dieffenbachia',
        isSale: false,
        isBestSelling: false,
        category: 'indoor_plants',
        createAt: new Date(1750781976548),
        view: 0,
        prevPrice: null,
        stock: 12,
      },
      {
        id: 'cmcaqe65e000cj7kb2vjnelo2',
        image: 'calathea',
        title: 'Calathea',
        Description: 'Striking patterned leaves, thrives in humidity, perfect for indoors.',
        price: 18,
        slug: 'calathea',
        isSale: false,
        isBestSelling: false,
        category: 'indoor_plants',
        createAt: new Date(1750781991074),
        view: 0,
        prevPrice: null,
        stock: 12,
      },
      {
        id: 'cmcdgv3s00001j7s03b1t2vph',
        image: 'lavender',
        title: 'Lavender',
        Description: 'Fragrant purple blooms, attracts bees, loves full sun.',
        price: 8,
        slug: 'lavender',
        isSale: true,
        isBestSelling: false,
        category: 'outdoor_plants',
        createAt: new Date(1750947383521),
        view: 3,
        prevPrice: 10,
        stock: 12,
      },
      {
        id: 'cmcdgvne10002j7s0cxnv8g0u',
        image: 'rosemary',
        title: 'Rosemary',
        Description: 'Edible herb, aromatic foliage, drought-tolerant.',
        price: 7,
        slug: 'rosemary',
        isSale: false,
        isBestSelling: false,
        category: 'outdoor_plants',
        createAt: new Date(1750947408938),
        view: 1,
        prevPrice: null,
        stock: 12,
      },
      {
        id: 'cmcdgw6dt0004j7s0av60u6r5',
        image: 'marigold',
        title: 'Marigold',
        Description: 'Bright orange or yellow flowers, repels pests, good for gardens.',
        price: 8,
        slug: 'marigold',
        isSale: false,
        isBestSelling: false,
        category: 'outdoor_plants',
        createAt: new Date(1750947433554),
        view: 0,
        prevPrice: null,
        stock: 12,
      },
      {
        id: 'cmcdgwiu70005j7s0jnwk7nhd',
        image: 'bougainvillea',
        title: 'Bougainvillea',
        Description: 'Vining plant with papery blooms, needs full sunlight.',
        price: 15,
        slug: 'bougainvillea',
        isSale: false,
        isBestSelling: false,
        category: 'outdoor_plants',
        createAt: new Date(1750947449695),
        view: 0,
        prevPrice: null,
        stock: 12,
      },
      {
        id: 'cmcdgwxyt0006j7s0sp7v3i1z',
        image: 'hibiscus',
        title: 'Hibiscus',
        Description: 'Large vibrant flowers, tropical feel, attracts hummingbirds.',
        price: 18,
        slug: 'hibiscus',
        isSale: true,
        isBestSelling: false,
        category: 'outdoor_plants',
        createAt: new Date(1750947469301),
        view: 14,
        prevPrice: 19,
        stock: 12,
      },
      {
        id: 'cmcdgxi9p0007j7s0kmu1yos3',
        image: 'geranium',
        title: 'Geranium',
        Description: 'Colorful blooms, heat-tolerant, popular balcony plant.',
        price: 12,
        slug: 'geranium',
        isSale: true,
        isBestSelling: false,
        category: 'outdoor_plants',
        createAt: new Date(1750947495613),
        view: 0,
        prevPrice: 10,
        stock: 12,
      },
      {
        id: 'cmcdgxtsc0008j7s0gdj6hagt',
        image: 'boxwood',
        title: 'Boxwood',
        Description: 'Evergreen shrub, great for shaping and hedges.',
        price: 18,
        slug: 'boxwood',
        isSale: true,
        isBestSelling: false,
        category: 'outdoor_plants',
        createAt: new Date(1750947510540),
        view: 0,
        prevPrice: 20,
        stock: 12,
      },
      {
        id: 'cmcdgy6gx0009j7s0old5wonu',
        image: 'petunia',
        title: 'Petunia',
        Description: 'Seasonal flowering plant with trailing growth, vibrant colors.',
        price: 8,
        slug: 'petunia',
        isSale: false,
        isBestSelling: false,
        category: 'outdoor_plants',
        createAt: new Date(1750947526977),
        view: 0,
        prevPrice: null,
        stock: 12,
      },
      {
        id: 'cmcdgyosi000aj7s00fpf9h89',
        image: 'gardenia',
        title: 'Gardenia',
        Description: 'White aromatic flowers, glossy green leaves, partial sun.',
        price: 17,
        slug: 'gardenia',
        isSale: false,
        isBestSelling: false,
        category: 'outdoor_plants',
        createAt: new Date(1750947550723),
        view: 0,
        prevPrice: null,
        stock: 12,
      },
      {
        id: 'cmcdgz0rg000bj7s0n0y9dq4h',
        image: 'oleander',
        title: 'Oleander',
        Description: 'Tough flowering shrub, thrives in dry climates.',
        price: 14,
        slug: 'oleander',
        isSale: false,
        isBestSelling: false,
        category: 'outdoor_plants',
        createAt: new Date(1750947566236),
        view: 0,
        prevPrice: null,
        stock: 12,
      },
    ],
    skipDuplicates: true,
  });
}