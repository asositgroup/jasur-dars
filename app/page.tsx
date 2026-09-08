'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

/* ============================================================
   BARCHA MATNLAR SHU YERDA — o'zgartirish uchun faqat shu blok
   ============================================================ */
const T = {
  title: 'TOP 5% treyderlarning',
  titleG: 'strategiya va tizimi',
  sub1: '30 daqiqalik videodars.',
  subFree: 'Bepul.',
  sub2: 'YETIM strategiyasi to‘liq ochib berilgan.',
  coverTitle: 'TOP 5% treyderlarning strategiya va tizimi',
  coverMeta: 'Jasur Kalonov · 30 daqiqa',
  cta: 'Videoni bepul ochish →',
  ctaNote1: 'Narxi: ',
  ctaNote2: '0 so‘m',
  ctaNote3: ' · Faqat 24 soat',

  cards: [
    { ic: '🎯', t: 'YETIM strategiyasi',
      d: 'Qoidalari to‘liq ochiladi — qanday topiladi, qayerga limit qo‘yiladi, qachon umuman kirilmaydi.' },
    { ic: '⚙️', t: 'Tizim',
      d: 'Strategiya — bu qachon kirish. Tizim — qachon kirish, qancha risk qilish, qachon chiqish va qachon savdo qilmaslik.' },
    { ic: '📊', t: 'Backtest',
      d: 'Strategiyangiz ishlaydimi yoki yo‘q — real pul tikmasdan qanday tekshirish kerak.' },
    { ic: '🧠', t: 'Psixologiya',
      d: 'Nega qoidangizni o‘zingiz buzasiz va buni qanday to‘xtatish mumkin.' },
  ],

  who: [
    'Strategiya, tizim va backtestsiz, omadga ishonib bozorga kirayotganlar',
    'Ko‘p marta sliv bo‘lib, sababini tushunmayotganlar',
    'Kurslarda o‘qib, YouTube ko‘rib, lekin natijaga chiqa olmaganlar',
    'Grafikka qarab, keyin qayerga ketishini bilmayotganlar',
  ],

  qadam: [
    ['Saytdan ro‘yxatdan o‘ting', 'Ism va telefon — 10 soniya'],
    ['Botga /start bosing', 'Telegram ochiladi'],
    ['Videoni ko‘ring', 'Bot havolani darhol yuboradi'],
  ],

  about: [
    '2019-yildan beri treyding bilan shug‘ullanaman va shu bilan birga odamlarga o‘rgatib kelaman.',
    'Shu vaqt ichida <b>1,500 dan ortiq o‘quvchi</b> — noldan boshlaganlaridan tortib, yillar davomida daromadga chiqa olmaganlargacha.',
    'Bu videodarsda nazariya emas, <b>o‘zim har kuni ishlatadigan strategiya va tizimni</b> ko‘rsataman.',
  ],
  stats: [['7 yil', 'bozorda'], ['1,500+', 'o‘quvchi'], ['30 daq', 'videodars']],
};

const HOURS = 24; // video necha soatdan keyin "o'chadi"

