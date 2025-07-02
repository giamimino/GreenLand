'use client'

import { redirect, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from './style.module.scss'
import { Icon } from '@iconify/react/dist/iconify.js'
import { editEmail, editName, LogOut } from '@/actions/actions'

type User = {
  id: string
  name: string
  email: string
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isEditName, setIsEditName] = useState(false)
  const [isEditEmail, setIsEditEmail] = useState(false)
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const router = useRouter()

  useEffect(() => {
    if(user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

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

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [error, success])

  if(!user) {
    return <div>loading...</div>
  }

  async function handleLogOut(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const result = await LogOut(formData)

    if(!result.success) {
      setError("somthing went wrong can't logout")
    } else {
      if(result.success) {
        localStorage.removeItem('token')
        redirect('/')
      }
    }
  }

  async function handleNameEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const result = await editName(formData)

    if(!result.success) {
      setError("somthing went wrong cant change name");
    } else {
      if(result.success) {
        setSuccess("successfuly changed name");
        setIsEditName(false)
        setUser(prev => prev? {...prev, name} : prev)
      }
    }
  }

  async function handleEmailEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const result = await editEmail(formData)

    if(!result.success) {
      setError("somthing went wrong cant change email");
    } else {
      if(result.success) {
        setSuccess("successfuly changed email");
        setIsEditEmail(false)
        setUser(prev => prev? {...prev, name} : prev)
      }
    }
  }

  return (
    <div className='p-24 flex items-center justify-center h-[70vh]'>
        <main className={styles.profile}>
          <h1>Profile</h1>
          <div>
            {!isEditName ? 
            <>
              <p>name: {user?.name}</p>
              <button type='button' onClick={() => setIsEditName(prev => !prev)}><Icon icon="lucide:edit" /></button>
            </> :
            <form onSubmit={handleNameEdit}>
              <input type="text" name='id' defaultValue={user?.id} hidden/>
              <p>Name:</p>
              <input type="text" name='name' value={name}
              onChange={(e) => setName(e.target.value)} />
              <button type='submit'><Icon icon="hugeicons:sent-02"/></button>
            </form>
            }
          </div>
          <div>
            {!isEditEmail ? 
            <>
              <p>email: {user?.email}</p>
              <button type='button' onClick={() => setIsEditEmail(prev => !prev)}><Icon icon="lucide:edit" /></button>
            </> :
            <form onSubmit={handleEmailEdit} >
              <input type="text" name='id' defaultValue={user?.id} hidden/>
              <p>Email:</p>
              <input type="email" name='email' value={email}
              onChange={(e) => setEmail(e.target.value)} />
              <button type='submit'><Icon icon="hugeicons:sent-02"/></button>
            </form>
            }
          </div>
          <form onSubmit={handleLogOut}>
            <input type="text" name='id' defaultValue={user?.id} hidden/>
            <button type='submit'>Log out</button>
          </form>
        </main>
        {error && <div role="alert" className={styles.error}>{error}</div>}
        {success && <div role="alert" className={styles.success}>{success}</div>}
    </div>
  )
}