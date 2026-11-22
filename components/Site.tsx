"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { contact, experience, moreWork, skills, work } from "@/lib/content";

export function Loader() {
  return (
    <div className="loader" aria-hidden="true">
      <span className="lp lp-1" />
      <span className="lp lp-2" />
      <span className="lp lp-3" />
      <div className="loader-in">
        <span className="loader-num">0</span>
        <span className="loader-txt">Loading Anirudha&rsquo;s work</span>
      </div>
    </div>
  );
}

export function Cursor() {
  return (
    <div className="cursor" aria-hidden="true">
      <span className="cursor-dot" />
      <span className="cursor-ring">
        <em>View</em>
      </span>
    </div>
  );
}

export function Nav({ app, onToggle }: { app: boolean; onToggle: () => void }) {
  return (
    <header className="nav">
      <a href="#top" className="nav-logo" data-magnetic>
        AU<span>.</span>
      </a>
      <nav className="nav-links" aria-label="Main">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#journey">Journey</a>
        <a href="#contact">Contact</a>
      </nav>
      <div className="nav-right">
        <button type="button" className={"mode-toggle" + (app ? " on" : "")} onClick={onToggle} aria-pressed={app} title="See this site as it looks on a phone">
          <span className="mt-label">Mobile view</span>
          <span className="mt-switch">
            <i />
          </span>
        </button>
        <a href={contact.resume} download="Anirudha-Udupa-Resume.pdf" className="nav-cta" data-magnetic>
          Resume ↓
        </a>
      </div>
    </header>
  );
}

function Hero3D() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let dispose: (() => void) | undefined;
    let alive = true;
    const test = document.createElement("canvas");
    if (!(test.getContext("webgl2") || test.getContext("webgl"))) return;
    import("@/lib/hero3d").then(({ createHero3D }) => {
      if (alive && ref.current) dispose = createHero3D(ref.current, ["/img/rentease-1.webp", "/img/moneyplan-1.webp", "/img/punchin-1.webp"]);
    });
    return () => { alive = false; dispose?.(); };
  }, []);
  return <canvas ref={ref} className="hero-3d" aria-hidden="true" />;
}

function SkillsGlobe({ items }: { items: string[] }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const tags = Array.from(el.querySelectorAll<HTMLElement>(".gt"));
    const n = tags.length;
    /* spread the labels evenly over a sphere */
    const pts = tags.map((_, i) => {
      const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = Math.PI * (3 - Math.sqrt(5)) * i;
      return [Math.cos(th) * r, y, Math.sin(th) * r];
    });
    let ax = 0.002, ay = 0.004, rx = 0, ry = 0, raf = 0, hover = false;
    const onMove = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      ay = ((e.clientX - b.left) / b.width - 0.5) * 0.03;
      ax = -((e.clientY - b.top) / b.height - 0.5) * 0.03;
      hover = true;
    };
    const onLeave = () => { hover = false; };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!hover) { ax += (0.002 - ax) * 0.02; ay += (0.004 - ay) * 0.02; }
      rx += reduce ? 0 : ax; ry += reduce ? 0 : ay;
      const R = el.clientWidth * 0.4;
      const cx = Math.cos(rx), sx = Math.sin(rx), cy = Math.cos(ry), sy = Math.sin(ry);
      tags.forEach((t, i) => {
        const [x, y, z] = pts[i];
        const y1 = y * cx - z * sx, z1 = y * sx + z * cx;
        const x2 = x * cy + z1 * sy, z2 = -x * sy + z1 * cy;
        const s = (z2 + 2) / 3;
        t.style.transform = `translate(-50%, -50%) translate3d(${x2 * R}px, ${y1 * R}px, ${z2 * R}px) scale(${0.6 + s * 0.6})`;
        t.style.opacity = String(0.25 + s * 0.75);
        t.style.zIndex = String(Math.round(s * 100));
      });
    };
    frame();
    return () => { cancelAnimationFrame(raf); el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave); };
  }, []);
  const cols = ["#ff5a1f", "#6c5ce7", "#0ea47a", "#ff6fa5", "#02569b", "#ffc93c"];
  return (
    <div className="globe" ref={box} aria-label={items.join(", ")}>
      {items.map((s, i) => (
        <span className="gt" key={s} style={{ background: cols[i % cols.length], color: i % cols.length === 5 ? "#141414" : "#fff" }}>
          {s}
        </span>
      ))}
    </div>
  );
}

