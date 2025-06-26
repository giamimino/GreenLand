"use client"
import { Icon } from "@iconify/react/dist/iconify.js";
import styes from "./page.module.scss"
import React, { useEffect, useState } from 'react';
import { Product } from "@/components/ui/ui";

type Props = {
  products: any[],
}

type FilterProps = {
  title: string,
  object: any[],
}


export default function ProductsPage({products}: Props) {
  const [showFilterCategoy, setShowFilterCategory] = useState(false)
  const [filter, setFilter] = useState<string[]>([])
  const [filteredProducts, setFilteredProducts] = useState<any[]>([])
  const categoryTechs = [
    {
      key: "indoor_plants",
      label: "Indoor Plants"
    },
    {
      key: "outdoor_plants",
      label: "Outdoor Plants"
    },
    {
      key: "succulents_cacti",
      label: "Succulents & Cacti"
    },
    {
      key: "air_purifying_plants",
      label: "Air-Purifying Plants"
    },
    {
      key: "flowering_plants",
      label: "Flowering Plants"
    },
    {
      key: "pet-friendly_plants",
      label: "Pet-Friendly Plants"
    },
    {
      key: "herbs",
      label: "Herbs"
    },
    {
      key: "hanging_plants",
      label: "Hanging Plants"
    },
    {
      key: "rare_exotic_plants",
      label: "Rare & Exotic Plants"
    },
    {
      key: "low_maintenance_plants",
      label: "Low-Maintenance Plants"
    }
  ]

  useEffect(() => {
    setFilteredProducts(products)
  }, [])

  useEffect(() => {

  })

  function handleFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value, checked } = event.target;
    setFilter(prev =>
      checked ? [...prev, value] : prev.filter(item => item !== value)
    );
  }

  useEffect(() => {
    if(filter.length >= 1) {
      setFilteredProducts(products.filter(product => filter.some(category => product.category === category)))
    } else {
      setFilteredProducts(products)
    }
  }, [filter])
  
  function FilterDropDown(props:FilterProps) {
    return (
      <div>
        <div>
          <button onClick={() => setShowFilterCategory(!showFilterCategoy)}>{props.title} <Icon icon={showFilterCategoy ? 'iconamoon:arrow-down-2-bold' : 'iconamoon:arrow-right-2-bold'} /></button>
          {showFilterCategoy &&
          <ul>
            {categoryTechs.map((cat:any) => (
              <div key={cat.key}>
                <input type="checkbox" id={cat.key} value={cat.key} checked={filter.includes(cat.key)} hidden onChange={handleFilterChange} />
                <label htmlFor={cat.key} >{cat.label}</label>
              </div>
            ))}
          </ul>
          }
        </div>
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
      </main>
      {filteredProducts.length >= 1 &&
      <>
      <main className={styes.inSaleWrapper}>
          <h1>InSale</h1>
          <div>
            {filteredProducts
            .filter(product => product.isSale)
            .slice(0, 6)
            .map((product, index) => (
              <Product
                key={product.slug}
                title={product.title}
                price={product.price}
                image={product.image}
                prevPrice={product.prevPrice ?? undefined}
                delay={index * 100}
              />
            ))}
          </div>
      </main>
          <hr />
      </>
      }
      <main>
        {filteredProducts.map((product, index) => (
          !product.isSale &&
            <Product
              key={product.slug}
              title={product.title}
              price={product.price}
              image={product.image}
              delay={index * 100}
            />
        ))}
      </main>
    </div>
  )
}