export default function Page() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [hp, setHp] = useState('');
  const [badName, setBadName] = useState(false);
  const [badPhone, setBadPhone] = useState(false);
  const [sending, setSending] = useState(false);
  const [left, setLeft] = useState('24:00:00');

  /* ---------- UTM ---------- */
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
    const found: Record<string, string> = {};
    keys.forEach((k) => { const v = p.get(k); if (v) found[k] = v; });
    if (Object.keys(found).length) sessionStorage.setItem('utm', JSON.stringify(found));
  }, []);

  /* ---------- 24 soatlik taymer (har bir tashrifchiga o'zining oynasi) ---------- */
  useEffect(() => {
    const KEY = 'jk_deadline';
    let d = Number(localStorage.getItem(KEY));
    if (!d || Number.isNaN(d)) {
      d = Date.now() + HOURS * 3600 * 1000;
      localStorage.setItem(KEY, String(d));
    }
    const tick = () => {
      const s = Math.max(0, Math.floor((d - Date.now()) / 1000));
      const h = String(Math.floor(s / 3600)).padStart(2, '0');
      const m = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
      const x = String(s % 60).padStart(2, '0');
      setLeft(`${h}:${m}:${x}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const openForm = useCallback(() => {
    setOpen(true);
    document.body.style.overflow = 'hidden';
    if (typeof (window as any).fbq === 'function') (window as any).fbq('track', 'InitiateCheckout');
  }, []);

  const closeForm = useCallback(() => {
    setOpen(false);
    document.body.style.overflow = '';
  }, []);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && closeForm();
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [closeForm]);

  /* ---------- Telefon maskasi ---------- */
  const onPhone = (raw: string) => {
    let d = raw.replace(/\D/g, '');
    if (d.startsWith('998')) d = d.slice(3);
    d = d.slice(0, 9);
    let out = '+998 ';
    if (d.length > 0) out += '(' + d.slice(0, 2);
    if (d.length >= 2) out += ') ';
    if (d.length > 2) out += d.slice(2, 5);
    if (d.length > 5) out += '-' + d.slice(5, 7);
    if (d.length > 7) out += '-' + d.slice(7, 9);
    setPhone(out);
    setBadPhone(false);
  };

  /* ---------- Yuborish ---------- */
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hp) return;

    const digits = phone.replace(/\D/g, '');
    let ok = true;
    if (name.trim().length < 2) { setBadName(true); ok = false; }
    if (digits.length !== 12) { setBadPhone(true); ok = false; }
    if (!ok) return;

    setSending(true);

    let utm: Record<string, string> = {};
    try { utm = JSON.parse(sessionStorage.getItem('utm') || '{}'); } catch {}

    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), phone: '+' + digits, ...utm }),
      });
    } catch {
      /* xato bo'lsa ham odamni botga o'tkazamiz */
    }

    if (typeof (window as any).fbq === 'function') (window as any).fbq('track', 'Lead');
    if (typeof (window as any).ym === 'function' && (window as any).YM_ID) {
      (window as any).ym((window as any).YM_ID, 'reachGoal', 'lead');
    }

    router.push('/bot');
  };

  const Cta = () => (
    <>
      <button className="btn" onClick={openForm}>{T.cta}</button>
      <div className="bn">{T.ctaNote1}<b>{T.ctaNote2}</b>{T.ctaNote3}</div>
    </>
  );

  const Timer = () => (
    <div className="urg">
      <span className="d" />
      <span className="txt">Video o‘chishiga <b>{left}</b> qoldi</span>
    </div>
  );

  return (
    <>
      {/* ---------- QADAMLAR ---------- */}
      <div className="steps-bar">
        <div className="steps-in">
          <div className="stp on"><div className="b">1</div><div className="t">Sayt</div></div>
          <div className="dash" />
          <div className="stp"><div className="b">2</div><div className="t">Bot</div></div>
          <div className="dash" />
          <div className="stp"><div className="b">3</div><div className="t">Video</div></div>
        </div>
      </div>

      {/* ---------- HERO ---------- */}
      <header className="hero">
        <div className="wrap">
          <Timer />
          <h1>{T.title}<br /><span className="g">{T.titleG}</span></h1>
          <p className="h-sub">
            {T.sub1} <b>{T.subFree}</b><br />{T.sub2}
          </p>

          <div className="cover" onClick={openForm}>
            <Image src="/cover.jpg" alt="Jasur Kalonov" width={1920} height={1080} priority />
            <div className="ov" />
            <div className="lock">🔒 Yopiq</div>
            <div className="free">BEPUL</div>
            <div className="in">
              <div className="play">
                <svg width="24" height="26" viewBox="0 0 24 26" fill="#04240F"><path d="M22 13L2 25V1z" /></svg>
              </div>
              <div className="ttl">{T.coverTitle}</div>
              <div className="meta">{T.coverMeta}</div>
            </div>
          </div>

          <Cta />
        </div>
      </header>

      {/* ---------- VIDEODARSDA NIMA BOR ---------- */}
      <section>
        <div className="wrap">
          <h2>Videodarsda <span className="g">nima bor</span></h2>
          <div className="cards">
            {T.cards.map((c, i) => (
              <div className="card" key={i}>
                <div className="ic">{c.ic}</div>
                <div><h3>{c.t}</h3><p>{c.d}</p></div>
              </div>
            ))}
          </div>
          <Cta />
        </div>
      </section>

      {/* ---------- KIMLAR UCHUN ---------- */}
      <section>
        <div className="wrap">
          <h2>Bu video <span className="g">kimlar uchun</span></h2>
          {T.who.map((w, i) => (
            <div className="li" key={i}><i>✕</i><span>{w}</span></div>
          ))}
        </div>
      </section>

      {/* ---------- 3 QADAM ---------- */}
      <section>
        <div className="wrap">
          <h2>Videoni ochish — <span className="g">3 ta qadam</span></h2>
          <div className="q">
            {T.qadam.map(([t, s], i) => (
              <div className="qi" key={i}>
                <div className="qn">{i + 1}</div>
                <div className="qt">{t}<span>{s}</span></div>
              </div>
            ))}
          </div>
          <Cta />
        </div>
      </section>

      {/* ---------- JASUR ---------- */}
      <section>
        <div className="wrap">
          <h2>Jasur <span className="g">Kalonov</span></h2>
          <div className="ab">
            <div className="ab-img">
              <Image src="/jasur.jpg" alt="Jasur Kalonov" width={830} height={1400} />
            </div>
            <div>
              {T.about.map((p, i) => (
                <p key={i} dangerouslySetInnerHTML={{ __html: p }} />
              ))}
              <div className="st3">
                {T.stats.map(([v, l], i) => (
                  <div key={i}><div className="v">{v}</div><div className="l">{l}</div></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- YAKUNIY ---------- */}
      <section style={{ borderBottom: '1px solid var(--line)' }}>
        <div className="wrap">
          <h2 style={{ textAlign: 'center' }}>Video <span className="g">24 soatdan keyin o‘chadi</span></h2>
          <Timer />
          <Cta />
        </div>
      </section>

      <footer>
        <div className="wrap">
          <p className="disc">
            Treyding kapital yo‘qotish riski bilan bog‘liq. Natija kafolatlanmaydi.<br />
            © {new Date().getFullYear()} Jasur Kalonov
          </p>
        </div>
      </footer>

      {/* ---------- MODAL ---------- */}
      <div
        className={'mb' + (open ? ' open' : '')}
        onClick={(e) => { if (e.target === e.currentTarget) closeForm(); }}
      >
        <div className="md">
          <button className="cl" onClick={closeForm} aria-label="Yopish">&times;</button>
          <div className="bg">🔓 1-qadam · Ro‘yxatdan o‘tish</div>
          <h3>Videoni <span>bepul</span> ochish uchun</h3>
          <div className="ms">Ma‘lumotlaringizni qoldiring — keyin bot sizga video havolasini yuboradi.</div>

          <form onSubmit={submit} noValidate>
            <div className={'fl' + (badName ? ' bad' : '')}>
              <label htmlFor="n">Ismingiz</label>
              <input id="n" type="text" placeholder="Ismingiz" maxLength={40} autoComplete="given-name"
                value={name} onChange={(e) => { setName(e.target.value); setBadName(false); }} />
              <div className="er">Ismingizni kiriting</div>
            </div>

            <div className={'fl' + (badPhone ? ' bad' : '')}>
              <label htmlFor="p">Telefon raqamingiz</label>
              <input id="p" type="tel" inputMode="numeric" autoComplete="tel"
                placeholder="+998 (__) ___-__-__" value={phone}
                onFocus={() => { if (!phone) setPhone('+998 '); }}
                onChange={(e) => onPhone(e.target.value)} />
              <div className="er">Raqamni to‘liq kiriting</div>
            </div>

            <input className="hp" type="text" tabIndex={-1} autoComplete="off"
              value={hp} onChange={(e) => setHp(e.target.value)} />

            <button className={'btn' + (sending ? ' ld' : '')} type="submit" disabled={sending}>
              <span className="sp" />{sending ? 'Ochilmoqda…' : 'Videoni ochish →'}
            </button>

            <div className="pv">
              <span>🔒</span>
              <span>Ma‘lumotlaringiz uchinchi shaxsga berilmaydi.</span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
