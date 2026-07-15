---
title: "¿Hay que reemplazar el software para automatizarlo?"
description: "No — la mayoría de los problemas de integración no necesitan una plataforma nueva. Una sincronización bidireccional entre un sistema de laboratorio óptico y SAP Business One, construida sin tocar ninguna de las dos plataformas, muestra cómo se ve realmente 'una capa encima'."
pubDate: 2026-07-14
author: Alvaro Hernandez
tags: ['automatizacion', 'integracion', 'erp']
lang: es
---

No. El instinto de "simplemente reemplazar el sistema viejo" casi siempre
resulta más caro y más lento que la alternativa: construir una capa que
conecte lo que ya tienes. Antes de que existiera HeyView como estudio, dirigí
un proyecto que es un buen ejemplo de cómo se ve eso en la práctica.

## El problema: dos sistemas, cero conexión

TOPEX Labs, una manufacturera de lentes oftálmicos costarricense, operaba dos
sistemas en paralelo. **Lensware** manejaba todo del lado del laboratorio —
órdenes, prescripciones, inventario. **SAP Business One** manejaba el lado del
negocio — clientes, órdenes de venta, facturación. Ninguno de los dos sabía
que el otro existía.

El vacío se llenaba a mano. El personal retecleaba órdenes de Lensware en SAP.
Los registros de clientes vivían en ambos sistemas y había que mantenerlos
sincronizados manualmente. Los movimientos de inventario en la bodega nunca
llegaban de vuelta al sistema del laboratorio. El estado de facturación
generado en SAP no regresaba a quienes atendían preguntas sobre eso. Cada dato
que cruzaba la frontera entre los dos sistemas la cruzaba a mano, y cada
retecleo era una oportunidad para que los dos sistemas se desincronizaran.

La solución que suena obvia — reemplazar uno de los dos sistemas, o montar una
plataforma nueva que hable con ambos — también era la equivocada. Lensware era
el sistema de referencia del laboratorio para prescripciones y órdenes; SAP
era el ERP de la empresa. Los dos funcionaban bien. Ninguno necesitaba
cambiar.

## Qué significó "una capa encima" en este caso

La solución fueron cuatro servicios independientes en .NET, desplegados en los
propios servidores de la empresa, que se acoplaban a cada plataforma en los
términos que cada una ya ofrecía:

- **La integración nativa de Lensware es basada en archivos.** Lee y escribe
  archivos `.vca` (el estándar de la industria óptica) y CSV en una carpeta de
  red compartida. Así que en lugar de pedirle al sistema del laboratorio que
  cambiara, la integración escribía en esa carpeta en el formato que Lensware
  ya esperaba.
- **SAP Business One expone todo su modelo de objetos a través del DI API**,
  que permite acceso transaccional directo a los objetos de negocio de SAP.
  Cada escritura quedaba envuelta en una transacción con rollback ante
  cualquier falla — una orden de venta a medio escribir en un ERP es peor que
  no tener orden en absoluto.
- **Un servicio por flujo de datos** — clientes, inventario, facturas y
  órdenes corrían cada uno como su propio servicio en segundo plano. Un
  problema en la sincronización de inventario no podía tumbar el
  procesamiento de órdenes. Cada servicio se podía reiniciar, monitorear o
  redesplegar de forma independiente.

Ninguna plataforma nueva. Ninguna dependencia de nube que la empresa no
tuviera ya la capacidad de operar. Ningún cambio al núcleo de ninguno de los
dos sistemas.

## El detalle que generó confianza

La parte que más importó no fue el parseo de archivos ni las llamadas al DI
API — fue el ciclo de retroalimentación. Cuando llegaba una orden nueva desde
Lensware y la integración creaba la orden de venta correspondiente en SAP, SAP
devolvía un número de documento. Ese número se escribía de vuelta en un
archivo dentro de la carpeta de importación de Lensware, quedando estampado en
la orden original del laboratorio. A partir de ahí, ambos sistemas
referenciaban el mismo documento.

Ese ciclo es lo que convierte una integración en algo que el personal
realmente confía usar. Sin eso, terminas con dos registros que
*probablemente* son la misma orden — exactamente la ambigüedad que el
retecleo manual se suponía debía evitar desde el inicio.

## Qué resolvió

- Las órdenes creadas en Lensware aparecían automáticamente en SAP, con
  líneas de detalle y códigos de bodega ya llenos — sin captura manual para
  las órdenes del laboratorio.
- Los registros de clientes gestionados en SAP se sincronizaban de forma
  continua a Lensware — una sola fuente de verdad en vez de dos copias
  desalineándose con el tiempo.
- El estado de facturación generado en SAP regresaba al piso del
  laboratorio, para que el personal pudiera responder preguntas de
  facturación sin tener que preguntarle a contabilidad.
- Cada evento de sincronización y cada transacción en SAP quedaba
  registrado, dándole al equipo un rastro de auditoría que antes no tenía.

Nada de esto requirió que TOPEX comprara software nuevo ni migrara de un
sistema que ya les funcionaba.

## La conclusión

Antes de definir un proyecto como "reemplazar el sistema X", pregunta qué es
lo que X ya expone — un formato de archivo, una carpeta de exportación, un
API que la mayoría de software trae de fábrica pero que nadie ha usado
todavía. La mayoría del software de negocio tiene *alguna* superficie de
integración; el trabajo casi siempre está en encontrarla y construir sobre
ella con cuidado, no en arrancar la plataforma de raíz. Este es el mismo
principio detrás de cómo definimos el alcance del [trabajo de
automatización](/services) en HeyView hoy. Puedes ver más de ese enfoque en
el [trabajo](/work) que hemos entregado desde entonces.

*Este proyecto es anterior a HeyView — se entregó de forma independiente en
2023–2024, antes de que Sinaí y yo formalizáramos el estudio. TOPEX Labs
más adelante se convirtió en cliente de HeyView para un proyecto distinto, un
[diagnóstico de estrategia de AI](/work/topex-labs) sobre otra parte del
negocio.*
