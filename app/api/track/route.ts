import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const payload = {
    timestamp: new Date().toISOString(),
    ...body,
  };

  try {
    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, "tracking.ndjson"), `${JSON.stringify(payload)}\n`, "utf8");
  } catch {
    // Tracking should never block user actions in read-only environments.
  }

  return NextResponse.json({ ok: true });
}
