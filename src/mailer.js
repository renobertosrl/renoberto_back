const BREVO_API = 'https://api.brevo.com/v3/smtp/email';

export async function sendContactNotification(msg) {
  const key = process.env.BREVO_API_KEY;
  if (!key) return; // Brevo not configured — skip silently

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
      <h2 style="margin:0 0 24px;color:#1a1815">Nouveau message — Renoberto</h2>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:8px 0;color:#888;width:110px">Nom</td><td style="padding:8px 0"><strong>${msg.name}</strong></td></tr>
        <tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0"><a href="mailto:${msg.email}">${msg.email}</a></td></tr>
        ${msg.phone ? `<tr><td style="padding:8px 0;color:#888">Téléphone</td><td style="padding:8px 0"><a href="tel:${msg.phone}">${msg.phone}</a></td></tr>` : ''}
        ${msg.subject ? `<tr><td style="padding:8px 0;color:#888">Sujet</td><td style="padding:8px 0">${msg.subject}</td></tr>` : ''}
      </table>
      <div style="margin-top:24px;padding:20px;background:#f5f3f0;border-radius:8px;line-height:1.6">
        ${msg.body.replace(/\n/g, '<br>')}
      </div>
      <p style="margin-top:24px;color:#888;font-size:13px">
        Reçu le ${new Date().toLocaleDateString('fr-BE', { weekday:'long', year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })}
      </p>
    </div>
  `;

  await fetch(BREVO_API, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': key,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      sender:      { name: 'Renoberto Site', email: process.env.BREVO_SENDER || 'renobertosrl@gmail.com' },
      to:          [{ email: process.env.NOTIFY_EMAIL || 'renobertosrl@gmail.com', name: 'Renoberto' }],
      replyTo:     { email: msg.email, name: msg.name },
      subject:     `📩 Nouveau devis — ${msg.name}${msg.subject ? ` · ${msg.subject}` : ''}`,
      htmlContent: html,
    }),
  });
}
