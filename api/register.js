import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email } = req.body;

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "rebecca.bergekrans@gmail.com",
      subject: "New registration SynCHRO",
      html: `
        <h2>New signup</h2>
        <p>Name: ${name}</p>
        <p>Email: ${email}</p>
      `,
    });

    res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
}
