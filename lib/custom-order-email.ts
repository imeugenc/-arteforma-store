type CustomOrderEmailPayload = {
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
  file_name?: string | null;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function row(label: string, value?: string | null) {
  if (!value) {
    return "";
  }

  return `<tr>
    <td style="padding:8px 0;color:#d7a12a;font-weight:600;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="padding:8px 0;color:#f3f0e8;">${escapeHtml(value).replaceAll("\n", "<br />")}</td>
  </tr>`;
}

export function buildCustomOrderEmail(payload: CustomOrderEmailPayload) {
  const subject = "New Custom Order Request – ArteForma";
  const html = `
    <div style="background:#070707;padding:32px;font-family:Arial,sans-serif;color:#f3f0e8;">
      <div style="max-width:720px;margin:0 auto;background:#111;border:1px solid rgba(215,161,42,0.18);border-radius:24px;padding:28px;">
        <p style="margin:0;color:#d7a12a;font-size:12px;letter-spacing:0.35em;text-transform:uppercase;">ArteForma</p>
        <h1 style="margin:18px 0 8px;font-size:28px;line-height:1.2;">New Custom Order Request</h1>
        <p style="margin:0 0 20px;color:#bdb7aa;">Cerere nouă trimisă din formularul de pe site.</p>
        <table style="width:100%;border-collapse:collapse;">
          ${row("ID", payload.id)}
          ${row("Trimis la", payload.created_at)}
          ${row("Nume", payload.name)}
          ${row("Email", payload.email)}
          ${row("Telefon", payload.phone)}
          ${row("Tip", payload.type)}
          ${row("Dimensiune dorită", payload.desiredSize)}
          ${row("Finisaj / culori", payload.colors)}
          ${row("Buget", payload.budget)}
          ${row("Termen limită", payload.deadline)}
          ${row("Fișier", payload.file_name)}
          ${row("Descriere", payload.description)}
        </table>
      </div>
    </div>
  `;

  const text = [
    "New Custom Order Request – ArteForma",
    "",
    `ID: ${payload.id}`,
    `Trimis la: ${payload.created_at}`,
    `Nume: ${payload.name}`,
    `Email: ${payload.email}`,
    `Telefon: ${payload.phone}`,
    `Tip: ${payload.type}`,
    payload.desiredSize ? `Dimensiune dorită: ${payload.desiredSize}` : "",
    payload.colors ? `Finisaj / culori: ${payload.colors}` : "",
    payload.budget ? `Buget: ${payload.budget}` : "",
    payload.deadline ? `Termen limită: ${payload.deadline}` : "",
    payload.file_name ? `Fișier: ${payload.file_name}` : "",
    "",
    "Descriere:",
    payload.description,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}
