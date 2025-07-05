"use client"
import { Cart } from '@/components/ui/ui'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from './page.module.scss'

type CartItem = {
  product_id: string,
  qty: number
}

type User = {
  name: string
  email: string
  cart: CartItem[]
}

type ProductType = {
  id: string,
  title: string,
  image: string,
  price: number,
  prevPrice?: number,
  slug: string,
  category: string,
  isSale: boolean,
  isBestSelling: boolean,
  Description: string,
  view: number,
  stock: number
  qty: number
}

export default function CartPage() {
  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<ProductType[]>([])
  const [token, setToken] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token) {
      redirect('/auth/signUp');
    }
    setToken(token);

    fetch('/api/getUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
      .then(res => res.json())
      .then(data => {
        if(data.user) {
          setUser(data.user)
        }
      })
  }, [])

  useEffect(() => {
    if (!user?.cart) return;

    fetch('/api/getCart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cart: user.cart })
    })
      .then(res => res.json())
      .then(data => {
        if (data?.products) {
          const productsWithQty = data.products.map((product: ProductType) => {
          const cartItem = user.cart.find(item => item.product_id === product.id);
          return {
            ...product,
            qty: cartItem?.qty || 1
          };
        });
          setProducts(productsWithQty);
        }
      })
      .catch(err => {
        console.error('Failed to fetch cart products:', err);
      });
  }, [user?.cart]);
  useEffect(() => {
    const total = products.reduce((acc, product) => (acc + (product.prevPrice? product.prevPrice : product.price)) * product.qty, 0)
    const prevPriceTotal = products.reduce((acc, product) => (acc + product.price) * product.qty, 0)
    
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
                  {products.map((product, index) => (
                      <Cart
                        key={product.slug}
                        id={product.id ?? ''}
                        title={product.title}
                        price={product.price}
                        image={product.image}
                        token={token ?? ''}
                        description={product.Description}
                        prevPrice={product.prevPrice === null ? undefined : product.prevPrice}
                        delay={index * 100}
                        slug={product.title.replace(/\s+/g, "-").toLowerCase()}
                        category={product.category.replace("_", " ").toLowerCase()}
                        isSale={product.isSale}
                        isBestProducts={product.isBestSelling}
                        view={product.view}
                        stock={product.stock}
                        qty={product.qty}
                      />
                    ))}
              </aside>
              <p className='justify-self-end mr-7'>
                subtotal {`(${products.reduce((acc, product) => acc + product.qty, 0)} items)`}: {products.reduce((acc, product) => (acc + (!product.prevPrice ? product.price : product.prevPrice)) * product.qty, 0)}$ {discount >= 1 && <span className='text-red-600 font-bold'>-{Math.round(discount)}%</span>} 
              </p>
              {discount >= 1 && <p className='justify-self-end mt-0 mr-7'>
                discount: <span className='text-[#fb7701]'>-{products.reduce((acc, product) => (acc + (!product.prevPrice ? product.price : product.prevPrice)) * product.qty, 0) - products.reduce((acc, product) => (acc + product.price) * product.qty, 0)}$</span>
              </p>}
              {discount >= 1 && <h1 className='justify-self-end mr-7 font-bold text-1xl'>
                total: {products.reduce((acc, product) => (acc + product.price) * product.qty, 0)}$
              </h1>}
            </>
            }
      </main>
    </div>
  )
}
