"use client"
import React, { useEffect, useState } from 'react'
import styles from './page.module.scss'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Button } from '@/components/ui/ui'
import { createProduct } from '@/actions/actions'
import clsx from 'clsx'

export default function page() {
  const [isLogin, setIsLogin] = useState(true)
  const [passwordValue, setPasswordValue] = useState("")
  const [WrongPas, setWrongPas] = useState(false)
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState("");
  const [checked, setChecked] = useState(false)
  const [category, setCategory] = useState("")

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

  function passwordCheck() {
    if (passwordValue === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
      setWrongPas(true)
      setPasswordValue("")
    }
  }

  function typePass (e: any) {
    if(WrongPas) {
      setWrongPas(false)
    }
    setPasswordValue(e.target.value)
  }
  
  return (
    <div style={{
      height: "120vh"
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
      </div> :
      <div className={styles.login}>
        <div>
          <input
            type="text"
            placeholder="password"
            value={passwordValue}
            onChange={typePass}
          />
          <button onClick={passwordCheck}>
            <Icon icon="formkit:submit" />
          </button>
        </div>
        {WrongPas && <p>Wrong Password pls try again</p>}
      </div>
      }
      
    </div>
  )
}
