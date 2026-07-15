---
lang: es
title: Automatización de planificación de oferta/demanda
tag: "DISPOSITIVOS MÉDICOS   AUTOMATIZACIÓN CON OFFICE SCRIPTS"
summary: El equipo de planificación de suministro de una manufacturera global de dispositivos médicos cruzaba a mano cinco fuentes de Excel cada semana para seguir ~1,800 componentes contra un horizonte de demanda de 52 semanas. Lo reemplazamos con una automatización en Office Scripts que explota la demanda por BOM y refresca todo el panorama de oferta/demanda en unos 25 segundos.
cover: /work/supply-demand-planning-automation/diagram-before-after.svg
client: "Confidencial (manufacturera global de dispositivos médicos)"
industry: Dispositivos Médicos · Planificación de Cadena de Suministro
services: Automatización de Procesos, Diseño de Sistemas en Excel
period: Nov 2025 – May 2026
team: Desarrollador de Automatización y Herramientas
tools: Office Scripts (TypeScript), Excel para Microsoft 365, SharePoint Online
year: 2026
order: 6
featured: false
context:
  body: >
    Un equipo de planificación de suministro dentro de una manufacturera
    global de dispositivos médicos necesitaba una vista semanal, a nivel de
    componente, de oferta versus demanda a lo largo de un horizonte de 52
    semanas, para dos sitios de manufactura y cerca de 1,800 componentes
    únicos. El proceso existente requería que los planificadores cruzaran a
    mano cinco fuentes de datos distintas — un pronóstico de demanda, una
    Lista de Materiales (BOM), un Material Master, una fotografía de
    inventario y órdenes de compra abiertas — sin explosión automática de
    demanda de producto terminado a demanda de componente, sin vista
    consolidada, y sin señal de qué componentes estaban en riesgo de
    quedar en negativo. El equipo trabajaba enteramente dentro de Excel y
    Microsoft 365; no había infraestructura nueva sobre la mesa, así que la
    solución tenía que vivir dentro del mismo workbook, como un Office
    Script.
solution:
  intro: >
    Diseñamos y construimos dos Office Scripts — uno por sitio de
    manufactura, con arquitectura idéntica — que reemplazan todo el proceso
    de ensamblaje manual de principio a fin.
  features:
    - title: "Explosión de demanda por BOM en JavaScript"
      body: >
        El script lee la demanda de producto terminado desde el Demand
        Tracker, la multiplica por la cantidad de BOM de cada componente
        padre, y agrega la demanda a nivel de componente a través de cada
        producto terminado — cubriendo cerca de 1,800 componentes por
        sitio.
    - title: "Vencer el timeout de Office Scripts"
      body: >
        Escribir fórmulas para 1.1 millones de celdas (1,800 componentes ×
        12 filas × 52 semanas) dispara el timeout de 5 minutos de Office
        Scripts sin importar el tamaño del lote. La solución fue
        precalcular cada valor en JavaScript y escribirlo en llamadas por
        lotes — cerca de 10 veces más rápido, porque Excel se salta por
        completo el parseo de fórmulas.
    - title: "Proyección continua de 52 semanas"
      body: >
        Una estructura de 12 filas de indicadores por componente —
        inventario disponible por bucket, órdenes de compra abiertas,
        ajustes de suministro, oferta y demanda total, inventario final
        proyectado en unidades y dólares, costo de flete, y semanas de
        cobertura — calculada como una proyección continua, donde el saldo
        de cierre de cada semana se convierte en el saldo de apertura de
        la siguiente.
    - title: "Un solo formato condicional en vez de 1,800"
      body: >
        Un único formato condicional basado en fórmula, aplicado a todo el
        rango de datos semanales, resalta en rojo cada celda con
        inventario final proyectado negativo, sin registrar una regla por
        componente.
    - title: "Resistente a cambios en los datos fuente"
      body: >
        La detección flexible de columnas en el Material Master maneja
        tanto exportaciones directas como exportaciones de listas de
        SharePoint, que renombran columnas en silencio (SKU a Title, Cost
        a Material Cost) — un desajuste que antes hacía que los datos del
        Material Master se perdieran del modelo sin ningún error visible.
