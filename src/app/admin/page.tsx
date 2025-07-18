"use client"
import React, { useEffect, useState } from 'react'
import styles from './page.module.scss'
import { Button } from '@/components/ui/ui'
import { backupDatabase, createProduct } from '@/actions/actions'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type User = {
  id: string
  name: string
  email: string
  role: string
}

export default function Admin() {
  const [isLogin, setIsLogin] = useState(false)
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState("");
  const [checked, setChecked] = useState(false)
  const [category, setCategory] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()


  useEffect(() => {
    const token = localStorage.getItem('token')
    if(!token) return

    fetch('/api/getUser', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
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
    if(user?.role === "admin") {
      setIsLogin(true)
    } else {
      setIsLogin(false)
    }
  }, [user])

  const categoryTechs = [
    {
      key: "indoor_plants",
      label: "Indoor Plants"
    },
    {
      key: "outdoor_plants",
      label: "Outdoor Plants"
    },
    {
      key: "succulents_cacti",
      label: "Succulents & Cacti"
    },
    {
      key: "air_purifying_plants",
      label: "Air-Purifying Plants"
    },
    {
      key: "flowering_plants",
      label: "Flowering Plants"
    },
    {
      key: "pet-friendly_plants",
      label: "Pet-Friendly Plants"
    },
    {
      key: "herbs",
      label: "Herbs"
    },
    {
      key: "hanging_plants",
      label: "Hanging Plants"
    },
    {
      key: "rare_exotic_plants",
      label: "Rare & Exotic Plants"
    },
    {
      key: "low_maintenance_plants",
      label: "Low-Maintenance Plants"
    }
  ]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const result = await createProduct(formData);

    if (!result.success) {
      setErrors(result.errors ?? []);
      setSuccess("");
    } else {
      setSuccess("Product created successfully!");
      setErrors([]);
      e.currentTarget.reset();
    }
  }
  
  return (
    <div style={{
      height: "140vh"
    }}>
      {isLogin ? <div className={styles.admin}>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="Title">Title</label>
            <input type="text" name='title' placeholder='Type Title' id='Title' />
          </div>

          <div>
            <label htmlFor="Description">Description</label>
            <textarea cols={50} rows={10} name='description' placeholder='Type description' id='Description'></textarea>
          </div>

          <div>
            <label htmlFor="Price">Price</label>
            <input type="number" name='price' placeholder='Type price' id='Price' />
          </div>
          
          <div>
            <label htmlFor="stock">Stock</label>
            <input type="number" name='stock' placeholder='Type stock' id='stock' />
          </div>

          <div>
            <h1>Chosse category</h1>
            <input type="text" hidden defaultValue={category} name='category' />
            <div>
              {categoryTechs.map((cat) => (
                  <p key={cat.key} 
                  className={clsx(
                    {
                      'bg-gray-100 text-black': category === cat.key,
                      'text-gray-500': category !== cat.key,
                    },
                  )} 
                  onClick={() => setCategory(cat.key)}>{cat.label}</p>
                ))}
            </div>
          </div>

          <aside className='flex flex-row gap-1.5'>
            <label htmlFor="isSale">isSale?</label>
            <input type="checkbox" className='hover:cursor-pointer' name='isSale' id='isSale' onChange={() => setChecked(!checked)} />
          </aside>

          {checked &&
          <div>
            <label htmlFor="prevPrice">Previus price?</label>
            <input type="text" name='prevPrice' placeholder='Type Previus price' id='prevPrice' />
          </div>}

          <Button
            type='submit'
            title='Submit'
            />
        </form>
        {errors && errors.map((error:string, index:number) => (
          <p style={{ color: "red" }} key={index}>{error}</p>
        ))}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <form onSubmit={async (e) => {
          e.preventDefault();
          const result = await backupDatabase();
          if (result.success) {
            alert("Database backup successful!");
          } else {
            alert("Failed to backup database.");
          }
        }}>
          <button type='submit'>BackUp</button>
        </form>
      </div> :
      <div className={styles.login}>
        <Link href="/">
          <p>{"Don't have accses"}</p>
        </Link>
      </div>
      }
      
    </div>
  )
}
