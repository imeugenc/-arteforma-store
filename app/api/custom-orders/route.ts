import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const resendFrom = process.env.RESEND_FROM_EMAIL || "ArteForma <onboarding@resend.dev>";
const contactEmail = "contact@arteforma.ro";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const entries = Object.fromEntries(formData.entries());
    const customerEmail = String(formData.get("email") ?? "").trim();
    const customerName = String(formData.get("name") ?? "").trim();

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
      return new Response(
        JSON.stringify({
          ok: false,
          message: "Formularul nu este configurat încă pentru trimitere.",
        }),
        { status: 500 },
      );
    }

    await resend.emails.send({
      from: resendFrom,
      to: [contactEmail],
      replyTo: customerEmail || undefined,
      subject: "New Custom Order Request – ArteForma",
      html,
      attachments,
    });

    if (customerEmail) {
      await resend.emails.send({
        from: resendFrom,
        to: [customerEmail],
        replyTo: contactEmail,
        subject: "Am primit cererea ta personalizată – ArteForma",
        html: `
          <div style="font-family:Arial,sans-serif;background:#0a0a0a;color:#f3f0e8;padding:32px;">
            <div style="max-width:640px;margin:0 auto;background:#121212;border:1px solid rgba(215,161,42,0.18);border-radius:24px;padding:28px;">
              <p style="margin:0 0 10px;color:#d7a12a;letter-spacing:0.28em;text-transform:uppercase;font-size:12px;">ArteForma</p>
              <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;">Cererea ta a fost trimisă.</h1>
              <p style="margin:0 0 14px;color:#d7d2c4;">${customerName ? `Salut, ${customerName}.` : "Salut."}</p>
              <p style="margin:0 0 14px;color:#d7d2c4;">Am primit cererea ta personalizată și revenim pe email în 12–24h cu un răspuns clar legat de fezabilitate, material și următorii pași.</p>
              <p style="margin:0 0 14px;color:#d7d2c4;">Dacă vrei să adaugi detalii între timp, ne poți scrie direct la ${contactEmail}.</p>
              <p style="margin:20px 0 0;color:#a9a08d;font-size:14px;">ArteForma, Brașov</p>
            </div>
          </div>
        `,
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        success: true,
        message: "Cererea a fost trimisă. Revenim pe email în 12–24h.",
      }),
      { status: 200 },
    );
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Solicitarea nu a putut fi trimisă.";

    return new Response(
      JSON.stringify({
        ok: false,
        error: "Email failed",
        message,
      }),
      { status: 500 },
    );
  }
}
