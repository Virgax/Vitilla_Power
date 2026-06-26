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
const btnToGame = document.getElementById("btn-to-game");
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
      btnToGame.disabled = false;
    });
    fieldGrid.appendChild(card);
  });
}
document.getElementById("btn-back-character").addEventListener("click", () => show("screen-character"));
document.getElementById("btn-to-game").addEventListener("click", () => { show("screen-game"); Game.start(); });
document.getElementById("btn-quit").addEventListener("click", () => { Game.stop(); show("screen-character"); });

/* ============================================================
   JUEGO 3D
   Eje Z: home en z=0 (cerca de cámara), pícher en z=-FIELD_LEN (lejos).
   La vitilla viaja de lejos hacia el home, flotando y girando.
   ============================================================ */
const Game = (() => {
  const canvas = document.getElementById("game-canvas");
  const msgEl = document.getElementById("message");
  const btnSwing = document.getElementById("btn-swing");
  const errEl = document.getElementById("webgl-error");

  const elRuns = document.getElementById("hud-runs");
  const elOuts = document.getElementById("hud-outs");
  const elGillas = document.getElementById("hud-gillas");
  const elPower = document.getElementById("hud-power");
  const elPowerVal = document.getElementById("hud-power-val");

  const FIELD_LEN = 18;
  const CAP_START_Z = -FIELD_LEN + 1;   // frente al pícher
  const CAP_END_Z = 3;                  // pasa el home
  const HIT_Z = 0;                       // punto ideal de contacto
  const BASE_WIN = 1.5;                  // ventana (en unidades z)
  const POWER_WIN_BONUS = 1.3;
  const CAP_SPEED = 7.2;                 // unidades/seg (más lento que antes)
  const SPEED_RAMP = 0.35;               // sube por conexión
  const MAX_SPEED = 11;

  let renderer, scene, camera, clock;
  let capMesh, capRig, capShadow, batter, pitcher;
  let swingT = -1, pitchT = -1;   // animaciones (-1 = inactiva)
  let raf = null, started = false;

  let runs, gillas, powerUpActive, speed;
  // estado de la vitilla: 'idle' | 'incoming' | 'hit' | 'done'
  let capState = "idle";
  // Física tipo frisbee: posición + velocidad + actitud (bank/pitch) + giro giroscópico
  let cap = {
    x: 0, y: 1.5, z: 0,
    vx: 0, vy: 0, vz: 0,
    spin: 0, spinRate: 26,       // giro sobre su propio eje (rad/s)
    bank: 0, pitch: 0,           // actitud del disco
    curveDir: 1, curveAmp: 2,    // curva lateral del lanzamiento (banana)
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
    [[-5.5, -5.5], [5.5, -5.5]].forEach(([x, z]) => {
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

    // Vitilla (tapa tipo frisbee). capRig = actitud (bank/pitch); capMesh gira sobre su eje.
    capRig = new THREE.Group();
    capMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.42, 0.42, 0.12, 24),
      new THREE.MeshStandardMaterial({ color: 0x2a7bff, emissive: 0x0a2a66, metalness: 0.2, roughness: 0.45 })
    );
    // borde (rim) para que se lea como disco/tapa
    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(0.4, 0.06, 8, 24),
      new THREE.MeshStandardMaterial({ color: 0x1657c8, roughness: 0.5 })
    );
    rim.rotation.x = Math.PI / 2;
    capMesh.add(rim);
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
    btnSwing.addEventListener("click", swing);
    canvas.addEventListener("pointerdown", (e) => { e.preventDefault(); swing(); });
    document.addEventListener("keydown", (e) => { if (e.code === "Space") { e.preventDefault(); swing(); } });
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

  /* ---------- Flujo de juego ---------- */
  function start() {
    if (!init()) return;
    setBatterAppearance(state.character || {});
    // color de cielo/grama según campo
    scene.background = new THREE.Color((state.field && state.field.sky) || 0x8ecbff);
    const ground = scene.getObjectByName("ground");
    if (ground) ground.material.color.setHex((state.field && state.field.grass) || 0x3f9f4a);

    runs = 0; gillas = 0; speed = CAP_SPEED; powerUpActive = false;
    capState = "idle";
    btnSwing.disabled = false;
    btnSwing.textContent = "¡BATEAR!";
    updateHUD();
    setMessage("¡Dale a la vitilla! 🥎", "#fff");
    onResize();
    started = true;
    if (!raf) loop();
    setTimeout(nextPitch, 1000);
  }
  function stop() { started = false; if (raf) { cancelAnimationFrame(raf); raf = null; } }

  function updateHUD() {
    elRuns.textContent = runs;
    elOuts.textContent = gillas;
    elGillas.textContent = gillas;
    elPowerVal.textContent = powerUpActive ? ((state.character && state.character.power) || "¡Listo!") : "—";
    elPower.classList.toggle("active", powerUpActive);
  }
  function setMessage(txt, color) { msgEl.textContent = txt; msgEl.style.color = color || "#fff"; }

  function nextPitch() {
    if (!started) return;
    if (gillas >= 3) return gameOver();
    powerUpActive = gillas === 2;
    swung = false;
    capState = "incoming";
    cap.z = CAP_START_Z;
    cap.x = 0; cap.prevX = 0;
    cap.phase = Math.random() * Math.PI * 2;
    cap.spinRate = 24 + Math.random() * 8;
    cap.curveDir = Math.random() < 0.5 ? -1 : 1;
    // amplitud de la curva: menos con power-up (más fácil de leer)
    cap.curveAmp = (powerUpActive ? 0.9 : 1.7) + Math.random() * 1.0;
    cap.flutter = (powerUpActive ? 0.05 : 0.12) + Math.random() * 0.06;
    capRig.visible = true;
    capShadow.visible = true;
    pitchT = 0;   // anima el brazo del pícher
    setMessage(powerUpActive ? ("⚡ ¡POWER-UP! " + state.character.power) : "", powerUpActive ? "#f5c542" : "#fff");
    updateHUD();
  }
  function currentWin() { return BASE_WIN + (powerUpActive ? POWER_WIN_BONUS : 0); }

  function swing() {
    if (capState !== "incoming" || swung) return;
    swung = true;
    swingT = 0;   // anima el swing del bateador
    const d = Math.abs(cap.z - HIT_Z);
    const win = currentWin();
    if (d <= win * 0.33) launchHit("¡JONRÓN! 💥", "#f5c542", 2, 16);
    else if (d <= win * 0.75) launchHit("¡HIT! ⚾", "#2ecc71", 1, 10);
    else if (d <= win) { setMessage("Foul… 😬", "#ffd27f"); endBall(false, 800); }
    else gilla("¡GILLA! 🚫 Abanicaste");
  }

  function launchHit(txt, color, addRuns, power) {
    runs += addRuns;
    speed = Math.min(speed + SPEED_RAMP, MAX_SPEED);
    powerUpActive = false;
    capState = "hit";
    // arranca desde donde estaba la vitilla y sale planeando hacia el outfield
    cap.x = capRig.position.x; cap.y = capRig.position.y; cap.z = capRig.position.z;
    cap.prevX = cap.x;
    cap.curveDir = Math.random() < 0.5 ? -1 : 1;
    cap.vz = -power;                                   // hacia el jardín
    cap.vx = cap.curveDir * (2 + Math.random() * 3);   // curva del batazo
    cap.vy = power * 0.55;                              // elevación inicial
    cap.spinRate = 30;
    setMessage(txt, color);
    updateHUD();
    endBall(true, 1300);
  }
  function gilla(txt) {
    gillas += 1; powerUpActive = false; capState = "done";
    capRig.visible = false; capShadow.visible = false;
    setMessage(txt, "#e23b3b");
    updateHUD();
    if (gillas >= 3) setTimeout(gameOver, 900); else setTimeout(nextPitch, 1000);
  }
  function endBall(wasHit, delay) {
    if (!wasHit) { capState = "done"; capRig.visible = false; capShadow.visible = false; }
    setTimeout(() => { if (capState !== "incoming") nextPitch(); }, delay);
  }

  function gameOver() {
    capState = "done"; capRig.visible = false; capShadow.visible = false;
    btnSwing.disabled = false;
    setMessage("⚾ ¡FUERA! Carreras: " + runs, "#fff");
    btnSwing.textContent = "JUGAR OTRA VEZ";
    const restart = () => { btnSwing.removeEventListener("click", restart); start(); };
    btnSwing.addEventListener("click", restart, { once: true });
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
      if (cap.z >= CAP_END_Z && !swung) gilla("¡GILLA! 🚫 La dejaste pasar");
    } else if (capState === "hit") {
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

    renderer.render(scene, camera);
  }

  return { start: start, stop: stop,
           _debug: { capZ: () => cap.z, st: () => capState } };
})();

/* ---------- Init ---------- */
renderCharacters();
renderFields();
show("screen-character");
