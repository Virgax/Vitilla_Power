# Referencia de diseño: Baseball Clash (Miniclip) → Vitilla Power

> **Propósito.** Baseball Clash es la referencia de la que queremos la **estructura completa**
> del juego (duelo en tiempo real pícher vs. bateador, bases, fildeo, boosts, progresión).
> Este documento analiza **sus sistemas** para reimplementarlos, **adaptados a la vitilla**.
>
> ⚠️ **Nota legal (importante).** Tomamos **mecánicas, flujos y sensación** como inspiración
> (eso es legítimo: las reglas/ideas de un juego no son copyrightables). **NO** copiamos ni
> descompilamos **assets, arte, código, sonidos ni textos** de Baseball Clash — todo eso lo
> creamos **original** (con identidad dominicana). Así el juego es nuestro y podemos publicarlo
> y monetizarlo sin riesgo. **No** metemos el APK/OBB al repositorio (ver `.gitignore`).

---

## 1. Bucle central (real-time PvP)

Partido **en tiempo real** contra otro jugador (o CPU): decisiones rápidas de pícheo, bateo,
fildeo y corrido de bases. Objetivo: anotar más carreras que el rival en el diamante.

## 2. Sistema de pícheo

Controlas **velocidad, tipo y ubicación** del lanzamiento para ponchar o inducir un batazo
débil.

- **Zona de strike:** un **cuadro** alrededor del guante del receptor. Fuera de la zona = "Ball".
- **Conteo de bolas:** hasta 3 "Balls"; al 4º, el bateador avanza a 1ra (**base por bolas**).
- **Atributos del pícher:**
  - **Control** — precisión para lanzar dentro de la zona.
  - **Velocidad** — rapidez del lanzamiento.
  - **Movimiento / Efecto (Spin)** — cuánto "engaña" al bateador (curvas/quiebres).
- **Estrategia:** variar tipo y ubicación, pegar a las **esquinas** de la zona (no por el medio).

## 3. Sistema de bateo

- **Timing del swing:** conectar en el momento justo para dar hit y empujar la bola.
- Un swing perfecto = mejor contacto/potencia; mal timing = fallo o batazo débil.

## 4. Fildeo y bases

- **4 bases:** 1ra, 2da, 3ra y home. El corredor sale de home y debe recorrer y volver.
- **Fildeo:** posicionas fildeadores, atrapas la bola y **tiras rápido a una base** para el out.
- **Out:** atrapar de aire, o llegar la bola a la base antes que el corredor.
- **Anotar:** cada corredor que completa el circuito = 1 carrera.

## 5. Boosts / habilidades especiales

Cada jugador tiene una **habilidad especial**:
- **Ofensiva:** p. ej. *power boost* al batear contra un fastball.
- **Defensiva:** p. ej. tiro a base súper rápido tras fildear.
- **De pícheo:** p. ej. boost de **control** mientras no tenga bolas en el conteo.
Se usan **estratégicamente** durante el partido y pueden cambiar la jugada.

## 6. Progresión (metajuego)

- **Cartas de jugadores** con **rareza** (Común / Raro / Legendario).
- **Subir de nivel** jugadores cuesta **monedas** (progresivamente más; raros/legendarios más caros).
- **Manager XP:** subir jugadores da XP de mánager; al subir de nivel, **sube los atributos**
  del equipo en general.
- Colección/equipo (roster) que el jugador arma y mejora.

## 7. Modos de juego

- **Cabeza a cabeza** (1v1 en tiempo real).
- **Torneos**.
- **Eventos especiales** con retos y recompensas.

## 8. UI/UX (a observar jugando)

- Vista del duelo pícher/bateador; indicador de zona de strike; conteo (bolas/strikes/outs).
- Marcador, entrada, corredores en bases (diamante).
- Botones de habilidad/boost; medidores de carga/timing.
- Pantallas de meta: roster, cartas, mejora, tienda, cofres/recompensas.

---

## 9. Mapeo Baseball Clash → Vitilla Power

