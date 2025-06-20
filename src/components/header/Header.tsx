"use client"
import React, { useEffect, useState } from 'react'
import { Icon } from "@iconify/react";
import { usePathname } from 'next/navigation';
import styles from './style.module.scss'
import Link from 'next/link';

export default function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  return (
    <header className={`${styles.header} ${isScrolled? styles.scrolled : ""}`}>
      <main>
        <span></span>
        <ul>
          <Link href="/"><li className={pathname === '/' ? styles.active : ""}>Home</li></Link>
          <Link href="./products"><li className={pathname === '/products' ? styles.active : ""}>products</li></Link>
          <Link href="./contact"><li className={pathname === '/contact' ? styles.active : ""}>contact</li></Link>
        </ul>
      </main>
      <ol>
        <li>
          <Icon icon="bi:cart" width={24} height={24} />
        </li>
        <li>
          <Icon icon="cuida:user-outline" width={24} height={24} />
        </li>
        <li>
          <span></span>
          <span></span>
          <span></span>
        </li>
      </ol>
    </header>
  )
}
