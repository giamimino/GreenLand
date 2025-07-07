'use client'

import { redirect, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from './style.module.scss'
import { Icon } from '@iconify/react/dist/iconify.js'
import { editEmail, editLocation, editName, LogOut } from '@/actions/actions'

type User = {
  id: string
  name: string
  email: string
  location: string
  address: string
  postalCode: number
  isVerified: boolean
  token: string
  state: string
  city: string
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isEditName, setIsEditName] = useState(false)
  const [isEditEmail, setIsEditEmail] = useState(false)
  const [isEditLocation, setIsEditLocation] = useState(false)
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [location, setLocation] = useState("")
  const [address, setAddress] = useState("")
  const [postalCode, setPostalCode] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
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
        setSuccess("successfully changed email");
        setIsEditEmail(false)
        setUser(prev => prev? {...prev, email} : prev)
      }
    }
  }

  async function handleEditLocation(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const result = await editLocation(formData)

    if(!result.success) {
      setError(result.error ?? "")
    } else {
      if(result.success) {
        setIsEditLocation(false)
        setUser(prev => prev? {...prev, location, address, postalCode: Number(postalCode), state, city} : prev)
      }
    }
  }

  return (
    <div className='p-24 flex items-center justify-center h-[100vh]'>
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
          <aside>
            <div>
              <h2>country:</h2>
              <p>{user.location}</p>
            </div>
            <div>
              <h2>state:</h2>
              <p>{user.state}</p>
            </div>
            <div>
              <h2>city:</h2>
              <p>{user.city}</p>
            </div>
            <div>
              <h2>address:</h2>
              <p>{user.address}</p>
            </div>
            <div>
              <h2>postal code:</h2>
              <p>{user.postalCode ? user.postalCode : "unknown"}</p>
            </div>
            <button type='button' onClick={() => setIsEditLocation(prev => !prev)} >Edit Location</button>
          </aside>
          <div>
            <form onSubmit={handleLogOut}>
              <input type="text" name='id' defaultValue={user?.id} hidden/>
              <button type='submit' className='bg-[tomato]'>Log out</button>
            </form>
            <form>
              <input type="text" name='id' defaultValue={user?.id} hidden/>
              <button type='submit' className='bg-[red]'>Delete</button>
            </form>
          </div>
          {user.isVerified && <p className='font-medium'>your account email is verified</p>}
        </main>
        {error && <div role="alert" className={styles.error}>{error}</div>}
        {success && <div role="alert" className={styles.success}>{success}</div>}
        {isEditLocation && 
        <form className={styles.locationForm} onSubmit={handleEditLocation}>
          <input type="text" hidden name='token' defaultValue={user.token} />
          <div>
            <label htmlFor="country">Country: </label>
            <input type='text' id='country' name='country' value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div>
            <label htmlFor="state">State: </label>
            <input type='text' id='state' name='state' value={state} onChange={(e) => setState(e.target.value)} />
          </div>
          <div>
            <label htmlFor="city">City: </label>
            <input type='text' id='city' name='city' value={city} onChange={(e) => setCity(e.target.value)} />
          </div>
          <div>
            <label htmlFor="address">Address: </label>
            <input type='text' id='address' name='address' value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div>
            <label htmlFor="postalCode">postal code: </label>
            <input type='text' id='postalCode' name='postalCode' value={postalCode} onChange={(e) => setPostalCode(e.target.value)}/>
          </div>
          {error && <p className='text-[tomato]'>{error}</p>}
          <button type='submit'>update</button>
        </form>}
    </div>
  )
}