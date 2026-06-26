# Vitilla Power — Decisiones pendientes

Preguntas sin cerrar en la reunión inicial. Resolverlas desbloquea el diseño y el prototipo.

## 1. ⚠️ Balance pícher ↔ bateador

**Problema:** no se definió cómo interactúan los **poderes del pícher** (p. ej. dividir el
rango de bateo, vitilla flotadora/freeze/aplanar) con las **habilidades del bateador** para
mantener el equilibrio. ¿Cada poder de pícher tiene un contra-poder de bateador? ¿El bateador
puede "leer" el poder antes de batear?

**Por decidir:** tabla de poderes y sus contrapartidas; cómo se comunica visualmente el poder
entrante; reglas de activación simétricas o no.

## 2. ⚠️ Derechos de autor (frases y sonidos)

**Problema:** se quiere usar **frases célebres** y sonidos de barrio, pero en la reunión se
advirtió que algunas están "satanizadas" / con problemas de derechos.

**Por decidir:** usar frases **originales** o con **licencia/permiso** explícito; lista blanca
de audios; eventual acuerdo con creadores locales.

## 3. ⚠️ Modelo de monetización

**Problema:** no se discutió en la reunión.

**Opciones a evaluar:** gratis con anuncios, de pago único, *free-to-play* con compras in-app
(skins de palos/vitillas/escenarios), *battle pass*, o combinación. Impacta la elección de
motor/servicios (ver TECH_STACK).

## 4. ⚠️ Sincronización del duelo en tiempo real

**Problema:** la mecánica "yo picheo / tú bateas" implica que ambos jugadores actúan en sus
pantallas. Falta definir si es **local** (mismo dispositivo, por turnos), **online en tiempo
real**, o **asíncrono**.

**Por decidir:** modo de conectividad del MVP; cómo se resuelve la ventana de *timing* entre
pícher y bateador.

## 5. ⚠️ Contenido del MVP

**Por decidir:** lista final y priorizada de:
- Palos (El Diablo, escoba, pala, pala con collón…) y sus poderes.
- Tipos de vitilla.
- Esquinas/barrios (Cristo Rey, Los Ríos, San Carlos, Palomino…).

## 6. ⚠️ Enfoque del prototipo

**Por decidir:** prototipo **web desechable** para validar el *core loop* rápido, o
prototipo directamente en **Godot** como base del producto. Ver [`TECH_STACK.md`](TECH_STACK.md).
