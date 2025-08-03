"use client"
import React, { useState } from 'react'
import styles from './page.module.scss'
import Image from 'next/image';
import { redirect } from 'next/navigation';

type ProductType = {
  id?: string,
  title: string,
  image: string,
  price: number,
  prevPrice?: number,
  category: string,
  isSale: boolean,
  isBestSelling: boolean,
  description: string,
  view: number,
  stock: number,
}

export default function ClientComponent({ product }: { product: ProductType }) {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [qty, setQty] = useState(1)

  async function handleAddCartItem() {
    fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, qty })
    }).then(res => res.json())
    .then(data => {
      if(data.success) {
        setSuccess(data.message)
        setError("")
        redirect("/cart")
      } else {
        if(!data.success) {
          setError(data.message)
          setSuccess("")
        }
      }
    })
  }

  return (
    <div className={styles.product}>
      <main>
        <Image
          src={`https://raw.githubusercontent.com/giamimino/images/refs/heads/main/greenland/products/${product?.image}.webp`}
          alt={product?.image ?? 'Product image'}
          width={299}
          height={363}
        />
        <div>
          <h1>{product?.title}</h1>
          <div>
            <div style={{
                "--hint": '"category"',
              } as React.CSSProperties}>
              {product?.category.replace("_", " ")}
            </div>
            <div style={{
                "--hint": '"stock"',
              } as React.CSSProperties}>
              {product?.stock}
            </div>
            {product?.isSale &&
            <div>
              {product?.isSale ? "Sale" : ''}
            </div>
            }
            {product?.isBestSelling &&
            <div>
              {product?.isBestSelling ? "BestSelling" : ''}
            </div>
            }
            <div style={{
                "--hint": '"views"',
              } as React.CSSProperties}>
              {product?.view}
            </div>
          </div>
          <p>{product?.description}</p>
          <h2>{product?.prevPrice && <span>{product.prevPrice ? `${product.prevPrice}$`  : ''}</span>} {product?.price}$</h2>
          <div className='mt-auto flex flex-col w-[fit-content]'>
            <div className={styles.addCart}>
              <button onClick={() => setQty(prev => prev < 2 ? prev : prev - 1)}>-</button>
              <button onClick={() => setQty(prev => prev > (product?.stock - 1) ? prev : prev + 1)}>+</button>
              <input type='number' min={1} max={product?.stock} value={qty} onChange={(e) => setQty(Number(e.target.value))}/>
            </div>
            <aside className='flex gap-[12px]'>
              <button type='button' onClick={() => redirect('/products')}>Back</button>
              <button type='submit' onClick={handleAddCartItem}>Add to Cart</button>
            </aside>
          </div>
            {error && <p className='text-[#ff6347]'>{error}</p>}
            {success && <p className='text-[#00bd00]'>{success}</p>}
        </div>
      </main>
    </div>
  )
}
