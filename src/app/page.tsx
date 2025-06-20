"use client"
import React, { useEffect, useState } from 'react';
import styles from './page.module.scss'
import { Counting } from '@/components/animations/animations';
import Image from 'next/image';
import { Icon } from '@iconify/react';

export default function Home() {
  
  return (
    <div className="p-24">
      <section className={styles.heroWelcome}>
        <aside>
          <h1 className='font-extrabold text-6xl w-[400px]'>Buy your dream plants</h1>
          <div className='flex'>
            <Counting end={50} content="Plant Species" style={{borderRight: "1px solid black", paddingLeft: "0"}} />
            <Counting end={100} content="Costumers" />
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
    </div>
  );
}