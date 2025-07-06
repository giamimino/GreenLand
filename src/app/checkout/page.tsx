"use client"
import React, { useEffect, useState } from 'react'
import styles from './page.module.scss'
import { redirect, useRouter } from 'next/navigation'
import Link from 'next/link'

type User = {
  id: string
  name: string
  email: string
  isVerified: boolean
}

export default function CheckOut() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const token = localStorage.getItem('token') || undefined;
    if(!token) {
      redirect('/')
    }

    fetch('/api/getUser', {
      method: 'POST',
      headers: {"content-type": "application/json"},
      body: JSON.stringify({ token })
    })
    .then(res => res.json())
    .then(data => {
      if(data.user) {
        setUser(data.user)
      }
    })
  }, [router])
  useEffect(() => {
    if(user) {
      if(user.isVerified === false) {
        setMessage("You have to verify email before checkout")
      }
    }
  }, [user])
  return (
    <div className='p-24'>
      {message !== "" ? 
      <div className={styles.alert}>
        <div>
          <p>
            {message}
          </p>
          <Link href="/verification">
            Click here
          </Link>
        </div>
      </div>
      :
      <div>
        
      </div>
      }
    </div>
  )
}