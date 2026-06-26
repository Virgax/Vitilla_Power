# Vitilla Power — Análisis de tecnología (cross-platform)

> **Objetivo:** un mismo juego corriendo en **iPhone/iPad y Android (teléfonos y tabletas)**
> con una sola base de código en lo posible.

Este documento compara opciones para el **prototipo** y la versión final, para decidir el
motor **antes** de empezar a codificar. No es una decisión cerrada todavía → se enlaza desde
[`OPEN_QUESTIONS.md`](OPEN_QUESTIONS.md).

## Requisitos derivados del GDD

- 2D (o 2.5D) con animación de vitilla rodando, barra de *timing*, escenarios de barrio.
- Multijugador / duelo pícher–bateador (local mismo dispositivo y/o online — por confirmar).
- Exportación a **iOS + Android** con buen rendimiento en gama media.
- Personalización (skins de palos, vitillas, escenarios, uniformes) → sistema de *assets*.
- Audio ambiental y frases.

## Opciones

### 1. Godot 4 (recomendado para empezar) ⭐

- **Pros:** gratis y open-source (sin regalías ni cuotas), excelente para **2D móvil**,
  exporta a Android e iOS desde un mismo proyecto, ligero, comunidad creciente, lenguaje
  GDScript fácil para prototipar rápido.
- **Contras:** ecosistema de *plugins* móviles (IAP, anuncios, login) menos maduro que Unity;
  build de iOS requiere igualmente una Mac + Xcode para firmar/publicar.
- **Ideal para:** prototipo rápido y MVP con presupuesto cero en licencias.

### 2. Unity

- **Pros:** estándar de la industria, soporte móvil muy maduro (IAP, ads, analytics,
  servicios), enorme cantidad de *assets* y tutoriales, exporta a iOS/Android.
- **Contras:** más pesado, curva de configuración mayor, términos de licencia/runtime fee han
  generado desconfianza; C#.
- **Ideal para:** si se busca monetización y servicios "llave en mano" desde el día uno.

### 3. Flutter + Flame

- **Pros:** Dart, un solo código para iOS/Android, bueno si el equipo ya conoce Flutter; Flame
  es un motor 2D ligero.
- **Contras:** menos orientado a juegos con física/animación intensa que Godot/Unity; menos
  herramientas de editor visual para escenas.
- **Ideal para:** equipos con base Flutter y juegos 2D relativamente simples.

### 4. Web (HTML5 Canvas / TypeScript) — solo prototipo

- **Pros:** prototipado **inmediato**, se prueba en cualquier navegador/móvil sin instalar,
  rapidísimo para validar la mecánica de *timing* y la sensación de la vitilla.
- **Contras:** no es la app final (rendimiento, tiendas, IAP); habría que reescribir o
  envolver (Capacitor) para publicar.
- **Ideal para:** **probar el *core loop* de bateo/timing esta misma semana** antes de
  comprometer un motor.

## Recomendación

| Fase | Recomendación |
|------|---------------|
| **Prototipo del *core loop*** | **Web (Canvas/TS)** para validar el *timing* de bateo/recogida en horas, o ir directo a **Godot** si queremos que el prototipo ya sea base del producto. |
| **MVP y producto** | **Godot 4** por costo cero y buen 2D móvil; revisar **Unity** si la monetización/servicios pesan más que la licencia. |

> ⚠️ **Nota sobre iOS:** independientemente del motor, **publicar en iPhone/iPad requiere una
> Mac con Xcode** y una cuenta de Apple Developer (USD ~99/año). Android requiere cuenta de
> Google Play (pago único ~USD 25). Conviene confirmar acceso a una Mac antes del primer build
> de iOS.

## Próximo paso

Decidir entre **(A)** prototipo web desechable para validar la mecánica, o **(B)** prototipo
directamente en Godot. Una vez elegido, empezamos el *core loop*: barra de *timing* + bateo +
vitilla que rueda/aplasta.
