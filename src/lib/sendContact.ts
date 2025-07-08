import { Resend } from 'resend';

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
}

export async function sendContact(object: Object) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: "devbytesyt@gmail.com",
    subject: 'GreenMind verify',
    html: `
    <h1>email: ${object.email}</h1>
    <h1>topic: ${object.topic}</h1>
    <p>name: ${object.name}</p>
    <p>id: ${object.id}</p>
    <p>job: ${object.job}</p>
    <p>reviewText: ${object.reviewText}</p>
    <p>page: ${object.page}</p>
    <p>bugDiscribe: ${object.bugDiscribe}</p>
    <p>order_number: ${object.order_number}</p>
    <p>date: ${object.date}</p>
    <p>paid: ${object.paid}</p>
    <p>describe_cart: ${object.describe_cart}</p>
    <p>issue_description: ${object.issue_description}</p>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}