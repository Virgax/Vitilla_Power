# Vitilla Power — Prototipo 3D (web)

Prototipo del *core loop* de bateo, ahora en **3D** con [Three.js](https://threejs.org/).
Funciona en **portrait (9:16) y landscape (16:9)**.

## Cómo probarlo

**Haz doble clic en `index.html`** (o arrástralo al navegador). Es un **único archivo
autocontenido** — el CSS, Three.js y el código del juego van **incrustados dentro**, así que
funciona **sin internet** y sin servidor, en móvil o escritorio.

> Gira el teléfono: el juego se adapta tanto vertical como horizontalmente.

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

## Mecánica

- 🧍 **Personaje → 🏟️ Campo → 🎮 Modo → ⚾ Duelo 3D.** Los jugadores son **personajes 3D**
  (cuerpo, jersey, bermuda, chancletas, gorra, bate). El bateador hace su **swing** y el pícher
  **lanza** con animación, al estilo *Mario Superstar Baseball*.
- ⚔️ **Duelo por turnos:** un lado **batea** (hasta 3 outs/gillas) mientras el otro **pichea**;
  luego cambian. Gana quien anote más **carreras**.
- ⚡ **Power-ups de ambos lados:**
  - **Bateador:** en el 3er turno (al llegar a 2 outs) se **amplía la ventana** de bateo.
  - **Pícher:** al armar su poder, el lanzamiento **reduce la ventana** del bateador y curva
    más (vitilla "encendida").
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