export function Hero() {
  return (
    <section className="hero" id="top">
      <div className="glows" aria-hidden="true">
        <span className="glow g1" />
        <span className="glow g2" />
        <span className="glow g3" />
      </div>
      <Hero3D />
      <p className="hero-hi">
        <span className="wave" aria-hidden="true">👋</span> Hey there! Flutter &amp; full-stack developer, based in Mangaluru, India.
      </p>
      <h1 className="hero-title" aria-label="Hey, I&rsquo;m Anirudha. I make apps.">
        <span className="hl hl-1" aria-hidden="true">
          <span className="hw">Hey, I&rsquo;m</span>
        </span>
        <span className="hl hl-2" aria-hidden="true">
          <span className="hero-photo">
            <Image src="/img/me.webp" alt="" fill priority sizes="220px" />
          </span>
          <span className="hw">Anirudha</span>
        </span>
        <span className="hl hl-3" aria-hidden="true">
          <span className="hw">
            <em>I make apps.</em>
          </span>
          <span className="hero-arrow">↘</span>
        </span>
      </h1>
      <div className="hero-foot">
        <p>
          I turn ideas into Flutter apps, then build the backend that keeps them running. Have a look around, or just say hi.
        </p>
        <div className="hero-cta">
          <a href="#work" className="btn btn-dark" data-magnetic>
            See my work
          </a>
          <a href="#contact" className="btn btn-line" data-magnetic>
            Get in touch
          </a>
        </div>
      </div>
      <div className="bands" aria-hidden="true">
        <div className="band band-a">
          <div className="band-track">
            {[0, 1].map((k) => (
              <div className="band-set" key={k}>
                {skills.slice(0, 9).map((s) => (
                  <span key={s + k}>
                    {s} <i>✦</i>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="band band-b">
          <div className="band-track">
            {[0, 1].map((k) => (
              <div className="band-set" key={k}>
                {["Available for work", "Flutter developer", "Full-stack", "Mangaluru, India", "Open to freelance"].map((s) => (
                  <span key={s + k}>
                    {s} <i>●</i>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section className="about" id="about">
      <div className="wrap about-grid">
        <div>
          <p className="eyebrow">
            <span className="dot" /> A bit about me
          </p>
          <h2 className="big split about-title">
            I like building the <em>whole</em> thing.
          </h2>
          <p className="about-text">
            I&rsquo;m a Flutter and full-stack developer from Mangaluru. I enjoy taking an app from the first sketch to launch day: the screens, the backend, payments, notifications, all of it. Nothing beats seeing people actually use something I made.
          </p>
        </div>
        <figure className="me tilt3d">
          <span className="me-blob" aria-hidden="true" />
          <div className="me-frame">
            <Image src="/img/me.webp" alt="Photo of Anirudha Udupa" fill sizes="(max-width: 900px) 70vw, 380px" />
          </div>
          <figcaption className="me-tag">
            <b>Anirudha Udupa</b>
            <span>B.E. CSBS · Canara Engineering College · CGPA 8.59</span>
          </figcaption>
          <span className="me-sticker" aria-hidden="true">
            Open to
            <br />
            work ✦
          </span>
        </figure>
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="wrap skills-grid">
        <div>
          <p className="eyebrow">
            <span className="dot" /> Toolkit
          </p>
          <h2 className="big split">
            Tools I <em>love</em> using
          </h2>
          <p className="skills-lede">Give the sphere a spin. These are the tools I reach for every day: Flutter up front, with FastAPI, PostgreSQL and Firebase behind it.</p>
        </div>
        <SkillsGlobe items={skills} />
      </div>
    </section>
  );
}

export function Work() {
  return (
    <section className="work" id="work">
      <div className="wrap work-head">
        <p className="eyebrow">
          <span className="dot" /> Things I&rsquo;ve made
        </p>
        <h2 className="big split">
          A few I&rsquo;m <em>proud</em> of
        </h2>
      </div>
      <div className="stack">
        {work.map((w, i) => (
          <article className="card" key={w.title} style={{ "--acc": w.accent, zIndex: i + 1 } as React.CSSProperties}>
            <div className="card-in">
              <div className="card-copy">
                <p className="card-meta">
                  <span>{w.n}</span>
                  <span>{w.kind}</span>
                  <span className="pill">{w.status}</span>
                </p>
                <h3>{w.title}</h3>
                <p className="card-body">{w.body}</p>
                <ul>
                  {w.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
                <div className="chips">
                  {w.stack.map((s) => (
                    <span key={s}>{s}</span>
                  ))}
                </div>
                {w.link && (
                  <a className="btn btn-light" href={w.link.href} target="_blank" rel="noopener noreferrer" data-magnetic>
                    {w.link.label} ↗
                  </a>
                )}
              </div>
              <div className="card-phones">
                <span className="ring" aria-hidden="true" />
                <figure className="phone p1">
                  <Image src={w.shots[0]} width={540} height={1200} alt={`${w.title} screen`} sizes="(max-width: 900px) 40vw, 250px" />
                </figure>
                <figure className="phone p2">
                  <Image src={w.shots[1]} width={540} height={1200} alt={`${w.title} second screen`} sizes="(max-width: 900px) 40vw, 250px" />
                </figure>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="wrap more">
        <h3 className="more-title">More projects</h3>
        <div className="tiles">
          {moreWork.map((m, i) => (
            <a key={m.title} href={m.href || "#contact"} target={m.href ? "_blank" : undefined} rel="noopener noreferrer" className={"tile tilt3d t" + i}>
              <span className="tile-stat">{m.stat}</span>
              <b>{m.title}</b>
              <span className="tile-kind">{m.kind}</span>
              <span className="tile-go" aria-hidden="true">
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

const gallery = [
  { src: "/img/rentease-1.webp", app: "RentEase", label: "Owner dashboard", c: "#ff5a36" },
  { src: "/img/rentease-2.webp", app: "RentEase", label: "Tenant bills", c: "#ff5a36" },
  { src: "/img/rentease-3.webp", app: "RentEase", label: "Reports", c: "#ff5a36" },
  { src: "/img/moneyplan-1.webp", app: "Money Plan", label: "Monthly plan", c: "#7c6cff" },
  { src: "/img/moneyplan-2.webp", app: "Money Plan", label: "Savings goals", c: "#7c6cff" },
  { src: "/img/moneyplan-3.webp", app: "Money Plan", label: "Review", c: "#7c6cff" },
  { src: "/img/punchin-1.webp", app: "PunchIn", label: "One-tap punch in", c: "#16a37f" },
  { src: "/img/punchin-2.webp", app: "PunchIn", label: "Admin today", c: "#16a37f" },
  { src: "/img/punchin-3.webp", app: "PunchIn", label: "Leave approvals", c: "#16a37f" },
];

export function Gallery() {
  return (
    <section className="gallery" id="screens">
      <div className="gal-pin">
        <div className="wrap gal-head">
          <p className="eyebrow light">
            <span className="dot" /> Inside the apps
          </p>
          <h2 className="big split">
            Take a <em>peek</em> inside
          </h2>
        </div>
        <div className="gal-track">
          {gallery.map((g) => (
            <figure className="gal-item" key={g.src} data-cursor="view">
              <div className="gal-phone" style={{ boxShadow: `0 40px 80px -30px ${g.c}` }}>
                <Image src={g.src} width={540} height={1200} alt={`${g.app}: ${g.label}`} sizes="260px" />
              </div>
              <figcaption>
                <b style={{ color: g.c }}>{g.app}</b> {g.label}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="gal-bar" aria-hidden="true">
          <span />
        </div>
      </div>
    </section>
  );
}

export function Journey() {
  return (
    <section className="journey" id="journey">
      <div className="wrap">
        <p className="eyebrow">
          <span className="dot" /> My story
        </p>
        <h2 className="big split">
          How I <em>got</em> here
        </h2>
        <div className="timeline">
          <svg className="tl-line" viewBox="0 0 4 100" preserveAspectRatio="none" aria-hidden="true">
            <line x1="2" y1="0" x2="2" y2="100" className="tl-base" />
            <line x1="2" y1="0" x2="2" y2="100" className="tl-fill" pathLength={1} />
          </svg>
          {experience.map((e, i) => (
            <div className={"tl-item" + (i % 2 ? " right" : "")} key={e.role}>
              <span className="tl-dot" aria-hidden="true" />
              <div className="tl-card">
                <span className="tl-when">{e.when}</span>
                <h3>{e.role}</h3>
                <p className="tl-org">{e.org}</p>
                <p>{e.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* the mailto link still works */
    }
  };
  return (
    <section className="contact" id="contact">
      <div className="wrap">
        <p className="eyebrow light">
          <span className="dot" /> Contact
        </p>
        <h2 className="contact-title split">
          Got an idea? Let&rsquo;s <em>chat</em>.
        </h2>
        <div className="contact-row">
          <a href={`mailto:${contact.email}`} className="mail-btn" data-magnetic>
            <span>Say hello</span>
          </a>
          <div className="contact-list">
            <div>
              <span>Email</span>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <button type="button" onClick={copy}>
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </div>
            <div>
              <span>Phone</span>
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>{contact.phone}</a>
            </div>
            <div>
              <span>LinkedIn</span>
              <a href={contact.linkedin} target="_blank" rel="noopener noreferrer">
                anirudha-udupa ↗
              </a>
            </div>
            <div>
              <span>GitHub</span>
              <a href={contact.github} target="_blank" rel="noopener noreferrer">
                Aniudupa15 ↗
              </a>
            </div>
            <div>
              <span>Resume</span>
              <a href={contact.resume} download="Anirudha-Udupa-Resume.pdf">
                Download PDF ↓
              </a>
            </div>
          </div>
        </div>
      </div>
      <p className="giant" aria-hidden="true">
        {"ANIRUDHA".split("").map((ch, i) => (
          <span key={i}>{ch}</span>
        ))}
      </p>
      <footer className="foot wrap">
        <span>© 2026 {contact.name}</span>
        <span>Built with Next.js &amp; GSAP</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </section>
  );
}
