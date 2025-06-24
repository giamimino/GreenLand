import { Product } from '@/components/ui/ui'
import prisma from '@/lib/prisma'
import styes from "./page.module.scss"

export default async function page() {
  const products = await prisma.products.findMany()
  const inSaleProducts = await prisma.products.findMany({
    where: {
      isSale: true,
    }
  })

  return (
    <div className={styes.products}>
      {inSaleProducts.length >= 1 &&
      <main className={styes.inSaleWrapper}>
          <h1>InSale</h1>
          <div>
            {inSaleProducts.map((product, index) => (
              <Product
                key={product.slug}
                title={product.title}
                price={product.price}
                image={product.image}
                prevPrice={product.prevPrice ?? undefined}
                delay={index * 100}
              />
            ))}
          </div>
      </main>
      }
      <hr />
      <main>
        {products.map((product, index) => (
          !product.isSale &&
            <Product
              key={product.slug}
              title={product.title}
              price={product.price}
              image={product.image}
              delay={index * 100}
            />
        ))}
      </main>
    </div>
  )
}
