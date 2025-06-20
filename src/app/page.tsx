"use client"
import React, { useEffect, useState } from 'react';
import styles from './page.module.scss'
import { Counting } from '@/components/animations/animations';

export default function Home() {
  
  return (
    <div className="p-24">
      <section className={styles.heroWelcome}>
        <h1 className='font-extrabold text-6xl'>Buy your dream plants</h1>
        <aside>
          <div className='flex'>
            <Counting end={50} content="Plant Species" style={{borderRight: "1px solid black", paddingLeft: "0"}} />
            <Counting end={100} content="Costumers" />
          </div>
        </aside>
      </section>
    </div>
  );
}