/* ============================================================
   VITILLA POWER — Prototipo web (core loop de bateo)
   Flujo: Personaje -> Campo -> Juego (bateo por timing)
   Vanilla JS + Canvas. Sin dependencias: abre index.html y juega.
   ============================================================ */

"use strict";

/* ---------- Datos de personajes (roster "flow") ---------- */
const CHARACTERS = [
  { id: "diablo",  emoji: "😈", name: "El Diablo",  desc: "Palo legendario",        power: "Bola de Fuego" },
  { id: "tiguere", emoji: "😎", name: "El Tíguere",  desc: "Puro flow de esquina",   power: "Swing Doble" },
  { id: "capitan", emoji: "🧢", name: "El Capi",     desc: "El líder del cuadro",    power: "Ojo de Águila" },
  { id: "dona",    emoji: "💃", name: "La Doña",     desc: "No falla una",           power: "Cadera Caliente" },
  { id: "guaro",   emoji: "🍺", name: "El Guaro",    desc: "Pega con cualquier cosa", power: "Aplane Seguro" },
  { id: "flaco",   emoji: "🦴", name: "El Flaco",    desc: "Rápido como un rayo",    power: "Vitilla Freeze" },
  { id: "random",  emoji: "🎲", name: "Sorpresa",    desc: "Personaje aleatorio",    power: "???", isRandom: true },
  { id: "create",  emoji: "📸", name: "Crea el tuyo", desc: "Avatar por selfie (próximamente)", power: "El tuyo", isCreate: true },
];

/* ---------- Datos de campos ---------- */
const FIELDS = [
  { id: "stadium", emoji: "🏟️", name: "Baseball Stadium", desc: "Campo base del prototipo", sky: "#bfe3ff", grass: "#3f8f3f" },
  { id: "cristorey", emoji: "🏙️", name: "Cristo Rey",   desc: "Esquina de barrio (próximamente)", locked: true },
  { id: "losrios",   emoji: "🌆", name: "Los Ríos",     desc: "Próximamente", locked: true },
  { id: "sancarlos", emoji: "🏘️", name: "San Carlos",   desc: "Próximamente", locked: true },
];

/* ---------- Estado global ---------- */
const state = {
  character: null,
  field: FIELDS[0],
};

/* ============================================================
   Navegación de pantallas
   ============================================================ */
function show(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ---------- Pantalla: personaje ---------- */
const characterGrid = document.getElementById("character-grid");
const btnToField = document.getElementById("btn-to-field");

function pickRandomPlayable() {
  const playable = CHARACTERS.filter((c) => !c.isRandom && !c.isCreate);
  return playable[Math.floor(Math.random() * playable.length)];
}

function renderCharacters() {
  characterGrid.innerHTML = "";
  CHARACTERS.forEach((c) => {
    const card = document.createElement("div");
    card.className = "card" + (c.isCreate ? " create" : "");
    card.innerHTML = `
      <span class="emoji">${c.emoji}</span>
      <div class="name">${c.name}</div>
      <div class="desc">${c.desc}</div>
      ${c.isCreate ? '<span class="badge">SELFIE 📸</span>' : ""}
    `;
    card.addEventListener("click", () => selectCharacter(c, card));
    characterGrid.appendChild(card);
  });
}

function selectCharacter(c, card) {
  let chosen = c;
  if (c.isRandom) chosen = pickRandomPlayable();
  if (c.isCreate) {
    alert(
      "✨ Crea tu propio personaje con un SELFIE.\n\n" +
      "Esta función está planificada para una fase futura (ver GDD §11.2).\n" +
      "Por ahora usarás un personaje del roster."
    );
    chosen = pickRandomPlayable();
  }
  state.character = chosen;

  // marcar visualmente
  document.querySelectorAll("#character-grid .card").forEach((el) => el.classList.remove("selected"));
  if (c.isRandom || c.isCreate) {
    // resaltar el personaje realmente elegido
    const idx = CHARACTERS.indexOf(chosen);
    characterGrid.children[idx]?.classList.add("selected");
  } else {
    card.classList.add("selected");
  }
  btnToField.disabled = false;
}

document.getElementById("btn-random").addEventListener("click", () => {
  const chosen = pickRandomPlayable();
  selectCharacter(chosen, characterGrid.children[CHARACTERS.indexOf(chosen)]);
});
btnToField.addEventListener("click", () => show("screen-field"));

/* ---------- Pantalla: campo ---------- */
const fieldGrid = document.getElementById("field-grid");
const btnToGame = document.getElementById("btn-to-game");

function renderFields() {
  fieldGrid.innerHTML = "";
  FIELDS.forEach((f) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.opacity = f.locked ? 0.55 : 1;
    card.innerHTML = `
      <span class="emoji">${f.emoji}</span>
      <div class="name">${f.name}</div>
      <div class="desc">${f.desc}</div>
      ${f.locked ? '<span class="badge" style="background:#777">🔒</span>' : ""}
    `;
    card.addEventListener("click", () => {
      if (f.locked) return;
      state.field = f;
      document.querySelectorAll("#field-grid .card").forEach((el) => el.classList.remove("selected"));
      card.classList.add("selected");
      btnToGame.disabled = false;
    });
    fieldGrid.appendChild(card);
  });
}

