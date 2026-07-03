---
lang: es
title: "KDF Connect: Plataforma de Campo"
tag: "SERVICIOS DE CAMPO   PLATAFORMA MÓVIL + WEB"
summary: Una empresa de servicios de campo llevaba las horas de sus cuadrillas en papel y las rutas de memoria. La reemplazamos con una app de iPad offline-first, un dashboard administrativo y una API REST para rastreo de rutas por GPS, marcaje por código QR y cierre semanal digital, todo sobre Azure.
cover: /work/kdf-connect/kdf-connect-cover.jpg
client: KDF
industry: Servicios de Campo · Gestión de Fuerza Laboral
services: Desarrollo Full-Stack, App Móvil, Arquitectura Cloud
period: "2021"
team: Líder Técnico, 2 Desarrolladores, 2 QA
tools: React Native, .NET Core, Azure, React
year: 2021
order: 5
featured: false
context:
  body: >
    KDF operaba cuadrillas de campo en múltiples sitios. Los supervisores
    llevaban las horas en hojas de tiempo de papel, el marcaje de entrada y
    salida de la cuadrilla era verbal, y la cobertura de rutas quedaba
    documentada después del hecho, cuando quedaba documentada. No había
    forma estructurada de capturar qué pasaba en el campo durante un turno:
    a dónde iban las cuadrillas, qué fotografiaban, o si las horas de la
    semana habían sido revisadas y aprobadas formalmente. El sistema tenía
    que funcionar en iPads en el campo, manejar la conectividad intermitente
    con gracia, y ser administrable por un equipo no técnico.
solution:
  intro: >
    Diseñamos un sistema de cuatro componentes (app móvil, dashboard
    administrativo, API REST y un sistema de diseño compartido) desplegado
    en Azure, construido alrededor de la restricción real del campo: una
    conectividad con la que no se puede contar.
  features:
    - title: "App de campo offline-first"
      body: >
        Las coordenadas GPS, fotos y comentarios se encolan localmente
        cuando el iPad no tiene conexión. Un hook de vaciado de cola los
        drena en orden de dependencia al reconectar, así el servidor
        siempre recibe datos consistentes y el supervisor nunca ve un
        vacío.
    - title: "Rastreo de rutas por GPS y fotos geolocalizadas"
      body: >
        Los supervisores usan una pantalla de rastreo en vivo con mapa a
        pantalla completa, el trazo GPS de la cuadrilla, y captura de fotos
        anclada a una coordenada. La distancia total de la ruta se calcula
        con la fórmula de Haversine sobre los puntos acumulados.
    - title: "Marcaje de entrada/salida por código QR"
      body: >
        La entrada y salida de cada integrante de la cuadrilla queda ligada
        a un escaneo de código de barras en vez de una confirmación verbal,
        creando un registro de asistencia con marca de tiempo por proyecto
        en lugar de una memoria en disputa.
    - title: "Visibilidad administrativa"
      body: >
        Un dashboard de 29 páginas le da al equipo de oficina una vista de
        hojas de tiempo con desglose de Regular / Tiempo Extra / Doble
        Tiempo, una galería de mapa con cada foto geolocalizada de cada
        ruta, y exportación a CSV/impresión, sin depender de que los
        supervisores entreguen papeleo.
results:
  intro: >
    Cuatro componentes de producción (app móvil, dashboard administrativo,
    API y sistema de diseño) entregados en un contrato de precio fijo, en
    producción para agosto de 2021. La cola offline aguantó las condiciones
    reales del campo desde el primer día.
stats:
  - { value: "4", label: "Componentes de producción: móvil, admin, API, diseño" }
  - { value: "28+", label: "Controladores de API REST, un solo sistema de registro" }
  - { value: "3", label: "Tipos de tiempo: Regular, Extra, Doble Tiempo" }
  - { value: "5", label: "Personas en el equipo, de propuesta a producción" }
gallery:
  - src: /work/kdf-connect/kdf-connect-architecture.svg
    caption: "Arquitectura del sistema: app móvil, dashboard administrativo, API y sistema de diseño sobre Azure."
  - src: /work/kdf-connect/kdf-connect-route-tracker-wireframes.png
    caption: Wireframes del Route Tracker, anotados. Cada decisión de layout e interacción defendida por escrito antes de escribir una sola línea de React Native.
  - src: /work/kdf-connect/kdf-connect-weekly-signoff-wireframes.png
    caption: Wireframes del Cierre Semanal, anotados. Diseñando el momento en que una semana de horas se vuelve un registro oficial y firmado.
  - src: /work/kdf-connect/kdf-connect-admin-dashboard.jpg
    caption: "Dashboard administrativo: hojas de tiempo, empleados, proyectos y trabajos de un vistazo."
  - src: /work/kdf-connect/kdf-connect-circuit-detail.jpg
    caption: "Detalle de circuito: repetición completa de la ruta con trazo GPS, cuadrilla y fotos geolocalizadas."
  - src: /work/kdf-connect/kdf-connect-weekly-signoff.png
    caption: "Cierre semanal: aprobación del supervisor con firma digital."
  - src: /work/kdf-connect/kdf-connect-new-employee.png
    caption: Alta de empleados con credencial QR generada automáticamente para marcaje en campo.
