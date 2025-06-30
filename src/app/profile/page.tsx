'use client'

import { redirect, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type User = {
  name: string
  email: string
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      redirect('/auth/signUp')
    }

    fetch('/api/getUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user)
        } else {
          localStorage.removeItem('token')
          router.push('/')
        }
      })
  }, [router])

  if(!user) {
    return <div>loading...</div>
  }

  return (
    <div>
      name: {user?.name}
    </div>
  )
}