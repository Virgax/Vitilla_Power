/* ============================================================
   VITILLA POWER — Prototipo 3D (core loop de bateo)
   Flujo: Personaje -> Campo -> Juego 3D (bateo por timing)
   Three.js (incrustado). Soporta portrait (9:16) y landscape (16:9).
   ============================================================ */
"use strict";

/* ---------- Datos ---------- */
const CHARACTERS = [
  { id: "diablo",  emoji: "😈", name: "El Diablo",   desc: "Palo legendario",         power: "Bola de Fuego",    color: 0xe23b3b, skin: 0x8d5524, shorts: 0x222831 },
  { id: "tiguere", emoji: "😎", name: "El Tíguere",  desc: "Puro flow de esquina",    power: "Swing Doble",      color: 0x1f6feb, skin: 0xc68642, shorts: 0x1b1b1b },
  { id: "capitan", emoji: "🧢", name: "El Capi",     desc: "El líder del cuadro",     power: "Ojo de Águila",    color: 0x2ecc71, skin: 0x5c3a1e, shorts: 0xf0f0f0 },
  { id: "dona",    emoji: "💃", name: "La Doña",     desc: "No falla una",            power: "Cadera Caliente",  color: 0xff5fa2, skin: 0xe0ac69, shorts: 0x3a2e4d },
  { id: "guaro",   emoji: "🍺", name: "El Guaro",    desc: "Pega con cualquier cosa", power: "Aplane Seguro",    color: 0xf5c542, skin: 0x7a4a21, shorts: 0x2d4739 },
  { id: "flaco",   emoji: "🦴", name: "El Flaco",    desc: "Rápido como un rayo",     power: "Vitilla Freeze",   color: 0x9b59b6, skin: 0xa86b38, shorts: 0x222831 },
  { id: "random",  emoji: "🎲", name: "Sorpresa",    desc: "Personaje aleatorio",     power: "???", isRandom: true },
  { id: "create",  emoji: "📸", name: "Crea el tuyo", desc: "Avatar por selfie (próximamente)", power: "El tuyo", isCreate: true },
];

const FIELDS = [
  { id: "stadium",  emoji: "🏟️", name: "Baseball Stadium", desc: "Campo base del prototipo", sky: 0x8ecbff, grass: 0x3f9f4a },
  { id: "atardecer", emoji: "🌇", name: "Atardecer",        desc: "Cielo de tarde",           sky: 0xffb27a, grass: 0x4a8f3a },
  { id: "cristorey", emoji: "🏙️", name: "Cristo Rey",      desc: "Esquina de barrio (próximamente)", locked: true },
  { id: "losrios",   emoji: "🌆", name: "Los Ríos",        desc: "Próximamente", locked: true },
];

const state = { character: null, field: FIELDS[0] };

// Colores reales de vitillas (como en la foto de referencia): amarillo, verde, azul, lila
const VITILLA_COLORS = [0xe8c84b, 0x6fa84a, 0x4fa3d1, 0x6e7bc8, 0x2f7fc0];

function show(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* ---------- Selección de personaje ---------- */
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
    card.innerHTML =
      '<span class="emoji">' + c.emoji + '</span>' +
      '<div class="name">' + c.name + '</div>' +
      '<div class="desc">' + c.desc + '</div>' +
      (c.isCreate ? '<span class="badge">SELFIE 📸</span>' : "");
    card.addEventListener("click", () => selectCharacter(c, card));
    characterGrid.appendChild(card);
  });
}
function selectCharacter(c, card) {
  let chosen = c;
  if (c.isRandom) chosen = pickRandomPlayable();
  if (c.isCreate) {
    alert("✨ Crea tu propio personaje con un SELFIE.\n\nPlanificado para una fase futura (GDD §11.2).\nPor ahora usarás un personaje del roster.");
    chosen = pickRandomPlayable();
  }
  state.character = chosen;
  document.querySelectorAll("#character-grid .card").forEach((el) => el.classList.remove("selected"));
  if (c.isRandom || c.isCreate) {
    const idx = CHARACTERS.indexOf(chosen);
    if (characterGrid.children[idx]) characterGrid.children[idx].classList.add("selected");
  } else card.classList.add("selected");
  btnToField.disabled = false;
}
document.getElementById("btn-random").addEventListener("click", () => {
  const chosen = pickRandomPlayable();
  selectCharacter(chosen, characterGrid.children[CHARACTERS.indexOf(chosen)]);
});
btnToField.addEventListener("click", () => show("screen-field"));

/* ---------- Selección de campo ---------- */
const fieldGrid = document.getElementById("field-grid");
const btnToMode = document.getElementById("btn-to-mode");
function renderFields() {
  fieldGrid.innerHTML = "";
  FIELDS.forEach((f) => {
    const card = document.createElement("div");
    card.className = "card";
    card.style.opacity = f.locked ? 0.55 : 1;
    card.innerHTML =
      '<span class="emoji">' + f.emoji + '</span>' +
      '<div class="name">' + f.name + '</div>' +
      '<div class="desc">' + f.desc + '</div>' +
      (f.locked ? '<span class="badge" style="background:#777">🔒</span>' : "");
    card.addEventListener("click", () => {
      if (f.locked) return;
      state.field = f;
      document.querySelectorAll("#field-grid .card").forEach((el) => el.classList.remove("selected"));
      card.classList.add("selected");
      btnToMode.disabled = false;
    });
    fieldGrid.appendChild(card);
  });
}
document.getElementById("btn-back-character").addEventListener("click", () => show("screen-character"));
btnToMode.addEventListener("click", () => show("screen-mode"));