---

## La situación

KDF operaba cuadrillas de campo en múltiples sitios. Los supervisores llevaban las horas en hojas de tiempo de papel, el marcaje de entrada y salida de la cuadrilla era verbal, y la cobertura de rutas quedaba documentada después del hecho, cuando quedaba documentada. No había forma estructurada de capturar qué pasaba en el campo durante un turno: a dónde iban las cuadrillas, qué fotografiaban, o si las horas de la semana habían sido revisadas y aprobadas formalmente.

La restricción era estricta: construir para iPad primero, capaz de funcionar sin conexión, y administrable por un equipo no técnico, sin cambiar el flujo de trabajo existente más allá de pasar del papel a la tablet.

## Lo que construimos

Diseñamos un sistema de cuatro componentes (app móvil, dashboard web administrativo, API REST y un sistema de diseño compartido) desplegado en Azure con una sola capa de autenticación para todos los clientes. La decisión clave fue arquitectónica: Redux Persist más una cola offline para la realidad de conectividad del campo, y RTK Query como capa de datos para ambos clientes, de modo que la invalidación de caché, el refresco de tokens y los estados de carga se manejaran de forma consistente.

Antes de escribir una sola línea de React Native, las pantallas de Route Tracker y Cierre Semanal se diseñaron en wireframes y se defendió cada decisión: por qué el mapa ocupa dos tercios de la pantalla, por qué las acciones se anclan a la zona del pulgar, por qué se rechazó un bloqueo duro al enviar en favor del criterio del supervisor. Ese proceso está en la galería más abajo.

**Hoja de tiempo diaria.** Los supervisores ven los proyectos asignados, entran a un proyecto, y marcan entrada y salida de la cuadrilla con un escáner de código QR. Cada escaneo resuelve un empleado por ID y dispara una mutación de entrada o salida contra la API, con manejo en pantalla para casos como un empleado ya marcado.

**Rastreo de rutas.** Una pantalla de rastreo en vivo combina un mapa a pantalla completa con el trazo GPS actual de la cuadrilla, un panel lateral de fotos y comentarios capturados, y acciones para tomar una foto, agregar un comentario, o terminar la ruta. Cada foto se sube con su coordenada GPS adjunta y aparece de inmediato como marcador en el mapa. Terminar una ruta dispara un cálculo de distancia por Haversine sobre los puntos acumulados.

**Cierre semanal.** Al final de la semana, los supervisores revisan las horas por empleado contra cada proyecto, aprueban filas individuales, y envían un cierre final con una firma digital capturada que bloquea el registro del lado del servidor.

**Arquitectura offline-first.** Las coordenadas GPS, fotos y comentarios se encolan localmente cuando el dispositivo no tiene conexión. Al reconectar, un hook de vaciado de cola drena la cola en orden de dependencia: coordenadas, luego comentarios, luego imágenes, así el servidor siempre recibe datos en un estado consistente. Los marcadores aparecen de inmediato en el mapa desde el estado local; el supervisor nunca nota un vacío.

**Dashboard administrativo.** Una aplicación web de React de 29 páginas cubre todo el panorama operativo: un dashboard de hojas de tiempo con desglose de Regular / Tiempo Extra / Doble Tiempo y ajustes de viáticos, una galería de mapa que ubica cada foto geolocalizada de cada ruta, gestión de empleados y proyectos, y exportación de reportes a CSV/impresión.

**API de backend.** Una API REST de ASP.NET Core con más de 28 controladores y arquitectura por capas (Controllers → Core → Infrastructure), autenticación JWT con tokens de refresco, carga por lotes de coordenadas GPS para vaciados eficientes de la cola offline, y un sistema de campos personalizados: un esquema de 3 niveles que permite a los administradores registrar métricas de producción arbitrarias por trabajo y por empleado sin cambiar el esquema.

## El resultado

El sistema reemplazó las hojas de tiempo de papel con un registro digital que captura horas Regulares, Extra y Doble Tiempo por empleado y por proyecto, bloqueado semanalmente con la firma digital de un supervisor. El rastreo de rutas por GPS y las fotos geolocalizadas le dieron al equipo de oficina un registro permanente y basado en mapa de cada circuito recorrido, algo que antes solo existía como memoria y fotos compartidas informalmente.

Entregado como un contrato de precio fijo, en producción para agosto de 2021, con la cola offline aguantando las condiciones reales del campo desde el primer día.
