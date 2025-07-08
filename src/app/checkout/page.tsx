"use client"
import React, { useEffect, useState } from 'react'
import styles from './page.module.scss'
import { redirect, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Icon } from '@iconify/react/dist/iconify.js'

type CartType = {
  product_id: string,
  qty: number
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
  id: string,
  title: string,
  price: number,
  slug: string,
  prevPrice: number,
  qty: number
}

export default function CheckOut() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [message, setMessage] = useState("")
  const [products, setProducts] = useState<ProductType[]>([])
  
  useEffect(() => {
    const token = localStorage.getItem('token') || undefined;
    if(!token) {
      redirect('/')
    }

    fetch('/api/getUser', {
      method: 'POST',
      headers: {"content-type": "application/json"},
      body: JSON.stringify({ token })
    })
    .then(res => res.json())
    .then(data => {
      if(data.user) {
        setUser(data.user)
      }
    })
  }, [router])
  useEffect(() => {
    if(user) {
      if(user.isVerified === false) {
        setMessage("You have to verify email before checkout")
      }
      else if (user.cart.length === 0) {
        setMessage("Your cart is empty")
      }
      else if (user.address === "unknown" || user.location === "unknown" || isNaN(user.postalCode)) {
        setMessage("you have to share your location before checkout")
      }
      else {
        setMessage("")
      }
    }
  }, [user])
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

  const createOrder = async () => {
    const checkoutPrice = products.reduce((acc, product) => (acc + product.price) * product.qty, 0)
    const res = await fetch('/api/checkout', {
      method: 'POST',
      body: JSON.stringify({ amount: checkoutPrice }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    window.location.href = `https://www.sandbox.paypal.com/checkoutnow?token=${data.id}`;
  };

  return (
    <div className='p-24'>
      {message !== "" ? 
      <div className={styles.alert}>
        <div>
          <p>
            {message}
          </p>
          <Link href="/verification">
            Click here
          </Link>
        </div>
      </div>
      :
      <div className={styles.checkout}>
        <div>
          <h1 >checkout</h1>
          <div className={styles.checklist}>
            {products.map((product) => (
              <div key={product.slug}>
                <h3>
                  {product.title}: 
                </h3>
                <p>
                  {product.price}$ {`(${product.qty} items)`}
                </p>
              </div>
            ))}
          </div>
          <div className={styles.prices}>
            <h4><span>Total:</span> <span>{products.reduce((acc, product) => (acc + (product.prevPrice ? product.prevPrice : product.price)) * product.qty, 0)}$</span></h4>
            <h4><span>Discounts:</span> <span className='text-[#fb7701]'>-{products.reduce((acc, product) => (acc + (product.prevPrice ? product.prevPrice : product.price)) * product.qty, 0) - products.reduce((acc, product) => (acc + product.price) * product.qty, 0)}$</span></h4>
            <h4><span>subtotal:</span> <span>{products.reduce((acc, product) => (acc + product.price) * product.qty, 0)}$</span></h4>
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