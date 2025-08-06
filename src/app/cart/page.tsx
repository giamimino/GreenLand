"use client"
import React, { useEffect, useState } from 'react'
import styles from './page.module.scss'
import Link from 'next/link'
import { deleteCart, editCart } from '@/actions/actions'
import { Icon } from '@iconify/react/dist/iconify.js'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

type ProductProps = {
  id: string,
  title: string,
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
  id: string
  quantity: number
  product: ProductProps
}

export default function CartPage() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<ProductType[]>([])

  useEffect(() => {
    fetch('/api/cart/get').then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.cart)) {
          setProducts(data.cart)
        } else {
          console.log("Error or invalid format:", data.message)
        }
        setLoading(false)
      })
  }, [])

  const itemCount = products.reduce((acc, p) => acc + p.quantity, 0)

  const subtotal = products.reduce(
    (acc, p) => acc + ((p.product.prevPrice ?? p.product.price) * p.quantity),
    0
  )

  const total = products.reduce(
    (acc, p) => acc + (p.product.price * p.quantity),
    0
  )

  const discountAmount = subtotal - total
  const discountPercent = subtotal > 0 ? (discountAmount / subtotal) * 100 : 0

  function handleDelete(id: string) {
    setProducts(prev => prev.filter(product => product.id !== id))
  }

  function handleEditCart(id: string, qty: number){
    setProducts(prev => prev.map(product => product.id === id ? {...product, quantity: qty} : product))
  }
  

  return (
    <div className={styles.cartContainer}>
      <main>
        <h1>Hello, {`it's`} your cart</h1>

        {loading ? (
          <p>Loading...</p>
        ) : products.length > 0 ? (
          <>
            <p className="justify-self-end mr-7 mb-3">price</p>

            <aside className={styles.products}>
              {products.map((p, index) => (
                <Cart
                  key={p.product.slug}
                  id={p.id}
                  title={p.product.title}
                  price={p.product.price}
                  description={p.product.description}
                  prevPrice={p.product.prevPrice ?? undefined}
                  delay={index * 100}
                  slug={p.product.slug}
                  category={p.product.category.replace("_", " ").toLowerCase()}
                  isSale={p.product.isSale}
                  isBestProducts={p.product.isBestSelling}
                  view={p.product.view}
                  stock={p.product.stock}
                  qty={p.quantity}
                  onDelete={() => handleDelete(p.id)}
                  onEdit={(qty) => handleEditCart(p.id, qty)}
                />
              ))}
            </aside>

            <p className="justify-self-end mr-7">
              Subtotal ({itemCount} items): {subtotal.toFixed(2)}$
              {discountPercent >= 1 && (
                <span className="text-red-600 font-bold">
                  &nbsp;-{Math.round(discountPercent)}%
                </span>
              )}
            </p>

            {discountPercent >= 1 && (
              <p className="justify-self-end mt-0 mr-7">
                Discount:&nbsp;
                <span className="text-[#fb7701]">
                  -{discountAmount.toFixed(2)}$
                </span>
              </p>
            )}

            <h1 className="justify-self-end mr-7 font-bold text-1xl">
              Total: {total.toFixed(2)}$
            </h1>

            <div className="justify-self-end">
              <Link href="/checkout">
                <button type="button" className={styles.chechout}>
                  Proceed to checkout
                </button>
              </Link>
            </div>
          </>
        ) : (
          <p>Your cart is empty</p>
        )}
      </main>
    </div>
  )
}


type Cart = {
  id: string,
  title: string,
  delay: number,
  price: number,
  slug: string,
  prevPrice?: number,
  description: string,
  category: string,
  view: number,
  isSale: boolean,
  isBestProducts: boolean,
  stock: number,
  qty: number,
  onDelete: () => void,
  onEdit: (qty: number) => void
}

function Cart(props: Cart) {
  const [error, setError] = useState("")
  const [isCart, setIsCart] = useState(true)
  const router = useRouter()

  async function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    
    const formData = new FormData(e.currentTarget)
    const result = await deleteCart(formData, props.id)

    if(!result.success) {
      setError(result.message)
      setIsCart(prev => !prev)
    } else {
      setIsCart(prev => !prev)
      props.onDelete()
    }
  }

  async function handleEditCart(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const result = await editCart(formData, props.id)

    if(!result.success) {
      setError(result.message || "")
    } else {
      props.onEdit(Number(result.qty))
    }
  }
  
  return ( isCart ?
    <div className={styles.cart}>
      <div>
        <Image
          src={`https://raw.githubusercontent.com/giamimino/images/refs/heads/main/greenland/products/${props.slug}.webp`}
          alt={props.slug}
          width={150}
          height={205}
        />
        <div>
          <p>{props.description}</p>
          <div>
            <div style={{
                "--hint": '"category"',
              } as React.CSSProperties}>
              {props?.category}
            </div>
            <div style={{
                "--hint": '"stock"',
              } as React.CSSProperties}>
              {props.stock}
            </div>
            {props?.isSale &&
            <div>
              {props?.isSale ? "Sale" : ''}
            </div>
            }
            {props?.isBestProducts &&
            <div>
              {props?.isBestProducts ? "BestSelling" : ''}
            </div>
            }
            <div style={{
                "--hint": '"views"',
              } as React.CSSProperties}>
              {props?.view}
            </div>
          </div>
          <main> 
            {props.stock !== 0 ?
              <form onSubmit={handleEditCart}>
                <input type="number" name="qty" min={1} max={props.stock} defaultValue={props.qty} />
                <button type="submit">
                  <Icon icon="stash:paperplane-solid" />
                </button>
              </form> : <p className="red font-medium">out of stock</p>
            }
            <button type="button" onClick={() => router.push(`/products/${props.slug}`)}>
              <Icon icon='gravity-ui:eyes-look-right' />
            </button>

            <form onSubmit={handleDelete}>
              <button type="submit">
                <Icon icon="material-symbols:delete-rounded" />
              </button>
            </form>
          </main>
        </div>
      </div>
      <h1><span className='line-through'>{props.prevPrice ? `${props.prevPrice}$`  : ''}</span> {props.price}$</h1>
    </div> :
    <div>
      {error && <div role="alert" className={styles.error}>{error}</div>}
      <p><Link className='text-blue-500 cursor-pointer'
      style={{textDecoration: "underline"}} href={`/products/${props.slug}`}>{props.title}</Link> product was removed</p> 
    </div>
  )
} 