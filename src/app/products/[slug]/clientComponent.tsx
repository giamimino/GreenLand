"use client"
import React, { useEffect, useState } from 'react'
import styles from './page.module.scss'
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { addCart } from '@/actions/actions';

type ProductType = {
  id?: string,
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
  stock: number,
}

export default function ClientComponent({ product }: { product: ProductType }) {
  const [token, setToken] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if(storedToken) {
      setToken(storedToken ?? "")
    }
  }, [])
  

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if(token !== "") {
      const formData = new FormData(e.currentTarget)
      const result = await addCart(formData)

      if(!result.success) {
        setError("somthing went wrong")
      } else {
        if(result.success) {
          setSuccess("successfuly added product to your cart")
        }
      }
    } else {
      setError("you have to login before add to cart")
    }
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
          <p>{product?.Description}</p>
          <h2>{product?.prevPrice && <span>{product.prevPrice ? `${product.prevPrice}$`  : ''}</span>} {product?.price}$</h2>
          <div className='mt-auto'>
            <button type='button' onClick={() => redirect('/products')}>Back</button>
            <form onSubmit={handleSubmit}>
              <input type="text" hidden defaultValue={product?.id} name='id' />
              <input type="text" hidden defaultValue={token} name='token'/>
              <input type='number' min={1} max={product?.stock} defaultValue={1} name='qty'/>
              <button type='submit'>Add to Cart</button>
            </form>
            {error && <p className='text-[#ff6347]'>{error}</p>}
            {success && <p className='text-[#00ff00]'>{success}</p>}
          </div>
        </div>
      </main>
    </div>
  )
}
