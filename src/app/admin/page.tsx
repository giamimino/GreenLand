"use client"
import React, { useState } from 'react'
import styles from './page.module.scss'
import { Icon } from '@iconify/react/dist/iconify.js'
import { Button } from '@/components/ui/ui'
import { createProduct } from '@/actions/actions'

export default function page() {
  const [isLogin, setIsLogin] = useState(false)
  const [passwordValue, setPasswordValue] = useState("")
  const [WrongPas, setWrongPas] = useState(false)
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState("");
  const [checked, setChecked] = useState(false)

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
            <label htmlFor="category">Category</label>
            <input type="text" name='category' placeholder='Type category' id='category' />
          </div>

          <div>
            <div>
              <label htmlFor="isSale">isSale?</label>
              <input type="checkbox" name='isSale' id='isSale' onChange={() => setChecked(!checked)} />
            </div>
          </div>

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