results:
  intro: >
    El ensamblaje manual semanal desapareció. Los planificadores corren un
    script y obtienen el panorama completo de oferta/demanda a nivel de
    componente en unos 25 segundos, con los componentes en riesgo ya
    marcados en rojo.
stats:
  - { value: "~1,800", label: "Componentes rastreados" }
  - { value: "~25s", label: "Tiempo de refresh completo" }
  - { value: "1.1M", label: "Valores de celda calculados" }
  - { value: "2", label: "Sitios de manufactura" }
gallery:
  - src: /work/supply-demand-planning-automation/diagram-architecture.svg
    caption: "Cinco pestañas fuente alimentan un Office Script, que explota la demanda por BOM y escribe una sola tabla SDA Details."
  - src: /work/supply-demand-planning-automation/sda-details-output-mockup.svg
    caption: "Salida de SDA Details, ilustrativa: 12 indicadores por componente, inventario final proyectado negativo resaltado automáticamente en rojo. Los datos mostrados son ficticios, para uso de portafolio, no cifras reales del cliente."
---

## La situación

Un equipo de planificación de suministro en una manufacturera global de dispositivos médicos necesitaba una vista semanal, a nivel de componente, de oferta versus demanda a lo largo de un horizonte de 52 semanas, para dos sitios de manufactura y cerca de 1,800 componentes únicos. Llegar ahí significaba cruzar a mano cinco fuentes de datos distintas — un pronóstico de demanda, una Lista de Materiales, un Material Master, una fotografía de inventario y órdenes de compra abiertas — sin explosión automática de demanda de producto terminado a demanda de componente, sin vista consolidada, y sin señal de qué componentes estaban en riesgo de quedar en negativo.

La restricción era estricta: el equipo trabajaba enteramente dentro de Excel y Microsoft 365, sin infraestructura nueva sobre la mesa. La solución tenía que vivir dentro del workbook que los planificadores ya usaban, como un Office Script.

## Lo que construimos

Diseñamos y construimos dos Office Scripts — uno por sitio de manufactura, con arquitectura idéntica y una sola constante de ubicación como diferencia — que reemplazan todo el proceso de ensamblaje manual. Cada script lee la demanda de producto terminado desde el Demand Tracker, la explota a demanda de componente usando las cantidades de la Lista de Materiales, y la agrega a través de cada producto terminado padre, cubriendo cerca de 1,800 componentes por sitio.

El problema de ingeniería central fue una escala que chocaba contra un límite de la plataforma: escribir fórmulas para el 1.1 millones de celdas resultantes (1,800 componentes × 12 indicadores × 52 semanas) dispara el timeout de 5 minutos de Office Scripts sin importar cómo se dividan los lotes. La solución fue arquitectónica — precalcular cada valor en JavaScript y escribir valores planos en vez de fórmulas, cerca de 10 veces más rápido porque Excel se salta por completo el parseo de fórmulas. Cada componente obtiene un bloque de 12 filas de indicadores (inventario disponible por bucket, órdenes de compra abiertas, ajustes de suministro, oferta y demanda total, inventario final proyectado en unidades y dólares, costo de flete, semanas de cobertura) calculado como una proyección continua, donde el saldo de cierre de cada semana se convierte en el saldo de apertura de la siguiente.

Un único formato condicional basado en fórmula, aplicado a todo el rango de datos semanales, resalta en rojo cada celda con inventario final proyectado negativo, en vez de registrar una regla por componente. Y como la hoja del Material Master llega desde dos rutas de exportación distintas que renombran columnas en silencio (SKU a Title, Cost a Material Cost), el script usa detección flexible de columnas en vez de encabezados fijos — un desajuste que antes hacía que los datos del Material Master se perdieran del modelo sin ningún error visible.

## El resultado

El ensamblaje manual semanal desapareció. Los planificadores corren un script por sitio y obtienen el panorama completo de oferta/demanda a nivel de componente en unos 25 segundos — cinco fuentes de datos consolidadas, demanda por BOM explotada, una proyección continua de 52 semanas calculada, y los componentes en riesgo ya marcados en rojo, sin cruces manuales ni acrobacias de hoja de cálculo.
