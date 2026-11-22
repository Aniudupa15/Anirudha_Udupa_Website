import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import "./globals.css";
import "./appmode.css";
import "./phoneos.css";
import "./phoneos-themes.css";
import "./phoneos-polish.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "Anirudha Udupa · Flutter and full-stack developer",
  description:
    "Anirudha Udupa builds production-ready mobile and web apps with Flutter, FastAPI and Firebase. See RentEase, Money Plan, PunchIn and more.",
  openGraph: {
    title: "Anirudha Udupa · Flutter and full-stack developer",
    description: "Production-ready mobile and web apps with Flutter, FastAPI and Firebase.",
    images: ["/img/me.webp"],
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#0b0b0c", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js');if(location.search.indexOf('embed=1')>-1)document.documentElement.classList.add('embed');try{if(matchMedia('(pointer: coarse) and (max-width: 820px)').matches&&!sessionStorage.getItem('au-site'))document.documentElement.classList.add('phone-os');}catch(e){}history.scrollRestoration='manual';var f=function(e){var t=e.target;return t&&t.closest&&t.closest('input,textarea,[contenteditable=true]')};['copy','cut','selectstart','dragstart','contextmenu'].forEach(function(n){document.addEventListener(n,function(e){if(!f(e))e.preventDefault()})});document.addEventListener('mousedown',function(e){if(e.detail>1&&!f(e))e.preventDefault()});document.addEventListener('keydown',function(e){var k=(e.key||'').toLowerCase();if((e.ctrlKey||e.metaKey)&&(k==='c'||k==='a'||k==='x'||k==='s'||k==='u'||k==='p')&&!f(e))e.preventDefault()});" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
