"use client"
import { signIn } from '@/actions/actions'
import Link from 'next/link'
import { redirect } from 'next/navigation';
import React, { useState } from 'react'

export default function SignIn() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const fromData = new FormData(e.currentTarget)
    const result = await signIn(fromData)

    if(!result.success) {
      console.log("error broher", result.error);
      setError(result.error ?? "")
    } else {
      if(result.token) {
        localStorage.setItem('token', result.token)
      }
      redirect('/profile')
    }
  }

  return (
    <div className='p-24'>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" name="email" id="email" placeholder='email...' />
        </div>
        
        <div>
          <label htmlFor="password">password:</label>
          <input type="text" name="password" id="password" placeholder='password...' />
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <button type='submit'>Sign In</button>
        <Link href="/auth/signUp">Already have any account?</Link>
      </form>
    </div>
  )
}
