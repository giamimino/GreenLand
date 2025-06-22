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
        <form action={createProduct}>
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
            <input type="number" name='price' placeholder='Type price name' id='Price' />
          </div>
          
          <div>
            <label htmlFor="image">Image</label>
            <input type="text" name='image' placeholder='Type image name' id='image' />
          </div>

          <Button
            type='submit'
            title='Submit'
            />
        </form>
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
