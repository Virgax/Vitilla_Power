# Investigación: la vitilla real

> Recopilado el 26-jun-2026 para asegurar que el juego respeta la mecánica auténtica.
> Fuentes al final.

El objetivo de esta nota es que el diseño no "obvie" detalles del juego real. Varios de estos
puntos **no salieron en la reunión** y conviene decidir si los incorporamos.

## Qué es

La vitilla es una variación dominicana del *stickball*. Evolucionó en los años 70 y tuvo su
primer torneo formal en 2009. Se juega mucho en RD y en zonas de EE. UU. con población
dominicana. Se le atribuye parte de la ventaja de los peloteros dominicanos en bateo y
fildeo, por la coordinación que exige.

## Equipo

- **Bate:** palo de escoba, ~1.25 m de largo.
- **"Pelota":** una **tapa grande de botella/galón de agua** (la vitilla), ~1.5 pulgadas de
  diámetro.
- Normalmente **sin guantes**.

## Campo (reglas de torneo)

- **Plato (home) + 2 bases: primera y tercera. NO hay segunda base.**
- El recorrido de bases es un **triángulo**, ~50 pies por lado.
- La marca del lanzador está a **~45 pies** del home, centrada.
- **Diana de strike:** un blanco **circular detrás del home**, ~18 pulgadas de diámetro,
  a ~18 pulgadas del suelo.

## Lo que la hace difícil (¡el "flow"!)

> La vitilla **flota como un disco** y puede **girar descontroladamente a muy alta
> velocidad**, lo que hace el bateo y el fildeo **impredecibles**.

Este es el corazón de la sensación del juego: la trayectoria no es recta, "baila" en el aire.
El prototipo debe capturar ese movimiento ondulante/giratorio.

## Pícheo y bateo

- El lanzador tira la vitilla hacia la **diana**. El bateador se para enfrente pero **sin
  bloquear** la diana.
- **Strike** si: la vitilla pega en la diana, el bateador abanica y falla, o batea *foul* con
  menos de 2 strikes.
- **No hay bases por bolas (walks).** Un lanzamiento no bateado o que falla la diana se
  **puede relanzar**. Si el bateador bloquea la diana y le pega el lanzamiento, cuenta como
  strike.

## Outs y defensa

- **2 o 3 fildeadores** (incluye al lanzador). No hay receptor.
- **Out** por: atrapar la vitilla en el aire, tocar al corredor con la vitilla en mano, o
  forzar el out pisando la base.
- **3 outs** terminan el turno al bate del equipo.

## Implicaciones de diseño (decisiones a tomar)

1. **¿Diana de strike?** El juego real la usa y es muy reconocible. Podríamos incorporarla
   como elemento visual y de reglas (pichar a la diana = strike). → Añadir al GDD.
2. **Bases: ¿2 o 3?** El juego real tiene **home + 2 bases (1ª y 3ª)**. En la reunión se
   mapeó A=1ª, B=2ª, Y=3ª (estilo *Mario Superstar Baseball*). **Conflicto a resolver:**
   ¿somos fieles (2 bases) o usamos 3 por jugabilidad? Recomendación: fieles a 2 bases en el
   modo "callejero/auténtico" y permitir variantes.
3. **Trayectoria ondulante** de la vitilla = mecánica central de dificultad. El timing del
   bateo debe sincronizarse con ese "baile".
4. **Relanzamiento** (no walks): encaja con la idea de turnos; un lanzamiento fallado se
   puede repetir.

## Fuentes

- [Vitilla — Wikipedia (EN)](https://en.wikipedia.org/wiki/Vitilla)
- [Cómo jugar vitilla en RD (Scribd)](https://www.scribd.com/document/726028384/vitilla-es)
- [El béisbol dominicano se "cuece" en la vitilla — Listín Diario](https://listindiario.com/el-deporte/2022/04/17/716272/el-beisbol-dominicano-se-cuece-en-el-popular-juego-callejero-de-la-vitilla.html)
- [The Clásico de Vitilla — MLB.com](https://www.mlb.com/cut4/the-red-bull-clasico-de-vitilla-a-stickball-style-tournament/c-150978766)
- [Beteyah — Home of Vitilla](https://beteyah.com/)
- [Vitilla — Protoball](https://protoball.org/Vitilla)
