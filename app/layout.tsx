import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';

export const metadata: Metadata = {
  title: 'TOP 5% treyderlarning strategiya va tizimi — BEPUL videodars',
  description:
    '30 daqiqalik bepul videodars. YETIM strategiyasi, tizim, backtest va psixologiya. Jasur Kalonov.',
  openGraph: {
    title: 'TOP 5% treyderlarning strategiya va tizimi — BEPUL videodars',
    description: '30 daqiqalik bepul videodars. YETIM strategiyasi to‘liq ochib berilgan.',
    type: 'website',
    locale: 'uz_UZ',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#060809',
};

const FB = process.env.NEXT_PUBLIC_FB_PIXEL || '1047974701354978';
const YM = process.env.NEXT_PUBLIC_YM_ID;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {FB && (
          <script
            dangerouslySetInnerHTML={{
              __html:
                `if(!window.__fbPixel){window.__fbPixel=1;` +
                `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?` +
                `n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;` +
                `n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;` +
                `t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,` +
                `document,'script','https://connect.facebook.net/en_US/fbevents.js');` +
                `fbq('init', '${FB}');fbq('track', 'PageView');}`,
            }}
          />
        )}
      </head>
      <body>
        {children}

        {YM && (
          <Script id="ym" strategy="afterInteractive">
            {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],
            k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');
            ym(${YM},'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true});
            window.YM_ID=${YM};`}
          </Script>
        )}
      </body>
    </html>
  );
}
