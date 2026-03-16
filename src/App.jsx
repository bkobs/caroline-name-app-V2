import { useState, useEffect, useRef, useCallback } from "react";

const LETTERS = ["C","A","R","O","L","I","N","E"];

const COLORS = [
  "#FF6B9D", "#FF9F43", "#FECA57", "#48DBFB",
  "#1DD1A1", "#A29BFE", "#FD79A8", "#6C5CE7"
];

const BG_COLORS = [
  "#FFE0EC", "#FFF3E0", "#FFFDE7", "#E0F7FF",
  "#E0FFF6", "#EDE7FF", "#FFE4F0", "#EAE7FF"
];

const LETTER_WORDS = {
  C: "Cat 🐱", A: "Apple 🍎", R: "Rainbow 🌈",
  O: "Orange 🍊", L: "Lion 🦁", I: "Ice cream 🍦",
  N: "Night stars 🌟", E: "Elephant 🐘"
};

const EMOJIS = ["🌸","⭐","🦋","🌈","💖","🎉","✨","🌺"];

const SCREEN_LABELS = ["Meet It", "Find It", "Write Letters", "Write Name", "🌟"];
const TAB_COLORS = ["#FF6B9D","#48DBFB","#FF9F43","#A29BFE","#1DD1A1"];

// ── Confetti ──────────────────────────────────────────────────────────────────
function Confetti({ show }) {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i, color: COLORS[i % COLORS.length],
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 1.5}s`,
    size: `${8 + Math.random() * 14}px`,
    dur: `${1.5 + Math.random()}s`,
  }));
  if (!show) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 999, overflow: "hidden" }}>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute", top: "-20px", left: p.left,
          width: p.size, height: p.size, borderRadius: "50%",
          background: p.color,
          animation: `fall ${p.dur} ${p.delay} ease-in forwards`,
        }} />
      ))}
      <style>{`@keyframes fall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(720deg);opacity:0} }`}</style>
    </div>
  );
}

// ── SCREEN 1: Meet Your Name ──────────────────────────────────────────────────
function MeetYourName({ onNext }) {
  const [tapped, setTapped] = useState({});
  const [bouncing, setBouncing] = useState({});

  const tap = (i) => {
    setTapped(t => ({ ...t, [i]: true }));
    setBouncing(b => ({ ...b, [i]: true }));
    setTimeout(() => setBouncing(b => ({ ...b, [i]: false })), 600);
    const utt = new SpeechSynthesisUtterance(LETTERS[i].toLowerCase());
    utt.rate = 0.8; utt.pitch = 1.4;
    window.speechSynthesis.speak(utt);
  };

  const allTapped = LETTERS.every((_, i) => tapped[i]);

  const sayName = () => {
    const utt = new SpeechSynthesisUtterance("C... A... R... O... L... I... N... E... Caroline!");
    utt.rate = 0.65; utt.pitch = 1.3;
    window.speechSynthesis.speak(utt);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px 16px" }}>
      <div style={{ fontSize: 28, fontWeight: 800, color: "#6C5CE7", marginBottom: 6, fontFamily: "'Fredoka One', cursive", textShadow: "2px 2px 0 #A29BFE" }}>
        Hi Caroline! 👋
      </div>
      <div style={{ fontSize: 16, color: "#888", marginBottom: 30, fontWeight: 600 }}>
        Tap each letter to hear it!
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap", marginBottom: 32 }}>
        {LETTERS.map((letter, i) => (
          <button key={i} onClick={() => tap(i)} style={{
            width: 76, height: 90, borderRadius: 22,
            background: tapped[i] ? COLORS[i] : "#fff",
            border: `4px solid ${COLORS[i]}`,
            boxShadow: tapped[i] ? `0 6px 20px ${COLORS[i]}66` : "0 3px 12px rgba(0,0,0,0.12)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 2, cursor: "pointer",
            transform: bouncing[i] ? "scale(1.25) rotate(-5deg)" : "scale(1)",
            transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)", outline: "none",
          }}>
            <div style={{ fontSize: 38, fontWeight: 900, color: tapped[i] ? "#fff" : COLORS[i], fontFamily: "'Fredoka One', cursive", lineHeight: 1 }}>{letter}</div>
            {tapped[i] && <div style={{ fontSize: 18 }}>{EMOJIS[i]}</div>}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, maxWidth: 600, margin: "0 auto 28px" }}>
        {LETTERS.map((letter, i) => tapped[i] && (
          <div key={i} style={{ background: BG_COLORS[i], borderRadius: 14, padding: "6px 12px", fontSize: 14, fontWeight: 700, color: COLORS[i], animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)", border: `2px solid ${COLORS[i]}44` }}>
            {letter} is for {LETTER_WORDS[letter]}
          </div>
        ))}
      </div>
      <button onClick={sayName} style={{ background: "linear-gradient(135deg, #A29BFE, #6C5CE7)", border: "none", borderRadius: 24, padding: "14px 30px", color: "#fff", fontSize: 18, fontWeight: 800, boxShadow: "0 6px 20px #A29BFE66", cursor: "pointer", display: "block", margin: "0 auto 14px", fontFamily: "'Fredoka One', cursive" }}>
        🔊 Say My Whole Name!
      </button>
      {allTapped && (
        <button onClick={onNext} style={{ background: "linear-gradient(135deg, #FF6B9D, #FD79A8)", border: "none", borderRadius: 24, padding: "14px 36px", color: "#fff", fontSize: 20, fontWeight: 800, boxShadow: "0 6px 20px #FF6B9D66", cursor: "pointer", display: "block", margin: "16px auto 0", fontFamily: "'Fredoka One', cursive", animation: "pulse 1.2s ease-in-out infinite" }}>
          Great job! Play the Letter Game! →
        </button>
      )}
    </div>
  );
}

// ── SCREEN 2: Letter Hunt ─────────────────────────────────────────────────────
function LetterHunt({ onNext }) {
  const TARGET = LETTERS;
  const ALL_LETTERS_POOL = "BCDFGHJKMPQSTUVWXYZ".split("");

  const buildGrid = useCallback(() => {
    const distractors = ALL_LETTERS_POOL.sort(() => Math.random() - 0.5).slice(0, 12);
    return [...TARGET, ...distractors].sort(() => Math.random() - 0.5);
  }, []);

  const [grid] = useState(() => buildGrid());
  const [found, setFound] = useState([]);
  const [shaking, setShaking] = useState(null);
  const [collected, setCollected] = useState([]);

  const remaining = TARGET.filter(l => !collected.includes(l));
  const nextTarget = remaining[0];
  const done = collected.length === TARGET.length;

  const tap = (letter, idx) => {
    if (letter === nextTarget) {
      setCollected(c => [...c, letter]);
      setFound(f => [...f, idx]);
      const utt = new SpeechSynthesisUtterance(`Yes! ${letter.toLowerCase()}!`);
      utt.rate = 0.9; utt.pitch = 1.4;
      window.speechSynthesis.speak(utt);
    } else {
      setShaking(idx);
      setTimeout(() => setShaking(null), 500);
      const utt = new SpeechSynthesisUtterance("Not that one! Find " + nextTarget.toLowerCase());
      utt.rate = 0.9; utt.pitch = 1.2;
      window.speechSynthesis.speak(utt);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px 16px" }}>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#FF6B9D", fontFamily: "'Fredoka One', cursive", marginBottom: 6, textShadow: "2px 2px 0 #FD79A8" }}>🔍 Letter Hunt!</div>
      {!done ? (
        <>
          <div style={{ fontSize: 16, color: "#666", marginBottom: 16, fontWeight: 600 }}>Find the letter...</div>
          <div style={{ fontSize: 80, fontWeight: 900, color: COLORS[TARGET.indexOf(nextTarget)], fontFamily: "'Fredoka One', cursive", lineHeight: 1, marginBottom: 16, filter: `drop-shadow(3px 3px 0 ${COLORS[TARGET.indexOf(nextTarget)]}66)`, animation: "pulse 1.2s ease-in-out infinite" }}>
            {nextTarget}
          </div>
        </>
      ) : (
        <div style={{ fontSize: 26, color: "#1DD1A1", fontWeight: 800, fontFamily: "'Fredoka One', cursive", marginBottom: 16 }}>🎉 You found them ALL! Amazing!</div>
      )}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {TARGET.map((l, i) => (
          <div key={i} style={{ width: 40, height: 48, borderRadius: 12, background: collected.includes(l) ? COLORS[i] : "#f0f0f0", border: `3px solid ${collected.includes(l) ? COLORS[i] : "#ddd"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: collected.includes(l) ? "#fff" : "#ccc", fontFamily: "'Fredoka One', cursive", transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)", transform: collected.includes(l) ? "scale(1.1)" : "scale(1)" }}>
            {collected.includes(l) ? l : ""}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, maxWidth: 400, margin: "0 auto 24px" }}>
        {grid.map((letter, idx) => {
          const isFound = found.includes(idx);
          const letterIdx = TARGET.indexOf(letter);
          return (
            <button key={idx} onClick={() => !isFound && !done && tap(letter, idx)} style={{ height: 66, borderRadius: 18, background: isFound ? COLORS[letterIdx] : "#fff", border: `3px solid ${isFound ? COLORS[letterIdx] : "#e0e0e0"}`, boxShadow: isFound ? `0 4px 14px ${COLORS[letterIdx]}55` : "0 2px 8px rgba(0,0,0,0.08)", fontSize: 28, fontWeight: 900, color: isFound ? "#fff" : "#444", fontFamily: "'Fredoka One', cursive", cursor: isFound ? "default" : "pointer", transform: shaking === idx ? "translateX(-5px)" : "scale(1)", animation: shaking === idx ? "shake 0.4s ease" : "none", transition: "all 0.25s", outline: "none", opacity: isFound ? 0.6 : 1 }}>
              {letter}
            </button>
          );
        })}
      </div>
      {done && (
        <button onClick={onNext} style={{ background: "linear-gradient(135deg, #1DD1A1, #00B894)", border: "none", borderRadius: 24, padding: "14px 36px", color: "#fff", fontSize: 20, fontWeight: 800, boxShadow: "0 6px 20px #1DD1A166", cursor: "pointer", fontFamily: "'Fredoka One', cursive", animation: "pulse 1.2s ease-in-out infinite" }}>
          Now let's write each letter! ✏️ →
        </button>
      )}
    </div>
  );
}

