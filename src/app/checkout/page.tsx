"use client"
import React, { useEffect, useState } from 'react'
import styles from './page.module.scss'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Icon } from '@iconify/react/dist/iconify.js'

type CartType = {
  title: string,
  price: number,
  slug: string,
  prevPrice: number,
}

type User = {
  id: string
  name: string
  email: string
  isVerified: boolean
  location: string
  address: string
  postalCode: number
  state: string
  city: string
  cart: CartType[]
}

type ProductType = {
  quantity: number,
  product: CartType
}

export default function CheckOut() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [message, setMessage] = useState("")
  const [products, setProducts] = useState<ProductType[]>([])
  
  useEffect(() => {
    fetch('/api/getUser')
    .then(res => res.json())
    .then(data => {
      if(data.user) {
        setUser(data.user)
      }
    })
  }, [router])
  useEffect(() => {
    if(user) {
      fetch("/api/cart/checkout/get").then(res => res.json())
      .then(data => {
        if(data.success) {
          setProducts(data.cart)
        } else {
          setMessage(data.message)
        }
      })
    }
  }, [user])


  const createOrder = async () => {
    const checkoutPrice = products.reduce((acc, p) => (acc + p.product.price) * p.quantity, 0)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ amount: checkoutPrice }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${data.id}`;
  };

  return (
    <div className={styles.app}>
      {message !== "" ? 
      <div className={styles.alert}>
        <div>
          <p>
            {message}  <Link href="/verification">
            Click here
          </Link>
          </p>
        </div>
      </div>
      :
      <div className={styles.checkout}>
        <div>
          <h1 >checkout</h1>
          <div className={styles.checklist}>
            {products.map((p) => (
              <div key={p.product.slug}>
                <h3>
                  {p.product.title}: 
                </h3>
                <p>
                  {p.product.price}$ {`(${p.quantity} items)`}
                </p>
              </div>
            ))}
          </div>
          <div className={styles.prices}>
            <h4><span>Total:</span> <span>{products.reduce((acc, p) => (acc + (p.product.prevPrice ? p.product.prevPrice : p.product.price)) * p.quantity, 0)}$</span></h4>
            <h4><span>Discounts:</span> <span className='text-[#fb7701]'>-{products.reduce((acc, p) => (acc + (p.product.prevPrice ? p.product.prevPrice : p.product.price)) * p.quantity, 0) - products.reduce((acc, p) => (acc + p.product.price) * p.quantity, 0)}$</span></h4>
            <h4><span>subtotal:</span> <span>{products.reduce((acc, p) => (acc + p.product.price) * p.quantity, 0)}$</span></h4>
          </div>
          <h1>Location</h1>
          <h2>Country: {user?.location}</h2>
          <h2>State: {user?.state}</h2>
          <h2>City: {user?.city}</h2>
          <h2>address: {user?.address}</h2>
          <h2>postalCode: {user?.postalCode}</h2>
          <p className='text-[#353535]'>shipping takes 10-15 days</p>
          <button onClick={createOrder}>Checkout <Icon icon="logos:paypal" /></button>
          <p className='text-blue-400 cursor-pointer mt-1.5' style={{
            textDecoration: "underline",
            alignSelf: "center"
          }}>Secure privacy</p>
        </div>
      </div>
      }
    </div>
  )
}