'use client';

const BOT = process.env.NEXT_PUBLIC_BOT_URL || 'https://telegram.me/jasur_kalanov_bot?start=w59723114';

export default function BotStep() {
  const click = () => {
    if (typeof (window as any).fbq === 'function') {
      (window as any).fbq('track', 'CompleteRegistration');
    }
  };

  return (
    <>
      {/* Qadamlar — 2-qadam faol */}
      <div className="steps-bar">
        <div className="steps-in">
          <div className="stp on"><div className="b">✓</div><div className="t">Sayt</div></div>
          <div className="dash" />
          <div className="stp on"><div className="b">2</div><div className="t">Bot</div></div>
          <div className="dash" />
          <div className="stp"><div className="b">3</div><div className="t">Video</div></div>
        </div>
      </div>

      <div className="st2">
        <div className="wrap">
          <div className="tk">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#04240F"
                 strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div className="ok-t">1-qadam bajarildi</div>

          <div className="bx">
            <span className="hd">✋</span>
            <h1>To‘xtang!</h1>
            <h2>2 ta qadam qoldi</h2>

            <p>Video havolasini <b>Telegram bot</b> yuboradi.</p>
            <p>Botga <b>/start</b> bosing — havola darhol keladi.</p>

            <div className="wr">⚠️ Botga o‘tmasangiz videoni ko‘ra olmaysiz!</div>

            <a href={BOT} className="btn btn-tg" onClick={click} rel="noopener">
              Botga o‘tish va /start bosish
            </a>

            <div className="ct">
              Botga o‘tish uchun <b>yuqoridagi tugmani bosing</b>
            </div>
          </div>

          <div className="q">
            <div className="qi">
              <div className="qn ok">✓</div>
              <div className="qt">Ro‘yxatdan o‘tdingiz<span>Bajarildi</span></div>
            </div>
            <div className="qi">
              <div className="qn">2</div>
              <div className="qt">Botga /start bosing<span>Hozir</span></div>
            </div>
            <div className="qi">
              <div className="qn">3</div>
              <div className="qt">Videoni ko‘ring<span>30 daqiqa</span></div>
            </div>
          </div>

          <p className="disc" style={{ textAlign: 'center', marginTop: 18 }}>
            Treyding kapital yo‘qotish riski bilan bog‘liq. Natija kafolatlanmaydi.
          </p>
        </div>
      </div>
    </>
  );
}
