"use client"
import React, { useEffect, useState } from 'react'
import styles from './page.module.scss'
import { useRouter } from 'next/navigation'
import { redirect } from 'next/navigation'
import { checkVerifivation, sendVerification } from '@/actions/actions'

type User = {
  email: string,
  isVerified: boolean,
}

export default function Verification() {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetch("/api/getUser")
    .then(res => res.json())
    .then(data => {
      if(data.user) {
        setUser(data.user)
      }
    })
  }, [router])
  
  useEffect(() => {
    if(user?.isVerified) {
      redirect("/products")
    }
  }, [user])

  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const result = await sendVerification(formData)

    if(!result.success) {
      setError(typeof result.message === 'string' ? result.message : String(result.message))
    } else {
      if(result.success) {
        setSuccess(true)
      }
    }
  }

  async function handleCheck(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const result = await checkVerifivation(formData)

    if(!result.success) {
      setError(result.message)
    } if(result.success) {
      setMessage(result.message)
    }
  }

  return (
    <div className={styles.container}>
      {success === false ?
      <div className={styles.verification}>
        <p>{user?.email}</p>
        <form onSubmit={handleSend}>
          <input type="text" hidden defaultValue={user?.email} name='email' />
          <button type="submit">send</button>
        </form>
        {error && <p className='text-[tomato]'>{typeof error === 'string' ? error : String(error)}</p>}
      </div> :
      <div className={styles.checkVerification}>
        <form onSubmit={handleCheck}>
          <input type="text" placeholder='type your code' name='code' />
          <input type="text" hidden defaultValue={user?.email} name='email' />
          <button type="submit">send</button>
        </form>
        {error && <p className='text-[tomato]'>{typeof error === 'string' ? error : String(error)}</p>}
        {message && <p className='text-[lime]'>{message}</p>}
      </div>
      }
    </div>
  )
}