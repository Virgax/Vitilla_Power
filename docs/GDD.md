# Vitilla Power — Documento de Diseño del Juego (GDD)

> **Versión:** 0.1 (borrador inicial)
> **Fecha:** 26 de junio de 2026
> **Autor / equipo:** Jaime Irving — Edición 1
> **Basado en:** Reunión "Desarrollo de un Juego Móvil de Vitilla" (26-jun-2026)

Este documento es un *documento vivo*. Recoge las decisiones tomadas en la reunión inicial
y las organiza en una especificación accionable. Las decisiones aún abiertas están marcadas
con ⚠️ y detalladas en [`OPEN_QUESTIONS.md`](OPEN_QUESTIONS.md).

---

## 1. Visión general

**Vitilla Power** es un juego móvil de *vitilla* (béisbol callejero dominicano jugado con
tapas/galones plásticos y un palo de escoba) para **Android y iOS**. Captura la energía de
la esquina: el barrio, el colmado, la chancleta y el flow dominicano, en un duelo de pícher
contra bateador con mecánicas de *timing* y *power-ups*.

### Pilares de diseño

1. **Autenticidad dominicana.** Esquinas reales, vestimenta casual, sonido de barrio. Que el
   jugador sienta que está "en la calle".
2. **Duelo pícher ↔ bateador.** El corazón del juego es el enfrentamiento: yo te picheo con
   poderes, tú me bateas con tu *timing* y tus poderes.
3. **Fácil de aprender, difícil de dominar.** Controles táctiles simples (pocos botones),
   pero con profundidad en el *timing* y la lectura de poderes.
4. **Personalización con identidad.** Palos, vitillas, skins con banderas, uniformes y
   escenarios que el jugador colecciona y exhibe.

### Referencia principal

*Mario Superstar Baseball* (GameCube) — especialmente su modelo de bateo/pícheo y el envío de
la bola a las bases. **Vitilla Power adapta esa mecánica, no la copia**, sustituyendo la
física de la pelota por la de la vitilla.

---

## 2. La vitilla: regla física central

La vitilla **no se comporta como una pelota**. Esto define toda la jugabilidad:

- La vitilla, al caer, **rueda / gira** por el suelo en vez de quedarse quieta.
- **Parada o girando = la jugada sigue viva.** El defensor puede recogerla y hacer el *out*.
- **Pisada / aplastada contra el suelo = SAFE.** Si el bateador (o el corredor) logra que la
  vitilla quede plana en el piso, la jugada se considera *safe*.

> De la reunión: *"La vitilla es parada y pisada. Si está girando y yo la agarro... por eso
> tiene que haber [una mecánica] completa."*

Esto obliga a una **mecánica de recogida (*pick-up*) con *timing***: el defensor no recoge la
vitilla automáticamente; tiene que "cacharla" en el momento correcto mientras rueda.

---

## 3. Mecánicas de juego (*core gameplay*)

### 3.1 Bateo (*timing*)

- Mecánica de **barra de *timing***: una barrita sube y baja (o se desplaza), y el jugador
  debe pulsar dentro de un **rango** para conectar.
- Acertar el rango = buen contacto. Fallar = *gilla* (fallo / ponche).
- Pensado para **móvil**: pocos botones, controles táctiles claros.

### 3.2 Pícheo

- El pícher elige **tipo de vitilla** y lanza. Puede aplicar **poderes** que modifican la
  jugada del bateador (ver §4).
- Asimetría de pantalla: *"de tu lado de la pantalla tú das la combinación que quieras hacer;
  del otro lado yo espero y le doy."* Cada jugador ve y controla su rol.
- ⚠️ La **resolución exacta** del duelo (cómo se sincroniza la entrada del pícher con la del
  bateador) está por definir → ver OPEN_QUESTIONS #1.

### 3.3 Recogida / defensa (*pick-up*)

- Mecánica de ***timing*** también para la recogida (la misma barra-rango que el bateo).
- Combinación de botones táctiles (estilo A/B/X/Y) para **agarrar y cargar** la vitilla
  mientras rueda.
- Si el defensor "cachea" bien → recoge la vitilla y puede intentar el *out*.
- Si falla → la vitilla sigue viva / el corredor avanza.

### 3.4 Envío a las bases (modo con bases)

- Adaptado de *Mario Superstar Baseball*: **botones mapeados a bases**.
  - Ej.: A = primera, B = segunda, Y = tercera (mapeo táctil a definir).
