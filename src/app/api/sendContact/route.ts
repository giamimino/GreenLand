import { Resend } from "resend";
import { NextRequest, NextResponse } from "next/server";

type Object = {
  id: string,
  name: string,
  email: string,
  topic: string,
  job?: string,
  reviewText?: string,
  page?: string,
  bugDiscribe?: string,
  order_number?: number,
  date?: string,
  paid?: number,
  describe_cart?: string,
  issue_description?: string,
  reason?: string,
  item_condition?: string,
  shipping_concern?: string,
  product_name?: string,
  product_question?: string,
  company_name?: string,
  proposal?: string,
}

export async function POST(req: NextRequest) {
  const { object } = await req.json() as { object: Object }
  const resend =  new Resend(process.env.RESEND_API_KEY)

  const { error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: "devbytesyt@gmail.com",
    subject: 'GreenMind verify',
    html: `
    <h1>email: ${object.email}</h1>
    <h1>topic: ${object.topic}</h1>
    <p>name: ${object.name}</p>
    <p>id: ${object.id}</p>
    ${object.job && `<p>job: ${object.job}</p>`}
    ${object.reviewText && `<p>reviewText: ${object.reviewText}</p>`}
    ${object.page && `<p>page: ${object.page}</p>`}
    ${object.bugDiscribe && `<p>bugDiscribe: ${object.bugDiscribe}</p>`}
    ${object.order_number && `<p>order_number: ${object.order_number}</p>`}
    ${object.date && `<p>date: ${object.date}</p>`}
    ${object.paid && `<p>paid: ${object.paid}</p>`}
    ${object.describe_cart && `<p>describe_cart: ${object.describe_cart}</p>`}
    ${object.issue_description && `<p>issue_description: ${object.issue_description}</p>`}
    ${object.reason && `<p>reason: ${object.reason}</p>`}
    ${object.item_condition && `<p>item_condition: ${object.item_condition}</p>`}
    ${object.shipping_concern && `<p>shipping_concern: ${object.shipping_concern}</p>`}
    ${object.product_name && `<p>product_name: ${object.product_name}</p>`}
    ${object.product_question && `<p>product_question: ${object.product_question}</p>`}
    ${object.company_name && `<p>company_name: ${object.company_name}</p>`}
    ${object.proposal && `<p>proposal: ${object.proposal}</p>`}
    `,
  })

  if(error) {
    return NextResponse.json({success: false, error: error.message})
  }

  return NextResponse.json({success: true})
}