// ── SCREEN 3: Write Each Letter ───────────────────────────────────────────────
function WriteEachLetter({ onNext }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [done, setDone] = useState([]);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [celebrating, setCelebrating] = useState(false);
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef(null);

  const currentLetter = LETTERS[currentIdx];
  const color = COLORS[currentIdx];
  const allDone = done.length === LETTERS.length;

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const drawGuide = useCallback((ctx, letter, col) => {
    ctx.save();
    ctx.font = "bold 180px 'Fredoka One', cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = col + "18";
    ctx.strokeStyle = col + "30";
    ctx.lineWidth = 3;
    ctx.setLineDash([10, 7]);
    ctx.strokeText(letter, ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.fillText(letter, ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.restore();
  }, []);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFEF7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (showGuide) drawGuide(ctx, currentLetter, color);
  }, [currentLetter, color, showGuide, drawGuide]);

  useEffect(() => {
    setHasDrawn(false);
    initCanvas();
    const utt = new SpeechSynthesisUtterance(`Let's write ${currentLetter.toLowerCase()}!`);
    utt.rate = 0.8; utt.pitch = 1.3;
    window.speechSynthesis.speak(utt);
  }, [currentIdx, initCanvas]);

  useEffect(() => { initCanvas(); }, [showGuide, initCanvas]);

  const startDraw = (e) => { e.preventDefault(); drawing.current = true; setHasDrawn(true); lastPos.current = getPos(e, canvasRef.current); };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    ctx.strokeStyle = color;
    ctx.lineWidth = 20; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  const endDraw = (e) => { e?.preventDefault(); drawing.current = false; lastPos.current = null; };

  const clear = () => { setHasDrawn(false); initCanvas(); };

  const markDone = () => {
    setCelebrating(true);
    const utt = new SpeechSynthesisUtterance(`Amazing! You wrote ${currentLetter.toLowerCase()}!`);
    utt.rate = 0.85; utt.pitch = 1.4;
    window.speechSynthesis.speak(utt);
    setTimeout(() => {
      setCelebrating(false);
      setDone(d => [...d, currentIdx]);
      if (currentIdx < LETTERS.length - 1) {
        setCurrentIdx(i => i + 1);
        setShowGuide(true);
      }
    }, 1200);
  };

  return (
    <div style={{ textAlign: "center", padding: "16px 16px" }}>
      <div style={{ fontSize: 24, fontWeight: 800, color: "#FF9F43", fontFamily: "'Fredoka One', cursive", marginBottom: 4, textShadow: "2px 2px 0 #FECA5766" }}>
        ✏️ Write Each Letter!
      </div>

      {/* Letter progress strip — tap any letter to jump to it */}
      <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
        {LETTERS.map((l, i) => (
          <button key={i} onClick={() => { setCurrentIdx(i); setShowGuide(true); setHasDrawn(false); }} style={{
            width: 42, height: 50, borderRadius: 13,
            background: done.includes(i) ? COLORS[i] : currentIdx === i ? COLORS[i] + "33" : "#f0f0f0",
            border: `3px solid ${currentIdx === i ? COLORS[i] : done.includes(i) ? COLORS[i] : "#ddd"}`,
            fontSize: 20, fontWeight: 900,
            color: done.includes(i) ? "#fff" : currentIdx === i ? COLORS[i] : "#bbb",
            fontFamily: "'Fredoka One', cursive",
            cursor: "pointer", outline: "none",
            transform: currentIdx === i ? "scale(1.15)" : "scale(1)",
            transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            boxShadow: currentIdx === i ? `0 4px 12px ${COLORS[i]}55` : "none"
          }}>
            {done.includes(i) ? "✓" : l}
          </button>
        ))}
      </div>

      {!allDone ? (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ fontSize: 64, fontWeight: 900, color, fontFamily: "'Fredoka One', cursive", lineHeight: 1, filter: `drop-shadow(3px 3px 0 ${color}55)`, animation: celebrating ? "bounce 0.3s ease infinite alternate" : "none" }}>
              {currentLetter}
            </div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 13, color: "#aaa", fontWeight: 700 }}>Letter {currentIdx + 1} of 8</div>
              <div style={{ fontSize: 15, color, fontWeight: 800 }}>{currentLetter} is for</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#555" }}>{LETTER_WORDS[currentLetter]}</div>
            </div>
          </div>

          <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", boxShadow: `0 6px 24px ${color}33`, border: `4px solid ${color}44`, maxWidth: 500, margin: "0 auto 12px", touchAction: "none" }}>
            <canvas ref={canvasRef} width={500} height={220}
              style={{ display: "block", width: "100%", cursor: "crosshair", touchAction: "none" }}
              onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
              onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
            />
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => setShowGuide(g => !g)} style={{ background: showGuide ? color : "#f0f0f0", border: "none", borderRadius: 16, padding: "9px 18px", color: showGuide ? "#fff" : "#888", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Fredoka One', cursive" }}>
              {showGuide ? "🙈 Hide Guide" : "👁 Show Guide"}
            </button>
            <button onClick={clear} style={{ background: "#FFE0EC", border: "none", borderRadius: 16, padding: "9px 18px", color: "#FF6B9D", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Fredoka One', cursive" }}>
              🔄 Try Again
            </button>
            {hasDrawn && !celebrating && (
              <button onClick={markDone} style={{ background: `linear-gradient(135deg, ${color}, ${COLORS[(currentIdx + 2) % 8]})`, border: "none", borderRadius: 16, padding: "9px 22px", color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Fredoka One', cursive", boxShadow: `0 4px 14px ${color}55`, animation: "pulse 1.2s ease-in-out infinite" }}>
                🌟 I Did It!
              </button>
            )}
          </div>
        </>
      ) : (
        <div style={{ padding: "20px 0" }}>
          <div style={{ fontSize: 60, marginBottom: 10, animation: "bounce 0.5s ease infinite alternate" }}>🎉</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#1DD1A1", fontFamily: "'Fredoka One', cursive", marginBottom: 20 }}>
            You wrote ALL 8 letters!
          </div>
          <button onClick={onNext} style={{ background: "linear-gradient(135deg, #A29BFE, #6C5CE7)", border: "none", borderRadius: 24, padding: "14px 36px", color: "#fff", fontSize: 20, fontWeight: 800, boxShadow: "0 6px 20px #6C5CE755", cursor: "pointer", fontFamily: "'Fredoka One', cursive", animation: "pulse 1.2s ease-in-out infinite" }}>
            Now write your whole name! 🖊️ →
          </button>
        </div>
      )}
    </div>
  );
}

// ── SCREEN 4: Write Your Whole Name ───────────────────────────────────────────
function WriteYourName({ onFinish }) {
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const lastPos = useRef(null);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [showGuide, setShowGuide] = useState(true);

  const getPos = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if (e.touches) return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const drawGuide = useCallback((ctx) => {
    ctx.save();
    ctx.font = "bold 110px 'Fredoka One', cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(162,155,254,0.15)";
    ctx.strokeStyle = "rgba(162,155,254,0.28)";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.strokeText("Caroline", ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.fillText("Caroline", ctx.canvas.width / 2, ctx.canvas.height / 2);
    ctx.restore();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFEF7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (showGuide) drawGuide(ctx);
  }, [showGuide, drawGuide]);

  const startDraw = (e) => { e.preventDefault(); drawing.current = true; setHasDrawn(true); lastPos.current = getPos(e, canvasRef.current); };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getPos(e, canvas);
    const hue = (Date.now() / 10) % 360;
    ctx.strokeStyle = `hsl(${hue}, 90%, 55%)`;
    ctx.lineWidth = 18; ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  const endDraw = (e) => { e?.preventDefault(); drawing.current = false; lastPos.current = null; };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFEF7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (showGuide) drawGuide(ctx);
    setHasDrawn(false);
  };

  return (
    <div style={{ textAlign: "center", padding: "20px 16px" }}>
      <div style={{ fontSize: 26, fontWeight: 800, color: "#A29BFE", fontFamily: "'Fredoka One', cursive", marginBottom: 4, textShadow: "2px 2px 0 #6C5CE755" }}>
        🖊️ Write Your Whole Name!
      </div>
      <div style={{ fontSize: 14, color: "#888", fontWeight: 600, marginBottom: 16 }}>
        Use your finger to write <span style={{ color: "#FF6B9D", fontWeight: 800 }}>Caroline</span>!
      </div>
      <div style={{ position: "relative", borderRadius: 28, overflow: "hidden", boxShadow: "0 8px 32px rgba(162,155,254,0.3)", border: "4px solid #A29BFE44", maxWidth: 580, margin: "0 auto 16px", touchAction: "none" }}>
        <canvas ref={canvasRef} width={580} height={260}
          style={{ display: "block", width: "100%", cursor: "crosshair", touchAction: "none" }}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        />
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={() => setShowGuide(g => !g)} style={{ background: showGuide ? "#A29BFE" : "#f0f0f0", border: "none", borderRadius: 18, padding: "10px 20px", color: showGuide ? "#fff" : "#888", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Fredoka One', cursive" }}>
          {showGuide ? "🙈 Hide Guide" : "👁 Show Guide"}
        </button>
        <button onClick={clear} style={{ background: "#FFE0EC", border: "none", borderRadius: 18, padding: "10px 20px", color: "#FF6B9D", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Fredoka One', cursive" }}>
          🔄 Start Over
        </button>
        {hasDrawn && (
          <button onClick={onFinish} style={{ background: "linear-gradient(135deg, #FF6B9D, #6C5CE7)", border: "none", borderRadius: 18, padding: "10px 24px", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "'Fredoka One', cursive", boxShadow: "0 4px 16px #FF6B9D55", animation: "pulse 1.2s ease-in-out infinite" }}>
            🌟 I Did It!
          </button>
        )}
      </div>
    </div>
  );
}

// ── SCREEN 5: Celebration ─────────────────────────────────────────────────────
function Celebration({ onRestart }) {
  useEffect(() => {
    const utt = new SpeechSynthesisUtterance("Hooray! You are so amazing Caroline! You can recognize and write your name!");
    utt.rate = 0.85; utt.pitch = 1.3;
    window.speechSynthesis.speak(utt);
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "40px 24px" }}>
      <div style={{ fontSize: 64, marginBottom: 16, animation: "bounce 0.6s ease infinite alternate" }}>🎉</div>
      <div style={{ fontSize: 36, fontWeight: 900, fontFamily: "'Fredoka One', cursive", background: "linear-gradient(135deg, #FF6B9D, #FF9F43, #FECA57, #48DBFB, #6C5CE7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginBottom: 10, lineHeight: 1.1 }}>
        You're a SUPERSTAR!
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: "#6C5CE7", fontFamily: "'Fredoka One', cursive", marginBottom: 8 }}>You can spell your name:</div>
      <div style={{ display: "flex", justifyContent: "center", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
        {LETTERS.map((l, i) => (
          <div key={i} style={{ width: 64, height: 74, borderRadius: 20, background: COLORS[i], boxShadow: `0 6px 20px ${COLORS[i]}66`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: `popIn 0.4s ${i * 0.1}s cubic-bezier(0.34,1.56,0.64,1) both` }}>
            <div style={{ fontSize: 34, fontWeight: 900, color: "#fff", fontFamily: "'Fredoka One', cursive", lineHeight: 1 }}>{l}</div>
            <div style={{ fontSize: 16 }}>{EMOJIS[i]}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 20, color: "#888", fontWeight: 700, marginBottom: 28 }}>C - A - R - O - L - I - N - E 🌟</div>
      <button onClick={onRestart} style={{ background: "linear-gradient(135deg, #48DBFB, #6C5CE7)", border: "none", borderRadius: 24, padding: "14px 36px", color: "#fff", fontSize: 20, fontWeight: 800, boxShadow: "0 6px 20px #6C5CE755", cursor: "pointer", fontFamily: "'Fredoka One', cursive" }}>
        🔁 Play Again!
      </button>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function CarolineApp() {
  const [screen, setScreen] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const goTo = (idx) => {
    setScreen(idx);
    if (idx === 4) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@600;700;800;900&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
        body { overscroll-behavior: none; }
        @keyframes popIn { 0%{transform:scale(0) rotate(-10deg);opacity:0} 100%{transform:scale(1) rotate(0deg);opacity:1} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.06)} }
        @keyframes bounce { 0%{transform:translateY(0)} 100%{transform:translateY(-18px)} }
        @keyframes shake { 0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)} 40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)} }
      `}</style>

      <Confetti show={showConfetti} />

      <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #fff9ff 0%, #f0f4ff 50%, #fff8ee 100%)", fontFamily: "'Nunito', sans-serif", paddingBottom: 20 }}>

        {/* Header */}
        <div style={{ background: "linear-gradient(135deg, #FF6B9D 0%, #FF9F43 50%, #FECA57 100%)", padding: "18px 20px 14px", textAlign: "center", boxShadow: "0 4px 20px rgba(255,107,157,0.4)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, left: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
          <div style={{ position: "absolute", bottom: -30, right: -10, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
          <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", fontFamily: "'Fredoka One', cursive", textShadow: "2px 3px 0 rgba(0,0,0,0.15)", letterSpacing: 2, position: "relative" }}>
            ✨ C·A·R·O·L·I·N·E ✨
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", fontWeight: 700, marginTop: 2, letterSpacing: 1 }}>
            MY NAME LEARNING ADVENTURE
          </div>
        </div>

        {/* Navigation tabs — always freely clickable */}
        <div style={{ display: "flex", padding: "12px 10px 0", gap: 6, maxWidth: 640, margin: "0 auto" }}>
          {SCREEN_LABELS.map((label, i) => (
            <button key={i} onClick={() => goTo(i)} style={{
              flex: 1, padding: "8px 2px",
              borderRadius: 14,
              background: screen === i ? TAB_COLORS[i] : `${TAB_COLORS[i]}22`,
              border: `2px solid ${screen === i ? TAB_COLORS[i] : TAB_COLORS[i] + "55"}`,
              fontSize: 10, fontWeight: 800,
              color: screen === i ? "#fff" : TAB_COLORS[i],
              cursor: "pointer",
              transition: "all 0.3s",
              fontFamily: "'Fredoka One', cursive",
              boxShadow: screen === i ? `0 3px 10px ${TAB_COLORS[i]}55` : "none",
              lineHeight: 1.2
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Screen content */}
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {screen === 0 && <MeetYourName onNext={() => goTo(1)} />}
          {screen === 1 && <LetterHunt onNext={() => goTo(2)} />}
          {screen === 2 && <WriteEachLetter onNext={() => goTo(3)} />}
          {screen === 3 && <WriteYourName onFinish={() => goTo(4)} />}
          {screen === 4 && <Celebration onRestart={() => goTo(0)} />}
        </div>

        <div style={{ textAlign: "center", padding: "12px 20px 0", fontSize: 12, color: "#bbb", fontWeight: 600 }}>
          Based on NAEYC early literacy recommendations 🌱
        </div>
      </div>
    </>
  );
}
