"use client"
import { Cart } from '@/components/ui/ui'
import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type User = {
  name: string
  email: string
  cart: string[]
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
}

export default function cart() {
  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<ProductType[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token) {
      redirect('/auth/signUp');
    }

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
          setProducts(data.products);
        }
      })
      .catch(err => {
        console.error('Failed to fetch cart products:', err);
      });
  }, [user?.cart]);


  

  return (
    <div className='p-24'>
      <main>
        <h1>Hello <span className='font-medium'>{user?.name}</span> its your cart</h1>
        <aside className='flex'>
          {products.map((product, index) => (
            <Cart
              key={product.slug}
              id={product.id ?? ''}
              title={product.title}
              price={product.price}
              image={product.image}
              delay={index * 100}
              slug={product.title.replace(/\s+/g, "-").toLowerCase()}
            />
          ))}
        </aside>
      </main>
    </div>
  )
}
