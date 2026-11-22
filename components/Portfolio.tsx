"use client";
import { memo, useCallback, useLayoutEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import AppMode from "./AppMode";
import PhoneOS from "./PhoneOS";
import { About, Contact, Cursor, Gallery, Hero, Journey, Loader, Nav, Skills, Work } from "./Site";
import { startMotion } from "@/lib/motion";

/* The animated page never re-renders, so GSAP's text splitting stays intact */
const Page = memo(function Page() {
  return (
    <main>
      <Hero />
      <About />
      <Skills />
      <Work />
      <Gallery />
      <Journey />
      <Contact />
    </main>
  );
});

const isPhone = () => typeof window !== "undefined" && window.matchMedia("(pointer: coarse) and (max-width: 820px)").matches;

export default function Portfolio() {
  const root = useRef<HTMLDivElement>(null);
  const [app, setApp] = useState(false);
  /* phones open straight into the phone OS; the layout script sets the class before paint */
  const [os, setOs] = useState(false);
  useLayoutEffect(() => {
    if (document.documentElement.classList.contains("phone-os")) setOs(true);
  }, []);

  const enterOS = useCallback(() => {
    document.documentElement.classList.add("phone-os");
    try { sessionStorage.removeItem("au-site"); } catch {}
    window.scrollTo(0, 0);
    setOs(true);
  }, []);
  const exitOS = useCallback(() => {
    document.documentElement.classList.remove("phone-os");
    try { sessionStorage.setItem("au-site", "1"); } catch {}
    setOs(false);
  }, []);
  const toggle = useCallback(() => (isPhone() ? enterOS() : setApp((a) => !a)), [enterOS]);
  const close = useCallback(() => setApp(false), []);

  useGSAP(
    () => {
      if (os || document.documentElement.classList.contains("phone-os")) return;
      return startMotion(root.current!);
    },
    { scope: root, dependencies: [os], revertOnUpdate: true }
  );

  if (os) {
    return (
      <div className="os-full">
        <PhoneOS active onExit={exitOS} full />
      </div>
    );
  }

  return (
    <div ref={root}>
      <Loader />
      <Cursor />
      <Nav app={app} onToggle={toggle} />
      <Page />
      <AppMode open={app} onClose={close} />
    </div>
  );
}
