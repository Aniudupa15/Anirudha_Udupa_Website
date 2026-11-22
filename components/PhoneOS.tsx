"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { awards, contact, experience, moreWork, skills, stats, work } from "@/lib/content";
import { Memory, Snake, TicTacToe } from "./PhoneGames";

type Platform = "ios" | "android";
type Theme = "light" | "dark";

/* ---------- App catalogue ---------- */
type AppId =
  | "rentease" | "moneyplan" | "punchin" | "cleankudla" | "judica" | "trackin" | "swachsetu"
  | "photos" | "about" | "contact" | "skills" | "journey" | "awards" | "resume" | "linkedin" | "github" | "settings" | "games"
  | "phone" | "whatsapp" | "mail" | "browser";

type App = { id: AppId; name: string; bg: string; icon: React.ReactNode; external?: string };

/* real, running builds of my apps */
const LIVE: Partial<Record<AppId, { url: string; note: string }>> = {
  rentease: { url: "https://rentease-app-hkrb.onrender.com", note: "The live RentEase web app. The free server may take up to a minute to wake up." },
  punchin: { url: "/apps/punchin/index.html", note: "The real PunchIn Flutter web build." },
  cleankudla: { url: "/apps/cleankudla/index.html", note: "The real Clean Kudla Flutter web build." },
  judica: { url: "/apps/judica/index.html", note: "The real Judica Flutter web build." },
  trackin: { url: "/apps/trackin/index.html", note: "The real TrackIn Flutter web build. Face recognition needs a camera." },
};

const WA_NUMBER = contact.phone.replace(/[^0-9]/g, "");
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi Anirudha, I saw your portfolio and would like to talk.")}`;

