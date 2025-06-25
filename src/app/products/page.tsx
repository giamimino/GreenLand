import prisma from '@/lib/prisma'
import styes from "./page.module.scss"
import ProductsPage from './Products'

export default async function page() {
  const products = await prisma.products.findMany()
  return (
    <ProductsPage 
      products={products}
    />
  )
}