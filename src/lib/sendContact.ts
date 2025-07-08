import { Resend } from 'resend';

type ContactObject = {
  id: string;
  name: string;
  email: string;
  topic: string;
  job?: string;
  reviewText?: string;
  page?: string;
  bugDiscribe?: string;
  order_number?: number;
  date?: string;
  paid?: number;
  describe_cart?: string;
  issue_description?: string;
  reason?: string;
  item_condition?: string;
  shipping_concern?: string;
  product_name?: string;
  product_question?: string;
  company_name?: string;
  proposal?: string;
};

export async function sendContact(object: ContactObject) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'devbytesyt@gmail.com',
    subject: 'GreenMind Contact Form',
    html: `
      <h1>Contact Details</h1>
      <h2><strong>Email:</strong> ${object.email}</h2>
      <h2><strong>Topic:</strong> ${object.topic}</h2>
      <p><strong>Name:</strong> ${object.name}</p>
      <p><strong>ID:</strong> ${object.id}</p>

      ${object.job ? `<p><strong>Job:</strong> ${object.job}</p>` : ""}
      ${object.reviewText ? `<p><strong>Review:</strong> ${object.reviewText}</p>` : ""}
      ${object.page ? `<p><strong>Page:</strong> ${object.page}</p>` : ""}
      ${object.bugDiscribe ? `<p><strong>Bug:</strong> ${object.bugDiscribe}</p>` : ""}
      ${object.order_number ? `<p><strong>Order #:</strong> ${object.order_number}</p>` : ""}
      ${object.date ? `<p><strong>Date:</strong> ${object.date}</p>` : ""}
      ${object.paid !== undefined ? `<p><strong>Paid:</strong> ${object.paid}</p>` : ""}
      ${object.describe_cart ? `<p><strong>Cart:</strong> ${object.describe_cart}</p>` : ""}
      ${object.issue_description ? `<p><strong>Issue:</strong> ${object.issue_description}</p>` : ""}
      ${object.reason ? `<p><strong>Reason:</strong> ${object.reason}</p>` : ""}
      ${object.item_condition ? `<p><strong>Condition:</strong> ${object.item_condition}</p>` : ""}
      ${object.shipping_concern ? `<p><strong>Shipping:</strong> ${object.shipping_concern}</p>` : ""}
      ${object.product_name ? `<p><strong>Product:</strong> ${object.product_name}</p>` : ""}
      ${object.product_question ? `<p><strong>Product Question:</strong> ${object.product_question}</p>` : ""}
      ${object.company_name ? `<p><strong>Company:</strong> ${object.company_name}</p>` : ""}
      ${object.proposal ? `<p><strong>Proposal:</strong> ${object.proposal}</p>` : ""}
    `,
  });

  if (error) {
    throw new Error(error.message);
  }

  return error? error : ""
}
