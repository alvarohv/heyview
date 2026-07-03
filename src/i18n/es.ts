// Spanish copy (neutral Latin American / es-419). Claude-drafted first pass —
// needs a human review before treating as final marketing/legal copy.
import type en from './en';

const es = {
  common: {
    bookACall: 'Agenda una llamada',
    bookDiscoveryCall: 'Agenda una llamada de diagnóstico',
    defaultTitle: 'HeyView — Sistemas de diseño e IA para operaciones complejas',
    description:
      'Diseñamos los sistemas y experiencias que hacen tu negocio más ágil, rápido y fácil de escalar. Automatización, diseño e IA para negocios que operan con procesos complejos.',
    tagline: 'Claridad para sistemas complejos.',
    whatYouGet: 'Lo que obtienes',
  },
  nav: {
    services: 'Servicios',
    work: 'Trabajo',
    about: 'Nosotros',
    contact: 'Contacto',
  },
  footer: {
    tagline: 'Automatización, diseño e IA para operaciones complejas.',
    statement: 'Construido para operaciones que exigen más.',
    nav: [
      { label: 'Trabajo', href: '/work', localized: true },
      { label: 'Proceso', href: '/#process', localized: true },
      { label: 'Contacto', href: '/#contact', localized: true },
      { label: 'Política de Privacidad', href: '/privacy-policy', localized: false },
    ],
  },
  hero: {
    eyebrow: 'IA · Automatización · Diseño',
    headline: ['Sistemas de diseño e IA', 'para negocios que operan', 'con procesos complejos.'],
    subhead:
      'Diseñamos los sistemas y experiencias que hacen tu negocio más ágil, rápido y fácil de escalar.',
    cta: 'Ve nuestro trabajo →',
    pillars: ['Sistemas que funcionan', 'Diseño humano', 'Claridad que transforma'],
  },
  whatWeDo: {
    headline:
      'La mayoría de los sistemas están hechos para impresionar en una demo. Los nuestros están hechos para funcionar un martes cualquiera.',
    services: [
      {
        number: '01',
        title: 'Automatización de documentos y procesos',
        body: 'Si un documento que rige tu negocio requiere de tres personas y dos días, eso no es un proceso. Es un problema con rutina. Automatizamos los flujos manuales que frenan un negocio en silencio.',
      },
      {
        number: '02',
        title: 'Comunicación con clientes y asistentes de IA',
        body: 'Tus clientes escriben a las 9 PM por WhatsApp, Instagram y correo — y le compran a quien responda primero. Construimos asistentes de IA que responden al instante, agendan la cita y recuperan a los que se quedaron sin respuesta.',
      },
      {
        number: '03',
        title: 'Dashboards de operaciones',
        body: 'Los reportes te dicen qué pasó. Nosotros construimos dashboards que te dicen qué hacer después — pensados para quien toma la decisión, no para quien exporta el CSV.',
      },
      {
        number: '04',
        title: 'Sistemas e integraciones a medida',
        body: 'No vendemos plataformas ni te haremos reemplazar nada. Construimos la capa que conecta el software que ya pagas para que funcione como un solo sistema.',
      },
    ],
    seeAll: 'Ver todos los servicios →',
  },
  process: {
    eyebrow: 'Nuestro proceso',
    headline: 'Cuatro etapas. Sin sorpresas.',
    steps: [
      {
        number: '01',
        title: 'Descubrimiento',
        body: 'Mapeamos cómo funciona el trabajo en realidad, no cómo dice el organigrama. Espera preguntas incómodas.',
      },
      {
        number: '02',
        title: 'Estrategia',
        body: 'Recibes un plan por escrito: qué vamos a construir, qué reemplaza y una cotización fija. Conoces el costo total antes de escribir una sola línea de código.',
      },
      {
        number: '03',
        title: 'Ejecución',
        body: 'Lo construimos. Ves avances cada semana, en el sistema real, no en diapositivas.',
      },
      {
        number: '04',
        title: 'Entrega',
        body: 'Todo queda en tus manos: documentado, transferido, explicado. Si hicimos bien nuestro trabajo, no nos necesitas después.',
      },
    ],
  },
  about: {
    headline: 'Construido por ingenieros y diseñadores en busca de claridad.',
    intro:
      'HeyView fue fundada en Costa Rica por Alvaro Hernandez y Sinaí Alfaro. 22 años construyendo sistemas para hospitales, multinacionales y operaciones empresariales. Ahora aplicamos ese mismo rigor a negocios que lo merecen — sin el cronograma de 18 meses.',
    founders: [
      {
        name: 'Alvaro Hernandez',
        role: 'Arquitecto de IA y Sistemas',
        bio: '22 años en software empresarial e IA — diseñando sistemas para salud, finanzas y manufactura, incluyendo Johnson & Johnson.',
      },
      {
        name: 'Sinaí Alfaro',
        role: 'Diseño y Producto',
        bio: 'Diseñadora enfocada en la claridad y en productos centrados en las personas. Lidera UI/UX y marca.',
      },
    ],
  },
  whoWeWorkWith: {
    eyebrow: 'Con quién trabajamos',
    headline: 'Construido para operaciones, afinado por industria.',
    ctaLabel: 'Cuéntanos sobre tu operación →',
    verticals: [
      {
        label: 'Consultorios especializados',
        description:
          'Agendamiento, recuperación de inasistencias y un dashboard de consultorio para clínicas en crecimiento.',
        href: '/health',
        localized: true,
      },
      {
        label: 'Finanzas y operaciones',
        description: 'Cierre contable, reportes y conciliación reconstruidos para tomar días, no semanas.',
        href: '#contact',
        localized: true,
      },
      {
        label: 'Tu industria',
        description: 'Los sistemas son reutilizables. Cuéntanos tu operación.',
        href: '#contact',
        localized: true,
      },
    ],
  },
  contactCTA: {
    eyebrow: 'Trabajemos juntos',
    headline: 'Tu empresa merece sistemas que realmente funcionen.',
    subhead: 'Tomamos entre 2 y 3 clientes nuevos por trimestre. Si el encaje es correcto, avanzamos rápido.',
    stats: [
      { value: 22, suffix: '', label: 'Años en sistemas empresariales' },
      { value: 4, suffix: '', label: 'Etapas. Cotización fija.' },
      { value: 100, suffix: '%', label: 'EE. UU. y Costa Rica · con base en CR' },
    ],
  },
  caseStudies: {
    eyebrow: 'Trabajo Seleccionado',
    headline: 'El trabajo.',
    viewAll: 'Ver todo el trabajo',
    viewProject: 'Ver proyecto →',
    requestCaseStudy: 'Solicitar caso de estudio →',
  },
  workPage: {
    title: 'Trabajo — HeyView',
    description: 'Trabajo seleccionado de HeyView — diseño, automatización y sistemas de IA para operaciones complejas.',
    eyebrow: 'Trabajo Seleccionado',
    headline: 'El trabajo.',
    subhead: 'Un registro creciente de sistemas y diseño construidos para negocios que van en serio.',
    filters: ['Todos', 'Web', 'Marca', 'Sistemas de IA', 'Dashboard'],
    featuredLabel: 'Proyecto Destacado',
    viewCaseStudy: 'Ver caso de estudio',
    requestCaseStudy: 'Solicitar caso de estudio',
    projectPreview: '[Vista previa del proyecto]',
    ctaHeadline: '¿Listo para construir tu próximo producto insignia?',
    ctaButton: 'Iniciar una conversación',
  },
  workDetail: {
    allWork: 'Todo el trabajo',
    client: 'Cliente',
    services: 'Servicios',
    theContext: 'El Contexto',
    theSolution: 'La Solución',
    resultsHeadline: 'Los Resultados',
    resultsDefaultIntro: 'Resultados medibles de la colaboración.',
    inTheirWords: 'En Sus Palabras',
    previousProject: 'Proyecto Anterior',
    nextProject: 'Siguiente Proyecto',
  },
  servicesPage: {
    title: 'Servicios — HeyView',
    description:
      'HeyView construye automatización con IA, dashboards de operaciones e integraciones de sistemas para consultorios especializados y equipos de operaciones. Alcance fijo, manos senior, entrega en cuatro semanas.',
    hero: {
      eyebrow: 'Servicios',
      h1: 'Sistemas que funcionan un martes cualquiera.',
      body: 'La mayoría de los sistemas están hechos para impresionar en una demo. Nosotros construimos el tipo que sigue funcionando cuando el fundador está de vacaciones, el nuevo empleado empezó el lunes, y es un martes cualquiera. Automatización, herramientas internas e IA — construidos sobre el software que ya usas.',
      indexLabel: 'Cuatro capacidades',
      indexItems: [
        { num: '01', name: 'Automatización' },
        { num: '02', name: 'Asistentes de IA' },
        { num: '03', name: 'Dashboards' },
        { num: '04', name: 'Integraciones' },
      ],
    },
    services: [
      {
        num: '01',
        tag: 'Automatización de documentos',
        h2: 'Tu negocio corre sobre un proceso que no debería existir.',
        body: 'Si un documento le toma a tres personas dos días producir cada semana, eso no es un proceso. Es un problema con rutina. Automatizamos la rutina: generación de documentos, enrutamiento de aprobaciones, movimiento de datos entre sistemas, la misma firma por cuarta vez.',
        whatYouGet: [
          'Menos errores cada semana. Tiempo que no depende de quién esté en la oficina.',
          'Un flujo automatizado para cualquier documento que tu negocio genere — sin captura manual, sin confusión de versiones y con un rastro de auditoría claro.',
        ],
      },
      {
        num: '02',
        tag: 'Comunicación con clientes y asistentes de IA',
        h2: 'Cada mensaje sin responder es ingreso que se va por la puerta.',
        body: 'Tus clientes escriben a las 9 PM por WhatsApp, Instagram y correo — y le compran a quien responda primero. Construimos asistentes de IA que responden al instante, agendan desde donde sea que respondan, dan seguimiento y recuperan a los que se quedaron callados. Con una persona tomando el control en el momento que importa.',
        whatYouGet: [
          'Respuesta más rápida que cualquier recepción. Cero leads y citas perdidas. Ingreso recuperado que puedes contar de verdad.',
          'Asistente de IA para citas — confirmadas y recordadas. Bandeja de IA para WhatsApp, Instagram y correo — calificada y enrutada.',
        ],
      },
      {
        num: '03',
        tag: 'Dashboards de operaciones',
        h2: 'Deja de manejar el negocio desde una hoja de cálculo que solo una persona entiende.',
        body: 'Los reportes te dicen qué pasó. Nosotros construimos dashboards que te dicen qué hacer después — pensados para quien toma la decisión, no para quien arma el reporte. Una sola versión de la verdad.',
        whatYouGet: [
          'Una pantalla que tu equipo realmente abre cada mañana. Números que puedes defender.',
          'Diseñamos los reportes alrededor de las decisiones que tomas. Construimos la infraestructura que mantiene los datos limpios — consultables, consistentes, defendibles.',
        ],
      },
      {
        num: '04',
        tag: 'Integraciones',
        h2: 'Ya pagas por buen software. Solo que no se habla entre sí.',
        body: 'No vendemos plataformas ni te haremos reemplazar nada. Pasamos la primera semana conectando tu sistema de citas con tu facturación, tu CRM con tus hojas de cálculo, tus formularios con el sistema que realmente necesita esos datos. Y cuando el problema es fuera de lo común — conocimiento interno consultable, IA sobre años de documentos — aquí también lo construimos.',
        whatYouGet: ['El stack que ya tienes, funcionando como un solo sistema.'],
      },
    ],
    studio: {
      eyebrow: 'El estudio',
      h2: 'Diseñado, no solo construido.',
      body: 'La mitad de este estudio es una diseñadora de producto senior. Cada dashboard, herramienta interna e IA que entregamos cumple el mismo estándar de diseño que un sitio de marca público y querido — porque nadie odia usar el software que la gente realmente usa. Eso no es un acabado extra. Es la razón por la que los sistemas se quedan.',
      linkText: 'Nuestro trabajo',
      statKicker: 'Trayectoria',
      statUnit: 'años construyendo sistemas',
      statDomains: ['Hospitales y salud', 'Multinacionales globales', 'Operaciones empresariales'],
    },
    processSection: {
      eyebrow: 'Cómo trabajamos',
      h2: 'Cuatro etapas. Sin sorpresas.',
    },
    pricing: {
      eyebrow: 'El modelo',
      h2: ['Alcance fijo.', 'Cotización fija.', 'Manos senior.'],
      cards: [
        {
          label: 'Sin cobro por hora',
          body: 'Sin cobro por hora, nunca — compras un resultado, no nuestro tiempo. Los cambios de alcance reciben una nueva cotización. Por escrito, antes de mover nada.',
        },
        {
          label: 'Equipo pequeño, sin capas',
          body: 'Tomamos entre dos y tres clientes nuevos por trimestre, y los fundadores hacen el trabajo: sin gerentes de cuenta, sin equipo junior aprendiendo en tu proyecto.',
        },
      ],
    },
    fit: {
      eyebrow: 'El encaje',
      h2: 'Un buen encaje, con honestidad.',
      yes: {
        label: 'Esto es para ti si',
        items: [
          'Tu negocio corre sobre operaciones reales — citas, documentos, aprobaciones, inventario, facturación.',
          'Te ahogas en software que no genera ingresos.',
          'Algo creció rápido y los procesos no alcanzaron a seguirle el paso.',
          'Puedes tomar esta decisión sin un comité.',
        ],
      },
      no: {
        label: 'Esto no es para ti si',
        items: [
          'Buscas la opción más barata.',
          'Quieres un montón de presentaciones en vez de un sistema funcionando.',
          'Tu proceso de compras es más largo que nuestra entrega.',
        ],
      },
    },
    vertical: {
      eyebrow: 'Por industria',
      h2: 'Dónde pega más fuerte.',
      body: 'Los sistemas son los mismos. El dolor es específico. Profundizamos donde conocemos la industria desde adentro.',
      cards: [
        {
          label: 'Salud',
          body: 'Consultorios especializados: agendamiento, recuperación y un dashboard que tu recepción realmente va a usar.',
          href: '/health',
          localized: true,
        },
        { label: 'Más industrias', body: 'Próximamente.' },
      ],
    },
    ctaSection: {
      eyebrow: 'Hablemos',
      h2: 'Treinta minutos sobre tu operación. No es una llamada de ventas.',
      body: 'Cuéntanos por dónde se fuga el tiempo — el reporte que nadie quiere armar, la hoja de cálculo que todos temen, las inasistencias, la doble captura. Te diremos qué automatizaríamos primero y qué no tocaríamos.',
    },
  },
  healthPage: {
    title: 'Operaciones y sistemas de IA para consultorios especializados — HeyView',
    description:
      'Deja de perder ingreso por inasistencias y trabajo administrativo manual. Agendamiento que responde a las 9 PM, seguimiento que no se le olvida a nadie, y un dashboard que tu recepción realmente usa.',
    hero: {
      eyebrow: 'Para consultorios especializados',
      h1: 'Deja de perder ingreso por inasistencias y trabajo administrativo manual.',
      body: 'Tu agenda es tu inventario. Cada silla vacía es una venta que no puedes hacer dos veces — y la mayoría eran evitables. Construimos el sistema de operaciones que las llena: agendamiento que responde a las 9 PM, seguimiento que no se le olvida a nadie, y un dashboard que tu recepción realmente usa.',
      cta: 'Agenda una llamada de diagnóstico',
    },
    pain: {
      h2: 'No abriste un consultorio para perseguir confirmaciones.',
      body: 'Un paciente agenda, y luego desaparece. La recepción llama dos veces, deja un mensaje de voz, sigue adelante — hay otras cuarenta cosas que hacer. El espacio queda vacío, el costo fijo no. Multiplica eso por cada semana, súmale los formularios de admisión capturados dos veces y los mensajes de "¿puedo reagendar?" que llegan de noche por WhatsApp, y obtienes el número real: la mayoría de los consultorios pierden más ingreso por fricción administrativa que por competencia.',
      points: [
        'Una inasistencia no es un inconveniente. Es inventario que caducó.',
        'Los pacientes agendan con quien responda primero — incluso a las 9 PM.',
        'Las horas de tu equipo se van en perseguir, no en atender.',
      ],
    },
    system: {
      h2: 'Un solo sistema para todo el recorrido del paciente.',
      body: 'Construido sobre el software de agendamiento y las herramientas que ya usas — nada se reemplaza, tu equipo no tiene que reaprender nada.',
      pillars: [
        {
          title: 'Agendamiento que nunca duerme',
          body: 'Agendamiento conversacional por WhatsApp y SMS, en tu tono. Responde al instante, encuentra el espacio correcto con el profesional correcto, y prellena la admisión con datos de visitas anteriores — así el paciente llega con el papeleo ya listo.',
        },
        {
          title: 'Recuperación de inasistencias',
          body: 'El sistema marca las citas con más probabilidad de fallar y arranca la conversación antes de que eso pase: confirmación 24 horas antes, otra vez 4 horas antes, reagendamiento instantáneo cuando alguien cancela, y mensajes de recuperación para pacientes que desaparecieron en silencio.',
        },
        {
          title: 'Un dashboard que tu recepción abre cada mañana',
          body: 'La agenda de hoy, quién confirmó, quién está en riesgo, qué hacer después. El dueño tiene la vista semanal: ocupación, ingreso recuperado, de dónde vienen los pacientes. Una pantalla, una sola versión de la verdad.',
        },
      ],
      addOnsLabel: 'Extras cuando los necesites:',
      addOnsBody: 'automatización de reseñas, soporte multi-sede, recepción telefónica con IA, integraciones a medida.',
    },
    pedigree: {
      h2: 'Construimos para el sector salud desde antes de que la IA fuera un discurso de venta.',
      body: 'Nueve años construyendo sistemas para hospitales y marcas de salud. Veintidós años diseñando operaciones para multinacionales — incluyendo un sistema de planificación de capacidad para una manufacturera global de dispositivos médicos y un cierre contable que pasó de 80 horas al mes a seis. No somos un revendedor de chatbots descubriendo medicina este trimestre. Sabemos por qué tu software de citas, tus expedientes y tu recepción no se hablan entre sí — y cómo arreglarlo sin reemplazar ninguno.',
      linkText: 'Ver el trabajo →',
    },
    fit: {
      h2: 'Construido para consultorios que dependen de las citas.',
      specialtiesLabel: 'Clínicas dentales, consultorios de estética y dermatología, ortopedia, fisioterapia, oftalmología, veterinaria.',
      intro: 'Si tu semana vive o muere por la agenda — y tienes un equipo manejándola — esto es para ti.',
      goodLabel: 'Un buen encaje',
      good: [
        '2 a 8 profesionales. Ya usan agendamiento en línea o software de consultorio moderno.',
        'En crecimiento — nuevas sillas, nuevos consultorios, quizás una segunda sede — y la parte administrativa no creció al mismo ritmo.',
      ],
      notFitLabel: 'No es un encaje',
      notFit: [
        'Consultorio individual sin personal administrativo.',
        'Cadenas de private equity con comités de compras.',
        'Cualquiera que busque la opción más barata.',
      ],
    },
    process: {
      eyebrow: 'Cómo trabajamos',
      h2: 'Cuatro etapas. Sin sorpresas.',
      body: 'Alcance fijo, cotización fija, fundadores senior haciendo el trabajo. Sin cobro por hora. Conocerás el costo total antes de construir.',
      stages: [
        {
          number: '01',
          title: 'Descubrimiento',
          body: 'Mapeamos cómo se mueven realmente los pacientes por tu consultorio — desde el primer mensaje hasta el seguimiento — antes de tocar nada.',
        },
        {
          number: '02',
          title: 'Estrategia',
          body: 'Recibes un plan por escrito: qué vamos a construir, qué reemplaza y una cotización fija. Conoces el costo total antes de construir una sola línea de código.',
        },
        {
          number: '03',
          title: 'Ejecución',
          body: 'Lo construimos. Ves avances cada semana, en el sistema real, no en diapositivas.',
        },
        {
          number: '04',
          title: 'Entrega',
          body: 'Todo queda en tus manos: documentado, transferido, explicado. Si hicimos bien nuestro trabajo, no nos necesitas después. La mayoría de los clientes nos mantienen de todas formas, para evolucionar el sistema.',
        },
      ],
    },
    ctaSection: {
      h2: 'Treinta minutos sobre tu consultorio. No es una llamada de ventas.',
      body: 'Cuéntanos cómo funciona el agendamiento hoy, dónde duelen las inasistencias, qué le teme la recepción. Te diremos qué automatizaríamos primero — y qué no tocaríamos. Te vas con una idea más clara de tu propia operación, trabajemos juntos o no.',
      button: 'Agenda una llamada de diagnóstico',
      note: 'Inglés o español. No necesitas prepararte.',
    },
  },
} satisfies typeof en;

export default es;
