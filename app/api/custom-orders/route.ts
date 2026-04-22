import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const entries = Object.fromEntries(formData.entries());

    const file = formData.get("file") as File | null;

    const attachments: Array<{
      filename: string;
      content: Buffer;
    }> = [];

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      attachments.push({
        filename: file.name,
        content: buffer,
      });
    }

    const html = Object.entries(entries)
      .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
      .join("");

    if (!resend) {
      throw new Error("Email failed");
    }

    await resend.emails.send({
      from: "ArteForma <contact@arteforma.ro>",
      to: ["contact@arteforma.ro"],
      subject: "New Custom Order Request – ArteForma",
      html,
      attachments,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: "Email failed" }), { status: 500 });
  }
}
