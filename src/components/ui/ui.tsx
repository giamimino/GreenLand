"use client"

import React, {useState, useEffect, useRef} from "react";
import styles from "./ui.module.scss";
import { Icon } from "@iconify/react";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { redirect } from "next/navigation";
import Link from "next/link";

type FeatureCard = {
  icon: string,
  title: string,
  content: string,
}

type Category = {
  image: string,
  title: string,
  delay?: number,
}

type Title = {
  title: string,
  content: string,
}

type Button = {
  title: string,
  icon?: string,
  bgColor?: string,
  type?: "button" | "submit" | "reset",
}

type Product = {
  image: string,
  title: string,
  price: number,
  id?: string,
  delay?: number,
  prevPrice?: number,
  slug: string,
}

type CommentObject = {
  name: string,
  image: string,
  comment: string,
  job: string,
  key: string
}

type CommentSlider = {
  objects: CommentObject[],
}

type Cart = {
  id: string,
  image: string,
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
  stock: number
  qty: number
}

export function Cart(props: Cart) {
  const [error, setError] = useState("")
  const [isCart, setIsCart] = useState(true)
  setError("")
  
  return ( isCart ?
    <div className={styles.cart}>
      <div>
        <Image
          src={`https://raw.githubusercontent.com/giamimino/images/refs/heads/main/greenland/products/${props.image}.webp`}
          alt={props.image}
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
              <form>
                <input type="number" name="qty" min={1} max={props.stock} defaultValue={props.qty} />
                <button type="submit">
                  <Icon icon="stash:paperplane-solid" />
                </button>
              </form> : <p className="red font-medium">out of stock</p>
            }
            <button type="button" onClick={() => redirect(`/products/${props.slug}`)}>
              <Icon icon='gravity-ui:eyes-look-right' />
            </button>
            <form>

              <button type="submit" onClick={() => setIsCart(prev => !prev)}>
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

export function CommentSlider(props: CommentSlider) {
  return (
    <Swiper
      spaceBetween={48}
      slidesPerView={2}
      className={styles.sliderWrapper}
    >
      {props.objects.map((com) => (
        <SwiperSlide key={com.key} className={styles.slider}>
          <p>{com.comment}</p>
          <main>
            <Image
              src={`https://raw.githubusercontent.com/giamimino/images/refs/heads/main/greenland/${com.image}.webp`}
              alt={com.image}
              width={150}
              height={205}
            />
            <div>
              <h1>{com.name}</h1>
              <p>{com.job}</p>
            </div>
          </main>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export function Product(props: Product) {
  const productRef = useRef<HTMLHeadingElement>(null);
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if(productRef.current) {
      observer.observe(productRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [])

  return (
    <div ref={productRef}
    className={`${styles.product} ${inView? styles.fadeDown : ""}`}
    style={{
      animationDelay: `${props.delay || 0}ms`
    }}>
      <Image
        src={`https://raw.githubusercontent.com/giamimino/images/refs/heads/main/greenland/products/${props.image}.webp`}
        alt={props.image}
        width={299}
        height={363}
      />
      <main>
        <div>
          <h1>
            {props.title}
          </h1>
          <p>
            {props.prevPrice && <span>{props.prevPrice ? `${props.prevPrice}$`  : ''}</span>} {props.price}$
          </p>
        </div>
        <button type="button" onClick={() => redirect(`/products/${props.slug}`)}><Icon icon="mdi:cart" /></button>
      </main>
    </div>
  )
}

export function Button(props: Button) {
  return (
    <button type={props.type || "button"} className={styles.button} style={{
      backgroundColor: `#${props.bgColor || "fff"}` 
    }}>
      <span>{props.title}</span>
      <Icon icon={props.icon || "solar:arrow-right-linear"} />
    </button>
  )
}

export function Title(props: Title) {
  return (
    <div className="flex flex-col gap-3">
      <h1 className='text-[#1e1e1e] text-[32px] font-bold text-center '>
        {props.title}
      </h1>
      <p className='text-[#1e1e1e] text-[18px] font-medium text-center opacity-50'>
        {props.content}
      </p>
    </div>
  )
}

export function FeatureCard(props: FeatureCard) {
  return (
    <div className={styles.featureCard}>
      <aside>
        <Icon icon={props.icon}/>
      </aside>
      <div>
        <h1>{props.title}</h1>
        <p>{props.content}</p>
      </div>
    </div>
  )
}

export function Category(props: Category) {
  const categoryRef = useRef<HTMLHeadingElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if(categoryRef.current) {
      observer.observe(categoryRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);
  return (
    <div ref={categoryRef} className={`${styles.category}`}>
      <Image
        src={`https://raw.githubusercontent.com/giamimino/images/refs/heads/main/greenland/${props.image}.webp`}
        alt={props.image}
        width={352}
        height={512}
        className={inView ? styles.rotateY : ""}
        style={{
          animationDelay: props.delay ? `${props.delay}ms` : "0ms"
        }}
      />
      <h1>{props.title}</h1>
    </div>
  )
}