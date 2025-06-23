"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import { Product as ProductType } from "@prisma/client";
import { Product } from "@/components/ui/ui";

export default function InSaleSwiper({ products }: { products: ProductType[] }) {
  return (
    <Swiper spaceBetween={48} slidesPerView={7}>
      {products.map((product, index) => (
        <SwiperSlide key={product.slug}>
          <Product
            title={product.title}
            price={product.price}
            image={product.image}
            delay={index * 100}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
