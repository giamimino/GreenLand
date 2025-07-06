import { Resend } from 'resend';

export async function sendVerificationCodeEmail(to: string) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const { error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to,
    subject: 'GreenMind verify',
    html: `<h1>Code: ${code}</h1><p>Expires in 15 minutes</p>`,
  });

  if (error) {
    throw new Error(error.message);
  }

  return code;
}