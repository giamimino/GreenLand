'use client'

import { redirect } from 'next/navigation'
import React, { useEffect, useState } from 'react'

type User = {
  name: string
  email: string
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
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
        }
      })
  }, [])

  return (
    <div>
      name: {user?.name || 'Unknown'}
    </div>
  )
}