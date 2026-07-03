---
lang: es
title: Automatización de notificaciones a proveedores
tag: "DISPOSITIVOS MÉDICOS   AUTOMATIZACIÓN DE CADENA DE SUMINISTRO"
summary: El equipo de cadena de suministro de una manufacturera global de dispositivos médicos enviaba a mano cada semana correos a ~50 proveedores sobre órdenes de compra vencidas y próximas a vencer. Lo reemplazamos con un sistema de Power Automate de un clic, con señalización de urgencia integrada y rastro de auditoría.
cover: /work/supplier-notification-automation/flow-diagram.svg
client: "Confidencial — manufacturera global de dispositivos médicos"
industry: Dispositivos Médicos · Cadena de Suministro Global
services: Automatización de Procesos, Diseño de Sistemas
period: Ago – Sep 2025 (en curso)
team: Arquitecto de Automatización
tools: Power Automate, SharePoint, Outlook
year: 2025
order: 4
featured: false
context:
  body: >
    Un equipo de cadena de suministro dentro de una manufacturera global de
    dispositivos médicos mantenía informados a cerca de 50 proveedores sobre
    dos cosas cada semana: órdenes de compra que ya habían pasado su fecha de
    entrega, y órdenes por vencer en los próximos siete días. El proceso era
    completamente manual — un comprador copiando y pegando números de orden
    desde un reporte de órdenes abiertas hacia correos individuales, cerca de
    140 líneas abiertas por semana, con un tono inconsistente y sin rastro de
    auditoría de a quién se había notificado. El equipo había estandarizado
    en SharePoint Online para los datos de órdenes y Outlook para el
    contacto, así que cualquier solución tenía que vivir dentro de ese stack
    — sin infraestructura nueva, sin herramientas nuevas que aprender.
solution:
  intro: >
    Construimos tres flujos coordinados de Power Automate que convirtieron un
    ritual manual semanal en un sistema de un clic, con urgencia y
    responsabilidad diseñadas dentro del correo mismo.
  features:
    - title: "Tres flujos coordinados"
      body: >
        Un flujo masivo de "notificar a todos los proveedores", un flujo de
        un solo proveedor bajo demanda disparado directamente desde la lista
        de SharePoint, y una utilidad de reinicio que limpia la lista de
        órdenes antes de cada recarga semanal de datos.
    - title: "Correo de urgencia de dos niveles"
      body: >
        Cada proveedor recibe un correo consolidado con una tabla roja de
        vencidas y una tabla amarilla de próximas a vencer — el asunto y la
        bandera de importancia de Outlook cambian a URGENTE / Alta cuando
        existen elementos vencidos.
    - title: "Rastro de auditoría por diseño"
      body: >
        Las órdenes notificadas se marcan como Estado = "Notificada" dentro
        del mismo flujo, dándole al equipo un registro en la lista de a quién
        se ha contactado sin necesidad de una hoja de cálculo aparte.
results:
  intro: >
    El contacto semanal que antes le tomaba a un comprador una tarde de
    copiar y pegar ahora corre en un clic, con la bandeja de entrada misma
    priorizando.
stats:
  - { value: "50", label: "Proveedores notificados semanalmente" }
  - { value: "140", label: "Líneas de OC abiertas por ciclo" }
  - { value: "3", label: "Flujos de automatización coordinados" }
  - { value: "4", label: "Modos de falla manejados con elegancia" }
gallery:
  - src: /work/supplier-notification-automation/email-mockup.png
    caption: Ejemplo de correo de notificación a proveedor — tabla roja de vencidas, tabla amarilla de próximas a vencer, el asunto cambia a URGENTE cuando es necesario.
---

## La situación

Un equipo de cadena de suministro en una manufacturera global de dispositivos médicos mantenía a los proveedores al tanto de dos modos de falla: órdenes de compra ya vencidas, y órdenes por vencer en los próximos siete días. Hacerlo a mano significaba que un comprador copiaba números de orden desde un reporte de órdenes abiertas hacia correos individuales, cada semana, para cerca de 50 proveedores y unas 140 líneas abiertas — lento, inconsistente, y sin registro de a quién se había notificado realmente.

La restricción era estricta: el equipo había estandarizado en SharePoint Online para los datos de órdenes y Outlook para el contacto, así que la solución tenía que vivir dentro de Power Platform, enviarse desde el buzón propio del equipo, y degradarse con elegancia cuando los registros de proveedores estuvieran incompletos. Infraestructura nueva no era una opción.

## Lo que construimos

Diseñamos y construimos tres flujos en la nube de Power Automate que operan como un pequeño sistema: un flujo masivo de "notificar a todos los proveedores", un flujo de un solo proveedor bajo demanda disparado desde la interfaz de la lista de SharePoint, y una utilidad de reinicio que limpia la lista de órdenes antes de cada recarga semanal de datos.

La columna vertebral de SharePoint son dos listas operativas — una lista de órdenes y una base de datos de proveedores — unidas por número de proveedor, más una lista de registro para la ruta bajo demanda. Cada acción del flujo se mapea al esquema de campos subyacente para que el equipo pueda extenderlo sin romper las uniones.

Cada correo de notificación es un mensaje HTML de dos tablas generado en línea por el flujo: una tabla con tema rojo de "vencidas" y una tabla con tema amarillo de "vencen en 7 días", cada una renderizada condicionalmente, con el asunto y la bandera de importancia de Outlook cambiando a URGENTE / Alta cuando existe cualquier fila vencida.

También construimos degradación elegante a través de cuatro modos de falla — proveedores sin correo, proveedores sin órdenes coincidentes tras el filtrado, fallas de envío y fallas de lectura — cada uno enrutado a su propia rama de registro o notificación al administrador en lugar de tumbar el flujo a mitad de ciclo. Las órdenes notificadas se marcan de vuelta como Estado = "Notificada" dentro del mismo flujo, dándole al equipo un rastro de auditoría en la lista sin una hoja de cálculo de seguimiento aparte.

## El resultado

Lo que antes era la tarde de un viernes de copiar y pegar para un comprador ahora corre en un clic. La señal de urgencia de dos niveles está integrada en el correo mismo, así que las bandejas de entrada de los proveedores se auto-priorizan sin que el comprador escriba lenguaje por correo. El campo de estado funciona además como el registro de auditoría. El sistema ha estado corriendo en producción desde que se lanzó, con solo mantenimiento rutinario de conexión.
