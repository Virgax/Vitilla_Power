# Vitilla Power — Prototipo web

Prototipo **desechable** para sentir el *core loop* de bateo por *timing*. Vanilla JS +
HTML5 Canvas, **sin dependencias ni build**. Es un **único archivo autocontenido**
(`index.html` con el CSS y el JS adentro), así que basta con abrirlo.

## Cómo probarlo

**Solo haz doble clic en `index.html`** (o arrástralo al navegador). Funciona en móvil y
escritorio sin servidor ni instalación, porque todo está dentro del mismo archivo.

> Si antes lo viste "sin estilos / sin botones", era porque el navegador no cargaba los
> archivos `.css`/`.js` vecinos. Ahora va todo en `index.html` y eso ya no pasa.

## Flujo

1. **Selecciona tu personaje** (roster "flow", aleatorio 🎲, o "crea el tuyo" — placeholder del
   futuro avatar por *selfie*).
2. **Selecciona el campo** (por ahora *Baseball Stadium*; las esquinas de barrio llegan luego).
3. **Batea:** la vitilla "baila" en el aire (flota y gira). Toca **BATEAR** (o la pantalla, o
   Espacio) cuando la vitilla cruce la **banda verde**.

## Mecánica implementada

- ⏱️ **Timing de bateo:** centro de la banda = **JONRÓN**, cerca = **HIT**, borde = **foul**,
  fuera = **gilla**.
- 🌀 **Vitilla flotadora/giratoria:** trayectoria ondulante con giro (lo que la hace difícil,
  según la investigación real — ver `docs/VITILLA_RESEARCH.md`).
- ⚡ **Power-up al 3er turno:** al llevar **2 gillas**, el siguiente lanzamiento ensancha la
  ventana de bateo (mecánica de la reunión: "dos gillas → tercer turno → power-up").
- 🎯 **Diana de strike** dibujada detrás del home (detalle auténtico).
- **3 gillas = fuera** (fin de partida). Marca: carreras acumuladas.

## Qué NO incluye todavía (siguiente fase)

- Modo con/sin bases y corrido de bases.
- Poderes del pícher vs. bateador (balance).
- Multijugador / duelo en línea.
- Avatar por selfie, escenarios de barrio, audio.

> Este prototipo valida la **sensación** del bateo. Si convence, lo llevamos a **Godot** como
> base del producto (ver `docs/TECH_STACK.md`).
