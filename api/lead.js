import { createHash } from 'node:crypto';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ success: false });
  const allowed = new Set(['https://rehabclinicclub.com.br', 'https://www.rehabclinicclub.com.br', 'https://landing-rehab.vercel.app']);
  if (!allowed.has(req.headers.origin)) return res.status(403).json({ success: false });
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM_EMAIL) {
    console.error('lead_configuration_missing', { apiKey: Boolean(process.env.RESEND_API_KEY), sender: Boolean(process.env.RESEND_FROM_EMAIL) });
    return res.status(503).json({ success: false });
  }
  const data = req.body;
  if (!data || typeof data !== 'object' || JSON.stringify(data).length > 12000) return res.status(400).json({ success: false });
  const text = key => typeof data[key] === 'string' ? data[key].trim() : '';
  const name = text('name'), clinic = text('clinic'), email = text('email'), phone = text('phone'), challenge = text('challenge');
  if (name.length < 3 || name.length > 120 || clinic.length < 2 || clinic.length > 160 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 || !/^\d{10,11}$/.test(phone) || !challenge || challenge.length > 300 || data.consent !== true || data.website) return res.status(400).json({ success: false });
  const body = {
    from: process.env.RESEND_FROM_EMAIL,
    to: ['alphaplaybrasil@gmail.com'],
    reply_to: email,
    subject: 'Nova aplicação — REHAB Clinic Club',
    text: `Nome: ${name}\nClínica: ${clinic}\nE-mail: ${email}\nWhatsApp: ${phone}\nPrincipal desafio: ${challenge}\n\nConsentimento para contato: Sim\nRecebido em: ${new Date().toISOString()}`,
  };
  const key = req.headers['idempotency-key'];
  const digest = createHash('sha256').update(JSON.stringify({ name, clinic, email, phone, challenge })).digest('hex');
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `lead-${typeof key === 'string' && /^[a-f0-9-]{36}$/.test(key) ? key : digest}-${digest}` },
      body: JSON.stringify(body), signal: AbortSignal.timeout(10000),
    });
    const result = await response.json();
    if (!response.ok || !result.id) {
      console.error('lead_provider_rejected', { status: response.status, code: result.name });
      return res.status(502).json({ success: false });
    }
    return res.status(200).json({ success: true });
  } catch { return res.status(502).json({ success: false }); }
}
