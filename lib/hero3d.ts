import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* A glossy phone showing real app screens, with bright shapes floating around it.
   It follows the mouse, turns as you scroll and cycles through screenshots. */
export function createHero3D(canvas: HTMLCanvasElement, screens: string[]) {
  const mobile = window.matchMedia("(pointer: coarse)").matches;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = env.texture;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0, 12);

  const key = new THREE.DirectionalLight("#ffffff", 2.2);
  key.position.set(4, 6, 6);
  scene.add(key, new THREE.AmbientLight("#ffffff", 0.4));

  const world = new THREE.Group();
  scene.add(world);

  /* phone */
  const phone = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(1.75, 3.6, 0.2, 8, 0.24), new THREE.MeshPhysicalMaterial({ color: "#16161a", metalness: 0.6, roughness: 0.25, clearcoat: 1, clearcoatRoughness: 0.1 }));
  const loader = new THREE.TextureLoader();
  const textures = screens.map((src) => {
    const t = loader.load(src);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  });
  const screenMat = new THREE.MeshBasicMaterial({ map: textures[0], toneMapped: false });
  const screen = new THREE.Mesh(new RoundedBoxGeometry(1.58, 3.42, 0.02, 4, 0.16), screenMat);
  screen.position.z = 0.105;
  const notch = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.3, 4, 8), new THREE.MeshBasicMaterial({ color: "#000000" }));
  notch.rotation.z = Math.PI / 2;
  notch.position.set(0, 1.58, 0.12);
  const cam = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.06, 20), new THREE.MeshPhysicalMaterial({ color: "#222", metalness: 0.8, roughness: 0.2 }));
  cam.rotation.x = Math.PI / 2;
  cam.position.set(-0.5, 1.4, -0.12);
  phone.add(body, screen, notch, cam);
  phone.rotation.set(0.1, -0.45, 0.06);
  world.add(phone);

  /* floating shapes in the site's colours */
  const glossy = (color: string) => new THREE.MeshPhysicalMaterial({ color, roughness: 0.18, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.08 });
  const shapes: { m: THREE.Mesh; base: THREE.Vector3; speed: number; spin: THREE.Vector3; depth: number }[] = [];
  const add = (geo: THREE.BufferGeometry, color: string, pos: [number, number, number], scale: number, depth: number) => {
    const m = new THREE.Mesh(geo, glossy(color));
    m.position.set(...pos);
    m.scale.setScalar(scale);
    m.rotation.set(Math.random() * 3, Math.random() * 3, 0);
    world.add(m);
    shapes.push({ m, base: m.position.clone(), speed: 0.6 + Math.random() * 0.6, spin: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, 0).multiplyScalar(0.8), depth });
  };
  add(new THREE.TorusKnotGeometry(0.42, 0.15, 120, 18), "#ff5a1f", [-1.9, 1.3, 0.6], 1, 1.2);
  add(new THREE.SphereGeometry(0.5, 48, 32), "#6c5ce7", [1.8, 1.7, -0.6], 1, 0.8);
  add(new RoundedBoxGeometry(0.8, 0.8, 0.8, 6, 0.16), "#0ea47a", [1.9, -1.4, 0.4], 1, 1.4);
  add(new THREE.TorusGeometry(0.42, 0.16, 24, 60), "#ffc93c", [-1.7, -1.6, -0.3], 1, 1);
  add(new THREE.CapsuleGeometry(0.2, 0.5, 8, 16), "#ff6fa5", [0.4, 2.45, 0.8], 1, 1.6);
  add(new THREE.IcosahedronGeometry(0.32, 0), "#02569b", [-0.6, -2.5, 0.9], 1, 1.8);

  /* soft contact shadow under the phone */
  const shadowTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(20,20,20,0.35)");
    grd.addColorStop(1, "rgba(20,20,20,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
  shadow.position.set(0, -2.6, -0.5);
  shadow.rotation.x = -Math.PI / 2.4;
  world.add(shadow);

  /* input */
  const pointer = new THREE.Vector2();
  const onMove = (e: PointerEvent) => { pointer.set(e.clientX / window.innerWidth - 0.5, e.clientY / window.innerHeight - 0.5); };
  window.addEventListener("pointermove", onMove);

  const resize = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w / h < 0.8 ? 13 : 9.6;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  /* intro pop, then the screen flips through apps every few seconds */
  let intro = 0;
  let screenIdx = 0, flip = 0, flipping = false, swapped = false, nextFlip = 3.2;
  const clock = new THREE.Clock();
  let t = 0, raf = 0, visible = true;
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
  io.observe(canvas);

  const tick = () => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);
    if (!visible) return;
    t += dt;
    intro = Math.min(1, intro + dt * 0.8);
    const e = 1 - Math.pow(1 - intro, 3);
    const scroll = Math.min(1.5, window.scrollY / window.innerHeight);

    world.scale.setScalar(0.4 + e * 0.6);
    world.rotation.y += ((pointer.x * 0.5 + scroll * 1.2) - world.rotation.y) * Math.min(1, dt * 3);
    world.rotation.x += ((pointer.y * 0.3 + scroll * 0.25) - world.rotation.x) * Math.min(1, dt * 3);
    world.position.y = -scroll * 1.2 + Math.sin(t * 0.8) * 0.08;

    /* screen flip */
    if (t > nextFlip && !flipping) { flipping = true; flip = 0; }
    if (flipping) {
      /* a full spin: the phone turns its back to you, swaps apps, and spins back round */
      flip = Math.min(1, flip + dt * 0.9);
      const k = flip < 0.5 ? 4 * flip * flip * flip : 1 - Math.pow(-2 * flip + 2, 3) / 2;
      phone.rotation.y = -0.45 + k * Math.PI * 2;
      if (flip > 0.5 && !swapped) {
        swapped = true;
        screenIdx = (screenIdx + 1) % textures.length;
        screenMat.map = textures[screenIdx];
      }
      if (flip >= 1) { flipping = false; swapped = false; phone.rotation.y = -0.45; nextFlip = t + 3.5; }
    }
    phone.rotation.z = 0.06 + Math.sin(t * 0.9) * 0.04;
    phone.position.y = Math.sin(t * 1.1) * 0.12;

    for (const s of shapes) {
      const spread = 1 + scroll * 0.6;
      s.m.position.set(
        s.base.x * spread + pointer.x * s.depth * -0.6,
        s.base.y * spread + Math.sin(t * s.speed + s.base.x) * 0.18 + pointer.y * s.depth * 0.4,
        s.base.z
      );
      s.m.rotation.x += s.spin.x * dt;
      s.m.rotation.y += s.spin.y * dt + dt * 0.2;
    }
    renderer.render(scene, camera);
  };
  tick();

  return () => {
    cancelAnimationFrame(raf);
    ro.disconnect();
    io.disconnect();
    window.removeEventListener("pointermove", onMove);
    textures.forEach((x) => x.dispose());
    shadowTex.dispose();
    env.dispose();
    pmrem.dispose();
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.geometry.dispose();
        (Array.isArray(m.material) ? m.material : [m.material]).forEach((x) => x.dispose());
      }
    });
    renderer.dispose();
  };
}
