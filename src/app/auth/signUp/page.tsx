"use client"
import { signUp } from '@/actions/actions';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useState } from 'react';

export default function SignUp() {
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await signUp(formData);

    if (!result.success) {
      console.log("error broher", result.error);
      setError(result.error ?? "");
    } else {
      if (result.token) {
        localStorage.setItem('token', result.token);
      }
      redirect('/profile')
    }
  }

  return (
    <div className='p-24'>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email">Email:</label><br/>
          <input type="email" name="email" id="email" placeholder='email...' required />
        </div>

        <div>
          <label htmlFor="name">Name:</label><br/>
          <input type="text" name="name" id="name" placeholder='name...' required />
        </div>

        <div>
          <label htmlFor="password">Password:</label><br/>
          <input type="password" name="password" id="password" placeholder='password...' required />
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <button type='submit' className="bg-green-600 text-white px-4 py-2 rounded">Sign Up</button>
        <p>
          Already have an account? <Link href="/auth/signIn" className="text-blue-500 underline">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
