"use client"
import { Icon } from "@iconify/react/dist/iconify.js";
import styes from "./page.module.scss"
import { useState } from 'react';
import { Product } from "@/components/ui/ui";

type Props = {
  products: any[],
  inSaleProducts: any[]
}

function FilterDropDown() {
  return (
    <div>
      <div>
        <button onClick={() => setShowFilterCategory(!showFilterCategoy)}>Category <Icon icon={showFilterCategoy ? 'iconamoon:arrow-down-2-bold' : 'iconamoon:arrow-right-2-bold'} /></button>
        {showFilterCategoy &&
        <ul>
          <li>Indoor Plants</li>
          <li>Outdoor Plants</li>
          <li>Succulents & Cacti</li>
          <li>Air-Purifying Plants</li>
          <li>Flowering Plants</li>
          <li>Pet-Friendly Plants</li>
          <li>Herbs</li>
          <li>Hanging Plants</li>
          <li>Rare & Exotic Plants</li>
          <li>Low-Maintenance Plants</li>
        </ul>
        }
      </div>
    </div>
  )
}

export default function ProductsPage({inSaleProducts, products}: Props) {
  const [showFilterCategoy, setShowFilterCategory] = useState(false)
  

  return (
    <div className={styes.products}>
      <main className={styes.filterWrapper}>
        <h1>Filter</h1>
        
      </main>
      {inSaleProducts.length >= 1 &&
      <main className={styes.inSaleWrapper}>
          <h1>InSale</h1>
          <div>
            {inSaleProducts.map((product, index) => (
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
      }
      <hr />
      <main>
        {products.map((product, index) => (
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