const svg = (children: React.ReactNode, opts: { fill?: string; stroke?: string; size?: number } = {}) => (
  <svg viewBox="0 0 24 24" width={opts.size ?? 30} height={opts.size ?? 30} fill={opts.fill ?? "none"} stroke={opts.stroke ?? "none"} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const line = (d: string, color = "#fff") => svg(<path d={d} />, { stroke: color });

/* brand-style glyphs */
const I = {
  phone: svg(<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" />, { fill: "#fff" }),
  whatsapp: (
    <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
      <path d="M12 2.5a9.4 9.4 0 0 0-8.1 14.2L2.6 21.4l4.8-1.3A9.4 9.4 0 1 0 12 2.5z" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8.6 7.3c.2-.4.4-.4.7-.4h.5c.2 0 .4 0 .6.4l.8 1.9c.1.2.1.4 0 .6l-.4.6c-.1.2-.2.3 0 .6.4.7 1 1.4 1.6 1.9.7.6 1.3.9 1.6 1 .2.1.4.1.5-.1l.7-.8c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.4.4 0 .4 0 1.1-.5 1.6-.5.5-1.4.9-2.2.8-1-.1-2.6-.6-4.3-2.1-1.6-1.5-2.4-3-2.7-3.9-.3-.9 0-1.9.3-2.3z" fill="#fff" />
    </svg>
  ),
  mail: svg(<><rect x="3" y="5.5" width="18" height="13" rx="2.5" fill="#fff" /><path d="M4 7.5l8 6 8-6" stroke="#1f6fe0" strokeWidth="1.8" fill="none" /></>),
  linkedin: svg(<path d="M5 9h3v10H5zM6.5 4.5a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4zM10 9h2.9v1.4c.6-1 1.8-1.7 3.3-1.7 2.7 0 3.8 1.7 3.8 4.5V19h-3v-5.3c0-1.4-.4-2.4-1.7-2.4-1.4 0-2.3 1-2.3 2.6V19h-3z" />, { fill: "#fff" }),
  github: svg(<path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.7c-2.6.6-3.2-1.2-3.2-1.2-.4-1.1-1-1.4-1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.1-.2-4.3-1.1-4.3-4.7 0-1 .4-1.9 1-2.6-.1-.2-.4-1.2.1-2.5 0 0 .8-.3 2.6 1a9 9 0 0 1 4.8 0c1.8-1.2 2.6-1 2.6-1 .5 1.3.2 2.3.1 2.5.6.7 1 1.6 1 2.6 0 3.7-2.2 4.5-4.3 4.7.3.3.6.9.6 1.8v2.7c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5z" />, { fill: "#fff" }),
  settings: svg(<path d="M19.1 12.9c.1-.3.1-.6.1-.9s0-.6-.1-.9l2-1.6c.2-.1.2-.4.1-.6l-1.9-3.3c-.1-.2-.4-.3-.6-.2l-2.4 1c-.5-.4-1-.7-1.6-.9l-.4-2.5c0-.3-.2-.4-.5-.4h-3.8c-.2 0-.4.2-.5.4l-.4 2.5c-.6.2-1.1.6-1.6.9l-2.4-1c-.2-.1-.5 0-.6.2L2.7 8.9c-.1.2-.1.5.1.6l2 1.6c0 .3-.1.6-.1.9s0 .6.1.9l-2 1.6c-.2.1-.2.4-.1.6l1.9 3.3c.1.2.4.3.6.2l2.4-1c.5.4 1 .7 1.6.9l.4 2.5c0 .2.2.4.5.4h3.8c.2 0 .4-.2.5-.4l.4-2.5c.6-.2 1.1-.6 1.6-.9l2.4 1c.2.1.5 0 .6-.2l1.9-3.3c.1-.2.1-.5-.1-.6zM12 15.6a3.6 3.6 0 1 1 0-7.2 3.6 3.6 0 0 1 0 7.2z" />, { fill: "#fff" }),
  user: line("M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 0 1 14 0"),
  contact: svg(<><rect x="4" y="3" width="16" height="18" rx="3" fill="#fff" /><circle cx="12" cy="10" r="3" fill="#ff7a1a" /><path d="M7.5 17.5a4.5 4.5 0 0 1 9 0" fill="#ff7a1a" /></>),
  star: line("M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"),
  path: line("M5 19c3-6 11-2 14-14M5 19h4M19 5v4"),
  trophy: line("M7 4h10v4a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 13v4M8 20h8"),
  doc: line("M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6"),
  photo: svg(<><circle cx="12" cy="7" r="3.2" fill="#ff9f0a" /><circle cx="16.5" cy="10.5" r="3.2" fill="#30d158" opacity=".9" /><circle cx="15" cy="15.5" r="3.2" fill="#0a84ff" opacity=".9" /><circle cx="9" cy="15.5" r="3.2" fill="#bf5af2" opacity=".9" /><circle cx="7.5" cy="10.5" r="3.2" fill="#ff375f" opacity=".9" /></>),
  globe: svg(<path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" />, { stroke: "#1f6fe0" }),
  leaf: line("M5 19c0-8 5-14 14-14 0 9-6 14-14 14zM5 19l7-7"),
  scan: line("M4 8V5h3M17 5h3v3M20 16v3h-3M7 19H4v-3M9 10h.01M15 10h.01M9 15c1.7 1.3 4.3 1.3 6 0"),
  recycle: line("M7 19H4.5L7 14.5M17 19h2.5L17 14.5M9.5 5.5 12 3l2.5 2.5M7 14.5l2.5-4.5M17 14.5l-2.5-4.5M12 3v6M7 19h10"),
};
const logo = (src: string) => <Image className="os-logo" src={src} width={128} height={128} alt="" />;

const apps: App[] = [
  { id: "rentease", name: "RentEase", bg: "#ff4d2e", icon: logo("/icons/rentease.png") },
  { id: "moneyplan", name: "Money Plan", bg: "#1b1f5c", icon: logo("/icons/moneyplan.png") },
  { id: "punchin", name: "PunchIn", bg: "#0f7a64", icon: logo("/icons/punchin.png") },
  { id: "judica", name: "Judica", bg: "#ffffff", icon: logo("/icons/judica.png") },
  { id: "cleankudla", name: "Clean Kudla", bg: "linear-gradient(140deg,#5ad06a,#1f8a3a)", icon: I.leaf },
  { id: "trackin", name: "TrackIn", bg: "linear-gradient(140deg,#ff8fc0,#d63a75)", icon: I.scan },
  { id: "swachsetu", name: "Swach Setu", bg: "linear-gradient(140deg,#ffcf5a,#e07b00)", icon: I.recycle },
  { id: "photos", name: "Screens", bg: "#ffffff", icon: I.photo },
  { id: "contact", name: "Contact", bg: "linear-gradient(140deg,#ffb36b,#ff6a1a)", icon: I.contact },
  { id: "about", name: "About", bg: "linear-gradient(140deg,#8e8cff,#5146e0)", icon: I.user },
  { id: "skills", name: "Skills", bg: "linear-gradient(140deg,#7c6cff,#3b2fc9)", icon: I.star },
  { id: "journey", name: "Journey", bg: "linear-gradient(140deg,#20c997,#0b7285)", icon: I.path },
  { id: "awards", name: "Awards", bg: "linear-gradient(140deg,#ffd43b,#f59f00)", icon: I.trophy },
  { id: "resume", name: "Resume", bg: "linear-gradient(140deg,#ff6b6b,#c92a2a)", icon: I.doc },
  { id: "linkedin", name: "LinkedIn", bg: "#0a66c2", icon: I.linkedin, external: contact.linkedin },
  { id: "github", name: "GitHub", bg: "#1b1f24", icon: I.github, external: contact.github },
  { id: "games", name: "Games", bg: "rgba(255,255,255,0.28)", icon: (
    <span className="os-folder">
      <i style={{ background: "#2ea043" }}>🐍</i>
      <i style={{ background: "#6c5ce7" }}>✕</i>
      <i style={{ background: "#ff6fa5" }}>🃏</i>
      <i style={{ background: "transparent" }} />
    </span>
  ) },
  { id: "settings", name: "Settings", bg: "linear-gradient(140deg,#aeb4bc,#6b7280)", icon: I.settings },
];
const dock: App[] = [
  { id: "phone", name: "Phone", bg: "linear-gradient(140deg,#5fe07a,#1fa83e)", icon: I.phone },
  { id: "whatsapp", name: "WhatsApp", bg: "linear-gradient(140deg,#5be27a,#1ebe57)", icon: I.whatsapp },
  { id: "mail", name: "Mail", bg: "linear-gradient(140deg,#5fb4ff,#1f6fe0)", icon: I.mail },
  { id: "browser", name: "Website", bg: "#ffffff", icon: I.globe },
];
const allApps = [...apps, ...dock];

const projectOf = (id: AppId) => {
  const map: Partial<Record<AppId, string>> = { rentease: "RentEase", moneyplan: "Money Plan", punchin: "PunchIn" };
  const w = map[id] ? work.find((x) => x.title === map[id]) : undefined;
  if (w) return { title: w.title, kind: w.kind, status: w.status, body: w.body, points: w.points, stack: w.stack, shots: [...w.shots, w.shots[0].replace("-1", "-3")], link: w.link, accent: w.accent };
  const more: Partial<Record<AppId, string>> = { cleankudla: "Clean Kudla", judica: "Judica", trackin: "TrackIn", swachsetu: "Swach Setu" };
  const m = more[id] ? moreWork.find((x) => x.title === more[id]) : undefined;
  if (!m) return null;
  const extra: Record<string, { body: string; stack: string[]; accent: string }> = {
    "Clean Kudla": { body: "Waste collection monitoring for Mangaluru, with live worker GPS tracking, proximity-based house collection and a citizen confirmation portal.", stack: ["Flutter", "GPS", "IoT", "Firebase"], accent: "#2f9e44" },
    Judica: { body: "A legal assistance app for three user groups, with a law chatbot, document analysis and case tracking powered by machine learning through FastAPI.", stack: ["Flutter", "Firebase", "FastAPI", "ML"], accent: "#8a5a2b" },
    TrackIn: { body: "AI attendance that recognises every student in a single class photo and verifies their location before marking them present.", stack: ["Python", "Face recognition", "Flutter"], accent: "#d63a75" },
    "Swach Setu": { body: "A MERN dashboard for rural Material Recovery Facilities that tracks 33 categories of sorted waste.", stack: ["MongoDB", "Express", "React", "Node.js"], accent: "#e07b00" },
  };
  const e = extra[m.title];
  return { title: m.title, kind: m.kind, status: m.stat, body: e.body, points: [m.stat], stack: e.stack, shots: [] as string[], link: m.href ? { href: m.href, label: "View on GitHub" } : undefined, accent: e.accent };
};

const allShots = ["rentease-1", "rentease-2", "rentease-3", "moneyplan-1", "moneyplan-2", "moneyplan-3", "punchin-1", "punchin-2", "punchin-3"].map((s) => `/img/${s}.webp`);

function Tile({ app }: { app: App }) {
  return (
    <span className="os-tile" style={{ background: app.bg }}>
      {app.icon}
    </span>
  );
}

/* ---------- App screens ---------- */
function AppBody({ id, onExit, platform, theme, setPlatform, setTheme }: { id: AppId; onExit: () => void; platform: Platform; theme: Theme; setPlatform: (p: Platform) => void; setTheme: (t: Theme) => void }) {
  const [viewer, setViewer] = useState<string | null>(null);
  const [subject, setSubject] = useState("Let's work together");
  const [msg, setMsg] = useState("");
  const [waText, setWaText] = useState("Hi Anirudha, I saw your portfolio and would like to talk.");
  const [tab, setTab] = useState<"live" | "info">(LIVE[id] ? "live" : "info");
  const [loaded, setLoaded] = useState(false);
  const [game, setGame] = useState<"snake" | "ttt" | "memory" | null>(null);
  const p = projectOf(id);
  const app = allApps.find((a) => a.id === id)!;

  if (p) {
    const live = LIVE[id];
    return (
      <div className="ap ap-project">
        <header className="ap-hero" style={{ background: p.accent }}>
          <span className="ap-icon">
            <Tile app={app} />
          </span>
          <div>
            <h3>{p.title}</h3>
            <p>{p.kind}</p>
          </div>
          <span className="ap-status">{p.status}</span>
        </header>
        {live && (
          <div className="seg ap-tabs">
            <button type="button" className={tab === "live" ? "on" : ""} onClick={() => setTab("live")}>
              ▶ Try the app
            </button>
            <button type="button" className={tab === "info" ? "on" : ""} onClick={() => setTab("info")}>
              Details
            </button>
          </div>
        )}
        {live && tab === "live" && (
          <div className="ap-live">
            {!loaded && (
              <div className="ap-live-load">
                <span className="spin" />
                <b>Opening {p.title}…</b>
                <small>{live.note}</small>
              </div>
            )}
            <iframe src={live.url} title={`${p.title} live app`} onLoad={() => setLoaded(true)} allow="geolocation" />
            <a className="ap-live-open" href={live.url} target="_blank" rel="noopener noreferrer">
              Open full screen ↗
            </a>
          </div>
        )}
        {(!live || tab === "info") && (<>
        {p.shots.length > 0 && (
          <div className="ap-shots">
            {p.shots.map((s) => (
              <Image key={s} src={s} width={540} height={1200} alt={`${p.title} screen`} sizes="150px" />
            ))}
          </div>
        )}
        <div className="ap-pad">
          <p className="ap-text">{p.body}</p>
          <h4>Highlights</h4>
          <ul className="ap-list">
            {p.points.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          <h4>Built with</h4>
          <div className="ap-chips">
            {p.stack.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
          {p.link && (
            <a className="ap-btn" style={{ background: p.accent }} href={p.link.href} target="_blank" rel="noopener noreferrer">
              {p.link.label} ↗
            </a>
          )}
        </div>
        </>)}
      </div>
    );
  }

  const callBtns = (
    <div className="ap-actions">
      <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="act call">
        <span>{I.phone}</span>
        Call
      </a>
      <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="act wa">
        <span>{I.whatsapp}</span>
        WhatsApp
      </a>
      <a href={`mailto:${contact.email}`} className="act mail">
        <span>{I.mail}</span>
        Mail
      </a>
      <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="act li">
        <span>{I.linkedin}</span>
        LinkedIn
      </a>
    </div>
  );

  switch (id) {
    case "photos":
      return (
        <div className="ap">
          <h3 className="ap-title">Screens</h3>
          <p className="ap-sub">{allShots.length} screenshots from my apps</p>
          <div className="ap-grid">
            {allShots.map((s) => (
              <button key={s} type="button" onClick={() => setViewer(s)}>
                <Image src={s} width={540} height={1200} alt="App screenshot" sizes="120px" />
              </button>
            ))}
          </div>
          {viewer && (
            <button type="button" className="ap-viewer" onClick={() => setViewer(null)} aria-label="Close photo">
              <Image src={viewer} width={540} height={1200} alt="App screenshot, large" sizes="320px" />
            </button>
          )}
        </div>
      );
    case "contact":
      return (
        <div className="ap">
          <div className="ap-card">
            <Image src="/img/me.webp" width={200} height={240} alt="Anirudha Udupa" />
            <h3>Anirudha Udupa</h3>
            <p>Flutter &amp; full-stack developer</p>
          </div>
          {callBtns}
          <div className="ap-fields">
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
              <span>mobile</span>
              <b>{contact.phone}</b>
            </a>
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer">
              <span>WhatsApp</span>
              <b>{contact.phone}</b>
            </a>
            <a href={`mailto:${contact.email}`}>
              <span>email</span>
              <b>{contact.email}</b>
            </a>
            <a href={contact.github} target="_blank" rel="noopener noreferrer">
              <span>GitHub</span>
              <b>github.com/Aniudupa15</b>
            </a>
            <a href={contact.resume} download="Anirudha-Udupa-Resume.pdf">
              <span>resume</span>
              <b>Download PDF</b>
            </a>
          </div>
        </div>
      );
    case "about":
      return (
        <div className="ap">
          <div className="ap-profile">
            <Image src="/img/me.webp" width={200} height={240} alt="Anirudha Udupa" />
            <h3>Anirudha Udupa</h3>
            <p>Flutter &amp; full-stack developer · Mangaluru</p>
            <span className="ap-open">● Open to work</span>
          </div>
          <div className="ap-stats">
            {stats.map((s) => (
              <div key={s.label}>
                <b>
                  {s.value}
                  {s.suffix}
                </b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <p className="ap-text ap-pad">I build complete products: the Flutter app, the FastAPI or Firebase backend, payments, notifications, tests and deployment. Studying Computer Science and Business Systems at Canara Engineering College.</p>
        </div>
      );
    case "skills":
      return (
        <div className="ap">
          <h3 className="ap-title">Skills</h3>
          <p className="ap-sub">Tools I ship with</p>
          <div className="ap-chips big ap-pad">
            {skills.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
      );
    case "journey":
      return (
        <div className="ap">
          <h3 className="ap-title">Journey</h3>
          <div className="ap-timeline">
            {experience.map((e) => (
              <div key={e.role}>
                <i />
                <span>{e.when}</span>
                <b>{e.role}</b>
                <em>{e.org}</em>
                <p>{e.note}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "awards":
      return (
        <div className="ap">
          <h3 className="ap-title">Awards</h3>
          {awards.map((a, i) => (
            <div className="ap-award" key={a.title} style={{ background: ["#6c5ce7", "#0ea47a", "#ff6fa5"][i] }}>
              <b>{a.big}</b>
              <span>{a.of}</span>
              <p>{a.title}</p>
            </div>
          ))}
        </div>
      );
    case "resume":
      return (
        <div className="ap">
          <h3 className="ap-title">Resume</h3>
          <div className="ap-file">
            <span className="ap-fileicon">PDF</span>
            <b>Anirudha-Udupa-Resume.pdf</b>
            <span>Flutter &amp; full-stack developer</span>
          </div>
          <div className="ap-pad">
            <a className="ap-btn" style={{ background: "#c92a2a" }} href={contact.resume} target="_blank" rel="noopener">
              Open PDF ↗
            </a>
            <a className="ap-btn ghost" href={contact.resume} download="Anirudha-Udupa-Resume.pdf">
              Download
            </a>
          </div>
        </div>
      );
    case "phone":
      return (
        <div className="ap ap-dial">
          <Image className="ap-avatar" src="/img/me.webp" width={160} height={160} alt="" />
          <h3>Anirudha Udupa</h3>
          <p>{contact.phone}</p>
          <div className="ap-keys" aria-hidden="true">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"].map((k) => (
              <span key={k}>{k}</span>
            ))}
          </div>
          <div className="ap-dial-btns">
            <a className="ap-round wa" href={WA_LINK} target="_blank" rel="noopener noreferrer" aria-label="Message on WhatsApp">
              {I.whatsapp}
            </a>
            <a className="ap-round call" href={`tel:${contact.phone.replace(/\s/g, "")}`} aria-label="Call Anirudha">
              {I.phone}
            </a>
          </div>
        </div>
      );
    case "whatsapp":
      return (
        <div className="ap ap-wa">
          <header className="wa-head">
            <Image src="/img/me.webp" width={80} height={80} alt="" />
            <div>
              <b>Anirudha Udupa</b>
              <span>online</span>
            </div>
            <a href={`tel:${contact.phone.replace(/\s/g, "")}`} aria-label="Call">
              {svg(<path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" />, { fill: "#fff", size: 22 })}
            </a>
          </header>
          <div className="wa-chat">
            <span className="wa-day">Today</span>
            <p className="in">Hey! 👋 Thanks for checking out my portfolio.<small>10:02</small></p>
            <p className="in">I build Flutter apps end to end: the app, backend, payments and deployment.<small>10:02</small></p>
            <p className="in">Got a project or a role in mind? Message me here.<small>10:03</small></p>
          </div>
          <div className="wa-input">
            <input value={waText} onChange={(e) => setWaText(e.target.value)} aria-label="Message" />
            <a href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waText)}`} target="_blank" rel="noopener noreferrer" aria-label="Send on WhatsApp">
              {svg(<path d="M3 20l18-8L3 4l2 8zM5 12h8" />, { stroke: "#fff", size: 22 })}
            </a>
          </div>
        </div>
      );
    case "mail":
      return (
        <div className="ap ap-mail">
          <h3 className="ap-title">New message</h3>
          <label>
            <span>To</span>
            <b>{contact.email}</b>
          </label>
          <label>
            <span>Subject</span>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} />
          </label>
          <textarea placeholder="Hi Anirudha, I'd love to talk about…" value={msg} onChange={(e) => setMsg(e.target.value)} />
          <a className="ap-btn" style={{ background: "#1f6fe0" }} href={`mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(msg)}`}>
            Send ↗
          </a>
        </div>
      );
    case "games":
      if (game) {
        return (
          <div className="ap ap-game">
            <button type="button" className="gm-back" onClick={() => setGame(null)}>
              ‹ Games
            </button>
            {game === "snake" && <Snake />}
            {game === "ttt" && <TicTacToe />}
            {game === "memory" && <Memory />}
          </div>
        );
      }
      return (
        <div className="ap">
          <h3 className="ap-title">Games</h3>
          <p className="ap-sub">A few small games I built for this phone.</p>
          <div className="gm-list">
            {[
              { k: "snake" as const, t: "Snake", d: "Eat, grow, don't bite yourself.", c: "#2ea043", e: "🐍" },
              { k: "ttt" as const, t: "Tic-Tac-Toe", d: "Beat the phone. It's good, not perfect.", c: "#6c5ce7", e: "✕" },
              { k: "memory" as const, t: "Memory", d: "Match 8 pairs in as few moves as you can.", c: "#ff6fa5", e: "🃏" },
            ].map((g) => (
              <button key={g.k} type="button" onClick={() => setGame(g.k)}>
                <span style={{ background: g.c }}>{g.e}</span>
                <div>
                  <b>{g.t}</b>
                  <small>{g.d}</small>
                </div>
                <em>Play</em>
              </button>
            ))}
          </div>
        </div>
      );
    case "settings":
      return (
        <div className="ap ap-settings">
          <h3 className="ap-title">Settings</h3>
          <div className="set-profile">
            <Image src="/img/me.webp" width={120} height={120} alt="" />
            <div>
              <b>Anirudha Udupa</b>
              <span>AnirudhaOS · Portfolio edition</span>
            </div>
          </div>
          <p className="set-label">System style</p>
          <div className="set-group">
            <div className="seg">
              <button type="button" className={platform === "ios" ? "on" : ""} onClick={() => setPlatform("ios")}>
                iOS
              </button>
              <button type="button" className={platform === "android" ? "on" : ""} onClick={() => setPlatform("android")}>
                Android
              </button>
            </div>
            <p className="set-note">Switch how the whole phone looks: icons, status bar, lock screen and navigation.</p>
          </div>
          <p className="set-label">Appearance</p>
          <div className="set-group">
            <div className="seg">
              <button type="button" className={theme === "light" ? "on" : ""} onClick={() => setTheme("light")}>
                ☀ Light
              </button>
              <button type="button" className={theme === "dark" ? "on" : ""} onClick={() => setTheme("dark")}>
                ☾ Dark
              </button>
            </div>
          </div>
          <p className="set-label">About this phone</p>
          <div className="set-group rows">
            <div><span>Owner</span><b>Anirudha Udupa</b></div>
            <div><span>Built with</span><b>Next.js, GSAP, React</b></div>
            <div><span>Apps installed</span><b>{allApps.length}</b></div>
            <div><span>Status</span><b className="ok">Open to work</b></div>
          </div>
        </div>
      );
    case "browser":
      return (
        <div className="ap ap-browser">
          <div className="ap-url">anirudha-udupa.dev</div>
          <h3>Prefer the regular website?</h3>
          <p>This phone view shows my work as apps. The website has the same projects as one long page, with the 3D hero, stacking project cards and more.</p>
          <button type="button" className="ap-btn" style={{ background: "#1f6fe0" }} onClick={onExit}>
            Open the website
          </button>
        </div>
      );
    default:
      return null;
  }
}

/* ---------- The OS ---------- */
export default function PhoneOS({ active, onExit, full = false }: { active: boolean; onExit: () => void; full?: boolean }) {
  const screen = useRef<HTMLDivElement>(null);
  const [locked, setLocked] = useState(true);
  const [open, setOpen] = useState<AppId | null>(null);
  const [now, setNow] = useState(new Date());
  const [platform, setPlatformState] = useState<Platform>("ios");
  const [theme, setThemeState] = useState<Theme>("light");
  const origin = useRef({ x: 195, y: 420 });
  const swipeY = useRef<number | null>(null);

  /* remember the visitor's choice of style and theme */
  useEffect(() => {
    try {
      const p = localStorage.getItem("au-os-platform");
      const t = localStorage.getItem("au-os-theme");
      if (p === "ios" || p === "android") setPlatformState(p);
      else if (/android/i.test(navigator.userAgent)) setPlatformState("android");
      if (t === "light" || t === "dark") setThemeState(t);
      else if (window.matchMedia("(prefers-color-scheme: dark)").matches) setThemeState("dark");
    } catch {}
  }, []);
  const setPlatform = (p: Platform) => { setPlatformState(p); try { localStorage.setItem("au-os-platform", p); } catch {} };
  const setTheme = (t: Theme) => { setThemeState(t); try { localStorage.setItem("au-os-theme", t); } catch {} };

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(id);
  }, []);
  const time = now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" });
  const [hh, mm] = time.split(":");
  const date = now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", timeZone: "Asia/Kolkata" });
  const shortDate = now.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "Asia/Kolkata" });

  useEffect(() => {
    if (!active) return;
    setOpen(null);
    setLocked(true);
    gsap.set(".os-lock", { yPercent: 0, autoAlpha: 1 });
    gsap.set(".os-home", { autoAlpha: 0 });
    gsap.fromTo(".os-lock-in > *", { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08, ease: "power3.out", delay: full ? 0.2 : 0.9 });
  }, [active, full]);

  const unlock = () => {
    if (!locked) return;
    setLocked(false);
    gsap.timeline()
      .to(".os-lock", { yPercent: -100, duration: 0.6, ease: "power3.inOut" })
      .set(".os-lock", { autoAlpha: 0 })
      .set(".os-home", { autoAlpha: 1 }, 0.2)
      .fromTo(".os-widget, .os-search", { scale: 0.85, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6, ease: "back.out(1.6)" }, 0.3)
      .fromTo(".os-grid .os-icon", { scale: 0.4, autoAlpha: 0, y: 30 }, { scale: 1, autoAlpha: 1, y: 0, duration: 0.55, ease: "back.out(2)", stagger: { each: 0.022, from: "center" } }, 0.35)
      .fromTo(".os-dock", { y: 80 }, { y: 0, duration: 0.6, ease: "power3.out" }, 0.4);
  };

  const launch = (app: App, el: HTMLElement) => {
    if (app.external) {
      gsap.fromTo(el, { scale: 0.85 }, { scale: 1, duration: 0.4, ease: "back.out(3)" });
      window.open(app.external, "_blank", "noopener");
      return;
    }
    const s = screen.current!.getBoundingClientRect(), r = el.getBoundingClientRect();
    const k = full ? 1 : s.width / 390;
    origin.current = { x: (r.left + r.width / 2 - s.left) / k, y: (r.top + r.height / 2 - s.top) / k };
    setOpen(app.id);
    requestAnimationFrame(() => {
      gsap.timeline()
        .fromTo(".os-app", { scale: 0.16, borderRadius: 120, autoAlpha: 0, transformOrigin: `${origin.current.x}px ${origin.current.y}px` }, { scale: 1, borderRadius: full ? 0 : platform === "ios" ? 50 : 36, autoAlpha: 1, duration: 0.55, ease: "expo.out" })
        .to(".os-grid, .os-widget, .os-dock, .os-search", { scale: 0.92, autoAlpha: 0.4, duration: 0.4, ease: "power2.out" }, 0)
        .to(".os-island", { width: 190, duration: 0.45, ease: "back.out(2)" }, 0)
        .fromTo(".os-island-label", { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.25)
        .fromTo(".os-app .ap > *", { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.5, stagger: 0.04, ease: "power3.out" }, 0.2);
    });
  };

  const home = () => {
    if (!open) return;
    gsap.timeline({ onComplete: () => setOpen(null) })
      .to(".os-island-label", { autoAlpha: 0, duration: 0.1 }, 0)
      .to(".os-island", { width: 110, duration: 0.35, ease: "power2.out" }, 0)
      .to(".os-app", { scale: 0.16, borderRadius: 120, autoAlpha: 0, duration: 0.45, ease: "power3.in" }, 0)
      .to(".os-grid, .os-widget, .os-dock, .os-search", { scale: 1, autoAlpha: 1, duration: 0.45, ease: "power3.out" }, 0.15);
  };

  const exit = () => { home(); window.setTimeout(onExit, 300); };
  const openApp = allApps.find((a) => a.id === open);
  const android = platform === "android";

  return (
    <div className={`os os-${platform} os-${theme}` + (full ? " os-real" : "")} ref={screen}>
      <div className="os-wall" />

      <div className="os-statusbar">
        <span className="os-time">{time}</span>
        {android ? <span className="os-punch" /> : (
          <span className="os-island">
            <span className="os-island-label">{openApp?.name}</span>
          </span>
        )}
        <span className="os-sys">
          {android && <i className="wifi" />}
          <i className="sig" />
          {!android && <i className="wifi" />}
          <i className="bat" />
          {android && <b className="pct">87%</b>}
        </span>
      </div>

      {/* lock screen */}
      <button
        type="button"
        className="os-lock"
        onClick={unlock}
        onPointerDown={(e) => { swipeY.current = e.clientY; }}
        onPointerMove={(e) => { if (swipeY.current !== null && e.clientY - swipeY.current < -40) { swipeY.current = null; unlock(); } }}
        onPointerUp={() => { swipeY.current = null; }}
        aria-label="Unlock the phone"
      >
        <span className="os-lock-in">
          {android ? (
            <>
              <span className="os-lock-clock-a">
                <b>{hh}</b>
                <b>{mm}</b>
              </span>
              <span className="os-lock-date">{shortDate}</span>
            </>
          ) : (
            <>
              <span className="os-lock-date">{date}</span>
              <span className="os-lock-time">{time}</span>
            </>
          )}
          <span className="os-notif">
            <Image src="/img/me.webp" width={80} height={80} alt="" />
            <span>
              <b>Anirudha Udupa {android && <small>· now</small>}</b>
              <em>Open to Flutter &amp; full-stack roles. Tap to see my work.</em>
            </span>
          </span>
        </span>
        <span className="os-unlock">{android ? "🔒  Swipe up to unlock" : "Tap or swipe up to unlock"}</span>
      </button>

      {/* home screen */}
      <div className="os-home">
        {android ? (
          <div className="os-widget os-glance">
            <b>{shortDate}</b>
            <span>● Open to work · Mangaluru</span>
            <em>Anirudha Udupa · Flutter &amp; full-stack developer</em>
          </div>
        ) : (
          <div className="os-widget">
            <Image src="/img/me.webp" width={160} height={160} alt="" />
            <div>
              <b>Anirudha Udupa</b>
              <span>Flutter &amp; full-stack developer</span>
              <em>● Open to work · Mangaluru</em>
            </div>
          </div>
        )}
        <div className="os-grid">
          {apps.map((a) => (
            <button key={a.id} type="button" className="os-icon" onClick={(e) => launch(a, e.currentTarget)}>
              <Tile app={a} />
              <small>{a.name}</small>
            </button>
          ))}
        </div>
        {android && (
          <button type="button" className="os-search" onClick={(e) => launch(allApps.find((a) => a.id === "photos")!, e.currentTarget)}>
            <span className="g">G</span>
            <span>Search my work</span>
            <span className="mic">🎙</span>
          </button>
        )}
        {!android && (
          <div className="os-dots" aria-hidden="true">
            <i className="on" />
            <i />
          </div>
        )}
        <div className="os-dock">
          {dock.map((a) => (
            <button key={a.id} type="button" className="os-icon" onClick={(e) => launch(a, e.currentTarget)} aria-label={a.name}>
              <Tile app={a} />
            </button>
          ))}
        </div>
      </div>

      {/* open app */}
      {open && (
        <div className="os-app">
          {!android && (
            <div className="os-nav-ios">
              <button type="button" onClick={home}>‹ Home</button>
              <span>{openApp?.name}</span>
            </div>
          )}
          {android && (
            <div className="os-appbar-a">
              <button type="button" onClick={home} aria-label="Back">
                {svg(<path d="M15 5l-7 7 7 7" />, { stroke: "currentColor", size: 24 })}
              </button>
              <span>{openApp?.name}</span>
            </div>
          )}
          <div className="os-app-scroll">
            <AppBody id={open} onExit={exit} platform={platform} theme={theme} setPlatform={setPlatform} setTheme={setTheme} />
          </div>
        </div>
      )}

      {android ? (
        <nav className="os-navbar" aria-label="Android navigation">
          <button type="button" onClick={home} aria-label="Back">◁</button>
          <button type="button" onClick={home} aria-label="Home">○</button>
          <button type="button" onClick={home} aria-label="Recent apps">▢</button>
        </nav>
      ) : (
        <button type="button" className="os-homebar" onClick={home} aria-label="Go to home screen">
          <span />
        </button>
      )}
    </div>
  );
}
