export const dynamic = 'force-dynamic';

import prisma from '@/lib/prisma'
import ProductsPage from './Products'

export default async function Products() {
  const products = await prisma.products.findMany()
  return (
    <ProductsPage 
      products={products.map(product => ({
        ...product,
        prevPrice: product.prevPrice === null ? undefined : product.prevPrice,
      }))}
    />
  )
}