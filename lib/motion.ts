import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function startMotion(root: HTMLElement) {
  const html = document.documentElement;
  const q = <T extends Element = HTMLElement>(s: string, el: ParentNode = root) => el.querySelector<T>(s)!;
  const qa = <T extends Element = HTMLElement>(s: string, el: ParentNode = root) => Array.from(el.querySelectorAll<T>(s));
  const cleanups: Array<() => void> = [];
  const on = (t: EventTarget, type: string, fn: (e: never) => void) => {
    t.addEventListener(type, fn as EventListener);
    cleanups.push(() => t.removeEventListener(type, fn as EventListener));
  };
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  /* ---------- Smooth scroll ---------- */
  const lenis = new Lenis({ lerp: 0.09, anchors: true });
  lenis.on("scroll", ScrollTrigger.update);
  (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
  const raf = (t: number) => lenis.raf(t * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  lenis.stop();
  window.scrollTo(0, 0);
  const fine = window.matchMedia("(pointer: fine)").matches;
  const splits: SplitText[] = [];

  /* ---------- Nav hides on the way down ---------- */
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => q(".nav").classList.toggle("hide", self.direction > 0 && self.scroll() > 300),
  });

  /* ---------- Magnetic buttons ---------- */
  if (fine) {
    qa("[data-magnetic]").forEach((el) => {
      const mx = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      const my = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
      on(el, "pointermove", (e: PointerEvent) => { const r = el.getBoundingClientRect(); mx((e.clientX - r.left - r.width / 2) * 0.35); my((e.clientY - r.top - r.height / 2) * 0.35); });
      on(el, "pointerleave", () => { mx(0); my(0); });
    });
  }

  /* ---------- Custom cursor ---------- */
  if (fine) {
    const cur = q(".cursor");
    const dx = gsap.quickTo(".cursor-dot", "x", { duration: 0.1 }), dy = gsap.quickTo(".cursor-dot", "y", { duration: 0.1 });
    const rx = gsap.quickTo(".cursor-ring", "x", { duration: 0.5, ease: "power3" }), ry = gsap.quickTo(".cursor-ring", "y", { duration: 0.5, ease: "power3" });
    gsap.set(".cursor-dot, .cursor-ring", { x: -100, y: -100 });
    on(window, "pointermove", (e: PointerEvent) => { dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); });
    on(document, "pointerover", (e: PointerEvent) => {
      const t = e.target as HTMLElement;
      const view = !!t.closest("[data-cursor='view']");
      cur.classList.toggle("view", view);
      cur.classList.toggle("hover", !view && !!t.closest("a, button, .tilt3d, .globe"));
    });
  }

  /* ---------- Headings lean with scroll speed ---------- */
  const skewTargets = qa(".big, .contact-title, .statement");
  const skewProxy = { v: 0 };
  const skewSet = gsap.quickSetter(skewTargets, "skewY", "deg");
  gsap.set(skewTargets, { transformOrigin: "left center", force3D: true });
  ScrollTrigger.create({
    onUpdate: (self) => {
      const v = gsap.utils.clamp(-5, 5, self.getVelocity() / -400);
      if (Math.abs(v) > Math.abs(skewProxy.v)) {
        skewProxy.v = v;
        gsap.to(skewProxy, { v: 0, duration: 0.8, ease: "power3", overwrite: true, onUpdate: () => skewSet(skewProxy.v) });
      }
    },
  });

  /* ---------- Hero ---------- */
  const heroSplit = SplitText.create(".hw", { type: "chars", mask: "chars" });
  splits.push(heroSplit);
  gsap.to(".wave", { rotation: 18, duration: 0.35, yoyo: true, repeat: -1, repeatDelay: 1.6, ease: "sine.inOut" });

  /* soft colour glows drift behind the hero */
  qa(".glow").forEach((g, i) => gsap.to(g, { x: i % 2 ? -60 : 70, y: i ? -50 : 40, scale: 1.15, duration: 7 + i * 2, ease: "sine.inOut", yoyo: true, repeat: -1 }));

  /* lines slide apart as you scroll away */
  const heroST = { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 };
  gsap.to(".hl-1", { xPercent: -14, ease: "none", scrollTrigger: heroST });
  gsap.to(".hl-2", { xPercent: 10, ease: "none", scrollTrigger: heroST });
  gsap.to(".hl-3", { xPercent: -8, ease: "none", scrollTrigger: heroST });
  gsap.to(".hero-photo", { rotation: 8, ease: "none", scrollTrigger: heroST });

  /* ---------- 3D tilt on cards, photo and tiles ---------- */
  if (fine) {
    qa(".tilt3d").forEach((el) => {
      gsap.set(el, { transformPerspective: 1000 });
      const rx = gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3" });
      const ry = gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3" });
      on(el, "pointermove", (e: PointerEvent) => { const r = el.getBoundingClientRect(); ry(((e.clientX - r.left) / r.width - 0.5) * 18); rx(((e.clientY - r.top) / r.height - 0.5) * -14); });
      on(el, "pointerleave", () => { rx(0); ry(0); });
    });
  }

  /* crossing skill bands that speed up with scroll */
  const loops = qa(".band").map((band, i) =>
    gsap.fromTo(q(".band-track", band), { xPercent: i ? -50 : 0 }, { xPercent: i ? 0 : -50, duration: i ? 36 : 30, ease: "none", repeat: -1 })
  );
  ScrollTrigger.create({
    trigger: ".bands",
    start: "top bottom",
    end: "bottom top",
    onUpdate: (self) => {
      const v = Math.min(6, 1 + Math.abs(self.getVelocity()) / 300);
      loops.forEach((l) => gsap.to(l, { timeScale: v * (self.direction || 1), duration: 0.2, overwrite: true, onComplete: () => { gsap.to(l, { timeScale: 1, duration: 1 }); } }));
    },
  });

  /* ---------- About ---------- */
  gsap.from(".about-text", { y: 30, opacity: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".about-text", start: "top 85%" } });
  qa(".count").forEach((el) => {
    const to = parseFloat(el.dataset.to || "0"), dec = parseInt(el.dataset.decimals || "0"), suf = el.dataset.suffix || "";
    const o = { v: 0 };
    el.textContent = (0).toFixed(dec) + suf;
    gsap.to(o, { v: to, duration: 2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 92%" }, onUpdate: () => { el.textContent = o.v.toFixed(dec) + suf; } });
  });
  gsap.from(".stat", { rotationY: 90, transformPerspective: 800, transformOrigin: "0% 50%", autoAlpha: 0, duration: 1, ease: "power4.out", stagger: 0.1, scrollTrigger: { trigger: ".stats", start: "top 88%" } });
  gsap.from(".me-frame", { clipPath: "inset(100% 0 0 0 round 28px)", duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".me", start: "top 80%" } });
  gsap.from(".me-blob", { scale: 0, rotation: -90, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".me", start: "top 80%" } });
  gsap.to(".me-blob", { rotation: 360, duration: 40, ease: "none", repeat: -1 });
  gsap.from(".me-tag", { x: -60, autoAlpha: 0, duration: 1, ease: "power3.out", delay: 0.4, scrollTrigger: { trigger: ".me", start: "top 80%" } });
  gsap.from(".me-sticker", { scale: 0, rotation: -180, duration: 1, ease: "back.out(2)", delay: 0.6, scrollTrigger: { trigger: ".me", start: "top 80%" } });
  gsap.to(".me-sticker", { rotation: 200, ease: "none", scrollTrigger: { trigger: ".me", start: "top bottom", end: "bottom top", scrub: true } });
  gsap.to(".me-frame img", { yPercent: 8, scale: 1.1, ease: "none", scrollTrigger: { trigger: ".me", start: "top bottom", end: "bottom top", scrub: true } });

  /* ---------- Big titles: lines rise from a mask ---------- */
  const titles = () =>
    qa(".split").forEach((el) => {
      const s = SplitText.create(el, { type: "lines,words", mask: "lines" });
      splits.push(s);
      gsap.from(s.lines, { yPercent: 110, rotationX: -70, transformPerspective: 800, transformOrigin: "50% 0%", duration: 1.3, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 85%" } });
    });
  gsap.utils.toArray<HTMLElement>(".eyebrow").forEach((el) => gsap.from(el, { y: 20, autoAlpha: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%" } }));

  gsap.from(".globe", { scale: 0.4, rotation: -60, autoAlpha: 0, duration: 1.6, ease: "expo.out", scrollTrigger: { trigger: ".globe", start: "top 80%" } });
  gsap.from(".skills-lede", { y: 30, autoAlpha: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: ".skills-lede", start: "top 90%" } });

  /* ---------- Work: cards stack on top of each other ---------- */
  const cards = qa(".card");
  const last = cards[cards.length - 1];
  cards.forEach((card, i) => {
    const inner = q(".card-in", card);
    gsap.fromTo(inner, { rotationX: 22, yPercent: 8, transformPerspective: 1400, transformOrigin: "50% 0%" }, { rotationX: 0, yPercent: 0, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "top top", scrub: true } });
    if (i < cards.length - 1) {
      ScrollTrigger.create({ trigger: card, start: "top top", endTrigger: last, end: "top top", pin: true, pinSpacing: false });
      gsap.fromTo(inner, { scale: 1, rotationX: 0, filter: "brightness(1)" }, {
        scale: 0.88 + i * 0.03,
        rotationX: -10,
        immediateRender: false,
        filter: "brightness(0.72)",
        ease: "none",
        scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top top", scrub: true },
      });
    }
    const h3 = q("h3", card);
    const s = SplitText.create(h3, { type: "chars", mask: "chars" });
    splits.push(s);
    const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 70%" } });
    tl.from(s.chars, { yPercent: 110, duration: 0.9, ease: "expo.out", stagger: 0.03 })
      .from(qa(".card-meta, .card-body, li, .chips span, .btn", card), { y: 24, autoAlpha: 0, duration: 0.7, ease: "power3.out", stagger: 0.04 }, "<0.2")
      .from(q(".p1", card), { y: 200, rotation: -25, autoAlpha: 0, duration: 1.1, ease: "back.out(1.3)" }, 0)
      .from(q(".p2", card), { y: 260, rotation: 30, autoAlpha: 0, duration: 1.2, ease: "back.out(1.3)" }, 0.1)
      .from(q(".ring", card), { scale: 0.3, autoAlpha: 0, duration: 1.2, ease: "expo.out" }, 0);
    gsap.to(q(".ring", card), { rotation: 360, duration: 30, ease: "none", repeat: -1 });
    if (window.innerWidth > 900) {
      gsap.to(q(".p1", card), { y: -40, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } });
      gsap.to(q(".p2", card), { y: 40, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } });
    }
  });

  ScrollTrigger.batch(".tile", {
    start: "top 90%",
    once: true,
    onEnter: (els) => gsap.from(els, { rotationX: -80, y: 60, transformPerspective: 900, transformOrigin: "50% 0%", autoAlpha: 0, duration: 1.2, ease: "power4.out", stagger: 0.1 }),
  });

  /* ---------- Inside the apps: a 3D cover-flow you scroll sideways ---------- */
  const track = q(".gal-track");
  const items = qa(".gal-item");
  const itemW = () => items[0].offsetWidth;
  const coverflow = () => {
    const mid = window.innerWidth / 2;
    for (const it of items) {
      const r = it.getBoundingClientRect();
      const d = (r.left + r.width / 2 - mid) / window.innerWidth;
      const ad = Math.min(1, Math.abs(d));
      gsap.set(it, { rotationY: gsap.utils.clamp(-60, 60, d * -90), z: -ad * 380, scale: 1 - Math.min(0.3, ad * 0.45), opacity: 1 - Math.min(0.65, ad * 0.9) });
    }
  };
  gsap.fromTo(track, { x: () => -itemW() / 2 }, {
    x: () => window.innerWidth / 2 - track.scrollWidth + itemW() / 2,
    ease: "none",
    scrollTrigger: {
      trigger: ".gal-pin",
      start: "top top",
      end: () => "+=" + track.scrollWidth * 0.9,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      onUpdate: (self) => gsap.set(".gal-bar span", { scaleX: self.progress }),
    },
    onUpdate: coverflow,
  });
  coverflow();

  /* ---------- Journey: the line draws as you scroll ---------- */
  gsap.to(".tl-fill", { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".timeline", start: "top 60%", end: "bottom 60%", scrub: true } });
  qa(".tl-item").forEach((item) => {
    const right = item.classList.contains("right");
    gsap.from(q(".tl-card", item), { x: right ? 80 : -80, rotationY: right ? -45 : 45, transformPerspective: 900, autoAlpha: 0, duration: 1.2, ease: "power4.out", scrollTrigger: { trigger: item, start: "top 80%" } });
    gsap.from(q(".tl-dot", item), { scale: 0, duration: 0.6, ease: "back.out(3)", scrollTrigger: { trigger: item, start: "top 62%" } });
  });
  gsap.from(".award", { y: 40, autoAlpha: 0, duration: 0.9, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: ".awards", start: "top 88%" } });

  /* ---------- Contact ---------- */
  gsap.from(".contact", { borderRadius: "50% 50% 0 0", ease: "none", scrollTrigger: { trigger: ".contact", start: "top bottom", end: "top 30%", scrub: true } });
  gsap.from(".mail-btn", { scale: 0, rotation: -120, duration: 1.2, ease: "back.out(1.6)", scrollTrigger: { trigger: ".contact-row", start: "top 85%" } });
  gsap.from(".giant span", { yPercent: 100, rotationX: -80, transformPerspective: 800, transformOrigin: "50% 100%", duration: 1.2, ease: "expo.out", stagger: 0.06, scrollTrigger: { trigger: ".giant", start: "top 95%" } });
  gsap.from(".contact-list > div", { x: 60, autoAlpha: 0, duration: 0.8, ease: "power3.out", stagger: 0.07, scrollTrigger: { trigger: ".contact-list", start: "top 88%" } });

  /* ---------- Intro: counter, colour wipes, then the headline ---------- */
  const num = q(".loader-num");
  const c = { v: 0 };
  const ready = Promise.all([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise((r) => window.setTimeout(r, 300))]);
  const intro = gsap.timeline({ paused: true });
  intro
    .to(c, { v: 100, duration: 1.2, ease: "power3.inOut", onUpdate: () => { num.textContent = String(Math.round(c.v)); } })
    .to(".loader-in", { yPercent: -30, autoAlpha: 0, duration: 0.4, ease: "power2.in" })
    .to(".lp-3", { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "<0.1")
    .to(".lp-2", { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "<0.12")
    .to(".lp-1", { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "<0.12")
    .set(".loader", { display: "none" })
    .from(heroSplit.chars, { yPercent: 100, rotationX: -90, transformPerspective: 600, transformOrigin: "50% 100%", duration: 1.2, ease: "expo.out", stagger: 0.03 }, "<0.3")
    .from(".hero-3d", { autoAlpha: 0, scale: 0.8, duration: 1.6, ease: "expo.out" }, "<0.2")
    .from(".hero-photo", { width: 0, duration: 1.1, ease: "expo.inOut" }, "<0.2")
    .from(".hero-arrow", { scale: 0, rotation: -90, duration: 0.8, ease: "back.out(2.5)" }, "<0.4")
    .from(".hero-hi, .hero-foot > *, .nav > *", { y: 24, autoAlpha: 0, duration: 0.8, ease: "power3.out", stagger: 0.07 }, "<0.1")
    .fromTo(".band-a", { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut" }, "<")
    .fromTo(".band-b", { clipPath: "inset(0% 0% 0% 100%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut" }, "<0.1")
    .add(() => {
      lenis.start();
      html.classList.add("ready");
      titles();
      ScrollTrigger.refresh();
    });
  ready.then(() => intro.play());

  return () => {
    cleanups.forEach((f) => f());
    splits.forEach((s) => s.revert());
    gsap.ticker.remove(raf);
    lenis.destroy();
    html.classList.remove("ready");
  };
}