/* ---------- Selección de modo (vs CPU / 2 jugadores) ---------- */
document.getElementById("btn-back-field").addEventListener("click", () => show("screen-field"));
document.getElementById("mode-cpu").addEventListener("click", () => { show("screen-game"); Game.start("cpu"); });
document.getElementById("mode-2p").addEventListener("click", () => { show("screen-game"); Game.start("2p"); });
document.getElementById("btn-quit").addEventListener("click", () => { Game.stop(); show("screen-character"); });

/* ============================================================
   JUEGO 3D
   Eje Z: home en z=0 (cerca de cámara), pícher en z=-FIELD_LEN (lejos).
   La vitilla viaja de lejos hacia el home, flotando y girando.
   ============================================================ */
const Game = (() => {
  const canvas = document.getElementById("game-canvas");
  const msgEl = document.getElementById("message");
  const btnAction = document.getElementById("btn-action");
  const btnField = document.getElementById("btn-field-play");
  const errEl = document.getElementById("webgl-error");
  const roleBanner = document.getElementById("role-banner");
  const pitchControls = document.getElementById("pitch-controls");
  const chargeFill = document.getElementById("charge-fill");
  const btnPitchPower = document.getElementById("btn-pitch-power");

  const elScore = document.getElementById("hud-score");
  const elInning = document.getElementById("hud-inning");
  const elCount = document.getElementById("hud-count");
  const elOuts = document.getElementById("hud-outs");
  const baseEls = {
    1: document.querySelector("#diamond .b1"),
    2: document.querySelector("#diamond .b2"),
    3: document.querySelector("#diamond .b3"),
  };

  const FIELD_LEN = 18;
  const CAP_START_Z = -FIELD_LEN + 1;   // frente al pícher
  const CAP_END_Z = 3;                  // pasa el home
  const HIT_Z = 0;                       // punto ideal de contacto
  const BASE_WIN = 1.25;                 // ventana de bateo (en unidades z)
  const ZONE_HALF = 0.95;               // media anchura de la zona de strike (en x)
  const BAT_POWER_BONUS = 1.2;          // power-up del bateador: amplía la ventana
  const PITCH_POWER_PENALTY = 0.7;      // power-up del pícher: reduce la ventana
  const CAP_SPEED = 7.2;                 // unidades/seg base
  const MIN_SPEED = 6.0, MAX_SPEED = 11.5;
  const OUTS_PER_HALF = 3;
  const MAX_BALLS = 4;                   // 4ª bola = base por bolas
  const MAX_STRIKES = 3;                 // 3er strike = ponche
  const INNINGS = 3;                     // entradas por partido
  const POWERS_PER_HALF = 2;            // usos de power-up por lado por media entrada

  let renderer, scene, camera, clock;
  let capMesh, capRig, capShadow, batter, pitcher;
  let swingT = -1, pitchT = -1;   // animaciones (-1 = inactiva)
  let raf = null, started = false;

  let speed;
  // match = estado del duelo de 2 lados
  let match = null;
  // fase: 'intro' | 'pitchsetup' | 'incoming' | 'inplay' | 'over'
  let capState = "idle";
  let charging = false, chargeVal = 0;   // carga de fuerza del pícheo (humano)
  let pitchPowered = false;              // el lanzamiento actual lleva power-up del pícher
  let cpuAct = { swing: false, swingZ: 99, take: false }; // plan de la CPU al batear
  let field = null;                      // estado de la jugada de fildeo en curso
  // Física tipo frisbee: posición + velocidad + actitud (bank/pitch) + giro giroscópico
  let cap = {
    x: 0, y: 1.5, z: 0,
    vx: 0, vy: 0, vz: 0,
    spin: 0, spinRate: 26,       // giro sobre su propio eje (rad/s)
    bank: 0, pitch: 0,           // actitud del disco
    curveDir: 1, curveAmp: 2,    // curva lateral del lanzamiento (banana)
    endX: 0,                     // x al cruzar el plato (define bola/strike)
    flutter: 0, phase: 0, prevX: 0
  };
  let swung = false;

  function init() {
    if (renderer) return true;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    } catch (e) {
      errEl.style.display = "flex";
      errEl.textContent = "Tu navegador no pudo iniciar WebGL/3D. Prueba con Chrome o Safari actualizado.";
      return false;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(55, 1, 0.1, 200);
    clock = new THREE.Clock();

    // Luces
    scene.add(new THREE.HemisphereLight(0xffffff, 0x335533, 0.9));
    const sun = new THREE.DirectionalLight(0xffffff, 0.8);
    sun.position.set(-8, 14, 6);
    scene.add(sun);

    // Suelo (grama)
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(80, 120),
      new THREE.MeshLambertMaterial({ color: 0x3f9f4a })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.z = -FIELD_LEN / 2;
    ground.name = "ground";
    scene.add(ground);

    // Tierra del cuadro (rombo)
    const dirt = new THREE.Mesh(
      new THREE.CircleGeometry(7, 24),
      new THREE.MeshLambertMaterial({ color: 0xc9a36a })
    );
    dirt.rotation.x = -Math.PI / 2;
    dirt.position.set(0, 0.01, -6);
    scene.add(dirt);

    // Home y bases (1ra y 3ra; sin segunda, como la vitilla real)
    const baseMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const home = new THREE.Mesh(new THREE.BoxGeometry(1, 0.1, 1), baseMat);
    home.position.set(0, 0.05, 0);
    scene.add(home);
    // 1ra, 2da y 3ra (diamante completo estilo Baseball Clash)
    [[5.5, -5.5], [0, -11], [-5.5, -5.5]].forEach(([x, z]) => {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.1, 0.9), baseMat);
      b.position.set(x, 0.05, z);
      scene.add(b);
    });

    // Diana de strike (detrás del home)
    const target = new THREE.Group();
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.5, 0.8, 24), new THREE.MeshBasicMaterial({ color: 0xe23b3b, side: THREE.DoubleSide }));
    const dot = new THREE.Mesh(new THREE.CircleGeometry(0.45, 20), new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide }));
    dot.position.z = 0.01;
    target.add(ring); target.add(dot);
    target.position.set(0, 1.2, 1.6);
    scene.add(target);

    // Poste (montículo del pícher)
    const mound = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.6, 0.3, 20), new THREE.MeshLambertMaterial({ color: 0xc9a36a }));
    mound.position.set(0, 0.15, -FIELD_LEN + 1);
    scene.add(mound);

    // Vitilla = TAPA real (tope abombado, ranura y falda más ancha abajo), revolucionando
    // un perfil 2D (LatheGeometry). capRig = actitud (bank/pitch); capMesh gira sobre su eje.
    capRig = new THREE.Group();
    const profile = [
      [0.00, 0.00], [0.40, 0.00], [0.42, 0.045], [0.40, 0.085], [0.345, 0.105], // falda + ranura
      [0.36, 0.125], [0.355, 0.30], [0.335, 0.36],                               // pared
      [0.265, 0.42], [0.15, 0.45], [0.00, 0.46]                                  // hombro + tope abombado
    ].map((p) => new THREE.Vector2(p[0], p[1]));
    const capGeo = new THREE.LatheGeometry(profile, 36);
    capGeo.translate(0, -0.23, 0);     // centrar verticalmente
    capGeo.computeVertexNormals();
    capMesh = new THREE.Mesh(
      capGeo,
      new THREE.MeshStandardMaterial({ color: 0x4fa3d1, roughness: 0.55, metalness: 0.05 })
    );
    capRig.add(capMesh);
    capRig.visible = false;
    scene.add(capRig);

    // Sombra simple de la vitilla
    capShadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.3, 16),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25 })
    );
    capShadow.rotation.x = -Math.PI / 2;
    capShadow.visible = false;
    scene.add(capShadow);

    // Jugadores 3D (personas low-poly)
    pitcher = buildPerson({ skin: 0x8d5524, jersey: 0x444b54, shorts: 0x2b2b2b });
    pitcher.group.position.set(0, 0, -FIELD_LEN + 1.4);
    // el pícher mira al bateador (+Z), sin bate
    pitcher.bat.visible = false;
    scene.add(pitcher.group);

    batter = buildPerson({ skin: 0x8d5524, jersey: 0xe23b3b, shorts: 0x222831 });
    batter.group.position.set(1.5, 0, 0.6);   // cajón de bateo (lado 3ra)
    batter.group.rotation.y = Math.PI;          // de espaldas a la cámara, mirando al pícher
    batter.armsPivot.rotation.y = -0.8;         // bate cargado atrás (pose lista)
    scene.add(batter.group);

    // Cámara: detrás y arriba del home, mirando al pícher
    camera.position.set(0, 4.2, 7.5);
    camera.lookAt(0, 1.5, -7);

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    // Botón de acción: BATEAR (tap) cuando bateas; LANZAR (mantener y soltar) cuando pícheas.
    btnAction.addEventListener("pointerdown", (e) => { e.preventDefault(); onActionDown(); });
    btnAction.addEventListener("pointerup", (e) => { e.preventDefault(); onActionUp(); });
    btnAction.addEventListener("pointerleave", () => { if (charging) onActionUp(); });
    // Tap en el campo = batear (solo cuando bateas tú)
    canvas.addEventListener("pointerdown", (e) => { e.preventDefault(); if (capState === "incoming" && humanBatting()) doSwing(); });
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") { e.preventDefault(); if (capState === "incoming" && humanBatting()) doSwing(); }
    });

    // Curvas del pícheo
    document.querySelectorAll(".curve-btn[data-curve]").forEach((b) => {
      b.addEventListener("click", () => {
        document.querySelectorAll(".curve-btn[data-curve]").forEach((x) => x.classList.remove("selected"));
        b.classList.add("selected");
        const c = b.getAttribute("data-curve");
        match.pitch.curveSel = c;
      });
    });
    // Power-up del pícher (armar/desarmar el próximo lanzamiento)
    btnPitchPower.addEventListener("click", () => {
      if (capState !== "pitchsetup") return;
      const side = match.pitchingSide;
      if (match.powerUses[side] <= 0 && !match.pitch.armed) return;
      match.pitch.armed = !match.pitch.armed;
      btnPitchPower.classList.toggle("armed", match.pitch.armed);
    });
    // Fildeo (defensa): tocar dentro de la ventana para intentar el out
    btnField.addEventListener("pointerdown", (e) => { e.preventDefault(); onFieldTap(); });
    return true;
  }

  /* Construye una persona 3D low-poly (cabeza, jersey, bermuda, chancletas, gorra y bate).
     Devuelve refs animables: group, armsPivot (swing del bateo), throwArm (pícheo), bat. */
  function buildPerson(opts) {
    const skin = opts.skin, jersey = opts.jersey, shorts = opts.shorts;
    const g = new THREE.Group();
    const matSkin = new THREE.MeshLambertMaterial({ color: skin });
    const matJersey = new THREE.MeshLambertMaterial({ color: jersey });
    const matShorts = new THREE.MeshLambertMaterial({ color: shorts });
    const matShoe = new THREE.MeshLambertMaterial({ color: 0x6b4a2b }); // chancleta

    // piernas + chancletas
    for (const sx of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.72, 0.22), matSkin);
      leg.position.set(sx * 0.16, 0.4, 0); g.add(leg);
      const foot = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.08, 0.4), matShoe);
      foot.position.set(sx * 0.16, 0.05, 0.07); g.add(foot);
    }
    // bermuda
    const sh = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.46, 0.32), matShorts);
    sh.position.set(0, 0.95, 0); g.add(sh);
    // torso (jersey)
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.62, 0.34), matJersey);
    torso.position.set(0, 1.45, 0); g.add(torso);
    // cuello + cabeza
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.23, 18, 16), matSkin);
    head.position.set(0, 1.98, 0); g.add(head);
    // gorra (media esfera + visera) del color del equipo
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.245, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2), matJersey);
    cap.position.set(0, 2.02, 0); g.add(cap);
    const brim = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.05, 0.2), matJersey);
    brim.position.set(0, 2.0, 0.22); g.add(brim);

    // brazo izquierdo (fijo)
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.6, 0.15), matSkin);
    armL.position.set(-0.4, 1.45, 0.05); g.add(armL);

    // brazo derecho como pivote (para lanzar el pícheo)
    const throwArm = new THREE.Group();
    throwArm.position.set(0.4, 1.7, 0);
    const armRMesh = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.6, 0.15), matSkin);
    armRMesh.position.set(0, -0.28, 0); throwArm.add(armRMesh);
    g.add(throwArm);

    // bate + manos como un pivote que rota en el swing (alrededor del eje de la columna)
    const armsPivot = new THREE.Group();
    armsPivot.position.set(0, 1.5, 0);
    const bat = new THREE.Group();
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.05, 0.07, 1.15, 10),
      new THREE.MeshLambertMaterial({ color: 0xb5651d })
    );
    handle.position.set(0.32, 0.35, 0.18);
    handle.rotation.z = -0.5; handle.rotation.x = -0.5;  // bate alzado al hombro
    bat.add(handle);
    armsPivot.add(bat);
    g.add(armsPivot);

    return { group: g, armsPivot: armsPivot, throwArm: throwArm, bat: bat,
             mats: { jersey: matJersey, skin: matSkin, shorts: matShorts } };
  }

  function setBatterAppearance(ch) {
    if (!batter) return;
    batter.mats.jersey.color.setHex(ch.color || 0xe23b3b);
    batter.mats.skin.color.setHex(ch.skin || 0x8d5524);
    batter.mats.shorts.color.setHex(ch.shorts || 0x222831);
  }

  function onResize() {
    if (!renderer) return;
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // En portrait (alto) abrimos un poco el campo de visión vertical
    camera.fov = h > w ? 64 : 52;
    camera.updateProjectionMatrix();
  }

  /* ---------- Flujo de duelo (pícher vs. bateador, 2 lados) ---------- */
  let actionMode = "none"; // 'continue' | 'pitch' | 'bat' | 'restart' | 'none'

  function sideName(s) {
    if (!match) return "";
    if (match.mode === "cpu") return s === 0 ? "Tú" : "CPU";
    return "Jugador " + (s + 1);
  }
  function sideIsHuman(s) { return match.mode === "2p" ? true : s === 0; }
  function humanBatting() { return sideIsHuman(match.battingSide); }
  function setRole(html) { roleBanner.innerHTML = html; }
  function setMessage(txt, color) { msgEl.textContent = txt; msgEl.style.color = color || "#fff"; }
  function showPitchControls() { pitchControls.classList.remove("hidden"); }
  function hidePitchControls() { pitchControls.classList.add("hidden"); charging = false; chargeFill.style.width = "0%"; }

  function start(mode) {
    if (!init()) return;
    setBatterAppearance(state.character || {});
    scene.background = new THREE.Color((state.field && state.field.sky) || 0x8ecbff);
    const ground = scene.getObjectByName("ground");
    if (ground) ground.material.color.setHex((state.field && state.field.grass) || 0x3f9f4a);

    match = {
      mode: mode || "cpu",
      inning: 1, half: 0,
      battingSide: 0, pitchingSide: 1,
      scores: [0, 0], outs: 0,
      balls: 0, strikes: 0,
      bases: [false, false, false],   // corredores en 1ra, 2da, 3ra
      powerUses: [POWERS_PER_HALF, POWERS_PER_HALF],
      pitch: { curveSel: "straight", armed: false }
    };
    speed = CAP_SPEED;
    capState = "idle";
    pitchPowered = false;
    started = true;
    onResize();
    if (!raf) loop();
    updateHUD();
    beginHalf();
  }
  function stop() { started = false; if (raf) { cancelAnimationFrame(raf); raf = null; } }

  // Botones inferiores (solo uno visible a la vez)
  function showActionBtn() { btnField.classList.add("hidden"); btnAction.style.display = ""; }
  function showFieldBtn() { btnAction.style.display = "none"; btnField.classList.remove("hidden"); }
  function hideBottomBtns() { btnField.classList.add("hidden"); btnAction.style.display = "none"; }

  function resetCount() { match.balls = 0; match.strikes = 0; }

  function beginHalf() {
    match.battingSide = match.half === 0 ? 0 : 1;
    match.pitchingSide = 1 - match.battingSide;
    match.outs = 0;
    resetCount();
    match.bases = [false, false, false];
    match.powerUses = [POWERS_PER_HALF, POWERS_PER_HALF];
    capState = "intro";
    hidePitchControls();
    capRig.visible = false; capShadow.visible = false;
    showActionBtn();
    updateHUD();
    const bn = sideName(match.battingSide), pn = sideName(match.pitchingSide);
    setRole('<span class="bat">🏏 ' + bn + ' batea</span> &nbsp;·&nbsp; <span class="pit">🥏 ' + pn + ' pichea</span>');
    setMessage("Entrada " + match.inning + (match.half === 0 ? " (alta)" : " (baja)"), "#fff");
    btnAction.classList.remove("pitching");
    btnAction.textContent = "Continuar ▶";
    btnAction.disabled = false;
    actionMode = "continue";
  }

  function preparePitch() {
    if (!started) return;
    capState = "pitchsetup";
    match.pitch.armed = false;
    btnPitchPower.classList.remove("armed");
    swung = false;
    field = null;
    showActionBtn();
    setMessage("", "#fff");
    if (sideIsHuman(match.pitchingSide)) {
      showPitchControls();
      btnPitchPower.disabled = match.powerUses[match.pitchingSide] <= 0;
      setRole('<span class="pit">🥏 ' + sideName(match.pitchingSide) + ': elige curva y MANTÉN para lanzar</span>');
      btnAction.classList.add("pitching");
      btnAction.textContent = "LANZAR";
      btnAction.disabled = false;
      actionMode = "pitch";
    } else {
      hidePitchControls();
      setRole('<span class="pit">🥏 ' + sideName(match.pitchingSide) + ' prepara el pícheo…</span>');
      btnAction.classList.remove("pitching");
      btnAction.textContent = "Esperando…";
      btnAction.disabled = true;
      actionMode = "none";
      const p = cpuChoosePitch();
      setTimeout(() => { if (capState === "pitchsetup") throwPitch(p); }, 750);
    }
    updateHUD();
  }

  function cpuChoosePitch() {
    const usePower = match.powerUses[match.pitchingSide] > 0 && Math.random() < 0.35;
    const amp = 1.0 + Math.random() * 1.4 + (usePower ? 0.9 : 0);
    const spd = MIN_SPEED + Math.random() * (MAX_SPEED - MIN_SPEED) * 0.8;
    // la CPU mayormente busca la zona, a veces tira bola
    const endX = Math.random() < 0.7 ? (Math.random() - 0.5) * 1.4 : (Math.random() < 0.5 ? -1 : 1) * (ZONE_HALF + 0.4 + Math.random());
    return { curveDir: Math.random() < 0.5 ? -1 : 1, curveAmp: amp, speed: spd, powered: usePower, endX: endX };
  }

  function humanThrow() {
    const sel = match.pitch.curveSel || "straight";
    const dir = sel === "left" ? -1 : 1;
    const amp = sel === "straight" ? (0.3 + Math.random() * 0.3) : (1.8 + Math.random() * 0.8);
    const spd = MIN_SPEED + chargeVal * (MAX_SPEED - MIN_SPEED);
    const powered = match.pitch.armed && match.powerUses[match.pitchingSide] > 0;
    // La precisión depende de la carga: carga media = puntería; sobrecarga = salvaje (se va a bola)
    const wild = Math.max(0, chargeVal - 0.75) * 3.2 * (Math.random() - 0.5) * 2;
    const bias = sel === "left" ? -0.45 : sel === "right" ? 0.45 : 0;   // pinta la esquina
    const endX = bias + wild + (Math.random() - 0.5) * 0.3;
    throwPitch({ curveDir: dir, curveAmp: amp + (powered ? 0.9 : 0), speed: spd, powered: powered, endX: endX });
  }

  function throwPitch(p) {
    hidePitchControls();
    if (p.powered) match.powerUses[match.pitchingSide] = Math.max(0, match.powerUses[match.pitchingSide] - 1);
    pitchPowered = !!p.powered;
    speed = THREE.MathUtils.clamp(p.speed, MIN_SPEED, MAX_SPEED);
    capState = "incoming";
    swung = false;
    cap.z = CAP_START_Z; cap.x = 0; cap.prevX = 0;
    cap.phase = Math.random() * Math.PI * 2;
    cap.spinRate = 24 + Math.random() * 8;
    cap.curveDir = p.curveDir;
    cap.curveAmp = p.curveAmp;
    cap.endX = THREE.MathUtils.clamp(p.endX || 0, -2.4, 2.4);
    cap.flutter = (pitchPowered ? 0.16 : 0.1) + Math.random() * 0.05;
    capMesh.material.color.setHex(pitchPowered ? 0xff5a2a : VITILLA_COLORS[Math.floor(Math.random() * VITILLA_COLORS.length)]);
    capMesh.material.emissive.setHex(pitchPowered ? 0x7a1500 : 0x000000);
    capRig.visible = true; capShadow.visible = true;
    pitchT = 0;

    const bn = sideName(match.battingSide);
    setRole('<span class="bat">🏏 ¡Batea ' + bn + '!</span>' + (pitchPowered ? ' &nbsp;<span class="pit">⚡ pícheo con poder</span>' : ''));
    if (sideIsHuman(match.battingSide)) {
      showActionBtn();
      btnAction.classList.remove("pitching");
      btnAction.textContent = "¡BATEAR!";
      btnAction.disabled = false;
      actionMode = "bat";
    } else {
      hideBottomBtns();
      actionMode = "none";
      cpuPlanBat();
    }
    updateHUD();
  }

  function cpuPlanBat() {
    const inZone = Math.abs(cap.endX) <= ZONE_HALF;
    const swingProb = inZone ? 0.86 : 0.34;
    if (Math.random() < swingProb) {
      cpuAct.swing = true; cpuAct.take = false;
      const diff = 0.45 + cap.curveAmp * 0.12 + (speed - MIN_SPEED) * 0.06 + (pitchPowered ? 0.45 : 0);
      cpuAct.swingZ = (Math.random() - 0.5) * 2 * diff;
    } else {
      cpuAct.swing = false; cpuAct.take = true; cpuAct.swingZ = 99;
    }
  }

  // Power-up del bateador: disponible en el 3er turno (al llegar a 2 outs)
  function batterPower() {
    return match.outs === OUTS_PER_HALF - 1 && match.powerUses[match.battingSide] > 0;
  }
  function currentWin() {
    let w = BASE_WIN;
    if (batterPower()) w += BAT_POWER_BONUS;
    if (pitchPowered) w -= PITCH_POWER_PENALTY;
    return Math.max(0.7, w);
  }

  /* ---------- Bateo: contacto y resolución ---------- */
  function doSwing() {
    if (capState !== "incoming" || swung) return;
    swung = true;
    swingT = 0;
    if (batterPower()) match.powerUses[match.battingSide] = Math.max(0, match.powerUses[match.battingSide] - 1);
    const d = Math.abs(cap.z - HIT_Z);
    const win = currentWin();
    if (d > win) return addStrike(true);                 // abanicó y falló
    if (d > win * 0.85) return foul();                    // foul (borde del contacto)
    const p = 1 - d / (win * 0.85);                       // calidad de contacto 0..1
    resolveInPlay(p);
  }

  function takePitch() {
    if (capState !== "incoming" || swung) return;
    swung = true;
    capState = "dead";
    capRig.visible = false; capShadow.visible = false;
    if (Math.abs(cap.endX) <= ZONE_HALF) addStrike(false);   // strike cantado
    else addBall();                                          // bola
  }

  function foul() {
    capState = "dead";
    capRig.visible = false; capShadow.visible = false;
    if (match.strikes < 2) match.strikes += 1;
    setMessage("Foul… 😬", "#ffd27f");
    updateHUD();
    nextPitchDelay(850);
  }

  function addStrike(swinging) {
    match.strikes += 1;
    pitchPowered = false;
    if (match.strikes >= MAX_STRIKES) {
      match.outs += 1;
      setMessage(swinging ? "¡PONCHE! 🚫 Abanicó" : "¡Strike cantado — PONCHE! 🚫", "#e23b3b");
      resetCount(); updateHUD();
      finishAtBat(1100);
    } else {
      setMessage(swinging ? "¡Strike! (abanicó)" : "¡Strike cantado!", "#ffd27f");
      updateHUD();
      nextPitchDelay(850);
    }
  }
  function addBall() {
    match.balls += 1;
    pitchPowered = false;
    if (match.balls >= MAX_BALLS) { walk(); return; }
    setMessage("Bola " + match.balls, "#9fd0ff");
    updateHUD();
    nextPitchDelay(800);
  }
  function walk() {
    // base por bolas: el bateador va a 1ra; empuja corredores forzados
    let runs = 0;
    if (match.bases[0]) {
      if (match.bases[1]) {
        if (match.bases[2]) runs += 1;   // bases llenas -> anota el de 3ra
        match.bases[2] = true;
      }
      match.bases[1] = true;
    }
    match.bases[0] = true;
    if (runs) match.scores[match.battingSide] += runs;
    setMessage("¡Base por bolas! 🚶" + (runs ? "  +" + runs : ""), "#9fd0ff");
    resetCount(); updateHUD(); updateBasesUI();
    finishAtBat(1100);
  }

  function resolveInPlay(p) {
    pitchPowered = false;
    // batazo en juego: vuela al jardín (visual)
    launchBallInPlay(p);
    if (p >= 0.92) return homeRun();
    let playType, basesIfSafe;
    if (p >= 0.7) { playType = "line"; basesIfSafe = p >= 0.82 ? 2 : 1; }
    else if (p >= 0.42) { playType = "fly"; basesIfSafe = 1; }
    else { playType = "ground"; basesIfSafe = 1; }
    startFielding(playType, basesIfSafe);
  }

  function homeRun() {
    let runs = 1;
    match.bases.forEach((o) => { if (o) runs += 1; });
    match.bases = [false, false, false];
    match.scores[match.battingSide] += runs;
    setMessage("¡JONRÓN! 💥  +" + runs, "#f5c542");
    resetCount(); updateHUD(); updateBasesUI();
    finishAtBat(1500);
  }

  function launchBallInPlay(p) {
    capState = "inplay";
    cap.x = capRig.position.x; cap.y = Math.max(1.2, capRig.position.y); cap.z = capRig.position.z;
    cap.prevX = cap.x;
    cap.curveDir = Math.random() < 0.5 ? -1 : 1;
    const power = 8 + p * 10;
    cap.vz = -power; cap.vx = cap.curveDir * (2 + Math.random() * 3); cap.vy = power * 0.5;
    cap.spinRate = 30;
    capRig.visible = true; capShadow.visible = true;
  }

  /* ---------- Fildeo (ambos lados juegan la defensa) ---------- */
  function startFielding(playType, basesIfSafe) {
    const defense = match.pitchingSide;
    const cfg = {
      ground: { win: 1150, cpu: 0.82, out: "¡OUT! Rolling fildeado 🧤" },
      fly:    { win: 950,  cpu: 0.70, out: "¡OUT! Elevado atrapado 🧤" },
      line:   { win: 700,  cpu: 0.50, out: "¡OUT! Línea atrapada 🧤" }
    }[playType];
    field = { playType: playType, basesIfSafe: basesIfSafe, resolved: false, out: cfg.out };
    setRole('<span class="pit">🧤 Defensa: ' + sideName(defense) + '</span>');
    if (sideIsHuman(defense)) {
      showFieldBtn();
      btnField.classList.add("hot");
      setMessage("¡FILDEA a tiempo! 🧤", "#fff");
      field.timer = setTimeout(() => resolveField(false), cfg.win);   // no fildeó a tiempo
    } else {
      hideBottomBtns();
      setMessage("La defensa persigue la vitilla…", "#fff");
      field.timer = setTimeout(() => resolveField(Math.random() < cfg.cpu), 650 + Math.random() * 500);
    }
  }
  function onFieldTap() {
    if (!field || field.resolved) return;
    if (!sideIsHuman(match.pitchingSide)) return;
    resolveField(true);
  }
  function resolveField(success) {
    if (!field || field.resolved) return;
    field.resolved = true;
    if (field.timer) clearTimeout(field.timer);
    btnField.classList.remove("hot");
    hideBottomBtns();
    capRig.visible = false; capShadow.visible = false;
    if (success) applyPlay(0, true, field.out);
    else applyPlay(field.basesIfSafe, false, null);
    field = null;
  }

  function applyPlay(basesGained, isOut, outMsg) {
    if (isOut) {
      match.outs += 1;
      setMessage(outMsg || "¡OUT! 🧤", "#e23b3b");
    } else {
      const runs = advanceRunners(basesGained);
      const label = basesGained >= 3 ? "¡TRIPLE!" : basesGained === 2 ? "¡DOBLE!" : "¡HIT!";
      setMessage(label + " ⚾" + (runs ? "  +" + runs : ""), "#2ecc71");
    }
    resetCount(); updateHUD(); updateBasesUI();
    finishAtBat(1200);
  }

  // Avanza corredores (y el bateador) N bases; devuelve carreras anotadas
  function advanceRunners(n) {
    const runners = [];
    for (let b = 3; b >= 1; b--) if (match.bases[b - 1]) runners.push(b);
    match.bases = [false, false, false];
    let runs = 0;
    runners.forEach((pos) => { const np = pos + n; if (np >= 4) runs += 1; else match.bases[np - 1] = true; });
    if (n >= 4) runs += 1; else if (n >= 1) match.bases[n - 1] = true;   // bateador
    match.scores[match.battingSide] += runs;
    return runs;
  }

  function nextPitchDelay(ms) {
    setTimeout(() => { if (started && capState !== "over") preparePitch(); }, ms);
  }
  function finishAtBat(ms) {
    setTimeout(() => {
      if (!started) return;
      if (match.outs >= OUTS_PER_HALF) endHalf();
      else preparePitch();
    }, ms);
  }

  function endHalf() {
    hidePitchControls(); hideBottomBtns();
    match.half += 1;
    if (match.half >= 2) {
      match.half = 0;
      match.inning += 1;
      if (match.inning > INNINGS) return endMatch();
    }
    beginHalf();
  }

  function endMatch() {
    capState = "over";
    capRig.visible = false; capShadow.visible = false;
    hidePitchControls();
    showActionBtn();
    const s = match.scores;
    let txt;
    if (s[0] === s[1]) txt = "🤝 ¡Empate! " + s[0] + "–" + s[1];
    else {
      const w = s[0] > s[1] ? 0 : 1;
      txt = "🏆 ¡Gana " + sideName(w) + "! " + Math.max(s[0], s[1]) + "–" + Math.min(s[0], s[1]);
    }
    setRole("");
    setMessage(txt, "#fff");
    btnAction.classList.remove("pitching");
    btnAction.disabled = false;
    btnAction.textContent = "JUGAR OTRA VEZ";
    actionMode = "restart";
  }

  function updateBasesUI() {
    [1, 2, 3].forEach((b) => { if (baseEls[b]) baseEls[b].classList.toggle("on", !!match.bases[b - 1]); });
  }
  function updateHUD() {
    if (!match) return;
    elScore.textContent = match.scores[0] + "–" + match.scores[1];
    elInning.textContent = match.inning + (match.half === 0 ? " ▲" : " ▼");
    elCount.textContent = match.balls + "-" + match.strikes;
    elOuts.textContent = match.outs;
    updateBasesUI();
  }

  /* ---------- Botón de acción (según el rol) ---------- */
  function onActionDown() {
    if (actionMode === "pitch" && capState === "pitchsetup") { charging = true; chargeVal = 0; }
    else if (actionMode === "bat") { doSwing(); }
  }
  function onActionUp() {
    if (actionMode === "pitch" && charging) {
      charging = false; btnAction.disabled = true; actionMode = "none"; humanThrow();
    } else if (actionMode === "continue") {
      actionMode = "none"; btnAction.disabled = true; preparePitch();
    } else if (actionMode === "restart") {
      actionMode = "none"; start(match.mode);
    }
  }

  /* Coloca y orienta el disco como un frisbee: gira sobre su eje, se inclina (bank)
     hacia donde curva, con leve nariz abajo (planeo), y actualiza la sombra. */
  function applyDiscTransform(dt) {
    capRig.position.set(cap.x, cap.y, cap.z);
    cap.spin += cap.spinRate * dt;
    capMesh.rotation.y = cap.spin;
    const vx = (cap.x - cap.prevX) / Math.max(dt, 0.001);
    const targetBank = THREE.MathUtils.clamp(-vx * 0.12, -1.0, 1.0);
    cap.bank += (targetBank - cap.bank) * Math.min(1, dt * 8);
    capRig.rotation.z = cap.bank;
    capRig.rotation.x = -0.18;   // leve nariz abajo
    // sombra en el suelo
    capShadow.position.set(cap.x, 0.02, cap.z);
    capShadow.material.opacity = THREE.MathUtils.clamp(0.3 - cap.y * 0.03, 0.06, 0.3);
    const ssc = 0.5 + Math.max(0, (cap.z - CAP_START_Z) / (CAP_END_Z - CAP_START_Z)) * 0.8;
    capShadow.scale.setScalar(ssc);
  }

  /* ---------- Update + render ---------- */
  function loop() {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(clock.getDelta(), 0.05);
    const time = clock.elapsedTime;

    if (capState === "incoming") {
      cap.z += speed * dt;
      const s = Math.min((cap.z - CAP_START_Z) / (HIT_Z - CAP_START_Z), 1.15);
      const sc = Math.min(s, 1);
      cap.prevX = cap.x;
      // curva que rompe hacia un lado y vuelve a cruzar el plato (como un curveball),
      // + leve flutter que se calma al acercarse
      cap.x = cap.curveDir * cap.curveAmp * Math.sin(sc * Math.PI)
            + Math.sin(time * 7 + cap.phase) * cap.flutter * (1 - sc);
      // planeo de frisbee: sube un poco y cae suave hacia el plato
      cap.y = 1.55 + Math.sin(sc * Math.PI) * 0.5 - sc * 0.5;
      applyDiscTransform(dt);
      if (!swung) {
        if (!sideIsHuman(match.battingSide)) {
          // CPU al bate: abanica en su z objetivo, o deja pasar (take) al cruzar el plato
          if (cpuAct.swing && cap.z >= cpuAct.swingZ) doSwing();
          else if (cap.z >= CAP_END_Z) takePitch();
        } else if (cap.z >= CAP_END_Z) {
          // el humano no abanicó -> la deja pasar (bola o strike cantado)
          takePitch();
        }
      }
    } else if (capState === "inplay") {
      cap.prevX = cap.x;
      const speedH = Math.hypot(cap.vx, cap.vz);
      const lift = Math.min(speedH * 0.95, 17);   // sustentación tipo frisbee
      cap.vy -= (22 - lift) * dt;                  // gravedad menos lift -> planea
      cap.vx += cap.curveDir * 3.2 * dt;           // sigue curvando en el aire
      cap.x += cap.vx * dt; cap.y += cap.vy * dt; cap.z += cap.vz * dt;
      if (cap.y <= 0.12) { capRig.visible = false; capShadow.visible = false; }
      else applyDiscTransform(dt);
    }

    // Animación del swing del bateador
    if (swingT >= 0 && batter) {
      swingT += dt * 3.0;
      const p = swingT;
      let ang;
      if (p < 1) { const e = 1 - Math.pow(1 - p, 3); ang = -0.8 + (1.5 - (-0.8)) * e; }     // swing
      else if (p < 2) { ang = 1.5 + (-0.8 - 1.5) * (p - 1); }                                 // regreso
      else { ang = -0.8; swingT = -1; }                                                       // listo
      batter.armsPivot.rotation.y = ang;
    }
    // Animación del brazo del pícher
    if (pitchT >= 0 && pitcher) {
      pitchT += dt * 2.4;
      if (pitchT >= 1) { pitchT = -1; pitcher.throwArm.rotation.x = 0; }
      else pitcher.throwArm.rotation.x = -Math.sin(pitchT * Math.PI) * 2.2;
    }

    // Carga de fuerza del pícheo (humano manteniendo LANZAR)
    if (charging) {
      chargeVal = Math.min(1, chargeVal + dt * 1.1);
      chargeFill.style.width = (chargeVal * 100).toFixed(0) + "%";
    }

    renderer.render(scene, camera);
  }

  return { start: start, stop: stop,
           _debug: {
             capZ: () => cap.z, st: () => capState, action: () => actionMode,
             match: () => match, swung: () => swung,
             field: () => field, cpuAct: () => cpuAct,
             sim: (basesInit, n) => { match.bases = basesInit.slice(); const before = match.scores[match.battingSide];
               const r = advanceRunners(n); const res = { bases: match.bases.slice(), runs: r }; match.scores[match.battingSide] = before; return res; }
           } };
})();

/* ---------- Init ---------- */
renderCharacters();
renderFields();
show("screen-character");
