import { NextResponse } from 'next/server';

export const runtime = 'edge';

const TG_TOKEN = process.env.TG_TOKEN || '';
const TG_CHAT_ID = process.env.TG_CHAT_ID || '';
const B24_WEBHOOK = process.env.B24_WEBHOOK || '';

const esc = (s: unknown) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---------- Telegram gruppaga ---------- */
async function toTelegram(d: Record<string, string>) {
  if (!TG_TOKEN || !TG_CHAT_ID) return;

  const src = d.utm_source || '';
  const cont = d.utm_content || '';
  const joy = src && cont ? `${src} / ${cont}` : src || cont || '—';

  const vaqt = new Intl.DateTimeFormat('uz-UZ', {
    timeZone: 'Asia/Tashkent',
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date());

  const text =
    '🔥 <b>YANGI LID — BEPUL VIDEODARS</b>\n' +
    '━━━━━━━━━━━━━━━\n\n' +
    `👤 <b>Ismi:</b> ${esc(d.name)}\n` +
    `📞 <b>Telefon:</b> ${esc(d.phone)}\n` +
    `📍 <b>Kelgan joy:</b> ${esc(joy)}\n` +
    `🕐 <b>Tushgan vaqti:</b> ${vaqt}`;

  await fetch(`https://api.telegram.org/bot${TG_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TG_CHAT_ID,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    }),
  });
}

/* ---------- Bitrix24 ga ---------- */
async function toBitrix(d: Record<string, string>) {
  if (!B24_WEBHOOK) return;

  const body = new URLSearchParams();
  body.set('fields[TITLE]', `Bepul videodars — ${d.name}`);
  body.set('fields[NAME]', d.name);
  body.set('fields[PHONE][0][VALUE]', d.phone);
  body.set('fields[PHONE][0][VALUE_TYPE]', 'MOBILE');
  body.set('fields[SOURCE_ID]', 'WEB');
  body.set('fields[OPENED]', 'Y');
  if (d.utm_source) body.set('fields[UTM_SOURCE]', d.utm_source);
  if (d.utm_medium) body.set('fields[UTM_MEDIUM]', d.utm_medium);
  if (d.utm_campaign) body.set('fields[UTM_CAMPAIGN]', d.utm_campaign);
  if (d.utm_content) body.set('fields[UTM_CONTENT]', d.utm_content);

  await fetch(B24_WEBHOOK.replace(/\/$/, '') + '/crm.lead.add.json', {
    method: 'POST',
    body,
  });
}

export async function POST(req: Request) {
  let d: Record<string, string> = {};
  try {
    d = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 });
  }

  const name = String(d.name || '').trim().slice(0, 60);
  const phone = String(d.phone || '').replace(/[^\d+]/g, '').slice(0, 16);

  if (name.length < 2 || phone.replace(/\D/g, '').length !== 12) {
    return NextResponse.json({ ok: false, error: 'validation' }, { status: 400 });
  }

  const lead = {
    name,
    phone,
    utm_source: String(d.utm_source || '').slice(0, 80),
    utm_medium: String(d.utm_medium || '').slice(0, 80),
    utm_campaign: String(d.utm_campaign || '').slice(0, 80),
    utm_content: String(d.utm_content || '').slice(0, 80),
  };

  // Ikkalasi parallel — bittasi yiqilsa ikkinchisi baribir ishlaydi
  const r = await Promise.allSettled([toBitrix(lead), toTelegram(lead)]);
  r.forEach((x) => { if (x.status === 'rejected') console.error('lead:', x.reason); });

  return NextResponse.json({ ok: true });
}
