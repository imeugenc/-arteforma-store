import { appendFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { customOrderSchema } from "@/lib/schemas";
import { isProduction } from "@/lib/env";
import { siteConfig } from "@/lib/site";
import { buildCustomOrderEmail } from "@/lib/custom-order-email";
import { isEmailConfigured, sendEmail } from "@/lib/email";

const MAX_FILE_SIZE = 8 * 1024 * 1024;

type CustomOrderPayload = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  type: string;
  description: string;
  desiredSize?: string;
  colors?: string;
  budget?: string;
  deadline?: string;
  file_name: string | null;
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const validated = customOrderSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      type: formData.get("type"),
      description: formData.get("description"),
      desiredSize: formData.get("desiredSize"),
      colors: formData.get("colors"),
      budget: formData.get("budget"),
      deadline: formData.get("deadline"),
    });

    if (file instanceof File && file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          ok: false,
          message: "Te rugăm să încarci un fișier mai mic de 8 MB.",
        },
        { status: 400 },
      );
    }

    const payload: CustomOrderPayload = {
      id: crypto.randomUUID(),
      created_at: new Date().toISOString(),
      ...validated,
      file_name: file instanceof File && file.size > 0 ? file.name : null,
    };

    const emailContent = buildCustomOrderEmail(payload);
    const attachments =
      file instanceof File && file.size > 0
        ? [
            {
              filename: file.name,
              content: Buffer.from(await file.arrayBuffer()),
              contentType: file.type || "application/octet-stream",
            },
          ]
        : undefined;

    if (isEmailConfigured()) {
      await sendEmail({
        subject: emailContent.subject,
        html: emailContent.html,
        text: emailContent.text,
        replyTo: payload.email,
        attachments,
      });

      return NextResponse.json({
        ok: true,
        id: payload.id,
        message: "Cererea a fost trimisă. Revenim pe email în 12–24h.",
      });
    }

    if (isProduction) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Fluxul de email pentru cereri personalizate nu este configurat încă. Configurează SMTP înainte de a folosi formularul live.",
        },
        { status: 503 },
      );
    }

    await storeCustomOrderLocally({ payload, file, emailContent });

    return NextResponse.json({
      ok: true,
      id: payload.id,
      message: "Cererea a fost trimisă. Revenim pe email în 12–24h.",
      mode: "development-fallback",
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          ok: false,
          message: error.issues[0]?.message ?? "Datele formularului nu sunt valide.",
          issues: error.flatten(),
        },
        { status: 400 },
      );
    }

    const message =
      error instanceof Error
        ? error.message
        : `Nu am putut trimite cererea acum. Scrie-ne direct la ${siteConfig.email}.`;

    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

async function storeCustomOrderLocally({
  payload,
  file,
  emailContent,
}: {
  payload: CustomOrderPayload;
  file: FormDataEntryValue | null;
  emailContent: { subject: string; html: string; text: string };
}) {
  const dataDir = path.join(process.cwd(), "data");
  await mkdir(dataDir, { recursive: true });
  await appendFile(path.join(dataDir, "custom-orders.ndjson"), `${JSON.stringify(payload)}\n`, "utf8");
  await appendFile(
    path.join(dataDir, "custom-order-emails.ndjson"),
    `${JSON.stringify({ subject: emailContent.subject, text: emailContent.text, created_at: payload.created_at })}\n`,
    "utf8",
  );

  if (file instanceof File && file.size > 0) {
    const uploadsDir = path.join(dataDir, "uploads");
    await mkdir(uploadsDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, `${payload.id}-${file.name}`), buffer);
  }
}
