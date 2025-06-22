import { Product } from '@/components/ui/ui'
import prisma from '@/lib/prisma'
import React from 'react'
import styes from "./page.module.scss"

export default async function page() {
  const products = await prisma.products.findMany()
  
  return (
    <div className={styes.products}>
      {products.map((product, index) => (
        <Product
          key={product.slug}
          title={product.Title}
          price={product.price}
          image={product.image}
          delay={index * 100}
        />
      ))}
    </div>
  )
}
