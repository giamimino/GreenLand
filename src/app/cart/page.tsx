"use client"
import { Cart } from '@/components/ui/ui'
import React, { useEffect, useState } from 'react'
import styles from './page.module.scss'
import Link from 'next/link'

type CartItem = {
  product_id: string,
  qty: number
}

type User = {
  name: string
  email: string
  cart: CartItem[]
}

type ProductProps = {
  id: string,
  title: string,
  image: string,
  price: number,
  prevPrice?: number,
  slug: string,
  category: string,
  isSale: boolean,
  isBestSelling: boolean,
  description: string,
  view: number,
  stock: number
}

type ProductType = {
  quantity: number
  product: ProductProps
}

export default function CartPage() {
  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<ProductType[]>([])
  const [discount, setDiscount] = useState<number>(0)

  useEffect(() => {
    fetch('/api/cart/get').then(res => res.json())
    .then(data => {
      if(data.success) {
        console.log(data.cart);
        setProducts(data.cart.cart)
        setUser(null)
      }
    })
  }, [])
  useEffect(() => {
    const total = products.reduce((acc, p) => (acc + (p.product.prevPrice? p.product.prevPrice : p.product.price)) * p.quantity, 0)
    const prevPriceTotal = products.reduce((acc, p) => (acc + p.product.price) * p.quantity, 0)
    
    setDiscount(((total - prevPriceTotal) / total) * 100)
  }, [products])

  return (
    <div className={styles.cart}>
      <main>
        <h1>Hello <span className='font-medium'>{user?.name}</span> its your cart</h1>
          {products.length === 0
            ? !user?<p>loading...</p> : <p>no products</p> :
            <>
              <p className='justify-self-end mr-7 mb-3'>price</p>
              <aside className={styles.products}>
                  {products.map((p, index) => (
                      <Cart
                        key={p.product.slug}
                        id={p.product.id ?? ''}
                        title={p.product.title}
                        price={p.product.price}
                        image={p.product.image}
                        description={p.product.description}
                        prevPrice={p.product.prevPrice === null ? undefined : p.product.prevPrice}
                        delay={index * 100}
                        slug={p.product.title.replace(/\s+/g, "-").toLowerCase()}
                        category={p.product.category.replace("_", " ").toLowerCase()}
                        isSale={p.product.isSale}
                        isBestProducts={p.product.isBestSelling}
                        view={p.product.view}
                        stock={p.product.stock}
                        qty={p.quantity}
                      />
                    ))}
              </aside>
              <p className='justify-self-end mr-7'>
                subtotal {`(${products.reduce((acc, p) => acc + p.quantity, 0)} items)`}: {products.reduce((acc, p) => (acc + (!p.product.prevPrice ? p.product.price : p.product.prevPrice)) * p.quantity, 0)}$ {discount >= 1 && <span className='text-red-600 font-bold'>-{Math.round(discount)}%</span>} 
              </p>
              {discount >= 1 && <p className='justify-self-end mt-0 mr-7'>
                discount: <span className='text-[#fb7701]'>-{products.reduce((acc, p) => (acc + (!p.product.prevPrice ? p.product.price : p.product.prevPrice)) * p.quantity, 0) - products.reduce((acc, p) => (acc + p.product.price) * p.quantity, 0)}$</span>
              </p>}
              {discount >= 1 && <h1 className='justify-self-end mr-7 font-bold text-1xl'>
                total: {products.reduce((acc, p) => (acc + p.product.price) * p.quantity, 0)}$
              </h1>}
              <div className='justify-self-end'>
                <Link href={`/checkout`}>
                  <button type='button' className={styles.chechout}>Proceed to checkout</button>
                </Link>
              </div>
            </>
            }
      </main>
    </div>
  )
}
