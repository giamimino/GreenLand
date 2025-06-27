"use client"
import React from 'react'
import styles from './page.module.scss'
import Image from 'next/image';
import { redirect } from 'next/navigation';

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
}

export default function ClientComponent({ product }: { product: ProductType }) {
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
            <div>
              {product?.category}
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
            <div>
              {product?.view}
            </div>
          </div>
          <p>{product?.Description}</p>
          <h2>$ {product?.prevPrice && <span>{product.prevPrice}</span>} {product?.price}</h2>
          <div className='mt-auto'>
            <button type='button' onClick={() => redirect('/products')}>Back</button>
            <button type='button'>Add to Cart</button>
          </div>
        </div>
      </main>
    </div>
  )
}
