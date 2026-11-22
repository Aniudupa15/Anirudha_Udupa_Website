"use client";
import { useCallback, useEffect, useRef, useState } from "react";

const store = {
  get: (k: string) => { try { return Number(localStorage.getItem(k) || 0); } catch { return 0; } },
  set: (k: string, v: number) => { try { localStorage.setItem(k, String(v)); } catch {} },
};

/* ---------- Snake ---------- */
export function Snake() {
  const N = 16;
  const canvas = useRef<HTMLCanvasElement>(null);
  const dir = useRef({ x: 1, y: 0 });
  const next = useRef({ x: 1, y: 0 });
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [state, setState] = useState<"ready" | "play" | "over">("ready");
  const game = useRef({ snake: [{ x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 }], food: { x: 11, y: 8 } });

  useEffect(() => setBest(store.get("au-snake")), []);

  const draw = useCallback(() => {
    const c = canvas.current;
    if (!c) return;
    const g = c.getContext("2d")!;
    const s = c.width / N;
    g.fillStyle = "#1a2e1f";
    g.fillRect(0, 0, c.width, c.height);
    g.fillStyle = "rgba(255,255,255,0.04)";
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if ((i + j) % 2) g.fillRect(i * s, j * s, s, s);
    const { snake, food } = game.current;
    g.fillStyle = "#ff5a5f";
    g.beginPath();
    g.arc(food.x * s + s / 2, food.y * s + s / 2, s * 0.38, 0, Math.PI * 2);
    g.fill();
    snake.forEach((p, i) => {
      g.fillStyle = i === 0 ? "#7ee787" : "#3fb950";
      g.beginPath();
      g.roundRect(p.x * s + 1.5, p.y * s + 1.5, s - 3, s - 3, 5);
      g.fill();
    });
  }, []);

  const reset = () => {
    game.current = { snake: [{ x: 5, y: 8 }, { x: 4, y: 8 }, { x: 3, y: 8 }], food: { x: 11, y: 8 } };
    dir.current = { x: 1, y: 0 };
    next.current = { x: 1, y: 0 };
    setScore(0);
    setState("play");
  };

  useEffect(() => {
    draw();
    if (state !== "play") return;
    const id = window.setInterval(() => {
      const { snake, food } = game.current;
      const d = next.current;
      dir.current = d;
      const head = { x: (snake[0].x + d.x + N) % N, y: (snake[0].y + d.y + N) % N };
      if (snake.some((p) => p.x === head.x && p.y === head.y)) {
        setState("over");
        setScore((sc) => { if (sc > store.get("au-snake")) { store.set("au-snake", sc); setBest(sc); } return sc; });
        return;
      }
      snake.unshift(head);
      if (head.x === food.x && head.y === food.y) {
        setScore((sc) => sc + 1);
        let f;
        do f = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) };
        while (snake.some((p) => p.x === f!.x && p.y === f!.y));
        game.current.food = f;
      } else snake.pop();
      draw();
    }, 130);
    return () => window.clearInterval(id);
  }, [state, draw]);

  const turn = (x: number, y: number) => {
    if (dir.current.x === -x && dir.current.y === -y) return;
    next.current = { x, y };
    if (state !== "play") reset();
  };
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const m: Record<string, [number, number]> = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] };
      if (m[e.key]) { e.preventDefault(); turn(...m[e.key]); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });
  const start = useRef<{ x: number; y: number } | null>(null);

  return (
    <div className="gm gm-snake">
      <div className="gm-bar">
        <span>Score <b>{score}</b></span>
        <span>Best <b>{best}</b></span>
      </div>
      <div
        className="gm-board"
        onPointerDown={(e) => { start.current = { x: e.clientX, y: e.clientY }; }}
        onPointerUp={(e) => {
          const s = start.current;
          start.current = null;
          if (!s) return;
          const dx = e.clientX - s.x, dy = e.clientY - s.y;
          if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) { if (state !== "play") reset(); return; }
          if (Math.abs(dx) > Math.abs(dy)) turn(Math.sign(dx), 0);
          else turn(0, Math.sign(dy));
        }}
      >
        <canvas ref={canvas} width={320} height={320} />
        {state !== "play" && (
          <button type="button" className="gm-overlay" onClick={reset}>
            <b>{state === "over" ? `Game over · ${score}` : "Snake"}</b>
            <span>{state === "over" ? "Tap to play again" : "Tap to start · swipe or use arrows"}</span>
          </button>
        )}
      </div>
      <div className="gm-pad">
        <button type="button" onClick={() => turn(0, -1)} aria-label="Up">▲</button>
        <div>
          <button type="button" onClick={() => turn(-1, 0)} aria-label="Left">◀</button>
          <button type="button" onClick={() => turn(0, 1)} aria-label="Down">▼</button>
          <button type="button" onClick={() => turn(1, 0)} aria-label="Right">▶</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Tic-Tac-Toe against the phone ---------- */
const LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const winner = (b: string[]) => {
  for (const [a, c, d] of LINES) if (b[a] && b[a] === b[c] && b[a] === b[d]) return { who: b[a], line: [a, c, d] };
  return b.every(Boolean) ? { who: "draw", line: [] as number[] } : null;
};
function best(b: string[], me: string): number {
  const other = me === "O" ? "X" : "O";
  let bestScore = -Infinity, move = -1;
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue;
    b[i] = me;
    const s = -score(b, other, 1);
    b[i] = "";
    if (s > bestScore) { bestScore = s; move = i; }
  }
  return move;
}
function score(b: string[], turn: string, depth: number): number {
  const w = winner(b);
  if (w) return w.who === "draw" ? 0 : w.who === turn ? 10 - depth : depth - 10;
  const other = turn === "O" ? "X" : "O";
  let m = -Infinity;
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue;
    b[i] = turn;
    m = Math.max(m, -score(b, other, depth + 1));
    b[i] = "";
  }
  return m;
}
export function TicTacToe() {
  const [b, setB] = useState<string[]>(Array(9).fill(""));
  const [tally, setTally] = useState({ you: 0, phone: 0, draw: 0 });
  const w = winner(b);
  const play = (i: number) => {
    if (b[i] || w) return;
    const nb = [...b];
    nb[i] = "X";
    let res = winner(nb);
    if (!res) {
      /* the phone plays perfectly two times out of three, so you can win */
      const empties = nb.map((v, k) => (v ? -1 : k)).filter((k) => k >= 0);
      const mv = Math.random() < 0.67 ? best(nb, "O") : empties[Math.floor(Math.random() * empties.length)];
      nb[mv] = "O";
      res = winner(nb);
    }
    setB(nb);
    if (res) setTally((t) => ({ ...t, [res!.who === "X" ? "you" : res!.who === "O" ? "phone" : "draw"]: (t as Record<string, number>)[res!.who === "X" ? "you" : res!.who === "O" ? "phone" : "draw"] + 1 }));
  };
  return (
    <div className="gm gm-ttt">
      <div className="gm-bar">
        <span>You <b>{tally.you}</b></span>
        <span>Draw <b>{tally.draw}</b></span>
        <span>Phone <b>{tally.phone}</b></span>
      </div>
      <div className="ttt">
        {b.map((v, i) => (
          <button key={i} type="button" className={(v ? "on " + v : "") + (w?.line.includes(i) ? " win" : "")} onClick={() => play(i)} aria-label={`Cell ${i + 1}${v ? ", " + v : ""}`}>
            {v === "X" ? "✕" : v === "O" ? "◯" : ""}
          </button>
        ))}
      </div>
      <p className="gm-msg">{w ? (w.who === "X" ? "You win! 🎉" : w.who === "O" ? "The phone wins this one." : "It's a draw.") : "You are ✕. Tap a square."}</p>
      <button type="button" className="gm-btn" onClick={() => setB(Array(9).fill(""))}>
        New game
      </button>
    </div>
  );
}

/* ---------- Memory match ---------- */
const FACES = ["🐦", "⚡", "🔥", "🐍", "☁️", "📱", "💳", "🗺️"];
const shuffle = () => [...FACES, ...FACES].map((f, i) => ({ f, id: i, r: Math.random() })).sort((a, b) => a.r - b.r).map(({ f, id }) => ({ f, id }));
export function Memory() {
  const [cards, setCards] = useState(() => FACES.concat(FACES).map((f, id) => ({ f, id })));
  const [open, setOpen] = useState<number[]>([]);
  const [done, setDone] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [bestMoves, setBestMoves] = useState(0);
  useEffect(() => { setCards(shuffle()); setBestMoves(store.get("au-memory")); }, []);
  const flip = (i: number) => {
    if (open.length === 2 || open.includes(i) || done.includes(i)) return;
    const o = [...open, i];
    setOpen(o);
    if (o.length === 2) {
      setMoves((m) => m + 1);
      const [a, c] = o;
      if (cards[a].f === cards[c].f) {
        const d = [...done, a, c];
        window.setTimeout(() => { setDone(d); setOpen([]); }, 350);
        if (d.length === cards.length) {
          const m = moves + 1;
          if (!bestMoves || m < bestMoves) { store.set("au-memory", m); setBestMoves(m); }
        }
      } else window.setTimeout(() => setOpen([]), 750);
    }
  };
  const restart = () => { setCards(shuffle()); setOpen([]); setDone([]); setMoves(0); };
  const won = done.length === cards.length;
  return (
    <div className="gm gm-mem">
      <div className="gm-bar">
        <span>Moves <b>{moves}</b></span>
        <span>Best <b>{bestMoves || "–"}</b></span>
      </div>
      <div className="mem">
        {cards.map((c, i) => {
          const up = open.includes(i) || done.includes(i);
          return (
            <button key={c.id} type="button" className={"card3" + (up ? " up" : "") + (done.includes(i) ? " done" : "")} onClick={() => flip(i)} aria-label={up ? c.f : "Hidden card"}>
              <span className="back">AU</span>
              <span className="front">{c.f}</span>
            </button>
          );
        })}
      </div>
      <p className="gm-msg">{won ? `All pairs found in ${moves} moves! 🎉` : "Find all 8 pairs."}</p>
      <button type="button" className="gm-btn" onClick={restart}>
        Shuffle
      </button>
    </div>
  );
}
