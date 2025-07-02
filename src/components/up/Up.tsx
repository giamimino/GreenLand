"use client"
import React, { useEffect, useState } from 'react'
import styles from './Up.module.scss'
import { Icon } from '@iconify/react/dist/iconify.js'

export default function Up() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if(window.scrollY >= 300) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className={`${styles.up} ${styles[scrolled? "scrolled" : ""]}`}>
      <Icon icon="grommet-icons:link-up" />
    </button>
  )
}
