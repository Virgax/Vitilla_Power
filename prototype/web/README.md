# Vitilla Power — Prototipo 3D (web)

Prototipo del *core loop* de bateo, ahora en **3D** con [Three.js](https://threejs.org/).
Funciona en **portrait (9:16) y landscape (16:9)**.

## Cómo probarlo

**Haz doble clic en `index.html`** (o arrástralo al navegador). Es un **único archivo
autocontenido** — el CSS, Three.js y el código del juego van **incrustados dentro**, así que
funciona **sin internet** y sin servidor, en móvil o escritorio.

> Gira el teléfono: el juego se adapta tanto vertical como horizontalmente.

## Controles

- **¡BATEAR!** (botón), tocar la pantalla, o tecla **Espacio** para batear.

## Mecánica

- 🧍 **Personaje → 🏟️ Campo → ⚾ Juego 3D.** Los jugadores son **personajes 3D** (no emojis):
  cuerpo, jersey del cuadro, bermuda, chancletas y gorra del equipo, con bate. El bateador
  hace su **swing** y el pícher **lanza** con animación, al estilo *Mario Superstar Baseball*.
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
