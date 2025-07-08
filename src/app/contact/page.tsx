"use client"
import React, { useEffect, useState } from 'react'
import styles from './page.module.scss'
import { useRouter } from 'next/navigation'

type User = {
  token: string,
  name: string,
  email: string,
}

const contactTypes = [
  { label: "Review", value: "review" },
  { label: "Report a Bug", value: "bugreport" },
  { label: "Order Issue", value: "order_issue" },
  { label: "Return Request", value: "return" },
  { label: "Refund Request", value: "refund" },
  { label: "Shipping Question", value: "shipping" },
  { label: "Product Question", value: "product_question" },
  { label: "Business Proposal", value: "business" },
];

const topicMessages: Record<string, string> = {
  review: "Please provide your review details.",
  bugreport: "Please describe the bug you encountered.",
  order_issue: "Please describe the order issue.",
  return: "Please provide the reason for your return request.",
  refund: "Please explain why you are requesting a refund.",
  shipping: "Please specify your shipping-related question.",
  product_question: "Please ask your question about the product.",
  business: "Please share details about your business proposal.",
};


const topicForms: Record<string, JSX.Element> = {
  review: (
    <form>
      <div>
        <label htmlFor="job">Job:</label>
        <input type="text" id='job' name='job' />
      </div>
      <div>
        <label htmlFor="reviewText">Your Review:</label>
        <textarea id="reviewText" name="reviewText" rows={4} />
      </div>
      <button type='submit'>Send</button>
    </form>
  ),

  bugreport: (
    <form>
      <div>
        <label htmlFor="page">Page:</label>
        <input type='text' id="page" name="page" />
      </div>
      <div>
        <label htmlFor="bugDiscribe">Describe bug:</label>
        <textarea id="bugDiscribe" name="bugDiscribe" rows={4} />
      </div>
      <button type='submit'>Send</button>
    </form>
  ),
  order_issue: (
    <form>
      <div>
        <label htmlFor="order_number">Order ID:</label>
        <input type="text" id="order_number" name="order_number" required/>
      </div>
      <div>
        <label htmlFor="date">Order Date:</label>
        <input type="text" id="date" name="date" required/>
      </div>
      <div>
        <label htmlFor="paid">Amount Paid:</label>
        <input type="number" id="paid" name="paid" required/>
      </div>
      <div>
        <label htmlFor="describe_cart">Describe Your Cart:</label>
        <textarea id="describe_cart" name="describe_cart" rows={2} required/>
      </div>
      <div>
        <label htmlFor="issue_description">Describe the Issue:</label>
        <textarea id="issue_description" name="issue_description" rows={4}
          placeholder="Explain what's wrong with your order..."
          required
        />
      </div>
      <button type="submit">Send</button>
    </form>
  ),
  return: (
    <form>
      <div>
        <label htmlFor=""></label>
      </div>
      <button type="submit">send</button>
    </form>
  ),
  refund: (
    <form>
      <div>
        <label htmlFor=""></label>
      </div>
      <button type="submit">send</button>
    </form>
  ),
  shipping: (
    <form>
      <div>
        <label htmlFor=""></label>
      </div>
      <button type="submit">send</button>
    </form>
  ),
  product_question: (
    <form>
      <div>
        <label htmlFor=""></label>
      </div>
      <button type="submit">send</button>
    </form>
  ),
  business: (
    <form>
      <div>
        <label htmlFor=""></label>
      </div>
      <button type="submit">send</button>
    </form>
  ),
}


export default function Contact() {
  const [error, setError] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const [contactTopic, setContactTopic] = useState("")
  const router = useRouter()
  useEffect(() => {
    const token = localStorage.getItem("token")
    if(!token) {
      setError("you have to login before contact us")
    }

    fetch("/api/getUser", {
      method: "POST",
      headers: {"content-type": "application/json"},
      body: JSON.stringify({ token })
    })
    .then(res => res.json())
    .then(data => {
      if(data.user) {
        setUser(data.user)
      }
    })

  }, [router])
  return (
    <div className='p-24'>
      {error ? 
        <div className={styles.alert}>
          <div>
            <p>{error}</p>
          </div>
        </div> :
        <div className={styles.contact}>
          <div>
            <h1>Contact Us</h1>
            <div className={styles.contacTypes}>
              <h2 className='text-[#2c2c2c]'>contact Topic:</h2>
              {contactTypes.map((item) => (
                <div key={item.value}>
                  <input type='checkbox' hidden id={item.value} checked={contactTopic === item.value ? true : false} onChange={() => setContactTopic(item.value)} />
                  <label htmlFor={item.value}>{item.label}</label>
                </div>
              ))}
            </div>
            <p>{topicMessages[contactTopic]}</p>
            {topicForms[contactTopic]}
          </div>
        </div>
      }
    </div>
  )
}
