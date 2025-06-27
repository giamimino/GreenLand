"use client"
import React, {useEffect, useState} from 'react';
import styles from './page.module.scss'
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { CommentSlider, Button, Category, FeatureCard, Product, Title } from '@/components/ui/ui';
import Link from 'next/link';
import comments from '@/data/json/comments.json'

type ProductsType = {
  slug: string
  title: string
  image: string
  price: number
  prevPrice: number
  id: string
}

export default function Home() {
  const [products, setProducts] = useState<ProductsType[]>([])

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .then((err) => console.log("error in api:", err))
  }, [])

  return (
    <div className="p-24 flex flex-col gap-24">
      <section className={styles.heroWelcome}>
        <aside>
          <h1 className='font-extrabold text-6xl w-[400px]'>Buy your dream plants</h1>
          <div className='flex'>
            <div style={{borderRight: "1px solid black", paddingLeft: "0"}} className='px-[48px]'>
              <h1 className='text-3xl font-medium'>50+</h1>
              <p className='text-[18px] font-medium'>Plant Species</p>
            </div>

            <div className='px-[48px]'>
              <h1 className='text-3xl font-medium'>100+</h1>
              <p className='text-[18px] font-medium'>Costumers</p>
            </div>
          </div>
          <div className={styles.search}>
            <input type="text" placeholder='What are you looking for?'/>
            <span>
              <Icon icon="lets-icons:search"  />
            </span>
          </div>
        </aside>
        <div>
          <Image src="https://raw.githubusercontent.com/giamimino/images/refs/heads/main/greenland/plant.webp" 
          width={411}
          height={513} alt='plant'/>
        </div>
      </section>
      <section className={styles.bestSellingSec}>
        <div>
          <h1>Best Selling Plants</h1>
          <p>Easiest way to healthy life by buying your favorite plants</p>
          <Link href="/products">
            <Button
              title='See more'
              bgColor='C1DCDC'
            />
          </Link>
        </div>
        <main>
          {products.map((product, index) => (
            <Product
              key={product.slug}
              title={product.title}
              image={product.image}
              price={product.price}
              prevPrice={product.prevPrice ?? undefined}
              id={product.id}
              delay={ index * 100}
            />
          ))}
        </main>
      </section>
      <section className='flex flex-col gap-12 mt-24'>
        <Title
          title='About us'
          content='Order now and appreciate the beauty of nature'
         />
        <main className='flex justify-between'>
          <FeatureCard 
            icon='hugeicons:plant-02'
            title='Large Assortment'
            content='we offer many different types of products with fewer variations in each category.'
          />
          <FeatureCard 
            icon='solar:box-linear'
            title='Fast & Free Shipping'
            content='4-day or less delivery time, free shipping and an expedited delivery option.'
          />
          <FeatureCard 
            icon='solar:outgoing-call-linear'
            title='24/7 Support'
            content='answers to any business related inquiry 24/7 and in real-time.'
          />
        </main>
      </section>
      <section className={styles.categories}>
        <Title
          title='Categories'
          content='Find what you are looking for'
         />
        <main>
          <div>
            <Category 
              image='natural-plants-sec'
              title='Natural Plants'
              />
            <Category 
              image='plants-acc-sec'
              title='Plant Accessories'
              />
            <Category 
              image='artifical-plants-sec'
              title='Artifical Plants'
              delay={200}
            />
          </div>
          <aside>
            <p>Horem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <Link href='/products'>
              <Button
                title='Explore'
              />
            </Link>
          </aside>
        </main>
      </section>
      <section className='flex flex-col gap-12'>
        <h1 className='text-[32px] font-bold '>What customers say about GREEMIND?</h1>
        <main>
          <CommentSlider
            objects={comments}
           />
        </main>
      </section>
    </div>
  );
}