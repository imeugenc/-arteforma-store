import { appendFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { customOrderSchema } from "@/lib/schemas";
import { env, isProduction } from "@/lib/env";
import { getSupabaseAdminClient, isSupabaseConfigured } from "@/lib/supabase";

const MAX_FILE_SIZE = 8 * 1024 * 1024;

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

    const id = crypto.randomUUID();
    const payload = {
      id,
      created_at: new Date().toISOString(),
      ...validated,
      file_name: file instanceof File ? file.name : null,
      file_url: null as string | null,
      source: "website",
    };

    if (isSupabaseConfigured()) {
      const supabase = getSupabaseAdminClient();

      if (!supabase) {
        throw new Error("Clientul Supabase nu este disponibil.");
      }

      let uploadedFileUrl: string | null = null;

      if (file instanceof File && file.size > 0) {
        const filePath = `${id}/${file.name}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        const uploadResult = await supabase.storage
          .from(env.SUPABASE_CUSTOM_ORDERS_BUCKET)
          .upload(filePath, buffer, {
            contentType: file.type || "application/octet-stream",
            upsert: false,
          });

        if (uploadResult.error) {
          throw uploadResult.error;
        }

        const publicUrl = supabase.storage
          .from(env.SUPABASE_CUSTOM_ORDERS_BUCKET)
          .getPublicUrl(filePath);
        uploadedFileUrl = publicUrl.data.publicUrl;
      }

      const insertResult = await supabase
        .from(env.SUPABASE_CUSTOM_ORDERS_TABLE)
        .insert({
          ...payload,
          file_url: uploadedFileUrl,
        });

      if (insertResult.error) {
        throw insertResult.error;
      }

      return NextResponse.json({
        ok: true,
        id,
        message: "Solicitarea custom a fost primită. O analizăm și revenim cu următorul pas.",
      });
    }

    if (isProduction) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Comenzile custom nu sunt configurate încă. Conectează Supabase înainte de a accepta cereri reale.",
        },
        { status: 503 },
      );
    }

    await storeCustomOrderLocally({ id, payload, file });

    return NextResponse.json({
      ok: true,
      id,
      message:
        "Solicitarea custom a fost salvată în modul local de development. Configurează Supabase înainte de lansarea în producție.",
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
        : "Nu am putut trimite comanda ta custom acum.";

    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}

async function storeCustomOrderLocally({
  id,
  payload,
  file,
}: {
  id: string;
  payload: Record<string, unknown>;
  file: FormDataEntryValue | null;
}) {
  const dataDir = path.join(process.cwd(), "data");
  await mkdir(dataDir, { recursive: true });
  await appendFile(path.join(dataDir, "custom-orders.ndjson"), `${JSON.stringify(payload)}\n`, "utf8");

  if (file instanceof File && file.size > 0) {
    const uploadsDir = path.join(dataDir, "uploads");
    await mkdir(uploadsDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, `${id}-${file.name}`), buffer);
  }
}
