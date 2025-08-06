"use client"
import React, { useEffect, useState } from 'react'
import styles from './page.module.scss'
import { sendMessage } from '@/actions/actions'

type User = {
  id: string,
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

export default function Contact() {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const [contactTopic, setContactTopic] = useState("")

  useEffect(() => {
    fetch("/api/getUser")
    .then(res => res.json())
    .then(data => {
      if(data.user) {
        setUser(data.user)
      }
    })

  }, [])

  async function handleSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget)
    const result = await sendMessage(formData, contactTopic)

    if(!result.success) {
      setError(result.error  || "")
    } else {
      if(result.success) {
        setSuccess("successfully send report to us")
      }
    }
  }

  const DefaulInputs = (user: User | null) => (
    <>
      <input type="text" name="contactName" defaultValue={user?.name} hidden />
      <input type="text" name="contactEmail" defaultValue={user?.email} hidden />
    </>
  )

  const topicForms: Record<string, JSX.Element> = {
    review: (
      <form onSubmit={handleSend}>
        {DefaulInputs(user)}
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
      <form onSubmit={handleSend}>
        {DefaulInputs(user)}
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
      <form onSubmit={handleSend}>
        {DefaulInputs(user)}
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
      <form onSubmit={handleSend}>
        {DefaulInputs(user)}
        <div>
          <label htmlFor="order_id">Order ID:</label>
          <input type="text" id="order_id" name="order_id" required />
        </div>
        <div>
          <label htmlFor="reason">Reason for Return:</label>
          <textarea id="reason" name="reason" rows={4} required />
        </div>
        <div>
          <label htmlFor="item_condition">Item Condition:</label>
          <input type="text" id="item_condition" name="item_condition" required />
        </div>
        <button type="submit">Send</button>
      </form>
    ),
  
    refund: (
      <form onSubmit={handleSend}>
        {DefaulInputs(user)}
        <div>
          <label htmlFor="order_id">Order ID:</label>
          <input type="text" id="order_id" name="order_id" required />
        </div>
        <div>
          <label htmlFor="reason">Reason for Refund:</label>
          <textarea id="reason" name="reason" rows={4} required />
        </div>
        <button type="submit">Send</button>
      </form>
    ),
  
    shipping: (
      <form onSubmit={handleSend}>
        {DefaulInputs(user)}
        <div>
          <label htmlFor="order_id">Order ID:</label>
          <input type="text" id="order_id" name="order_id" required />
        </div>
        <div>
          <label htmlFor="shipping_concern">Shipping Concern:</label>
          <textarea id="shipping_concern" name="shipping_concern" rows={4} required />
        </div>
        <button type="submit">Send</button>
      </form>
    ),
  
    product_question: (
      <form onSubmit={handleSend}>
        {DefaulInputs(user)}
        <div>
          <label htmlFor="product_name">Product Name:</label>
          <input type="text" id="product_name" name="product_name" required />
        </div>
        <div>
          <label htmlFor="product_question">Your Question:</label>
          <textarea id="product_question" name="product_question" rows={4} required />
        </div>
        <button type="submit">Send</button>
      </form>
    ),
  
    business: (
      <form onSubmit={handleSend}>
        {DefaulInputs(user)}
        <div>
          <label htmlFor="company_name">Company Name:</label>
          <input type="text" id="company_name" name="company_name" required />
        </div>
        <div>
          <label htmlFor="proposal">Business Proposal:</label>
          <textarea id="proposal" name="proposal" rows={6} required />
        </div>
        <button type="submit">Send</button>
      </form>
    ),
  }

  return (
    <div className='p-24 pl-2 pr-2'>
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
          {error && <p className='text-[tomato]'>{error}</p>}
          {success && <p className='text-[lime]'>{success}</p>}
        </div>
      </div>
    </div>
  )
}
