"use client"
import React, { useEffect, useState, useMemo, useCallback } from 'react';
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
  isBestSelling: boolean
  view: number
}

const FEATURES_DATA = [
  {
    icon: 'hugeicons:plant-02',
    title: 'Large Assortment',
    content: 'we offer many different types of products with fewer variations in each category.'
  },
  {
    icon: 'solar:box-linear',
    title: 'Fast & Free Shipping',
    content: '4-day or less delivery time, free shipping and an expedited delivery option.'
  },
  {
    icon: 'solar:outgoing-call-linear',
    title: '24/7 Support',
    content: 'answers to any business related inquiry 24/7 and in real-time.'
  }
];

const CATEGORIES_DATA = [
  { image: 'natural-plants-sec', title: 'Natural Plants', delay: 0 },
  { image: 'plants-acc-sec', title: 'Plant Accessories', delay: 100 },
  { image: 'artifical-plants-sec', title: 'Artifical Plants', delay: 200 }
];

export default function Home() {
  const [products, setProducts] = useState<ProductsType[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/products');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const STATS_DATA = useMemo(() => [
    { number: products.length, label: "Plant Species", hasRightBorder: true },
    { number: products.length > 0 ? products.reduce((acc, product: ProductsType) => acc.view < product.view ? product : acc, products[0]).view : 0, label: "Customers", hasRightBorder: false }
  ], [products]);

  
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  

  const searchUrl = useMemo(() => 
    `/products?p=${encodeURIComponent(searchValue)}`, 
    [searchValue]
  );

  const StatsSection = useMemo(() => (
    <div className='flex'>
      {STATS_DATA.map((stat, index) => (
        <div 
          key={index}
          style={stat.hasRightBorder ? {borderRight: "1px solid black", paddingLeft: "0"} : {}} 
          className='px-[48px]'
        >
          <h1 className='text-3xl font-medium'>{stat.number}+</h1>
          <p className='text-[18px] font-medium'>{stat.label}</p>
        </div>
      ))}
    </div>
  ), [STATS_DATA]);

  const FeaturesSection = useMemo(() => (
    <main className='flex justify-between'>
      {FEATURES_DATA.map((feature, index) => (
        <FeatureCard 
          key={index}
          icon={feature.icon}
          title={feature.title}
          content={feature.content}
        />
      ))}
    </main>
  ), []);

  const CategoriesSection = useMemo(() => (
    <div>
      {CATEGORIES_DATA.map((category, index) => (
        <Category 
          key={index}
          image={category.image}
          title={category.title}
          delay={category.delay}
        />
      ))}
    </div>
  ), []);

  return (
    <div className="p-24 flex flex-col gap-24">
      <section className={styles.heroWelcome}>
        <aside>
          <h1 className='font-extrabold text-6xl w-[400px]'>Buy your dream plants</h1>
          {StatsSection}
          <div className={styles.search}>
            <input 
              type="text" 
              placeholder='What are you looking for?' 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)} 
            />
            <Link href={searchUrl}>
              <span>
                <Icon icon="lets-icons:search" />
              </span>
            </Link>
          </div>
        </aside>
        <div>
          <Image 
            src="https://raw.githubusercontent.com/giamimino/images/refs/heads/main/greenland/plant.webp" 
            width={411}
            height={513} 
            alt='plant'
            priority
          />
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
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="flex justify-center items-center p-8">
              <p className="text-red-500">Error: {error}</p>
            </div>
          ) : (
            products.map((product, index) => (
              
              <Product
                key={product.slug}
                title={product.title}
                image={product.image}
                price={product.price}
                prevPrice={product.prevPrice ?? undefined}
                id={product.id}
                delay={index * 100}
              />
            ))
          )}
        </main>
      </section>

      <section className='flex flex-col gap-12 mt-24'>
        <Title
          title='About us'
          content='Order now and appreciate the beauty of nature'
        />
        {FeaturesSection}
      </section>

      <section className={styles.categories}>
        <Title
          title='Categories'
          content='Find what you are looking for'
        />
        <main>
          {CategoriesSection}
          <aside>
            <p>Horem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <Link href='/products'>
              <Button title='Explore' />
            </Link>
          </aside>
        </main>
      </section>

      <section className='flex flex-col gap-12'>
        <h1 className='text-[32px] font-bold'>What customers say about GREEMIND?</h1>
        <main>
          <CommentSlider objects={comments} />
        </main>
      </section>
    </div>
  );
}