| Sistema (Baseball Clash) | Adaptación en Vitilla Power |
|--------------------------|-----------------------------|
| Bola de béisbol | **Vitilla** (tapa) con **física tipo frisbee** (ya implementada) |
| Zona de strike (cuadro) | **Diana de strike** dominicana (ya en el prototipo) |
| Control/Velocidad/Spin del pícher | Curva (izq/recta/der) + fuerza (carga) — ya en el prototipo; añadir **ubicación** y atributos |
| Base por bolas (4 balls) | Conteo de bolas/strikes al estilo vitilla (ver `VITILLA_RESEARCH.md`) |
| Timing de bateo | Ya implementado (ventana de contacto) |
| 4 bases + corrido | ⏳ **Por hacer:** corrido de bases (ojo: vitilla real usa **2 bases**; decidir 2 vs 4) |
| Fildeo + tiro a base | ⏳ **Por hacer:** mecánica de **recogida con timing** (la vitilla rueda/aplasta) |
| Habilidades por jugador | **Power-ups** de pícher y bateador (ya hay base); ampliar a habilidades por personaje |
| Cartas/rareza/nivel | ⏳ **Por hacer:** roster coleccionable con rareza y mejora |
| Monedas / Manager XP | ⏳ **Por hacer:** economía y progresión |
| Modos (1v1/torneos/eventos) | ⏳ **Por hacer:** online 1v1; ya hay vs CPU y 2P local |
| Skins/arte genérico | **Arte propio** dominicano (palos, esquinas, uniformes, colmado) |

## 10. Qué ya tenemos vs. qué falta

**Ya en el prototipo (`prototype/web/`):**
- Duelo pícher vs. bateador (vs CPU y 2 jugadores local).
- Pícheo controlado (curva + carga de fuerza) y bateo por timing.
- Power-ups de ambos lados. Diana de strike. Vitilla con física de frisbee.

**Añadido en esta iteración (motor de partido completo):**
- ✅ **Conteo** de bolas/strikes/outs, **zona de strike**, **base por bolas** y ponche.
- ✅ **Corrido de bases** en el diamante (1ra/2da/3ra + home) y carreras.
- ✅ **Fildeo con timing** (la defensa —humano o CPU— fildea a tiempo para el out).
- ✅ **Entradas** (alta/baja) y fin de partido por marcador.

**Pendiente (meta-juego de Baseball Clash):**
1. **Online 1v1** en tiempo real (matchmaking).
2. **Roster coleccionable** con rareza, niveles y habilidades por personaje.
3. **Economía/progresión** (monedas, XP de mánager, cofres/recompensas).
4. **Modos** (torneos, eventos).
5. Fildeo manual avanzado (mover fildeador, elegir base del tiro) y doble-play.

## 11. Cómo trabajamos con la app de referencia (sin subir el binario)

- **No** se sube el APK/OBB al repo (pesa ~600MB; GitHub rechaza >100MB y LFS no conviene).
  Ya está en `.gitignore`.
- Para estudiarla: **jugarla** y documentar aquí (capturas propias de análisis, notas de
  flujo). Si hace falta guardar el binario para tu referencia, ponlo en **almacenamiento
  externo** (p. ej. Google Drive) y deja solo el enlace en este doc — no el archivo.
- Construimos cada sistema de la lista §10 con **assets y código originales**.

## Fuentes (públicas)

- [Baseball Clash — Miniclip Help & Support](https://support.miniclip.com/hc/en-us/sections/4404466392849-Baseball-Clash)
- [Baseball Rules and Tips — Miniclip](https://support.miniclip.com/hc/en-us/articles/360018983078-Baseball-Rules-and-Tips)
- [Baseball Clash Pitches — Miniclip](https://support.miniclip.com/hc/en-us/articles/13738327086609-Baseball-Clash-Pitches)
- [Beginner's Guide — Level Winner](https://www.levelwinner.com/baseball-clash-beginners-guide-13-tips-tricks-strategies-for-winning-more-consistently/)
- [App Store — Baseball Clash](https://apps.apple.com/us/app/baseball-clash-real-time-game/id1491129492)
