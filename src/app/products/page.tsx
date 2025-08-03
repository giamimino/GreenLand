"use client"
import { Icon } from "@iconify/react/dist/iconify.js";
import styes from "./page.module.scss"
import React, { useEffect, useState, useMemo } from 'react';
import { Product } from "@/components/ui/ui";
import clsx from "clsx";
import { useRouter, useSearchParams } from "next/navigation";

type ProductType = {
  id?: string
  title: string
  image: string
  price: number
  prevPrice?: number
  slug: string
  category: string
  isSale: boolean
  createdAt: Date
  view: number
}

type FilterProps = {
  title: string,
  object: {
    key: string;
    label: string;
  }[],
}

const categoryTechs = [
  { key: "indoor_plants", label: "Indoor Plants" },
  { key: "outdoor_plants", label: "Outdoor Plants" },
  { key: "succulents_cacti", label: "Succulents & Cacti" },
  { key: "air_purifying_plants", label: "Air-Purifying Plants" },
  { key: "flowering_plants", label: "Flowering Plants" },
  { key: "pet-friendly_plants", label: "Pet-Friendly Plants" },
  { key: "herbs", label: "Herbs" },
  { key: "hanging_plants", label: "Hanging Plants" },
  { key: "rare_exotic_plants", label: "Rare & Exotic Plants" },
  { key: "low_maintenance_plants", label: "Low-Maintenance Plants" }
]

const sortTechs = [
  { key: "date", label: "by date" },
  { key: "price_to_low", label: "price hight to low" },
  { key: "price_to_hight", label: "price low to hight" },
  { key: "popularity", label: "by popularity" },
]

export default function Products() {
  const [showFilterCategoy, setShowFilterCategory] = useState(false)
  const [filter, setFilter] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState<string>("")
  const searchParams = useSearchParams()
  const [ShowSortCategory, setShowSortCategory] = useState(false)
  const [sort, setSort] = useState("")
  const [products, setProducts] = useState<ProductType[]>()
  const router = useRouter()

  useEffect(() => {
    fetch('/api/getProducts').then(res => res.json())
    .then(data => {
      if(data.success) {
        setProducts(data.products)
      }
    })
  }, [])

  useEffect(() => {
    const query = searchParams.get("p");
    if (query) {
      setSearchValue(query); 
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = products ?? [];

    if (searchValue.trim()) {
      const searchLower = searchValue.toLowerCase();
      result = result.filter(product => 
        product.title.toLowerCase().includes(searchLower)
      );
    }

    if (filter.length > 0) {
      result = result.filter(product => 
        filter.includes(product.category)
      );
    }

    if (sort !== "") {
      switch (sort) {
      case "date":
        result = [...result].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "price_to_low":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "price_to_hight":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "popularity":
        result = [...result].sort((a, b) => b.view - a.view);
        break;
      default:
        break;
      }
    }

    return result;
  }, [products, searchValue, filter, sort]);

  const saleProducts = useMemo(() => 
    filteredProducts.filter(product => product.isSale).slice(0, 6),
    [filteredProducts]
  );

  const nonSaleProducts = useMemo(() => 
    filteredProducts.filter(product => !product.isSale),
    [filteredProducts]
  );

  function handleFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value, checked } = event.target;
    setFilter(prev =>
      checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  }

  function FilterDropDown(props: FilterProps) {
    return (
      <div>
        <button onClick={() => setShowFilterCategory(!showFilterCategoy)}>
          {props.title} 
          <Icon 
            icon={'iconamoon:arrow-right-2-bold'} 
            className={clsx({
              'rotate-90': showFilterCategoy,
              'rotate-0': !showFilterCategoy,
            })} 
          />
        </button>
        {showFilterCategoy && (
          <ul>
            {props.object.map((cat) => (
              <div key={cat.key}>
                <input 
                  type="checkbox" 
                  id={cat.key} 
                  value={cat.key} 
                  checked={filter.includes(cat.key)} 
                  hidden 
                  onChange={handleFilterChange}
                />
                <label htmlFor={cat.key}>{cat.label}</label>
              </div>
            ))}
          </ul>
        )}
      </div>
    )
  }

  function SortDropDown(props: FilterProps) {
    return (
      <div>
        <button onClick={() => setShowSortCategory(!ShowSortCategory)}>
          {props.title} 
          <Icon 
            icon={'iconamoon:arrow-right-2-bold'} 
            className={clsx({
              'rotate-90': ShowSortCategory,
              'rotate-0': !ShowSortCategory,
            })} 
          />
        </button>
        {ShowSortCategory && (
          <ul className={styes.sort}>
            {props.object.map((cat) => (
              <div key={cat.key}>
                <input 
                  type="checkbox" 
                  id={cat.key} 
                  value={cat.key} 
                  hidden
                />
                <label className={
                  clsx(
                    {
                      'font-bold': sort === cat.key,
                      'text-black': sort !== cat.key,
                    },
                  )
                } htmlFor={cat.key} onClick={() => setSort(cat.key)}>{cat.label}</label>
              </div>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return (
    <div className={styes.products}>
      <main className={styes.filterWrapper}>
        <h1>Filter</h1>
        <FilterDropDown
          title="Category"
          object={categoryTechs}
        />
        <div className={styes.search}>
          <input 
            type="text" 
            placeholder='What are you looking for?'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <span onClick={() => router.push(`/products?q=${searchValue}`)}>
            <Icon icon="lets-icons:search" />
          </span>
        </div>
        <SortDropDown
          title="Sort By"
          object={sortTechs}
        />
      </main>
      
      {saleProducts.length > 0 && (
        <>
          <main className={styes.inSaleWrapper}>
            <h1>InSale</h1>
            <div>
              {saleProducts.map((product, index) => (
                <Product
                  key={product.slug}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  image={product.image}
                  slug={product.slug}
                  prevPrice={product.prevPrice ?? undefined}
                  delay={index * 100}
                />
              ))}
            </div>
          </main>
          <hr />
        </>
      )}
      
      <main>
        {nonSaleProducts.map((product, index) => (
          <Product
            key={product.slug}
            id={product.id}
            title={product.title}
            price={product.price}
            image={product.image}
            slug={product.slug}
            delay={index * 100}
          />
        ))}
      </main>
    </div>
  )
}