document.getElementById("btn-back-character").addEventListener("click", () => show("screen-character"));
document.getElementById("btn-to-game").addEventListener("click", () => {
  show("screen-game");
  Game.start();
});

/* ============================================================
   JUEGO: bateo por timing con vitilla "flotadora/giratoria"
   ============================================================ */
const Game = (() => {
  const canvas = document.getElementById("game-canvas");
  const ctx = canvas.getContext("2d");
  const msgEl = document.getElementById("message");
  const btnSwing = document.getElementById("btn-swing");

  // HUD
  const elRuns = document.getElementById("hud-runs");
  const elOuts = document.getElementById("hud-outs");
  const elGillas = document.getElementById("hud-gillas");
  const elPower = document.getElementById("hud-power");
  const elPowerVal = document.getElementById("hud-power-val");

  let W = 0, H = 0, dpr = 1;
  let runs, gillas, pitchInProgress, powerUpActive, swingLock;
  let raf = null;
  let pitchSpeed; // velocidad base, sube con cada conexión

  // vitilla en vuelo
  const cap = { t: 0, x: 0, wobblePhase: 0, spin: 0, amp: 0, freq: 0 };

  // geometría relativa (0..1 sobre la altura)
  const HIT_ZONE_Y = 0.80;       // centro de la zona de bateo
  const BASE_WINDOW = 0.055;     // medio-ancho de la ventana de contacto (en t)
  const POWER_WINDOW_BONUS = 0.05;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    W = rect.width; H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function start() {
    resize();
    runs = 0; gillas = 0;
    pitchSpeed = 0.014;
    powerUpActive = false;
    updateHUD();
    setMessage("¡Dale a la vitilla! 🥎", "#fff");
    btnSwing.disabled = false;
    if (raf) cancelAnimationFrame(raf);
    loop();
    setTimeout(nextPitch, 900);
  }

  function updateHUD() {
    elRuns.textContent = runs;
    elOuts.textContent = gillas;          // 3 gillas = juego terminado
    elGillas.textContent = gillas;
    elPowerVal.textContent = powerUpActive ? (state.character?.power || "¡Listo!") : "—";
    elPower.classList.toggle("active", powerUpActive);
  }

  function setMessage(txt, color) {
    msgEl.textContent = txt;
    msgEl.style.color = color || "#fff";
    msgEl.style.opacity = 1;
  }

  function nextPitch() {
    if (gillas >= 3) return gameOver();
    // power-up: cuando llevas 2 gillas, el siguiente turno trae poder
    powerUpActive = gillas === 2;
    swingLock = false;
    pitchInProgress = true;
    cap.t = 0;
    cap.wobblePhase = Math.random() * Math.PI * 2;
    cap.spin = 0;
    // la vitilla "baila": amplitud y frecuencia aleatorias (menos si hay power-up)
    cap.amp = (powerUpActive ? 0.07 : 0.12) + Math.random() * 0.05;
    cap.freq = 2 + Math.random() * 2.5;
    setMessage(powerUpActive ? `⚡ ¡POWER-UP! ${state.character.power}` : "", powerUpActive ? "#f5c542" : "#fff");
    updateHUD();
  }

  function currentWindow() {
    return BASE_WINDOW + (powerUpActive ? POWER_WINDOW_BONUS : 0);
  }

  function swing() {
    if (!pitchInProgress || swingLock) return;
    swingLock = true;

    // distancia (en t) al centro de la zona de bateo
    const center = HIT_ZONE_Y;
    const diff = Math.abs(cap.t - center);
    const win = currentWindow();

    if (diff <= win * 0.35) {
      // contacto perfecto
      result("¡JONRÓN! 💥", "#f5c542", 2, true);
    } else if (diff <= win * 0.8) {
      result("¡HIT! ⚾", "#2ecc71", 1, true);
    } else if (diff <= win) {
      // foul: no cuenta out, se relanza
      setMessage("Foul… 😬", "#ffd27f");
      pitchInProgress = false;
      setTimeout(nextPitch, 800);
    } else {
      // gilla (abanicó y falló)
      gilla("¡GILLA! 🚫 Abanicaste");
    }
  }

  function result(txt, color, addRuns, connected) {
    runs += addRuns;
    pitchInProgress = false;
    if (connected) pitchSpeed = Math.min(pitchSpeed + 0.0012, 0.03); // sube dificultad
    powerUpActive = false;
    setMessage(txt, color);
    spawnHitFx();
    updateHUD();
    setTimeout(nextPitch, 950);
  }

  function gilla(txt) {
    gillas += 1;
    pitchInProgress = false;
    powerUpActive = false;
    setMessage(txt, "#e23b3b");
    updateHUD();
    if (gillas >= 3) {
      setTimeout(gameOver, 900);
    } else {
      setTimeout(nextPitch, 950);
    }
  }

  function gameOver() {
    pitchInProgress = false;
    btnSwing.disabled = true;
    setMessage(`⚾ ¡FUERA! Carreras: ${runs}`, "#fff");
    // overlay de reinicio
    setTimeout(() => {
      setMessage(`Carreras: ${runs} — toca BATEAR para jugar otra vez`, "#fff");
      btnSwing.disabled = false;
      btnSwing.textContent = "JUGAR OTRA VEZ";
      const restart = () => {
        btnSwing.textContent = "¡BATEAR!";
        btnSwing.removeEventListener("click", restart);
        start();
      };
      btnSwing.addEventListener("click", restart);
    }, 1200);
  }

  /* ---------- Efecto visual de conexión ---------- */
  let hitFx = 0;
  function spawnHitFx() { hitFx = 1; }

  /* ---------- Render ---------- */
  function loop() {
    update();
    draw();
    raf = requestAnimationFrame(loop);
  }

  function update() {
    if (pitchInProgress) {
      cap.t += pitchSpeed;
      cap.spin += 0.4;
      cap.wobblePhase += 0.12;
      if (cap.t >= 1) {
        // pasó de largo sin batear -> gilla (se "ponchó" mirando) si no hubo swing
        if (!swingLock) gilla("¡GILLA! 🚫 La dejaste pasar");
        else { pitchInProgress = false; }
      }
    }
    if (hitFx > 0) hitFx = Math.max(0, hitFx - 0.04);
  }

  function capPos() {
    // y va de 0.12 (pitcher) a ~1.0 (home)
    const y = (0.12 + cap.t * 0.88) * H;
    const wobble = Math.sin(cap.wobblePhase * cap.freq + cap.wobblePhase) * cap.amp * W * (cap.t * 0.8 + 0.2);
    const x = W / 2 + wobble;
    return { x, y };
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // fondo: cielo + grama según campo
    const sky = state.field?.sky || "#bfe3ff";
    const grass = state.field?.grass || "#3f8f3f";
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H * 0.45);
    ctx.fillStyle = grass;
    ctx.fillRect(0, H * 0.45, W, H * 0.55);

    // montículo / diamante simple
    ctx.fillStyle = "rgba(220,200,150,0.9)";
    ctx.beginPath();
    ctx.ellipse(W / 2, H * 0.30, W * 0.07, H * 0.03, 0, 0, Math.PI * 2);
    ctx.fill();

    // diana de strike (detrás del home) — autenticidad
    ctx.save();
    ctx.translate(W / 2, H * 0.93);
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 3;
    [22, 14, 6].forEach((r, i) => {
      ctx.fillStyle = i % 2 ? "#fff" : "#e23b3b";
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    // zona de bateo (banda)
    const win = currentWindow();
    const zTop = (HIT_ZONE_Y - win) ;
    const zBot = (HIT_ZONE_Y + win);
    ctx.fillStyle = powerUpActive ? "rgba(245,197,66,0.28)" : "rgba(46,204,113,0.20)";
    const y1 = (0.12 + zTop * 0.88) * H;
    const y2 = (0.12 + zBot * 0.88) * H;
    ctx.fillRect(0, y1, W, y2 - y1);
    ctx.strokeStyle = powerUpActive ? "rgba(245,197,66,0.9)" : "rgba(46,204,113,0.7)";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, y1, W, y2 - y1);

    // pitcher (arriba)
    drawFigure(W / 2, H * 0.18, "🤾", 0.9);

    // bateador (abajo) con el personaje elegido
    drawFigure(W * 0.30, H * 0.86, state.character?.emoji || "🧍", 1.1);

    // vitilla en vuelo
    if (pitchInProgress) {
      const p = capPos();
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(cap.spin);
      // tapa: disco
      const r = 10 + cap.t * 6;
      ctx.fillStyle = "#1f6feb";
      ctx.beginPath();
      ctx.ellipse(0, 0, r, r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "#0b3d8a";
      ctx.lineWidth = 3;
      ctx.stroke();
      // estrías de la tapa
      ctx.strokeStyle = "rgba(255,255,255,0.6)";
      ctx.lineWidth = 1.5;
      for (let a = 0; a < Math.PI; a += Math.PI / 6) {
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r * 0.55);
        ctx.lineTo(-Math.cos(a) * r, -Math.sin(a) * r * 0.55);
        ctx.stroke();
      }
      ctx.restore();
    }

    // flash de conexión
    if (hitFx > 0) {
      ctx.fillStyle = `rgba(245,197,66,${hitFx * 0.5})`;
      ctx.fillRect(0, 0, W, H);
    }
  }

  function drawFigure(x, y, emoji, scale) {
    ctx.save();
    ctx.font = `${Math.round(46 * scale)}px serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, x, y);
    ctx.restore();
  }

  /* ---------- Entradas ---------- */
  btnSwing.addEventListener("click", swing);
  canvas.addEventListener("pointerdown", (e) => { e.preventDefault(); swing(); });
  window.addEventListener("resize", () => resize());
  document.addEventListener("keydown", (e) => { if (e.code === "Space") { e.preventDefault(); swing(); } });

  return { start };
})();

/* ---------- Salir del juego ---------- */
document.getElementById("btn-quit").addEventListener("click", () => show("screen-character"));

/* ---------- Init ---------- */
renderCharacters();
renderFields();
show("screen-character");
