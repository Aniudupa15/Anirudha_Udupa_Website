"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import PhoneOS from "./PhoneOS";

/* Mobile view: a phone that runs "AnirudhaOS", where every project and section is an app. */
const W = 390, H = 844;

export default function AppMode({ open, onClose }: { open: boolean; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const shown = useRef(false);
  const [load, setLoad] = useState(false);
  const [scale, setScale] = useState(1);

  /* fit the phone to the window */
  useEffect(() => {
    const fit = () => setScale(Math.min(1, (window.innerHeight - 130) / (H + 28), (window.innerWidth - 40) / (W + 28)));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const d = reduce ? 0 : 1;
    tlRef.current?.kill();
    if (open) {
      shown.current = true;
      setLoad(true);
      lenis?.stop();
      document.documentElement.classList.add("app-open");
      tlRef.current = gsap.timeline()
        .set(el, { autoAlpha: 1 })
        .to("main", { autoAlpha: 0, scale: 0.94, duration: 0.5 * d, ease: "power2.in" }, 0)
        .fromTo(".dv-bg", { opacity: 0 }, { opacity: 1, duration: 0.5 * d }, 0)
        .fromTo(".dv-phone", { y: 260, rotationX: 40, rotationY: -30, rotationZ: 10, scale: 0.7, autoAlpha: 0, transformPerspective: 1600 }, { y: 0, rotationX: 0, rotationY: -8, rotationZ: 0, scale: 1, autoAlpha: 1, duration: 1.2 * d, ease: "expo.out" }, 0.25)
        .to(".dv-phone", { rotationY: 0, duration: 1.2 * d, ease: "power2.out" }, ">-0.4")
        .fromTo(".dv-side > *", { x: -40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7 * d, stagger: 0.08, ease: "power3.out" }, 0.6);
    } else if (shown.current) {
      shown.current = false;
      tlRef.current = gsap.timeline({
        onComplete: () => {
          gsap.set(el, { autoAlpha: 0 });
          document.documentElement.classList.remove("app-open");
          lenis?.start();
        },
      })
        .to(".dv-side > *", { autoAlpha: 0, duration: 0.2 * d }, 0)
        .to(".dv-phone", { y: 260, rotationX: -30, rotationY: 25, scale: 0.75, autoAlpha: 0, duration: 0.6 * d, ease: "power3.in" }, 0)
        .to(".dv-bg", { opacity: 0, duration: 0.4 * d }, 0.3)
        .fromTo("main", { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.7 * d, ease: "power3.out", clearProps: "transform,opacity,visibility" }, 0.35);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);

  return (
    <div className="device" ref={root} aria-hidden={!open}>
      <div className="dv-bg" />
      <div className="dv-stage">
        <div className="dv-side">
          <p className="dv-kicker">Mobile view · AnirudhaOS</p>
          <h2>
            My work, <em>as apps.</em>
          </h2>
          <p>Unlock the phone, then open any app: each project, my skills, journey, screenshots, resume and contact all live on the home screen.</p>
          <button type="button" className="dv-back" onClick={onClose}>
            ← Back to desktop view
          </button>
        </div>
        <div className="dv-phone" style={{ width: (W + 28) * scale, height: (H + 28) * scale }}>
          <div className="dv-frame" style={{ transform: `scale(${scale})` }}>
            <div className="dv-screen">{load && <PhoneOS active={open} onExit={onClose} />}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
