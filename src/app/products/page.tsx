import { Product } from '@/components/ui/ui'
import prisma from '@/lib/prisma'
import styes from "./page.module.scss"

export default async function page() {
  const products = await prisma.products.findMany()
  
  return (
    <div className={styes.products}>
      <main className={styes.inSaleWrapper}>
          {/* <InSaleSwiper products={inSaleProducts} /> */}
      </main>
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