- El defensor decide a qué base tirar la vitilla. Tiro a la base equivocada → el corredor
  avanza / se permiten dobles.

---

## 4. Poderes especiales (*power-ups*)

Inspirados en *Mario Superstar Baseball*. Hay poderes de **pícher** y de **bateador**, y deben
**equilibrarse entre sí** (⚠️ balance pendiente → OPEN_QUESTIONS #1).

### 4.1 Condición de activación

- Un poder se activa en el **tercer turno** cuando el jugador lleva **dos *gillas*** (dos
  fallos previos). *"Cuando tienes dos gillas, en el tercer turno tienes un power-up."*
- Los **dos primeros turnos** son "normales" (sin poder); el **tercero** desbloquea el poder.

### 4.2 Origen del poder

- El poder está ligado al **skin / pintura del palo** ("el del Dios tiene el power"). Es decir,
  el palo elegido determina el poder disponible.

### 4.3 Poderes del pícher (ejemplos de la reunión)

- **Vitilla flotadora:** sube y baja en el aire ("flotadora").
- **Vitilla que *freeza*:** se congela / detiene su trayectoria.
- **Vitilla que se aplana al tocar el piso** (se pone *plana*).
- **Dividir el rango de bateo:** el poder del pícher reduce/parte el rango de *timing* del
  bateador, dificultando el contacto.

### 4.4 Poderes del bateador

- Capacidad de **darle aire** a la vitilla / controlar el rebote para que toque el piso y
  quede plana (*safe*).
- ⚠️ Lista completa de poderes del bateador y su contrapartida a cada poder del pícher →
  por definir.

---

## 5. Modos de juego

Hay **dos modos principales**:

### 5.1 Sin bases ("normal, como en la calle")

- Juego callejero clásico: dinámica simple de esquina.
- Foco en el duelo pícher–bateador y el *out* por recogida.

> 📌 **Nota de autenticidad** (ver [`VITILLA_RESEARCH.md`](VITILLA_RESEARCH.md)): la vitilla
> real se juega con **home + 2 bases (1ª y 3ª), sin segunda base**, y usa una **diana de
> strike** detrás del bateador. En la reunión se mapeó A=1ª/B=2ª/Y=3ª al estilo *Mario*.
> ⚠️ Decisión pendiente: ser fieles (2 bases) en el modo auténtico vs. usar 3 por jugabilidad.

### 5.2 Con bases

- Corredores avanzan por las bases.
- Usa la mecánica adaptada de *Mario Superstar Baseball* para el **envío de la vitilla a las
  bases** (ver §3.4).
- Como es vitilla y no pelota, el comportamiento del tiro y la recogida difiere (la vitilla
  rueda / se aplana).

### Reglas básicas comunes

- **Out / ponche:** fallar el *timing* (gillas) o ser puesto *out* por una recogida válida.
- **Safe:** lograr que la vitilla quede **aplastada/plana** en el suelo.

---

## 6. Personalización y ambientación

### 6.1 Palos (*skins* obligatorios de selección)

El jugador **elige el palo**, y el palo lleva el poder. Modelos mencionados:

- **El Diablo** (palo emblemático).
- **Escoba** (palo de escoba clásico).
- **Pala de recoger** ("la que se recoge, que le das con la hebilla").
- **Pala con el collón grande**.
- **Skins con banderas de todos los países.**

### 6.2 Vitillas

- El jugador elige el **tipo de vitilla** a pichear (distintos comportamientos / estética).

### 6.3 Ubicaciones / escenarios (esquinas reales de RD)

Escenarios basados en barrios y esquinas reales de República Dominicana. Candidatos
mencionados:

- **Cristo Rey**
- **Los Ríos**
- **San Carlos**
- **Palomino**
- (Sistema tipo "selección de *location* en el mapa"; lista final por cerrar.)

Detalle de ambiente: gradas con gente "bebiendo", **colmados** alrededor de la cancha.

### 6.4 Uniformes / vestimenta

Estilo **casual de esquina**, no uniforme deportivo formal:

- **Chancletas** 🩴
- **Bermudas / pantaloncito**
- **Jersey del cuadro** (camiseta de equipo)
- Variante "selección": piezas negras especiales para los de la selección.

### 6.5 Sonido

- **Frases célebres** y **sonidos de ambiente** de los barrios para autenticidad.
- ⚠️ **Cuidado con derechos de autor** de las frases célebres → ver OPEN_QUESTIONS #2.
  (En la reunión se advirtió explícitamente sobre frases "satanizadas" / con problemas de
  derechos. Preferir frases originales o con licencia.)

---

## 7. Controles (móvil)

- Diseño **táctil, pocos botones** ("como es en el móvil no va a tener que usar tantos
  botones").
- Botones contextuales específicos según el rol (batear / pichear / recoger / enviar a base).
- Núcleo de interacción = **barra de *timing* + rango** (bateo y recogida) y **botones de
  base** (modo con bases).

---

## 8. Plataformas

- **iOS / iPadOS** (iPhone, iPad)
- **Android** (teléfonos y tabletas)

El soporte cross-platform condiciona la elección de motor → ver [`TECH_STACK.md`](TECH_STACK.md).

---

## 9. Decisiones pendientes (resumen)

Ver el detalle en [`OPEN_QUESTIONS.md`](OPEN_QUESTIONS.md):

1. ⚠️ **Balance** de la interacción poderes-pícher ↔ habilidades-bateador.
2. ⚠️ **Derechos de autor** de frases célebres y sonidos.
3. ⚠️ **Modelo de monetización** (gratis, de pago, compras in-app, anuncios…).
4. ⚠️ **Resolución exacta** del duelo en tiempo real (sincronización pícher/bateador).
5. ⚠️ **Lista final** de esquinas/barrios y de palos/vitillas para el MVP.

---

## 11. Personajes

Inspirado en *Mario Superstar Baseball* (ver [`MARIO_SUPERSTAR_BASEBALL.md`](MARIO_SUPERSTAR_BASEBALL.md)):
un **roster de personajes 3D** con estilo dominicano de barrio ("flow"). Son **modelos 3D de
personas** (no emojis ni sprites planos): cuerpo, jersey del cuadro, bermuda, chancletas y
gorra, con bate; baten y pichean con animación.

### 11.1 Selección de personaje

- **Selección manual** de un personaje del roster, o **aleatoria (random)** para partida
  rápida.
- Cada jugador tiene su **personaje principal** con su propio *flow* (estética y, a futuro,
  estadísticas/poder característicos).

### 11.2 Crea tu propio personaje

- El jugador puede **crear su propio personaje** (no solo elegir del roster).
- ✨ **Feature estrella (a futuro): avatar por *selfie*.** Tomas una foto y el sistema genera
  tu personaje a partir de tu cara. Es una característica diferenciadora muy fuerte.
  - Implicaciones técnicas a evaluar: detección/recorte facial, estilización (cartoon/avatar),
    privacidad y permisos de cámara, procesamiento en dispositivo vs. servidor.
  - ⚠️ Se trata como **fase posterior** (no MVP); en el prototipo se deja como *placeholder*.
- Personalización adicional: piel, peinado, vestimenta (chancleta, bermuda, jersey del cuadro),
  y el **palo** (que lleva el poder, ver §4.2).

## 12. Selección de campo / escenario

Antes de jugar, el jugador **elige el campo** ("select the playing field").

- Se quieren **varias opciones**, que se irán mejorando con el tiempo.
- **Por ahora un estadio de béisbol (*baseball stadium*) sirve** como campo base del prototipo.
- A futuro, los escenarios de **esquinas/barrios reales de RD** (Cristo Rey, Los Ríos, San
  Carlos, Palomino…) con su ambientación (colmado, gradas con gente bebiendo) — ver §6.3.

> Flujo de entrada a partida (prototipo): **Seleccionar personaje → Seleccionar campo →
> Jugar (duelo de bateo por *timing*)**.

## 13. Glosario

| Término | Significado |
|---------|-------------|
| **Vitilla** | Tapa/galón plástico usado como "pelota" en el béisbol callejero dominicano. |
| **Gilla** | Fallo / ponche (no conectar). "Dos gillas" = dos fallos. |
| **Palo** | Bate improvisado (escoba, pala, etc.). |
| **Safe** | Jugada a favor del bateador/corredor (vitilla aplastada en el piso). |
| **Out / ponche** | Eliminación del bateador/corredor. |
| **Colmado** | Tienda de barrio dominicana; parte de la ambientación. |
| **Flow** | Estilo / actitud; usado en la reunión para "darle estilo" a una mecánica o skin. |
