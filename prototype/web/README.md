# Vitilla Power — Prototipo 3D (web)

Prototipo del *core loop* de bateo, ahora en **3D** con [Three.js](https://threejs.org/).
Funciona en **portrait (9:16) y landscape (16:9)**.

## Cómo probarlo

**Haz doble clic en `index.html`** (o arrástralo al navegador). Es un **único archivo
autocontenido** — el CSS, Three.js y el código del juego van **incrustados dentro**, así que
funciona **sin internet** y sin servidor, en móvil o escritorio.

> Gira el teléfono: el juego se adapta tanto vertical como horizontalmente.

## Shell del juego (estilo Baseball Clash, con arte propio)

El prototipo ahora tiene la **estructura de un juego F2P completo** (todo con branding y arte
**original** de vitilla — no se copian assets de Baseball Clash):

- 🏠 **Inicio (hub):** monedas 🪙 y gemas 💎, nivel de mánager con barra de XP, **capitán**
  elegido, botón **JUGAR**, y nav inferior (Inicio / Equipo / Tienda).
- 👥 **Equipo:** roster de personajes como **cartas con rareza** (Común/Raro/Legendario),
  nivel y habilidad; eliges tu **capitán/bateador**.
- 🛒 **Tienda:** placeholder (cofres, palos, monedas — próximamente).
- 🏁 **Resultados:** al terminar el partido, pantalla de victoria/derrota con **recompensas**
  (monedas + XP que suben tu nivel de mánager) y botones **Revancha / Menú**.
- 💾 El **progreso se guarda** (monedas/nivel/capitán) en el dispositivo.

## Modos

- 🤖 **vs Máquina (CPU):** pícheas y bateas contra la IA.
- 🧑‍🤝‍🧑 **2 Jugadores:** por turnos en el mismo dispositivo (hot-seat).

## Controles

**Cuando BATEAS:** **¡BATEAR!** (botón), tocar la pantalla, o **Espacio** — en el momento en
que la vitilla cruza el plato.

**Cuando PÍCHEAS:**
- Elige la **curva**: ⟲ Izq / ⟶ Recta / Der ⟳.
- (Opcional) arma **⚡ Poder** del pícher.
- **Mantén LANZAR** para cargar la **fuerza** (más carga = más rápido; si te pasas, sale
  salvaje) y **suelta** para lanzar.

## Mecánica (motor de partido completo, estilo Baseball Clash)

- 🧍 **Personaje → 🏟️ Campo → 🎮 Modo → ⚾ Duelo 3D.** Personajes 3D con animación de swing y
  lanzamiento.
- 🔢 **Conteo real:** **bolas y strikes**. Si dejas pasar una vitilla:
  - dentro de la **zona de strike** = strike cantado; fuera = **bola**.
  - **3 strikes = ponche (out)**, **4 bolas = base por bolas** (avanzas a 1ra).
  - abanicar y fallar = strike; **foul** = strike (salvo con 2 strikes).
- 🏃 **Corrido de bases:** los hits avanzan al bateador y a los corredores por el **diamante**
  (mini-diamante en pantalla); cada corredor que llega a home = **carrera**.
- 🧤 **Fildeo (¡ambos lados juegan!):** al conectar, la vitilla va al jardín y la **defensa**
  debe **fildear a tiempo** (botón 🧤 con ventana). Fildeo exitoso = **out**; si falla, el
  bateador llega a base (sencillo/doble). La CPU fildea sola.
- ⚔️ **Estructura:** 3 entradas (alta/baja); 3 outs por media entrada; gana quien anote más.
- ⚡ **Power-ups de ambos lados:**
  - **Bateador:** en el 3er turno (a 2 outs) se **amplía la ventana** de bateo.
  - **Pícher:** al armar su poder, **reduce la ventana** del bateador y curva más (vitilla
    "encendida" 🔥).
- 🧢 **Vitilla = tapa real:** modelada como una **tapa/bitilla** (tope abombado + falda ancha
  abajo, perfil revolucionado), con **colores variados** (amarillo, verde, azul, lila) como en
  la realidad.
- 🥏 **Física tipo frisbee:** la vitilla **planea** y **gira sobre su propio eje**
  (giroscópico), con una **curva que rompe y vuelve a cruzar el plato** y se **inclina (bank)**
  hacia donde curva — como un disco volador real. Al conectar, **sale planeando** con
  sustentación hacia el jardín. Toca **BATEAR** cuando cruce el plato.
- 🎯 Centro = **JONRÓN** (sale volando al outfield), cerca = **HIT**, borde = **foul**,
  fuera = **gilla**.
- ⚡ **Power-up al 3er turno** (al llevar 2 gillas): ensancha la ventana de bateo.
- **3 gillas = fuera.** Marca: carreras acumuladas.

## Estructura / cómo se construye

El `index.html` final se **genera** a partir de fuentes (para no editar 700 KB a mano):

```
prototype/web/
├─ index.html      ← GENERADO y autocontenido (esto es lo que abres)
├─ build.mjs       ← script que incrusta todo en index.html
├─ lib/three.min.js← Three.js vendorizado (offline)
└─ src/
   ├─ template.html← estructura HTML + marcadores
   ├─ style.css    ← estilos (incluye layout portrait/landscape)
   └─ app.js       ← lógica del juego (Three.js)
```

Para reconstruir tras editar `src/`:

```bash
cd prototype/web
node build.mjs      # regenera index.html
```

## Siguiente fase

- Modo con/sin bases y corrido de bases.
- Poderes del pícher vs. bateador (balance).
- Escenarios de barrio (Cristo Rey, Los Ríos…) y modelos 3D reales.
- Avatar por *selfie*.
- Migración a **Godot** para el producto cross-platform (ver `docs/TECH_STACK.md`).
