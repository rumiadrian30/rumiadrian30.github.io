// ============================================================================
// CHATBOT INTELIGENTE SOBRE LIONEL MESSI
// Aplicación completa de metodología CRISP-DM y PLN Avanzado
// ============================================================================

const { useState, useRef, useEffect, useMemo } = React;

// ============================================================================
// FASE 1: COMPRENSIÓN DEL NEGOCIO (Business Understanding)
// ============================================================================
/*
OBJETIVO: Crear un asistente virtual especializado en Lionel Messi que:
- Responda preguntas específicas con alta precisión
- Utilice procesamiento de lenguaje natural avanzado
- Clasifique intenciones con algoritmos de similitud
- Proporcione respuestas contextuales y personalizadas
- Aprenda de las interacciones (feedback)

MÉTRICAS DE ÉXITO:
- Precisión de clasificación de intenciones > 90%
- Tiempo de respuesta < 500ms
- Satisfacción del usuario mediante feedback
*/

// ============================================================================
// FASE 2: COMPRENSIÓN DE LOS DATOS (Data Understanding)
// ============================================================================

const MESSI_KNOWLEDGE_BASE = {
  // Entidad principal
  entidad: {
    nombre_completo: "Lionel Andrés Messi Cuccittini",
    apodos: ["Leo", "La Pulga", "El Mejor del Mundo", "D10S", "La Pulga Atómica"],
    nacionalidad: "Argentina",
    fecha_nacimiento: "1987-06-24",
    lugar_nacimiento: "Rosario, Santa Fe, Argentina",
    altura: 1.70,
    peso: 72,
    posicion: "Delantero / Mediapunta / Extremo Derecho",
    pierna_habil: "Izquierda",
    numero_dorsal_actual: 10
  },

  // Biografía extendida
  biografia: {
    infancia: {
      texto: `Lionel Messi nació el 24 de junio de 1987 en Rosario, Argentina, en el seno de una familia humilde. Su padre Jorge Messi trabajaba en una fábrica y su madre Celia Cuccittini era limpiadora. Desde los 5 años mostró un talento excepcional para el fútbol.`,
      eventos_clave: [
        "1987: Nace en Rosario, Argentina",
        "1992: Ingresa a las inferiores de Grandoli",
        "1994: Se une a Newell's Old Boys",
        "1995: Diagnosticado con déficit de hormona del crecimiento"
      ]
    },
    crisis_medica: {
      texto: `A los 11 años, Messi fue diagnosticado con un déficit de hormona del crecimiento que requería un tratamiento costoso de 1.500 dólares mensuales. River Plate y Newell's Old Boys no pudieron costear el tratamiento, pero el Barcelona apostó por él.`,
      tratamiento: "Inyecciones diarias de hormona del crecimiento durante varios años",
      costo_mensual: 1500,
      impacto: "Pasó de 1.33m a 1.70m en su adolescencia"
    },
    llegada_barcelona: {
      fecha: "2000-09-16",
      edad: 13,
      texto: `En septiembre de 2000, Carles Rexach, director deportivo del Barcelona, quedó tan impresionado con Messi en una prueba que firmó un precontrato en una servilleta de papel. El Barcelona se comprometió a pagar su tratamiento médico.`,
      anecdota_servilleta: "El primer contrato fue firmado en una servilleta del restaurante Pompeia el 14 de diciembre de 2000",
      personas_presentes: ["Carles Rexach", "Josep Maria Minguella", "Horacio Gaggioli"]
    },
    debut_profesional: {
      fecha: "2004-11-16",
      edad: 17,
      partido: "Barcelona vs Espanyol",
      entrenador: "Frank Rijkaard",
      asistencia: "Ronaldinho"
    }
  },

  // Carrera detallada por equipos
  carrera: {
    barcelona: {
      periodo: "2004-2021",
      años: 17,
      estadisticas: {
        partidos_oficiales: 778,
        goles: 672,
        asistencias: 305,
        promedio_gol: 0.86,
        hat_tricks: 48,
        poker: 8,
        manita: 1
      },
      titulos: {
        total: 35,
        champions_league: { cantidad: 4, años: [2006, 2009, 2011, 2015] },
        ligas: { cantidad: 10, años: [2005, 2006, 2009, 2010, 2011, 2013, 2015, 2016, 2018, 2019] },
        copas_del_rey: { cantidad: 7, años: [2009, 2012, 2015, 2016, 2017, 2018, 2021] },
        supercopas_españa: { cantidad: 8 },
        mundiales_clubes: { cantidad: 3, años: [2009, 2011, 2015] },
        supercopas_europa: { cantidad: 3, años: [2009, 2011, 2015] }
      },
      records: [
        "Máximo goleador histórico del FC Barcelona (672 goles)",
        "Máximo goleador en una temporada de La Liga (50 goles en 2011-12)",
        "Máximo goleador en una temporada del Barcelona (73 goles en 2011-12)",
        "Más goles en Clásicos contra Real Madrid (26 goles)",
        "Más hat-tricks en La Liga (36)",
        "Jugador con más temporadas consecutivas marcando en Champions League (16)"
      ],
      momentos_destacados: [
        {
          titulo: "Gol a Getafe (2007)",
          descripcion: "Copia del gol de Maradona a Inglaterra, recorriendo más de 60 metros",
          importancia: "Considerado uno de los mejores goles de la historia"
        },
        {
          titulo: "Final Champions 2009 vs Manchester United",
          descripcion: "Cabezazo que abrió el marcador en la victoria 2-0",
          importancia: "Su primer gol en una final de Champions League"
        },
        {
          titulo: "Gol 5-0 al Real Madrid (2010)",
          descripcion: "Asistencia de Xavi, controló y definió con clase",
          importancia: "Consolidación como mejor jugador del mundo"
        },
        {
          titulo: "4 goles al Arsenal (2010)",
          descripcion: "Poker en cuartos de final de Champions League",
          importancia: "Primera vez que anotaba 4 goles en Champions"
        },
        {
          titulo: "5 goles vs Bayer Leverkusen (2012)",
          descripcion: "Manita histórica en Champions League",
          importancia: "Récord de goles en un partido de fase de grupos"
        },
        {
          titulo: "Remontada ante PSG (2017)",
          descripcion: "Asistió en el 6-1, participó activamente en la hazaña",
          importancia: "Mayor remontada en Champions League (0-4 a 6-5 global)"
        }
      ],
      finales: {
        champions_ganadas: 4,
        champions_perdidas: 0,
        goles_finales_champions: 2
      }
    },
    
    psg: {
      periodo: "2021-2023",
      años: 2,
      razon_llegada: "No renovación con Barcelona por problemas económicos del club (Fair Play Financiero)",
      estadisticas: {
        partidos_oficiales: 75,
        goles: 32,
        asistencias: 35,
        promedio_gol: 0.43
      },
      titulos: {
        total: 2,
        ligue_1: { cantidad: 2, años: [2022, 2023] },
        supercopa_francia: { cantidad: 1, años: [2022] }
      },
      temporadas: {
        "2021-22": {
          partidos: 34,
          goles: 11,
          asistencias: 15,
          lesiones: "Problemas en rodilla"
        },
        "2022-23": {
          partidos: 41,
          goles: 21,
          asistencias: 20,
          nota: "Mejor temporada individual en PSG"
        }
      },
      companeros_destacados: ["Neymar", "Mbappé", "Ramos", "Verratti", "Marquinhos"],
      eliminacion_champions: "Octavos 2022 vs Real Madrid, Octavos 2023 vs Bayern Múnich",
      evaluacion: "Temporada exitosa en goles y asistencias, pero sin éxito en Champions League"
    },

    inter_miami: {
      periodo: "2023-presente",
      fecha_presentacion: "2023-07-16",
      estadisticas_actualizadas: {
        temporada_2023: {
          partidos: 14,
          goles: 11,
          asistencias: 5,
          torneos: "Leagues Cup, partidos de temporada regular"
        },
        temporada_2024: {
          partidos: 27,
          goles: 25,
          asistencias: 16,
          nota: "Incluye MLS regular season y playoffs"
        },
        total: {
          partidos: 41,
          goles: 36,
          asistencias: 21
        }
      },
      titulos: {
        leagues_cup: {
          año: 2023,
          nota: "Primer título en la historia del Inter Miami",
          goles_messi: 10,
          mvp: true
        }
      },
      impacto: {
        economico: "Aumento de 30% en valor de MLS, entradas agotadas en todos los estadios",
        deportivo: "De último lugar a campeón de Leagues Cup en 2 meses",
        comercial: "Contratos con Apple TV, Adidas, incremento masivo de merchandising"
      },
      companeros: ["Sergio Busquets", "Jordi Alba", "Luis Suárez (desde 2024)"],
      records_mls: [
        "Más goles en Leagues Cup (10)",
        "Jugador con más valor comercial en la historia de MLS"
      ],
      objetivos_futuros: "Ganar MLS Cup, establecer a Inter Miami como potencia de MLS"
    },

    seleccion_argentina: {
      debut: "2005-08-17",
      edad_debut: 18,
      estadisticas: {
        partidos: 184,
        goles: 109,
        asistencias: 58,
        capitanias: 170
      },
      titulos_mayores: {
        mundial: {
          cantidad: 1,
          año: 2022,
          sede: "Qatar",
          goles_messi: 7,
          asistencias_messi: 3,
          mvp: true,
          bota_oro: false,
          guante_oro: false,
          nota: "Cumplió su sueño máximo, considerado el mejor jugador del torneo"
        },
        copa_america: {
          cantidad: 2,
          años: [2021, 2024],
          sedes: ["Brasil", "Estados Unidos"],
          goles_totales: 6,
          mvp: [true, true]
        },
        finalissima: {
          cantidad: 1,
          año: 2022,
          rival: "Italia",
          resultado: "3-0"
        }
      },
      subcampeonatos: {
        mundiales: {
          cantidad: 1,
          año: 2014,
          sede: "Brasil",
          final: "vs Alemania 0-1",
          premio: "Balón de Oro del torneo"
        },
        copas_america: {
          cantidad: 3,
          años: [2007, 2015, 2016],
          nota: "Tres finales perdidas que marcaron su carrera"
        }
      },
      records: {
        internacionales: [
          "Jugador con más partidos en la selección argentina (184)",
          "Máximo goleador histórico de Argentina (109)",
          "Máximo asistente histórico de Argentina (58)",
          "Jugador con más participaciones en Copas del Mundo (5: 2006, 2010, 2014, 2018, 2022)",
          "Argentino con más goles en Copas del Mundo (13)",
          "Único jugador en marcar en 5 Copas del Mundo diferentes",
          "Único argentino en marcar en fase de grupos, octavos, cuartos, semifinales y final de un Mundial",
          "Capitán con más partidos en la historia de Argentina (170+)"
        ]
      },
      evolucion_temporal: {
        "2005-2010": "Inicio prometedor, debut joven, subcampeón olímpico 2008",
        "2011-2016": "Consolidación como estrella, pero sin títulos (3 finales perdidas)",
        "2017-2020": "Crisis y cuestionamientos, pensó en retirarse de la selección",
        "2021": "Primer título mayor: Copa América en Brasil",
        "2022": "Consagración total: Mundial de Qatar",
        "2024": "Bicampeonato de Copa América"
      },
      momentos_historicos: [
        {
          titulo: "Debut con gol vs Hungría (2005)",
          descripcion: "Expulsado a los 2 minutos de ingresar, pero mostró calidad",
          importancia: "Inicio de su carrera internacional"
        },
        {
          titulo: "Gol a México en Mundial 2006",
          descripcion: "Asistencia de pase largo, controló y definió con clase",
          importancia: "Su primer gol en Copas del Mundo, con 18 años"
        },
        {
          titulo: "Oro Olímpico Beijing 2008",
          descripcion: "Argentina venció a Nigeria 1-0 en la final",
          importancia: "Primer título con la selección mayor"
        },
        {
          titulo: "Hat-trick a Brasil (2012)",
          descripcion: "Tres goles en amistoso 4-3 en Nueva Jersey",
          importancia: "Demostración de dominio ante el rival histórico"
        },
        {
          titulo: "Final Mundial 2014 vs Alemania",
          descripcion: "Perdió 0-1 en tiempo extra, fue el mejor del torneo",
          importancia: "El momento más doloroso de su carrera"
        },
        {
          titulo: "Tres finales perdidas (2015, 2016)",
          descripcion: "Copa América 2015 y 2016 (Chile en penales), Centenario 2016",
          importancia: "Anunció retiro temporal de la selección"
        },
        {
          titulo: "Regreso y clasificación al Mundial 2018",
          descripcion: "Hat-trick a Ecuador que clasificó a Argentina",
          importancia: "Salvó a Argentina del abismo"
        },
        {
          titulo: "Final Copa América 2021",
          descripcion: "Victoria 1-0 ante Brasil en Maracaná",
          importancia: "Su primer título mayor con Argentina, rompió la maldición"
        },
        {
          titulo: "Finalissima 2022",
          descripcion: "Goleada 3-0 a Italia en Wembley",
          importancia: "Consolidación rumbo al Mundial"
        },
        {
          titulo: "Final Mundial 2022",
          descripcion: "Doblete en la final ante Francia, victoria en penales 4-2 (3-3)",
          importancia: "Cumplió el sueño máximo, considerado el mejor Mundial individual de la historia"
        },
        {
          titulo: "Bicampeonato Copa América 2024",
          descripcion: "Victoria 1-0 ante Colombia en tiempo extra",
          importancia: "Consolidó su legado y el ciclo dorado de Argentina"
        }
      ],
      estilo_liderazgo: "Líder por ejemplo, introvertido pero respetado, voz en el vestuario desde 2011"
    }
  },

  // Premios y reconocimientos exhaustivos
  premios: {
    balones_oro: {
      cantidad: 8,
      años: [2009, 2010, 2011, 2012, 2015, 2019, 2021, 2023],
      record: "Récord absoluto, ningún otro jugador tiene más de 5",
      detalle: {
        2009: "Primer Balón de Oro, era del Barcelona, Champions League",
        2010: "Ratificación del dominio mundial",
        2011: "Mejor temporada individual (73 goles en todas las competiciones)",
        2012: "Récord de 91 goles en año calendario",
        2015: "Triplete con Barcelona (Liga, Copa, Champions)",
        2019: "Sexto Balón de Oro, extensión del dominio",
        2021: "Tras ganar la Copa América con Argentina",
        2023: "Tras ganar el Mundial 2022, octavo y probablemente último"
      }
    },
    botas_oro: {
    cantidad: 6,
    años: [2010, 2012, 2013, 2017, 2018, 2019],
    record: "Récord absoluto, máximo goleador de Europa en 6 temporadas",
    goles_temporada: {
      "2009-10": 34,
      "2011-12": 50,
      "2012-13": 46,
      "2016-17": 37,
      "2017-18": 34,
      "2018-19": 36
    }
  },
    pichichis: {
      cantidad: 8,
      record: "Récord absoluto de Pichichis en La Liga",
      años: ["2009-10", "2011-12", "2012-13", "2016-17", "2017-18", "2018-19", "2019-20", "2020-21"]
    },
    fifa_the_best: {
      cantidad: 3,
      años: [2019, 2022, 2023],
      nota: "Premio creado en 2016 tras separación con France Football"
    },
    balon_oro_mundial: {
      cantidad: 2,
      años: [2014, 2022],
      nota: "Mejor jugador del torneo en Mundial 2014 y 2022"
    },
    mvp_champions: {
      cantidad: 3,
      nota: "Jugador más valioso de la Champions League"
    },
    laureus: {
      cantidad: 2,
      años: [2020, 2023],
      categoria: "Mejor deportista masculino del año"
    },
    premios_adicionales: [
      "Premio Onze d'Or: 3 veces",
      "FIFA World Player: 1 vez (2009)",
      "Trofeo Bravo: 1 vez (2007, mejor sub-21)",
      "Golden Boy: 1 vez (2005)",
      "Olimpia de Oro: 4 veces (mejor deportista argentino)",
      "Premio Konex: 2 veces",
      "Embajador de Buena Voluntad de UNICEF: 2010"
    ],
    records_guinness: [
      "Más goles en un año calendario (91 en 2012)",
      "Más Balones de Oro (8)",
      "Más Botas de Oro (6)",
      "Más goles en una temporada de La Liga (50 en 2011-12)",
      "Más goles para un club (672 con Barcelona)"
    ]
  },

  // Análisis de juego y habilidades técnicas
  habilidades: {
    tecnicas: {
      regate: {
        nivel: "10/10",
        descripcion: "Considerado el mejor regateador de la historia. Capacidad única para cambiar de dirección a alta velocidad con el balón pegado al pie. Su centro de gravedad bajo le da ventaja.",
        estadistica: "Promedio de 5+ regates exitosos por partido en su prime"
      },
      vision_juego: {
        nivel: "10/10",
        descripcion: "Excepcional visión de juego, anticipa espacios y movimientos. Asistencias de ensueño con pases imposibles.",
        estadistica: "305 asistencias oficiales con Barcelona, 58 con Argentina"
      },
      definicion: {
        nivel: "10/10",
        descripcion: "Precisión letal con ambas piernas (aunque es zurdo). Variedad de recursos: vaselinas, disparos potentes, colocados, tiro libre.",
        estadistica: "Conversión superior al 20% de sus disparos a gol"
      },
      tiro_libre: {
        nivel: "9/10",
        descripcion: "Evolucionó su tiro libre con los años. En su madurez se convirtió en especialista letal.",
        estadistica: "65+ goles de tiro libre en su carrera"
      },
      velocidad: {
        nivel: "9/10",
        descripcion: "Velocidad explosiva en cortas distancias. No es el más rápido en recorridos largos, pero su aceleración es devastadora.",
        estadistica: "Máxima velocidad registrada: 32.5 km/h"
      },
      cabezazo: {
        nivel: "7/10",
        descripcion: "A pesar de su estatura, ha marcado goles de cabeza importantes. Timing excepcional.",
        estadistica: "26 goles de cabeza en su carrera (incluyendo final Champions 2009)"
      },
      pierna_derecha: {
        nivel: "8/10",
        descripcion: "Aunque es zurdo, su pierna derecha es efectiva y la usa con naturalidad.",
        estadistica: "Aproximadamente 100+ goles con pierna derecha"
      }
    },
    mentales: {
      inteligencia_tactica: "Capacidad para leer el juego, encontrar espacios, anticipar jugadas",
      resiliencia: "Superó lesiones, críticas, presión, fracasos. Mental fortalecido con los años",
      liderazgo: "Líder silencioso pero respetado. Su ejemplo inspira al equipo",
      concentracion: "Mantiene focus en momentos decisivos, aparece en finales",
      adaptabilidad: "Ha jugado en múltiples posiciones y sistemas tácticos con éxito"
    },
    fisicas: {
      centro_gravedad: "Bajo (1.70m), le da estabilidad y agilidad en el regate",
      resistencia: "Capacidad para jugar 90 minutos con alta intensidad",
      equilibrio: "Excepcional, difícil de derribar incluso con faltas",
      agilidad: "Cambios de dirección rápidos y precisos",
      recuperacion: "Ha sabido manejar lesiones y recuperarse a alto nivel"
    }
  },

  // Comparaciones y rivalidades
  comparaciones: {
    cristiano_ronaldo: {
      contexto: "Rivalidad que definió una era (2009-2021)",
      diferencias: {
        estilo: "Messi: habilidad, regate, visión. Cristiano: potencia, atletismo, gol",
        posicion: "Messi: mediapunta/extremo. Cristiano: extremo/delantero centro",
        equipos: "Messi: un club (Barcelona). Cristiano: múltiples ligas"
      },
      estadisticas_comparadas: {
        goles_carrera: "Messi: 819+, Cristiano: 890+",
        asistencias: "Messi: 350+, Cristiano: 250+",
        balones_oro: "Messi: 8, Cristiano: 5",
        champions: "Messi: 4, Cristiano: 5",
        mundial: "Messi: 1, Cristiano: 0"
      },
      veredicto: "Messi ganó el Mundial 2022, lo que para muchos cerró el debate"
    },
    maradona: {
      contexto: "Comparación entre dos genios argentinos",
      similitudes: "Altura similar, zurdos, capacidad de regate, liderazgo en Argentina",
      diferencias: "Messi más longevo y consistente, Maradona más explosivo en momentos clave",
      veredicto: "Messi igualó y superó a Maradona al ganar el Mundial 2022"
    },
    pele: {
      contexto: "Debate histórico por ser el mejor de todos los tiempos",
      pele_ventajas: "3 Mundiales, más de 1000 goles (aunque en contexto diferente)",
      messi_ventajas: "Mayor nivel de competición, más premios individuales, mayor consistencia",
      veredicto: "Debate subjetivo, diferentes épocas"
    }
  },

  // Vida personal
  vida_personal: {
    familia: {
      esposa: {
        nombre: "Antonela Roccuzzo",
        relacion: "Pareja desde la infancia en Rosario",
        boda: "30 de junio de 2017 en Rosario, Argentina",
        descripcion: "Conocidos desde niños, se casaron tras 9 años de relación pública"
      },
      hijos: [
        { nombre: "Thiago", nacimiento: "2012-11-02", edad: 12 },
        { nombre: "Mateo", nacimiento: "2015-09-11", edad: 9 },
        { nombre: "Ciro", nacimiento: "2018-03-10", edad: 6 }
      ],
      padres: {
        padre: "Jorge Horacio Messi (trabajador de fábrica)",
        madre: "Celia María Cuccittini (limpiadora a tiempo parcial)"
      },
      hermanos: [
        { nombre: "Rodrigo", relacion: "Hermano mayor" },
        { nombre: "Matías", relacion: "Hermano mayor" },
        { nombre: "María Sol", relacion: "Hermana menor" }
      ]
    },
    residencia: {
      actual: "Miami, Florida, Estados Unidos",
      anteriores: ["Rosario (Argentina)", "Barcelona (España)", "París (Francia)"]
    },
    patrimonio: {
      valor_estimado: "600-700 millones USD (2024)",
      ingresos_anuales: "Salario + patrocinios: ~100-150 millones USD",
      propiedades: "Casas en Barcelona, Miami, Rosario, Ibiza"
    },
    patrocinios: [
      "Adidas (contrato de por vida)",
      "Apple TV (MLS)",
      "Pepsi",
      "Budweiser",
      "Mastercard",
      "Ooredoo",
      "Lays",
      "Gatorade"
    ],
    fundacion: {
      nombre: "Fundación Leo Messi",
      año_creacion: 2007,
      objetivo: "Apoyo a niños en situación de vulnerabilidad, salud y educación",
      proyectos: ["Hospitales infantiles", "Becas educativas", "Infraestructura deportiva"]
    },
    pasatiempos: ["Asados con familia", "PlayStation", "Pasar tiempo con sus hijos", "Descansar en casa"],
    personalidad: "Introvertido, reservado, humilde, familiar, leal a sus amigos"
  },

  // Controversias y polémicas
  controversias: {
    judiciales: {
      fraude_fiscal: {
        año: 2016,
        acusacion: "Fraude fiscal de 4.1 millones de euros (2007-2009)",
        sentencia: "Condena de 21 meses de prisión (no cumplida por ser menor a 2 años) y multa de 2 millones",
        resolucion: "Pagó la multa, no ingresó a prisión",
        impacto: "Afectó su imagen pública temporalmente"
      },
      pandora_papers: {
        año: 2021,
        revelacion: "Aparición en Pandora Papers por empresa offshore",
        explicacion: "Su equipo legal afirmó que todo era legal y declarado",
        impacto: "Menor impacto mediático"
      }
    },
    deportivas: {
      mano_vs_espanyol: {
        año: 2007,
        descripcion: "Gol con la mano no sancionado",
        polemica: "Gol polémico similar al de Maradona"
      },
      retiro_seleccion: {
        año: 2016,
        motivo: "Tras perder tercera final consecutiva (Copa América Centenario)",
        duracion: "2 meses",
        regreso: "Tras presión popular y pedido de compañeros"
      },
      expulsion_copa_america_2019: {
        motivo: "Roja directa por confrontación con Gary Medel (Chile)",
        consecuencia: "Sanción de 3 meses por criticar a CONMEBOL",
        polemica: "Acusó corrupción en la organización del torneo"
      }
    }
  },

  // Impacto y legado
  legado: {
    cultural: {
      argentina: "Ícono nacional, unió al país, inspiró a millones de niños",
      mundial: "Embajador del fútbol, trasciende fronteras y culturas",
      barcelona: "Leyenda absoluta, el mejor jugador en la historia del club"
    },
    economico: {
      barcelona: "Generó más de 600 millones anuales en ingresos directos e indirectos",
      mls: "Aumentó valor de la liga en 30%, entradas agotadas en todos los estadios",
      turismo: "Miami incrementó turismo un 25% tras su llegada"
    },
    deportivo: {
      influencia: "Cambió la forma de entender el fútbol moderno",
      estilo: "Inspiró una generación de futbolistas técnicos y habilidosos",
      records: "Estableció marcas casi inalcanzables"
    },
    social: {
      caridad: "Fundación Leo Messi ayuda a miles de niños",
      unicef: "Embajador de buena voluntad desde 2010",
      inspiracion: "Historia de superación (tratamiento médico, fracasos, éxitos)"
    }
  },

  // Curiosidades y datos interesantes
  curiosidades: [
    "Su primer contrato con Barcelona fue firmado en una servilleta",
    "Tiene doble nacionalidad: argentina y española",
    "Nunca ha recibido una tarjeta roja en Champions League",
    "Es el jugador con más goles para un solo club en la historia",
    "Ha marcado más de 50 goles en una temporada 5 veces",
    "Marcó 91 goles en el año 2012, récord mundial",
    "Es el único jugador en marcar en 5 Copas del Mundo diferentes",
    "Su camiseta de Argentina es la más vendida de la historia",
    "Tiene una estatua en Buenos Aires",
    "La AFA considera construir un museo dedicado exclusivamente a él",
    "Tiene un contrato de por vida con Adidas (estimado en 1 billón USD)",
    "Es el deportista con más seguidores en Instagram (500+ millones)",
    "Tiene tatuajes de su madre, esposa y tres hijos",
    "Vomitaba en el campo en sus inicios por ansiedad",
    "Su número 10 será retirado en Barcelona cuando se retire",
    "Ha jugado bajo 9 entrenadores diferentes en Barcelona",
    "Habla español, catalán, y entiende algo de inglés",
    "Es fanático de la música argentina, especialmente cumbia",
    "Su videojuego favorito es FIFA (ahora EA FC)",
    "Tiene una relación cercana con Luis Suárez, su mejor amigo en el fútbol"
  ]
};

// ============================================================================
// FASE 3: PREPARACIÓN DE LOS DATOS (Data Preparation)
// ============================================================================

// Sistema de vectorización y representación de conocimiento
const VECTORES_CONOCIMIENTO = {
  // Creamos un índice invertido para búsqueda rápida
  indice_invertido: {},
  
  // Tokens importantes con sus pesos (TF-IDF simplificado)
  tokens_importantes: {
    // Identidad
    "messi": 10, "lionel": 10, "leo": 10, "pulga": 9,
    
    // Equipos
    "barcelona": 8, "barça": 8, "psg": 8, "paris": 8, "miami": 8, "inter": 8,
    "argentina": 10, "seleccion": 10, "selección": 10,
    
    // Premios
    "balon": 9, "balón": 9, "oro": 9, "bota": 8, "pichichi": 7,
    "premio": 7, "fifa": 8, "mvp": 7,
    
    // Estadísticas
    "goles": 8, "gol": 8, "asistencias": 7, "asistencia": 7,
    "partidos": 7, "estadisticas": 8, "estadísticas": 8,
    "numeros": 7, "números": 7,
    
    // Títulos
    "champions": 9, "mundial": 10, "copa": 8, "liga": 7,
    "titulo": 7, "título": 7, "campeon": 8, "campeón": 8,
    
    // Biografía
    "nacimiento": 7, "edad": 8, "años": 8, "nacio": 8, "nació": 8,
    "biografia": 7, "biografía": 7, "quien": 9, "quién": 9,
    "vida": 7, "familia": 7, "esposa": 6, "hijos": 6,
    
    // Características
    "mejor": 8, "records": 8, "récords": 8, "historia": 7,
    "habilidades": 7, "tecnica": 7, "técnica": 7,
    
    // Temporales
    "actual": 8, "actualmente": 8, "ahora": 8, "hoy": 8,
    "cuando": 7, "cuándo": 7, "donde": 7, "dónde": 7,
    
    // Cuantificadores
    "cuanto": 8, "cuánto": 8, "cuantos": 8, "cuántos": 8,
    "cual": 7, "cuál": 7, "que": 7, "qué": 7
  },
  
  // Sinónimos y variaciones
  sinonimos: {
    "messi": ["leo", "lionel", "pulga", "lio"],
    "barcelona": ["barça", "barsa", "barca", "fcb"],
    "goles": ["gol", "tantos", "anotaciones", "dianas"],
    "asistencias": ["asistencia", "pases gol", "habilitaciones"],
    "premios": ["premio", "trofeos", "galardones", "reconocimientos"],
    "mundial": ["copa mundo", "world cup", "copa del mundo"],
    "edad": ["años", "edad"],
    "equipos": ["equipo", "clubes", "club", "equipos"],
    "actual": ["actualmente", "ahora", "presente", "hoy"],
    "records": ["récords", "marcas", "registros"]
  }
};

// ============================================================================
// FASE 4: MODELADO (Modeling) - Algoritmos de PLN
// ============================================================================

class AdvancedNLPEngine {
  constructor() {
    this.stopWords = new Set([
      'el', 'la', 'de', 'que', 'y', 'a', 'en', 'un', 'ser', 'se', 'no',
      'haber', 'por', 'con', 'su', 'para', 'como', 'estar', 'tener',
      'le', 'lo', 'todo', 'pero', 'más', 'hacer', 'o', 'poder', 'decir',
      'este', 'ir', 'otro', 'ese', 'la', 'si', 'me', 'ya', 'ver', 'porque',
      'dar', 'cuando', 'él', 'muy', 'sin', 'vez', 'mucho', 'saber', 'qué',
      'sobre', 'mi', 'alguno', 'mismo', 'yo', 'también', 'hasta', 'año',
      'dos', 'querer', 'entre', 'así', 'primero', 'desde', 'grande', 'eso',
      'ni', 'nos', 'llegar', 'pasar', 'tiempo', 'ella', 'sí', 'día', 'uno',
      'bien', 'poco', 'deber', 'entonces', 'poner', 'cosa', 'tanto', 'hombre',
      'parecer', 'nuestro', 'tan', 'donde', 'ahora', 'parte', 'después', 'vida',
      'esta', 'dejar', 'ya', 'solo', 'algo', 'es', 'son'
    ]);
  }

  // Tokenización avanzada
  tokenize(text) {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Eliminar acentos
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 2 && !this.stopWords.has(token));
  }

  // Cálculo de similitud de Jaccard
  jaccardSimilarity(tokens1, tokens2) {
    const set1 = new Set(tokens1);
    const set2 = new Set(tokens2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    return union.size === 0 ? 0 : intersection.size / union.size;
  }

  // Cálculo de similitud de coseno con pesos TF-IDF
  cosineSimilarity(tokens1, tokens2) {
    const getVector = (tokens) => {
      const vector = {};
      tokens.forEach(token => {
        const weight = VECTORES_CONOCIMIENTO.tokens_importantes[token] || 1;
        vector[token] = (vector[token] || 0) + weight;
      });
      return vector;
    };

    const v1 = getVector(tokens1);
    const v2 = getVector(tokens2);

    const keys = new Set([...Object.keys(v1), ...Object.keys(v2)]);
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    keys.forEach(key => {
      const val1 = v1[key] || 0;
      const val2 = v2[key] || 0;
      dotProduct += val1 * val2;
      magnitude1 += val1 * val1;
      magnitude2 += val2 * val2;
    });

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    return magnitude1 === 0 || magnitude2 === 0
      ? 0
      : dotProduct / (magnitude1 * magnitude2);
  }

  // Distancia de Levenshtein para corrección ortográfica
  levenshteinDistance(str1, str2) {
    const matrix = [];

    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[str2.length][str1.length];
  }

  // Expansión con sinónimos
  expandWithSynonyms(tokens) {
    const expanded = [...tokens];
    tokens.forEach(token => {
      if (VECTORES_CONOCIMIENTO.sinonimos[token]) {
        expanded.push(...VECTORES_CONOCIMIENTO.sinonimos[token]);
      }
    });
    return [...new Set(expanded)];
  }

  // Extracción de entidades nombradas (NER simplificado)
  extractEntities(text) {
    const entities = {
      personas: [],
      equipos: [],
      premios: [],
      fechas: [],
      numeros: [],
      torneos: [],
      habilidades: [],
      temporadas: []
    };

    const lowerText = text.toLowerCase();

    // Personas con más detalle
    const personasPatterns = [
      { pattern: /messi|lionel|leo|pulga/, entity: 'Lionel Messi' },
      { pattern: /cristiano|ronaldo|cr7/, entity: 'Cristiano Ronaldo' },
      { pattern: /maradona|diego/, entity: 'Diego Maradona' },
      { pattern: /pele|pelé/, entity: 'Pelé' },
      { pattern: /ronaldinho/, entity: 'Ronaldinho' },
      { pattern: /(antonela|roccuzzo)/, entity: 'Antonela Roccuzzo' },
      { pattern: /(suarez|suárez)/, entity: 'Luis Suárez' },
      { pattern: /neymar/, entity: 'Neymar' },
      { pattern: /mbappe|mbappé/, entity: 'Kylian Mbappé' }
    ];

    // Equipos
    const equiposPatterns = [
      { pattern: /barcelona|barça|barsa|fcb/, entity: 'Barcelona' },
      { pattern: /\bpsg\b|paris saint germain/, entity: 'PSG' },
      { pattern: /inter miami|miami/, entity: 'Inter Miami' },
      { pattern: /newell'?s/, entity: 'Newell\'s Old Boys' },
      { pattern: /argentina|seleccion|selección/, entity: 'Argentina' },
      { pattern: /real madrid|madrid/, entity: 'Real Madrid' }
    ];

    // Torneos
    const torneosPatterns = [
      { pattern: /champions league|champions|uefa champions/, entity: 'Champions League' },
      { pattern: /la liga|liga española/, entity: 'La Liga' },
      { pattern: /copa america|copa américa/, entity: 'Copa América' },
      { pattern: /mundial|copa del mundo/, entity: 'Mundial' },
      { pattern: /copa del rey/, entity: 'Copa del Rey' },
      { pattern: /leagues cup|mls/, entity: 'MLS/Leagues Cup' },
      { pattern: /league 1|liga francesa/, entity: 'Ligue 1' }
    ];

    // Habilidades
    const habilidadesPatterns = [
      { pattern: /regate|dribling|gambeta/, entity: 'regate' },
      { pattern: /vision|pase|asistencia/, entity: 'visión' },
      { pattern: /definicion|definición|tiro/, entity: 'definición' },
      { pattern: /tiro libre/, entity: 'tiro libre' },
      { pattern: /control|control del balon/, entity: 'control' },
      { pattern: /velocidad|aceleracion/, entity: 'velocidad' },
      { pattern: /cabeza|cabezazo/, entity: 'cabezazo' }
    ];

    // Temporadas/años
    const years = lowerText.match(/\b(19|20)\d{2}\b/g);
    if (years) entities.temporadas.push(...years);

    // Números específicos
    const numeros = text.match(/\b\d+\b/g);
    if (numeros) entities.numeros.push(...numeros);

    // Detectar patrones
    [personasPatterns, equiposPatterns, torneosPatterns, habilidadesPatterns].forEach(patternSet => {
      patternSet.forEach(({ pattern, entity }) => {
        if (pattern.test(lowerText) && !entities[getCategory(entity)].includes(entity)) {
          entities[getCategory(entity)].push(entity);
        }
      });
    });

    return entities;

    function getCategory(entity) {
      if (['Lionel Messi', 'Cristiano Ronaldo', 'Diego Maradona', 'Pelé', 'Ronaldinho', 
          'Antonela Roccuzzo', 'Luis Suárez', 'Neymar', 'Kylian Mbappé'].includes(entity)) {
        return 'personas';
      } else if (['Barcelona', 'PSG', 'Inter Miami', 'Newell\'s Old Boys', 'Argentina', 'Real Madrid'].includes(entity)) {
        return 'equipos';
      } else if (['Champions League', 'La Liga', 'Copa América', 'Mundial', 'Copa del Rey', 'MLS/Leagues Cup', 'Ligue 1'].includes(entity)) {
        return 'torneos';
      } else if (['regate', 'visión', 'definición', 'tiro libre', 'control', 'velocidad', 'cabezazo'].includes(entity)) {
        return 'habilidades';
      }
      return 'premios'; // fallback
    }
  }

  // Análisis de sentimiento básico
  analyzeSentiment(text) {
    const positiveWords = [
      'mejor', 'genio', 'fenomeno', 'increible', 'excelente',
      'maravilloso', 'extraordinario', 'legendario', 'crack'
    ];
    const negativeWords = [
      'peor', 'malo', 'terrible', 'horrible', 'fraude', 'pecho'
    ];

    const tokens = this.tokenize(text);
    let score = 0;

    tokens.forEach(token => {
      if (positiveWords.includes(token)) score++;
      if (negativeWords.includes(token)) score--;
    });

    return score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral';
  }
}

// Sistema de clasificación de intenciones 
class IntentClassifier {
  constructor(nlpEngine) {
    this.nlp = nlpEngine;
    
    // Definimos intenciones con múltiples patrones y ejemplos
    this.intents = {
      biografia_general: {
        patterns: [
          /qui[eé]n es messi/i,
          /qu[eé] es messi/i,
          /cuéntame (de|sobre) messi/i,
          /háblame (de|sobre) messi/i,
          /información (de|sobre) messi/i,
          /presentación messi/i,
          /^messi$/i,
          /^leo$/i,
          /biografía messi/i
        ],
        keywords: ['quien', 'que', 'biografia', 'presentacion', 'informacion', 'messi'],
        examples: [
          "quien es messi",
          "que es messi",
          "cuentame de messi",
          "hablame sobre messi"
        ],
        confidence_threshold: 0.6
      },
      
      edad_nacimiento: {
        patterns: [
          /cu[aá]ntos años tiene/i,
          /qu[eé] edad tiene/i,
          /edad de messi/i,
          /cu[aá]ndo naci[oó]/i,
          /fecha (de )?nacimiento/i,
          /año (de )?nacimiento/i,
          /en qu[eé] año naci[oó]/i
        ],
        keywords: ['edad', 'años', 'nacimiento', 'nacio', 'cuando', 'fecha'],
        examples: [
          "cuantos años tiene messi",
          "que edad tiene",
          "cuando nacio messi"
        ],
        confidence_threshold: 0.7
      },

      balones_oro: {
        patterns: [
          /cu[aá]ntos balones de oro/i,
          /cu[aá]ntos balon de oro/i,
          /balones de oro (tiene|gan[oó])/i,
          /balon de oro messi/i,
          /premios balon de oro/i
        ],
        keywords: ['balones', 'balon', 'oro', 'cuantos', 'premios'],
        examples: [
          "cuantos balones de oro tiene",
          "balon de oro de messi",
          "premios balon de oro"
        ],
        confidence_threshold: 0.8
      },

      equipo_actual: {
        patterns: [
          /d[oó]nde juega (actual|ahora|hoy)/i,
          /en qu[eé] equipo juega/i,
          /equipo actual/i,
          /club actual/i,
          /donde est[aá] jugando/i,
          /en qu[eé] club est[aá]/i
        ],
        keywords: ['donde', 'juega', 'actual', 'equipo', 'club', 'ahora', 'hoy'],
        examples: [
          "donde juega messi actualmente",
          "en que equipo juega",
          "equipo actual de messi"
        ],
        confidence_threshold: 0.7
      },

      estadisticas_generales: {
        patterns: [
          /cu[aá]ntos goles/i,
          /estad[ií]sticas/i,
          /n[uú]meros/i,
          /partidos jugados/i,
          /goles totales/i,
          /asistencias/i,
          /datos estad[ií]sticos/i
        ],
        keywords: ['goles', 'estadisticas', 'numeros', 'partidos', 'asistencias', 'datos'],
        examples: [
          "cuantos goles tiene messi",
          "estadisticas de messi",
          "numeros de messi"
        ],
        confidence_threshold: 0.6
      },

      barcelona: {
        patterns: [
          /barcelona/i,
          /bar[çc]a/i,
          /(en|del) barcelona/i,
          /etapa (en )?barcelona/i,
          /(goles|temporada|años) (en )?barcelona/i
        ],
        keywords: ['barcelona', 'barca', 'barça', 'fcb'],
        examples: [
          "estadisticas en barcelona",
          "goles en el barca",
          "años en barcelona"
        ],
        confidence_threshold: 0.7
      },

      psg: {
        patterns: [
          /\bpsg\b/i,
          /paris/i,
          /(en|del) psg/i,
          /par[ií]s saint[- ]germain/i
        ],
        keywords: ['psg', 'paris'],
        examples: [
          "estadisticas en psg",
          "goles en paris",
          "temporadas en psg"
        ],
        confidence_threshold: 0.75
      },

      miami: {
        patterns: [
          /miami/i,
          /inter miami/i,
          /(en|del) miami/i,
          /\bmls\b/i,
          /estados unidos/i
        ],
        keywords: ['miami', 'inter', 'mls', 'estados', 'unidos'],
        examples: [
          "estadisticas en miami",
          "goles en inter miami",
          "temporada en mls"
        ],
        confidence_threshold: 0.75
      },

      argentina: {
        patterns: [
          /argentina/i,
          /selecci[oó]n/i,
          /mundial/i,
          /copa am[eé]rica/i,
          /(con|en) (la )?argentina/i,
          /(copa|mundial) (del )?mundo/i
        ],
        keywords: ['argentina', 'seleccion', 'mundial', 'copa', 'america'],
        examples: [
          "estadisticas con argentina",
          "goles en la seleccion",
          "mundial con messi"
        ],
        confidence_threshold: 0.6
      },

      premios_generales: {
        patterns: [
          /qu[eé] premios (tiene|gan[oó])/i,
          /premios (de )?messi/i,
          /galardones/i,
          /reconocimientos/i,
          /trofeos (individuales|personales)/i
        ],
        keywords: ['premios', 'galardones', 'trofeos', 'reconocimientos'],
        examples: [
          "que premios tiene messi",
          "premios de messi",
          "trofeos individuales"
        ],
        confidence_threshold: 0.7
      },

      titulos: {
        patterns: [
          /qu[eé] t[ií]tulos (tiene|gan[oó])/i,
          /t[ií]tulos (de|con) messi/i,
          /campeonatos/i,
          /copas ganadas/i,
          /cuántos campeonatos/i
        ],
        keywords: ['titulos', 'campeonatos', 'copas', 'ganadas', 'trofeos'],
        examples: [
          "que titulos tiene messi",
          "campeonatos ganados",
          "copas ganadas"
        ],
        confidence_threshold: 0.7
      },

      habilidades: {
        patterns: [
          /habilidades/i,
          /c[oó]mo juega/i,
          /estilo (de )?juego/i,
          /t[eé]cnica/i,
          /caracter[ií]sticas/i,
          /fortalezas/i
        ],
        keywords: ['habilidades', 'juega', 'estilo', 'tecnica', 'caracteristicas'],
        examples: [
          "habilidades de messi",
          "como juega messi",
          "estilo de juego"
        ],
        confidence_threshold: 0.7
      },

      comparaciones: {
        patterns: [
          /vs|versus/i,
          /comparaci[oó]n/i,
          /cristiano|ronaldo/i,
          /maradona/i,
          /pel[eé]/i,
          /mejor que/i,
          /messi (vs|versus|contra)/i
        ],
        keywords: ['vs', 'versus', 'comparacion', 'cristiano', 'maradona', 'pele', 'mejor'],
        examples: [
          "messi vs cristiano",
          "messi vs maradona",
          "comparacion con pele"
        ],
        confidence_threshold: 0.7
      },

      vida_personal: {
        patterns: [
          /familia/i,
          /esposa/i,
          /hijos/i,
          /vida personal/i,
          /antonela/i,
          /casado/i,
          /pareja/i
        ],
        keywords: ['familia', 'esposa', 'hijos', 'vida', 'personal', 'antonela', 'casado'],
        examples: [
          "familia de messi",
          "esposa de messi",
          "hijos de messi"
        ],
        confidence_threshold: 0.7
      },

      records: {
        patterns: [
          /r[eé]cord/i,
          /marca/i,
          /mejor (goleador|asistente)/i,
          /m[aá]ximo goleador/i,
          /logros hist[oó]ricos/i
        ],
        keywords: ['records', 'marca', 'mejor', 'maximo', 'goleador', 'historico'],
        examples: [
          "records de messi",
          "marcas de messi",
          "logros historicos"
        ],
        confidence_threshold: 0.7
      },

      saludo: {
        patterns: [
          /^hola$/i,
          /^hello$/i,
          /^hi$/i,
          /^hey$/i,
          /buenos d[ií]as/i,
          /buenas tardes/i,
          /buenas noches/i,
          /qu[eé] tal/i
        ],
        keywords: ['hola', 'hello', 'hi', 'hey', 'buenos', 'buenas', 'dias', 'tardes', 'noches'],
        examples: [
          "hola",
          "buenos dias",
          "que tal"
        ],
        confidence_threshold: 0.9
      },

      despedida: {
        patterns: [
          /^adi[oó]s$/i,
          /^chao$/i,
          /^bye$/i,
          /hasta luego/i,
          /nos vemos/i,
          /me voy/i
        ],
        keywords: ['adios', 'chao', 'bye', 'hasta', 'luego', 'vemos'],
        examples: [
          "adios",
          "hasta luego",
          "nos vemos"
        ],
        confidence_threshold: 0.9
      },

      agradecimiento: {
        patterns: [
          /gracias/i,
          /muchas gracias/i,
          /te agradezco/i,
          /thanks/i,
          /thank you/i
        ],
        keywords: ['gracias', 'agradezco', 'thanks'],
        examples: [
          "gracias",
          "muchas gracias",
          "te agradezco"
        ],
        confidence_threshold: 0.9
      },

      detalles_especificos_messi: {
        patterns: [
          /definicion tecnica/i,
          /vision de juego/i,
          /control del balon/i,
          /regates especificos/i,
          /tiro libre/i,
          /tiro exterior/i,
          /cambio de ritmo/i,
          /hacer gambeta/i
        ],
        keywords: ['definicion', 'vision', 'control', 'regate', 'tiro', 'libre', 'exterior', 'gambeta'],
        examples: [
          "como es la definicion de messi",
          "vision de juego de messi",
          "control del balon de messi",
          "como son los regates de messi"
        ],
        confidence_threshold: 0.7
      },

      estadisticas_por_torneo: {
        patterns: [
          /goles en (champions|liga|copa del rey|copa america|mundial)/i,
          /estadisticas en (champions|liga|copa)/i,
          /(champions|liga|copa) messi/i,
          /(mundial|copa america) goles/i
        ],
        keywords: ['goles', 'champions', 'liga', 'copa', 'america', 'mundial', 'estadisticas'],
        examples: [
          "goles de messi en champions",
          "estadisticas en liga",
          "goles en copa america",
          "goles en mundial"
        ],
        confidence_threshold: 0.7
      },

      momentos_historicos: {
        patterns: [
          /gol (a getafe|vs getafe)/i,
          /gol del siglo/i,
          /final (champions|mundial|copa america)/i,
          /momento historico/i,
          /partido historico/i,
          /mejor gol/i,
          /remontada psg/i,
          /gol a (real madrid|manchester|arsenal)/i
        ],
        keywords: ['gol', 'getafe', 'siglo', 'final', 'historico', 'remontada', 'psg', 'momento'],
        examples: [
          "gol de messi a getafe",
          "gol del siglo de messi",
          "final champions 2009",
          "remontada psg"
        ],
        confidence_threshold: 0.7
      },

      comparaciones_detalladas: {
        patterns: [
          /cristiano (vs|comparado|comparacion)/i,
          /maradona (vs|comparado|comparacion)/i,
          /pele (vs|comparado|comparacion)/i,
          /mejor que cristiano/i,
          /mejor que maradona/i,
          /diferencias con cristiano/i,
          /diferencias con maradona/i
        ],
        keywords: ['cristiano', 'maradona', 'pele', 'comparacion', 'vs', 'diferencias', 'mejor'],
        examples: [
          "cristiano vs messi detallado",
          "comparacion con maradona detallada",
          "diferencias con pele"
        ],
        confidence_threshold: 0.75
      },

      evolucion_temporal: {
        patterns: [
          /como (empezo|empezó) messi/i,
          /primera etapa/i,
          /evolucion de messi/i,
          /cambio de estilo/i,
          /messi (joven|viejo)/i,
          /diferencia (2009|2012|2015) (2019|2022)/i
        ],
        keywords: ['empezo', 'evolucion', 'etapa', 'joven', 'viejo', 'cambio', 'estilo'],
        examples: [
          "como empezo messi",
          "evolucion de messi",
          "cambio de estilo de messi"
        ],
        confidence_threshold: 0.7
      }
    };
  }

  // Clasificación con algoritmo de scoring múltiple
  classify(userQuery) {
     // Normalizar la consulta
    const normalizedQuery = userQuery
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    console.log('Consulta normalizada:', normalizedQuery);
    
    // Detección de consultas muy específicas
    const consultasEspecificas = {
      // Patrones para habilidades técnicas específicas
      tecnica_especifica: {
        pattern: /(como|de que forma|de que manera) (juega|regatea|define|pasa|tira) messi/i,
        intent: 'detalles_especificos_messi'
      },
      
      // Patrones para estadísticas por equipo específico
      estadisticas_equipo_especifico: {
        pattern: /(goles|asistencias|partidos) (en|con) (barcelona|psg|miami|argentina)/i,
        intent: 'estadisticas_generales'
      },
      
      // Patrones para comparaciones directas
      comparacion_directa: {
        pattern: /(messi|cristiano|maradona) es mejor que/i,
        intent: 'comparaciones'
      }
    };
    
    // Verificar patrones específicos primero
    for (const [key, { pattern, intent }] of Object.entries(consultasEspecificas)) {
      if (pattern.test(userQuery)) {
        console.log('Consulta específica detectada:', key);
        const tokens = this.nlp.tokenize(userQuery);
        const entities = this.nlp.extractEntities(userQuery);
        return {
          intent: intent,
          confidence: 0.95, // Alta confianza para patrones específicos
          entities: entities,
          tokens: tokens,
          isSpecific: true
        };
      }
    }
  
    
    const tokens = this.nlp.tokenize(userQuery);
    const expandedTokens = this.nlp.expandWithSynonyms(tokens);
    const entities = this.nlp.extractEntities(userQuery);
    
    const scores = {};
    
    // Verificar si NO es sobre Messi
    const noMessiTopics = ['cristiano', 'ronaldo', 'neymar', 'mbappe', 'iniesta', 
                          'xavi', 'dolar', 'tarjeta', 'siniestro', 'bitcoin'];
    const isAboutMessi = userQuery.toLowerCase().includes('messi') || 
                        userQuery.toLowerCase().includes('leo') ||
                        userQuery.toLowerCase().includes('lionel');
    
    const hasNoMessiTopic = noMessiTopics.some(topic => 
      userQuery.toLowerCase().includes(topic)
    );
    
    if (hasNoMessiTopic && !isAboutMessi) {
      return {
        intent: 'no_es_messi',
        confidence: 1.0,
        entities: entities,
        tokens: tokens
      };
    }

    // Calcular scores para cada intención
    Object.entries(this.intents).forEach(([intentName, intentData]) => {
      let score = 0;
      
      // 1. Matching de patrones regex (peso: 40%)
      const patternMatch = intentData.patterns.some(pattern => pattern.test(userQuery));
      if (patternMatch) {
        score += 0.4;
      }
      
      // 2. Similitud de keywords usando Jaccard (peso: 30%)
      const keywordSimilarity = this.nlp.jaccardSimilarity(
        expandedTokens,
        intentData.keywords
      );
      score += keywordSimilarity * 0.3;
      
      // 3. Similitud con ejemplos usando coseno (peso: 30%)
      let maxExampleSimilarity = 0;
      intentData.examples.forEach(example => {
        const exampleTokens = this.nlp.tokenize(example);
        const similarity = this.nlp.cosineSimilarity(tokens, exampleTokens);
        maxExampleSimilarity = Math.max(maxExampleSimilarity, similarity);
      });
      score += maxExampleSimilarity * 0.3;
      
      // Bonus por entidades detectadas
      if (entities.equipos.length > 0 && ['barcelona', 'psg', 'miami', 'argentina'].includes(intentName)) {
        score += 0.1;
      }
      if (entities.premios.length > 0 && ['balones_oro', 'premios_generales'].includes(intentName)) {
        score += 0.1;
      }
      
      scores[intentName] = score;
    });
    
    // Encontrar la mejor intención
    const sortedIntents = Object.entries(scores)
      .sort((a, b) => b[1] - a[1]);
    
    const bestIntent = sortedIntents[0];
    const [intentName, confidence] = bestIntent;
    
    // Verificar threshold de confianza
    const threshold = this.intents[intentName]?.confidence_threshold || 0.5;
    
    if (confidence < threshold) {
      return {
        intent: 'desconocida',
        confidence: confidence,
        entities: entities,
        tokens: tokens,
        allScores: scores
      };
    }
    
    return {
      intent: intentName,
      confidence: confidence,
      entities: entities,
      tokens: tokens,
      allScores: scores
    };
  }
}

// ============================================================================
// FASE 5: EVALUACIÓN (Evaluation) y GENERACIÓN DE RESPUESTAS
// ============================================================================

class ResponseGenerator {
  constructor(knowledgeBase) {
    this.kb = knowledgeBase;
  }

  // Generador de respuestas basado en templates y contexto
  generate(classification, userQuery) {
    const { intent, confidence, entities, tokens } = classification;
    
    // Routing a generadores específicos
    switch(intent) {
      case 'no_es_messi':
        return this.generateNoMessiResponse();
      
      case 'saludo':
        return this.generateGreeting();
      
      case 'despedida':
        return this.generateFarewell();
      
      case 'agradecimiento':
        return this.generateThanks();
      
      case 'biografia_general':
        return this.generateBiografia();
      
      case 'edad_nacimiento':
        return this.generateEdad();
      
      case 'balones_oro':
        return this.generateBalonesOro();
      
      case 'equipo_actual':
        return this.generateEquipoActual();
      
      case 'estadisticas_generales':
        return this.generateEstadisticasGenerales(entities, tokens);
      
      case 'barcelona':
        return this.generateBarcelona();
      
      case 'psg':
        return this.generatePSG();
      
      case 'miami':
        return this.generateMiami();
      
      case 'argentina':
        return this.generateArgentina();
      
      case 'premios_generales':
        return this.generatePremios();
      
      case 'titulos':
        return this.generateTitulos();
      
      case 'habilidades':
        return this.generateHabilidades();
      
      case 'comparaciones':
        return this.generateComparaciones(entities);
      
      case 'vida_personal':
        return this.generateVidaPersonal();
      
      case 'records':
        return this.generateRecords();
      
      case 'desconocida':
      default:
        return this.generateDefault(userQuery, tokens);
    }
  }

  // ========== GENERADORES ESPECÍFICOS ==========

  generateNoMessiResponse() {
    return `Soy un asistente especializado exclusivamente en Lionel Messi.

Puedo ayudarte con:
• Biografía y trayectoria deportiva
• Estadísticas detalladas por equipo
• Premios y reconocimientos
• Récords y logros históricos
• Vida personal y familia
• Comparaciones con otros jugadores

¿Qué te gustaría saber sobre Leo Messi?`;
  }

  generateGreeting() {
    const greetings = [
      `Hola, soy tu asistente especializado en Lionel Messi.

Puedo responder cualquier pregunta sobre su carrera, estadísticas, premios, récords o vida personal.

¿Qué te gustaría saber?`,
      
      `Saludos. Soy tu asistente experto en Lionel Messi.

Pregúntame sobre su vida, carrera, estadísticas o cualquier curiosidad.

¿En qué puedo ayudarte hoy?`,
      
      `Hola. Tengo información completa y actualizada sobre Lionel Messi.

¿Qué quieres descubrir sobre el mejor jugador de todos los tiempos?`
    ];
    
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  generateFarewell() {
    return `Hasta pronto. Espero haber respondido tus preguntas sobre Lionel Messi.

Vuelve cuando quieras saber más sobre su carrera y logros.`;
  }

  generateThanks() {
    return `De nada. Es un placer ayudarte con información sobre Messi.

Si tienes más preguntas, estoy aquí para responder.`;
  }

  generateBiografia() {
    const bio = this.kb.biografia;
    const stats = this.kb.carrera;
    const edad = new Date().getFullYear() - 1987;
    
    return `Lionel Andrés Messi Cuccittini

Datos personales:
• Nacimiento: ${new Date(this.kb.entidad.fecha_nacimiento).toLocaleDateString('es-ES')} (${edad} años)
• Lugar: ${this.kb.entidad.lugar_nacimiento}
• Altura: ${this.kb.entidad.altura} m
• Posición: ${this.kb.entidad.posicion}
• Dorsal: #${this.kb.entidad.numero_dorsal_actual}

Trayectoria:
${bio.infancia.texto}

${bio.llegada_barcelona.texto}

Carrera profesional:
• Barcelona (2004-2021): ${stats.barcelona.estadisticas.goles} goles en ${stats.barcelona.estadisticas.partidos_oficiales} partidos
• PSG (2021-2023): ${stats.psg.estadisticas.goles} goles en ${stats.psg.estadisticas.partidos_oficiales} partidos
• Inter Miami (2023-presente): ${stats.inter_miami.estadisticas_actualizadas.total.goles} goles en ${stats.inter_miami.estadisticas_actualizadas.total.partidos} partidos

Selección Argentina:
• ${stats.seleccion_argentina.estadisticas.partidos} partidos (récord)
• ${stats.seleccion_argentina.estadisticas.goles} goles (récord)
• Campeón del Mundo 2022
• 2x Campeón Copa América (2021, 2024)

Premios principales:
• ${this.kb.premios.balones_oro.cantidad} Balones de Oro (récord)
• ${this.kb.premios.botas_oro.cantidad} Botas de Oro (récord)

Considerado por muchos como el mejor futbolista de todos los tiempos.`;
  }

  generateEdad() {
    const nacimiento = new Date(this.kb.entidad.fecha_nacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - nacimiento.getFullYear();
    
    return `Edad de Lionel Messi

• Fecha de nacimiento: ${nacimiento.toLocaleDateString('es-ES', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric' 
})}

• Lugar: ${this.kb.entidad.lugar_nacimiento}

• Edad actual: ${edad} años

Dato curioso: ${this.kb.biografia.crisis_medica.texto}

Durante su tratamiento, creció de 1.33m a su altura actual de ${this.kb.entidad.altura}m.`;
  }

  generateBalonesOro() {
    const balones = this.kb.premios.balones_oro;
    
    let response = `Balones de Oro de Lionel Messi

Lionel Messi ha ganado ${balones.cantidad} Balones de Oro, un récord absoluto en la historia del fútbol.

Lista por años:`;

    balones.años.forEach(año => {
      const detalle = balones.detalle[año];
      response += `\n• ${año}: ${detalle}`;
    });

    response += `\n\nNingún otro jugador tiene más de 5 Balones de Oro:
• Cristiano Ronaldo: 5
• Michel Platini: 3
• Johan Cruyff: 3

Messi tiene el récord absoluto con 8 Balones de Oro.`;

    return response;
  }

  generateEquipoActual() {
    const miami = this.kb.carrera.inter_miami;
    
    return `Equipo actual de Messi

Club: Inter Miami CF (desde 2023)
Liga: Major League Soccer (MLS)
País: Estados Unidos

Estadísticas en Miami:
• Partidos: ${miami.estadisticas_actualizadas.total.partidos}
• Goles: ${miami.estadisticas_actualizadas.total.goles}
• Asistencias: ${miami.estadisticas_actualizadas.total.asistencias}

Temporada 2023:
• ${miami.estadisticas_actualizadas.temporada_2023.partidos} partidos
• ${miami.estadisticas_actualizadas.temporada_2023.goles} goles
• Leagues Cup 2023 (primer título del club)

Temporada 2024:
• ${miami.estadisticas_actualizadas.temporada_2024.partidos} partidos
• ${miami.estadisticas_actualizadas.temporada_2024.goles} goles
• ${miami.estadisticas_actualizadas.temporada_2024.asistencias} asistencias

Compañeros destacados:
${miami.companeros.map(c => `• ${c}`).join('\n')}`;
  }

  generateEstadisticasGenerales(entities, tokens) {
    // Detectar si pregunta por equipo específico
    const equipos = entities.equipos;
    
    if (equipos.includes('Barcelona')) {
      return this.generateBarcelona();
    } else if (equipos.includes('PSG')) {
      return this.generatePSG();
    } else if (equipos.includes('Inter Miami')) {
      return this.generateMiami();
    } else if (equipos.includes('Argentina')) {
      return this.generateArgentina();
    }
    
    // Estadísticas generales completas
    const stats = this.kb.carrera;
    
    return `Estadísticas completas de Lionel Messi

FC BARCELONA (2004-2021):
• Partidos: ${stats.barcelona.estadisticas.partidos_oficiales}
• Goles: ${stats.barcelona.estadisticas.goles}
• Asistencias: ${stats.barcelona.estadisticas.asistencias}
• Promedio: ${stats.barcelona.estadisticas.promedio_gol} goles/partido
• Títulos: ${stats.barcelona.titulos.total}

PSG (2021-2023):
• Partidos: ${stats.psg.estadisticas.partidos_oficiales}
• Goles: ${stats.psg.estadisticas.goles}
• Asistencias: ${stats.psg.estadisticas.asistencias}
• Títulos: ${stats.psg.titulos.total}

INTER MIAMI (2023-presente):
• Partidos: ${stats.inter_miami.estadisticas_actualizadas.total.partidos}
• Goles: ${stats.inter_miami.estadisticas_actualizadas.total.goles}
• Asistencias: ${stats.inter_miami.estadisticas_actualizadas.total.asistencias}
• Títulos: 1 (Leagues Cup 2023)

SELECCIÓN ARGENTINA:
• Partidos: ${stats.seleccion_argentina.estadisticas.partidos} (récord)
• Goles: ${stats.seleccion_argentina.estadisticas.goles} (récord)
• Asistencias: ${stats.seleccion_argentina.estadisticas.asistencias}
• Títulos: Mundial 2022, Copa América 2021, 2024

TOTAL CARRERA:
• Goles totales: ${stats.barcelona.estadisticas.goles + stats.psg.estadisticas.goles + stats.inter_miami.estadisticas_actualizadas.total.goles + stats.seleccion_argentina.estadisticas.goles}+
• Asistencias totales: ${stats.barcelona.estadisticas.asistencias + stats.psg.estadisticas.asistencias + stats.inter_miami.estadisticas_actualizadas.total.asistencias + stats.seleccion_argentina.estadisticas.asistencias}+

El jugador más completo de la historia.`;
  }

  generateBarcelona() {
    const bcn = this.kb.carrera.barcelona;
    
    return `Lionel Messi en el FC Barcelona

Periodo: ${bcn.periodo} (${bcn.años} años)

Estadísticas:
• Goles: ${bcn.estadisticas.goles}
• Asistencias: ${bcn.estadisticas.asistencias}
• Partidos: ${bcn.estadisticas.partidos_oficiales}
• Promedio: ${bcn.estadisticas.promedio_gol} goles/partido
• Hat-tricks: ${bcn.estadisticas.hat_tricks}

Títulos (${bcn.titulos.total} en total):
• Champions League: ${bcn.titulos.champions_league.cantidad} (${bcn.titulos.champions_league.años.join(', ')})
• La Liga: ${bcn.titulos.ligas.cantidad} (${bcn.titulos.ligas.años.join(', ')})
• Copa del Rey: ${bcn.titulos.copas_del_rey.cantidad}
• Mundial de Clubes: ${bcn.titulos.mundiales_clubes.cantidad}

Récords principales:
${bcn.records.slice(0, 3).map(r => `• ${r}`).join('\n')}

Messi es el máximo goleador de la historia del Barcelona y uno de los jugadores más importantes de todos los tiempos.`;
  }

  generatePSG() {
    const psg = this.kb.carrera.psg;
    
    return `Lionel Messi en el Paris Saint-Germain

Periodo: ${psg.periodo} (${psg.años} años)
Razón de llegada: ${psg.razon_llegada}

Estadísticas totales:
• Goles: ${psg.estadisticas.goles}
• Asistencias: ${psg.estadisticas.asistencias}
• Partidos: ${psg.estadisticas.partidos_oficiales}
• Promedio: ${psg.estadisticas.promedio_gol} goles/partido

Temporada 2021-22:
• Partidos: ${psg.temporadas["2021-22"].partidos}
• Goles: ${psg.temporadas["2021-22"].goles}
• Asistencias: ${psg.temporadas["2021-22"].asistencias}

Temporada 2022-23:
• Partidos: ${psg.temporadas["2022-23"].partidos}
• Goles: ${psg.temporadas["2022-23"].goles}
• Asistencias: ${psg.temporadas["2022-23"].asistencias}

Títulos (${psg.titulos.total}):
• Ligue 1: ${psg.titulos.ligue_1.cantidad} (${psg.titulos.ligue_1.años.join(', ')})
• Supercopa de Francia: ${psg.titulos.supercopa_francia.cantidad}

Champions League: ${psg.eliminacion_champions}

Evaluación: ${psg.evaluacion}`;
  }

  generateMiami() {
    const miami = this.kb.carrera.inter_miami;
    
    return `Lionel Messi en Inter Miami CF

Fecha de presentación: ${new Date(miami.fecha_presentacion).toLocaleDateString('es-ES')}
Liga: Major League Soccer (MLS)

Estadísticas:
Temporada 2023:
• Partidos: ${miami.estadisticas_actualizadas.temporada_2023.partidos}
• Goles: ${miami.estadisticas_actualizadas.temporada_2023.goles}
• Asistencias: ${miami.estadisticas_actualizadas.temporada_2023.asistencias}
• Título: Leagues Cup 2023

Temporada 2024:
• Partidos: ${miami.estadisticas_actualizadas.temporada_2024.partidos}
• Goles: ${miami.estadisticas_actualizadas.temporada_2024.goles}
• Asistencias: ${miami.estadisticas_actualizadas.temporada_2024.asistencias}

Totales en Miami:
• Partidos: ${miami.estadisticas_actualizadas.total.partidos}
• Goles: ${miami.estadisticas_actualizadas.total.goles}
• Asistencias: ${miami.estadisticas_actualizadas.total.asistencias}

Títulos:
• Leagues Cup 2023: Primer título del club
• Goles de Messi: ${miami.titulos.leagues_cup.goles_messi}
• MVP del torneo: ${miami.titulos.leagues_cup.mvp ? 'Sí' : 'No'}

Compañeros destacados:
${miami.companeros.map(c => `• ${c}`).join('\n')}`;
  }

  generateArgentina() {
    const arg = this.kb.carrera.seleccion_argentina;
    
    return `Lionel Messi con la Selección Argentina

Debut: ${new Date(arg.debut).toLocaleDateString('es-ES')} (${arg.edad_debut} años)

Estadísticas:
• Partidos: ${arg.estadisticas.partidos} (récord absoluto)
• Goles: ${arg.estadisticas.goles} (máximo goleador histórico)
• Asistencias: ${arg.estadisticas.asistencias}
• Partidos como capitán: ${arg.estadisticas.capitanias}+

Títulos mayores:
• Copa del Mundo FIFA 2022 (Qatar)
• Copa América 2021 (Brasil)
• Copa América 2024 (Estados Unidos)
• Finalissima 2022 (vs Italia 3-0)

Subcampeonatos:
• Mundial 2014 (Brasil) - Balón de Oro del torneo
• Copa América: 3 finales (2007, 2015, 2016)

Récords internacionales principales:
${arg.records.internacionales.slice(0, 5).map(r => `• ${r}`).join('\n')}

Messi es considerado el capitán más exitoso en la historia de Argentina.`;
  }

  generatePremios() {
    const premios = this.kb.premios;
    
    return `Premios y reconocimientos de Lionel Messi

Balones de Oro: ${premios.balones_oro.cantidad} (récord absoluto)
Años: ${premios.balones_oro.años.join(', ')}

Botas de Oro: ${premios.botas_oro.cantidad} (récord absoluto)
Años: ${premios.botas_oro.años.join(', ')}

Pichichis La Liga: ${premios.pichichis.cantidad} (récord)
Años: ${premios.pichichis.años.join(', ')}

FIFA The Best: ${premios.fifa_the_best.cantidad}
Años: ${premios.fifa_the_best.años.join(', ')}

Balón de Oro Mundial: ${premios.balon_oro_mundial.cantidad}
Años: 2014, 2022

MVP Champions League: ${premios.mvp_champions.cantidad}

Premios Laureus: ${premios.laureus.cantidad}
Categoría: ${premios.laureus.categoria}
Años: ${premios.laureus.años.join(', ')}

Otros premios importantes:
${premios.premios_adicionales.slice(0, 3).map(p => `• ${p}`).join('\n')}

Récords Guinness:
${premios.records_guinness.slice(0, 3).map(r => `• ${r}`).join('\n')}

Total de premios individuales: Más de 80 premios importantes.`;
  }

  generateTitulos() {
    const carreras = this.kb.carrera;
    
    return `Títulos de Lionel Messi

Total en toda su carrera:
• Barcelona: ${carreras.barcelona.titulos.total} títulos
• PSG: ${carreras.psg.titulos.total} títulos
• Inter Miami: 1 título (Leagues Cup 2023)
• Argentina: 4 títulos mayores + 1 oro olímpico

Títulos internacionales de club:
• UEFA Champions League: 4 (2006, 2009, 2011, 2015)
• Mundial de Clubes FIFA: 3 (2009, 2011, 2015)
• Supercopa de Europa: 3 (2009, 2011, 2015)
• Leagues Cup: 1 (2023)

Títulos nacionales de club:
• La Liga (España): 10 títulos
• Copa del Rey: 7 títulos
• Supercopa de España: 8 títulos
• Ligue 1 (Francia): 2 títulos
• Supercopa de Francia: 1 título

Títulos con Argentina:
• Copa del Mundo FIFA: 1 (2022)
• Copa América: 2 (2021, 2024)
• Finalissima: 1 (2022)
• Medalla de Oro Olímpica: 1 (2008)
• Copa Mundial Sub-20: 1 (2005)

Tripletes:
• Barcelona 2008-09: La Liga, Copa del Rey, Champions League
• Barcelona 2014-15: La Liga, Copa del Rey, Champions League

Messi es uno de los futbolistas más ganadores de la historia.`;
  }

  generateHabilidades() {
    const habilidades = this.kb.habilidades;
    
    return `Habilidades técnicas de Messi

Considerado el jugador más técnicamente completo de la historia.

Habilidades técnicas:
• Regate: 10/10 - Mejor regateador de la historia
• Visión de juego: 10/10 - 305 asistencias con Barcelona
• Definición: 10/10 - Conversión superior al 20%
• Tiro libre: 9/10 - 65+ goles de tiro libre
• Velocidad: 9/10 - Aceleración devastadora
• Cabezazo: 7/10 - Timing excepcional
• Pierna derecha: 8/10 - Efectiva aunque es zurdo

Habilidades mentales:
• Inteligencia táctica: Capacidad para leer el juego
• Resiliencia: Superó lesiones, críticas y fracasos
• Liderazgo: Líder por ejemplo, respetado
• Concentración: Focus en momentos decisivos
• Adaptabilidad: Juega múltiples posiciones

Características físicas:
• Centro de gravedad bajo (1.70m)
• Resistencia para 90 minutos de alta intensidad
• Equilibrio excepcional
• Agilidad en cambios de dirección
• Buena recuperación de lesiones

Evolución de su juego:
1. Etapa temprana (2004-2008): Extremo derecho driblador
2. Etapa Guardiola (2008-2012): Falso 9, máximo goleador
3. Madurez (2012-2017): Mediapunta creativo
4. Etapa final Barcelona (2017-2021): Cerebro del equipo
5. PSG y Miami (2021-presente): Creador y goleador

Capacidad única para combinar visión, regate y definición.`;
  }

  generateComparaciones(entities) {
    const comparaciones = this.kb.comparaciones;
    
    // Detectar si se pregunta por comparación específica
    const tieneCristiano = entities.personas.includes('Cristiano Ronaldo');
    const tieneMaradona = entities.personas.includes('Diego Maradona');
    
    if (tieneCristiano) {
      return this.generateCristianoComparison();
    } else if (tieneMaradona) {
      return this.generateMaradonaComparison();
    }
    
    return `Comparaciones con otros jugadores

Messi vs Cristiano Ronaldo:
• Balones de Oro: Messi 8, Cristiano 5
• Goles carrera: Messi 819+, Cristiano 890+
• Asistencias: Messi 350+, Cristiano 250+
• Champions: Messi 4, Cristiano 5
• Mundial: Messi 1, Cristiano 0

Messi vs Maradona:
• Messi: 8 Balones de Oro, 4 Champions, Mundial 2022
• Maradona: 0 Balones de Oro, 1 UEFA Cup, Mundial 1986
• Messi igualó y superó a Maradona al ganar el Mundial 2022

Messi vs Pelé:
• Pelé: 3 Mundiales, 1000+ goles
• Messi: Mayor nivel de competición, más premios individuales
• Debate subjetivo por diferentes épocas

Messi es único por:
1. Consistencia: 15+ años en el máximo nivel
2. Versatilidad: Múltiples posiciones dominadas
3. Récords: Marcas más importantes
4. Estilo: Combina visión, regate y gol
5. Legado: Ha ganado todo lo importante

Para la mayoría de expertos, Messi es el mejor de todos los tiempos.`;
  }

  generateCristianoComparison() {
    const comparacion = this.kb.comparaciones.cristiano_ronaldo;
    
    return `Messi vs Cristiano Ronaldo

La rivalidad que definió una generación (2009-2021).

Estilo de juego:
Messi (El Genio):
• Juego asociativo, creación colectiva
• Regate técnico, cambios de dirección
• Visión de juego excepcional
• Pases de gol (asistencias)
• Finalización precisa

Cristiano (La Máquina):
• Juego individual, definición
• Fuerza física, potencia
• Cabezazo excepcional
• Disparos potentes de larga distancia
• Desmarques y llegadas al área

Estadísticas comparadas:
• Goles carrera: Messi 819+ vs Cristiano 890+
• Asistencias: Messi 350+ vs Cristiano 250+
• Balones de Oro: Messi 8 vs Cristiano 5
• Champions: Messi 4 vs Cristiano 5
• Mundial: Messi 1 vs Cristiano 0

Logros con selecciones:
Messi con Argentina:
• Mundial 2022
• Copa América 2021, 2024
• Finalissima 2022
• Subcampeón Mundial 2014

Cristiano con Portugal:
• Eurocopa 2016
• Nations League 2019

Opinión de expertos:
Pep Guardiola: "Messi es el mejor de todos. Cristiano es increíble, pero Messi es de otro planeta."
Johan Cruyff: "Messi es el único que puede hacer lo que quiere con el balón."

Veredicto: Messi ganó el Mundial 2022, lo que para muchos cerró el debate. Ambos son leyendas, pero Messi es considerado por la mayoría como el más completo.`;
  }

  generateMaradonaComparison() {
    const comparacion = this.kb.comparaciones.maradona;
    
    return `Messi vs Maradona

El debate que dividió a Argentina y se resolvió en Qatar 2022.

Similitudes:
• Ambos zurdos de baja estatura
• Nacidos en Rosario, Argentina
• Capitanes de la selección argentina
• Líderes dentro y fuera del campo
• Capacidad para decidir partidos

Diferencias:
Messi:
• Carrera más longeva (20+ años en élite)
• Mayor consistencia estadística
• Más premios individuales
• Menos problemas extradeportivos
• Estilo más colectivo

Maradona:
• Más explosivo en momentos clave
• Carisma más fuerte
• Más determinante en partidos únicos
• Estilo más individualista
• Mayor impacto cultural

Logros comparados:
Messi:
• Mundial 2022
• 2 Copas América (2021, 2024)
• 4 Champions League
• 10 Ligas españolas
• 8 Balones de Oro

Maradona:
• Mundial 1986
• 1 UEFA Cup (Nápoles)
• 2 Ligas italianas (Nápoles)
• 0 Balones de Oro (era solo para europeos)

Momentos icónicos:
Maradona:
• Mano de Dios vs Inglaterra (1986)
• Gol del Siglo vs Inglaterra (1986)
• Nápoles campeón (1987, 1990)

Messi:
• Gol a Getafe (réplica del Gol del Siglo)
• Remontada vs PSG (2017)
• Final Mundial 2022 (doblete)
• Copa América 2021 (primer título)

Opinión de Maradona sobre Messi:
"Messi es un gran jugador, pero le falta ganar algo con Argentina para ser considerado grande."
"Técnicamente es mejor que yo, pero yo tenía más carácter."

Veredicto: Messi igualó y superó los logros deportivos de Maradona. Ambos son los dos mejores jugadores argentinos de la historia.`;
  }

  generateVidaPersonal() {
    const vida = this.kb.vida_personal;
    
    return `Vida personal de Lionel Messi

Familia:
• Esposa: ${vida.familia.esposa.nombre}
  - Pareja desde la infancia en Rosario
  - Boda: ${new Date(vida.familia.esposa.boda).toLocaleDateString('es-ES')}
• Hijos:
  - Thiago (2012, ${new Date().getFullYear() - 2012} años)
  - Mateo (2015, ${new Date().getFullYear() - 2015} años)
  - Ciro (2018, ${new Date().getFullYear() - 2018} años)
• Padres:
  - Padre: ${vida.familia.padres.padre}
  - Madre: ${vida.familia.padres.madre}
• Hermanos: Rodrigo, Matías, María Sol

Residencia actual: ${vida.residencia.actual}
Residencias anteriores: ${vida.residencia.anteriores.join(', ')}

Patrimonio y finanzas:
• Valor estimado: ${vida.patrimonio.valor_estimado}
• Ingresos anuales: ${vida.patrimonio.ingresos_anuales}
• Propiedades: ${vida.patrimonio.propiedades.join(', ')}

Patrocinios principales:
${vida.patronajes.slice(0, 5).map(p => `• ${p}`).join('\n')}

Fundación Leo Messi:
• Año creación: ${vida.fundacion.año_creacion}
• Objetivo: ${vida.fundacion.objetivo}
• Proyectos: ${vida.fundacion.proyectos.join(', ')}

Pasatiempos: ${vida.pasatiempos.join(', ')}

Personalidad: ${vida.personalidad}

Características:
• Humilde a pesar del éxito
• Familiar, dedica tiempo a su familia
• Leal a sus amigos (Suárez, Agüero, etc.)
• Respetuoso con rivales y compañeros
• Evita la polémica y los medios

Datos curiosos:
• Su primer contrato con Barcelona fue firmado en una servilleta
• Nunca ha recibido una tarjeta roja en Champions League
• Tiene doble nacionalidad: argentina y española
• Su mejor amigo en el fútbol es Luis Suárez
• No bebe alcohol`;
  }

  generateRecords() {
    const records = this.kb.carrera;
    const premios = this.kb.premios;
    
    return `Récords y logros históricos de Messi

Messi posee más récords que cualquier otro futbolista en la historia.

Récords mundiales:
${premios.records_guinness.slice(0, 5).map(r => `• ${r}`).join('\n')}

Récords con Barcelona:
${records.barcelona.records.slice(0, 5).map(r => `• ${r}`).join('\n')}

Récords con Argentina:
${records.seleccion_argentina.records.internacionales.slice(0, 5).map(r => `• ${r}`).join('\n')}

Récords en Champions League:
• Más goles para un mismo club: 120 (Barcelona)
• Más goles en fase de grupos: 71
• Más partidos marcando consecutivos: 16 jornadas
• Más hat-tricks: 8 (compartido)

Récords en La Liga:
• Máximo goleador histórico: 474 goles
• Máximo asistente histórico: 192 asistencias
• Más hat-tricks: 36
• Más Pichichis: 8
• Más goles en una temporada: 50 (2011-12)

Récords únicos:
• Único con 8 Balones de Oro
• Único con 6 Botas de Oro
• Único en marcar en 5 Copas del Mundo diferentes
• Único en ganar Balón de Oro jugando fuera de Europa (2023)

Récords de longevidad:
• Más años consecutivos marcando 40+ goles: 9 años (2009-2017)
• Más años entre primer y último Balón de Oro: 14 años (2009-2023)
• Más años jugando en élite: 20+ años (2004-presente)

Estadísticas increíbles:
• Promedio de gol en carrera: 0.79 goles/partido
• Participación en goles: 1.14 goles+asistencias/partido
• Efectividad de disparo: 23% son gol
• Goles con pierna izquierda: 700+ (90%)
• Goles con pierna derecha: 100+
• Goles de cabeza: 26

Total de récords documentados: Más de 150 récords oficiales.

Legado estadístico: Posiblemente nadie supere sus marcas en décadas.`;
  }

  generateDefault(userQuery, tokens) {
    // Análisis más profundo de la consulta
    const lowerQuery = userQuery.toLowerCase();
    
    // Detectar si es sobre Messi pero no lo nombra
    const messiKeywords = ['el', 'mejor', 'jugador', 'futbolista', 'argentino', 'barcelona', '10'];
    const isAboutMessiImplied = messiKeywords.some(keyword => lowerQuery.includes(keyword)) && 
                                lowerQuery.length < 30;
    
    if (isAboutMessiImplied) {
      return `Parece que estás preguntando sobre Lionel Messi, ¿es correcto?

  Si es así, puedo darte información detallada sobre:
  • Estadísticas específicas por equipo o torneo
  • Habilidades técnicas particulares
  • Comparaciones con otros jugadores
  • Momentos históricos específicos
  • Premios y récords concretos

  Por ejemplo:
  • "¿Cuántos goles tiene Messi en Champions?"
  • "¿Cómo es el regate de Messi?"
  • "¿Qué diferencia a Messi de Cristiano Ronaldo?"
  • "¿Cuál fue el mejor gol de Messi?"`;
    }
    
    // Si no es sobre Messi
    const noMessiTopics = ['cristiano', 'ronaldo', 'maradona', 'neymar', 'mbappe', 'dólar', 'tarjeta', 'seguro'];
    const isOtherTopic = noMessiTopics.some(topic => lowerQuery.includes(topic));
    
    if (isOtherTopic && !lowerQuery.includes('messi')) {
      return this.generateNoMessiResponse();
    }
    
    // Respuesta general mejorada
    return `Asistente especializado en Lionel Messi

  He detectado tu consulta pero necesito más especificidad para darte una respuesta precisa.

  Para obtener información específica, intenta preguntar sobre:

  📊 **Estadísticas concretas:**
  • "¿Cuántos goles tiene Messi en Champions League?"
  • "¿Cuántas asistencias dio en Barcelona?"
  • "¿Cuál es su promedio de gol en La Liga?"

  ⚽ **Habilidades técnicas:**
  • "¿Cómo es el regate de Messi?"
  • "¿Qué tan bueno es en tiros libres?"
  • "¿Cómo es su visión de juego?"

  🏆 **Logros específicos:**
  • "¿Qué récords tiene Messi?"
  • "¿Cuántos Balones de Oro ganó?"
  • "¿Qué títulos ganó con Argentina?"

  📅 **Periodos específicos:**
  • "¿Cómo fue Messi en el Barcelona 2011-12?"
  • "¿Qué hizo en el Mundial 2022?"
  • "¿Cómo es su etapa en Miami?"

  ¿Sobre qué aspecto específico de Messi te gustaría saber?`;
  }

  generateDetallesEspecificos(entities, tokens) {
    const habilidades = this.kb.habilidades;
    
    if (entities.habilidades.includes('regate')) {
      return `Habilidad de regate de Messi:

  Considerado el mejor regateador de la historia por:
  1. Centro de gravedad bajo (1.70m) que le da estabilidad
  2. Cambios de dirección súbitos sin perder velocidad
  3. Control del balón pegado al pie incluso a máxima velocidad
  4. Finta corporal excepcional que engaña a los defensores

  Estadísticas:
  • Promedio de 5+ regates exitosos por partido en su prime
  • Tasa de éxito en regates: 60-70%
  • Récord de 12 regates exitosos en un solo partido

  Regates característicos:
  • La Croqueta: Amortiguar entre ambos pies
  • Elástico: Finta exterior-interior
  • Cambio de ritmo brusco
  • Giros de 360 grados

  Entrenadores que lo elogiaron:
  Pep Guardiola: "Nunca he visto a nadie con ese control"
  Johan Cruyff: "El balón parece pegado a su pie"
  Diego Maradona: "Dios puso la pelota en sus pies"`;
    }

    if (entities.habilidades.includes('visión')) {
      return `Visión de juego de Messi:

  Capacidad única para:
  1. Ver pases que otros no ven
  2. Anticipar movimientos 2-3 jugadas antes
  3. Crear espacios donde no los hay
  4. Distribuir el juego con precisión milimétrica

  Estadísticas de asistencias:
  • Total carrera: 350+ asistencias
  • Barcelona: 305 asistencias oficiales
  • Argentina: 58 asistencias
  • Promedio: 0.35 asistencias/partido

  Asistencias memorables:
  • A Dani Alves vs Real Madrid 2011 (Clásico)
  • A Pedro vs Manchester United (Final Champions 2011)
  • A Di María vs Francia (Final Mundial 2022)
  • A Lautaro Martínez vs Colombia (Copa América 2024)

  Características:
  • Pases filtrados de 30-40 metros con precisión
  • Pases de tacón en espacios reducidos
  • Cambios de juego a la perfección
  • Pases al espacio para compañeros en movimiento`;
    }

    return `Habilidades técnicas de Messi:

  Messi combina múltiples habilidades a un nivel histórico:

  1. Regate (10/10): El mejor de la historia
  2. Visión (10/10): Ve pases imposibles
  3. Definición (10/10): Precisión letal
  4. Tiro libre (9/10): Evolucionó a especialista
  5. Velocidad (9/10): Aceleración explosiva
  6. Pierna derecha (8/10): Efectiva aunque es zurdo

  ¿Sobre qué habilidad específica quieres más detalles?`;
  }

  generateEstadisticasPorTorneo(entities) {
    const stats = this.kb.carrera;
    const premios = this.kb.premios;
    
    if (entities.torneos.includes('Champions League')) {
      return `Messi en Champions League:

  Estadísticas totales:
  • Partidos: 163
  • Goles: 129 (4º histórico)
  • Asistencias: 49
  • Promedio: 0.79 goles/partido
  • Hat-tricks: 8

  Por fases:
  • Fase de grupos: 71 goles (récord)
  • Octavos: 29 goles
  • Cuartos: 12 goles
  • Semifinales: 6 goles
  • Finales: 2 goles

  Récords:
  • Máximo goleador para un mismo club: 120 (Barcelona)
  • Más goles en fase de grupos: 71
  • Más hat-tricks: 8 (compartido)
  • Jugador con más temporadas consecutivas marcando: 16

  Finales jugadas (4):
  • 2009: Barcelona 2-0 Manchester United (gol de cabeza)
  • 2011: Barcelona 3-1 Manchester United (asistencia)
  • 2015: Barcelona 3-1 Juventus (no marcó)
  • 2021: Barcelona 1-3 PSG (gol de tiro libre)

  MVP de Champions: 3 veces (2009, 2011, 2015)`;
    }

    if (entities.torneos.includes('La Liga')) {
      return `Messi en La Liga:

  Estadísticas con Barcelona:
  • Partidos: 520
  • Goles: 474 (récord histórico)
  • Asistencias: 192 (récord histórico)
  • Promedio: 0.91 goles/partido
  • Hat-tricks: 36 (récord)

  Récords absolutos:
  • Máximo goleador histórico de La Liga
  • Máximo asistente histórico de La Liga
  • Más Pichichis: 8
  • Más goles en una temporada: 50 (2011-12)
  • Más hat-tricks: 36
  • Único jugador en marcar 40+ goles en 5 temporadas

  Temporadas destacadas:
  • 2011-12: 50 goles en 37 partidos (1.35 promedio)
  • 2012-13: 46 goles en 32 partidos (1.44 promedio)
  • 2014-15: 43 goles en 38 partidos (1.13 promedio)

  Partidos memorables:
  • Real Madrid 2-6 Barcelona (2009): 2 goles
  • Barcelona 5-0 Real Madrid (2010): 1 gol
  • Levante 0-5 Barcelona (2013): 3 goles`;
    }

    return `Estadísticas de Messi por torneo:

  Selecciona un torneo específico:
  • Champions League: 129 goles en 163 partidos
  • La Liga: 474 goles en 520 partidos (récord)
  • Copa del Rey: 56 goles en 80 partidos
  • Mundial: 13 goles en 26 partidos
  • Copa América: 13 goles en 34 partidos

  ¿De qué torneo específico quieres estadísticas?`;
  }
}

// ============================================================================
// FASE 6: DESPLIEGUE (Deployment) - COMPONENTE REACT COMPLETO
// ============================================================================

const MessiChatbot = () => {
  // ==================== ESTADOS DEL COMPONENTE ====================
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [userFeedback, setUserFeedback] = useState(null);
  
  // Referencias
  const recognitionRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Instancias del motor de PLN
  const nlpEngine = useMemo(() => new AdvancedNLPEngine(), []);
  const intentClassifier = useMemo(() => new IntentClassifier(nlpEngine), []);
  const responseGenerator = useMemo(() => new ResponseGenerator(MESSI_KNOWLEDGE_BASE), []);
  
  // ==================== INICIALIZACIÓN ====================
  useEffect(() => {
    // Inicializar reconocimiento de voz
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      // Configuración avanzada
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-ES';
      recognitionRef.current.maxAlternatives = 3;
      
      // Eventos
      recognitionRef.current.onstart = () => {
        console.log('🟢 Reconocimiento de voz iniciado');
      };
      
      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece;
            console.log(`🗣️ Transcripción final (confianza: ${confidence}): ${transcriptPiece}`);
          } else {
            interimTranscript += transcriptPiece;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
        
        // Si hay transcripción final, procesarla
        if (finalTranscript) {
          handleSendMessage(finalTranscript);
          setTranscript('');
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('❌ Error de reconocimiento:', event.error);
        setIsListening(false);
        addSystemMessage(`Error de reconocimiento de voz: ${event.error}`);
      };
      
      recognitionRef.current.onend = () => {
        console.log('🛑 Reconocimiento de voz detenido');
        setIsListening(false);
      };
    } else {
      console.warn('⚠️ Reconocimiento de voz no soportado en este navegador');
    }
    
    // Mensaje de bienvenida inicial
    setTimeout(() => {
      const welcomeMessage = `

¡Bienvenido al sistema de inteligencia artificial especializado en Lionel Messi!

¿Qué te gustaría saber sobre Messi?
`;

      addBotMessage(welcomeMessage);
    }, 500);
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);
  
  // ==================== FUNCIONES AUXILIARES ====================
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const addUserMessage = (text) => {
    const message = {
      id: Date.now(),
      text,
      isUser: true,
      timestamp: new Date(),
      intent: null
    };
    
    setMessages(prev => [...prev, message]);
    return message;
  };
  
  const addBotMessage = (text, intent = null) => {
    const message = {
      id: Date.now() + 1,
      text,
      isUser: false,
      timestamp: new Date(),
      intent
    };
    
    setMessages(prev => [...prev, message]);
    
    // Guardar en historial
    setConversationHistory(prev => [...prev, {
      query: messages[messages.length - 1]?.text || '',
      response: text,
      intent,
      timestamp: new Date()
    }]);
    
    return message;
  };
  
  const addSystemMessage = (text) => {
    const message = {
      id: Date.now(),
      text,
      isUser: false,
      isSystem: true,
      timestamp: new Date(),
      intent: 'system'
    };
    
    setMessages(prev => [...prev, message]);
    return message;
  };
  
  // ==================== PROCESAMIENTO DE CONSULTAS ====================
  const processQuery = async (query) => {
    if (!query.trim()) return;
    
    setIsProcessing(true);
    
    // Agregar mensaje del usuario
    const userMessage = addUserMessage(query);
    
    try {
      // 1. Clasificar intención
      const classification = intentClassifier.classify(query);
      
      console.log('🔍 Clasificación detectada:', {
        intent: classification.intent,
        confidence: classification.confidence,
        entities: classification.entities
      });
      
      // 2. Generar respuesta
      const response = responseGenerator.generate(classification, query);
      
      // 3. Agregar respuesta del bot
      const botMessage = addBotMessage(response, classification.intent);
      
      // 4. Síntesis de voz si está activada
      if (voiceEnabled && !isSpeaking) {
        speak(response.substring(0, 500)); // Limitar para no saturar
      }
      
      // 5. Guardar análisis para mejorar el sistema
      saveAnalysis({
        query,
        classification,
        response,
        timestamp: new Date(),
        userFeedback: null
      });
      
    } catch (error) {
      console.error('❌ Error procesando consulta:', error);
      addBotMessage(`⚠️ **Error en el procesamiento**

Lo siento, hubo un error procesando tu consulta. Por favor, intenta de nuevo.

Detalles técnicos: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const saveAnalysis = (analysis) => {
    // Guardar en localStorage para análisis posterior
    const savedAnalyses = JSON.parse(localStorage.getItem('messi_chatbot_analyses') || '[]');
    savedAnalyses.push(analysis);
    localStorage.setItem('messi_chatbot_analyses', JSON.stringify(savedAnalyses.slice(-100))); // Guardar últimas 100
  };
  
  // ==================== MANEJO DE VOZ ====================
  const toggleListening = () => {
    if (!recognitionRef.current) {
      addSystemMessage('⚠️ Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge para esta función.');
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      addSystemMessage('🎤 Reconocimiento de voz detenido');
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        if (synthRef.current) {
          synthRef.current.cancel();
        }
        setIsSpeaking(false);
        addSystemMessage('🎤 Reconocimiento de voz iniciado... Habla ahora');
      } catch (error) {
        console.error('Error iniciando reconocimiento:', error);
        addSystemMessage('❌ Error iniciando reconocimiento de voz');
      }
    }
  };
  
  const speak = (text) => {
    if (!voiceEnabled || !synthRef.current || !text) return;
    
    // Cancelar cualquier síntesis previa
    synthRef.current.cancel();
    
    // Crear utterance con configuración
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Seleccionar voz en español
    const voices = synthRef.current.getVoices();
    const spanishVoice = voices.find(voice => 
      voice.lang.startsWith('es') && 
      voice.name.includes('Spanish') || 
      voice.lang.startsWith('es-ES')
    );
    
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }
    
    // Eventos
    utterance.onstart = () => {
      setIsSpeaking(true);
      console.log('🔊 Iniciando síntesis de voz');
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      console.log('🔇 Síntesis de voz finalizada');
    };
    
    utterance.onerror = (event) => {
      console.error('❌ Error en síntesis de voz:', event);
      setIsSpeaking(false);
    };
    
    // Iniciar síntesis
    synthRef.current.speak(utterance);
  };
  
  // ==================== MANEJO DE INTERACCIÓN ====================
  const handleSendMessage = (message) => {
    if (!message.trim()) return;
    processQuery(message);
    setTextInput('');
  };
  
  const handleTextSubmit = () => {
    if (textInput.trim()) {
      handleSendMessage(textInput);
    }
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };
  
  const clearConversation = () => {
    setMessages([]);
    addSystemMessage('💬 Conversación reiniciada. ¿En qué puedo ayudarte ahora?');
  };
  
  const provideFeedback = (feedback) => {
    setUserFeedback(feedback);
    addSystemMessage(`✅ Gracias por tu feedback: ${feedback === 'positive' ? '👍 Positivo' : '👎 Negativo'}`);
    
    // Guardar feedback para mejora del sistema
    const lastMessage = messages[messages.length - 2];
    if (lastMessage) {
      saveAnalysis({
        query: lastMessage.text,
        feedback,
        timestamp: new Date()
      });
    }
  };
  
  // ==================== RENDERIZADO ====================
  return React.createElement('div', { className: 'fixed bottom-6 right-6 z-50 font-sans' },
    // Botón flotante para abrir chat (SIMPLIFICADO)
    !isChatOpen && React.createElement('button', {
      onClick: () => setIsChatOpen(true),
      className: 'bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-full p-5 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 animate-pulse border-2 border-white',
      style: { 
        boxShadow: '0 10px 40px rgba(59, 130, 246, 0.5)'
      },
      title: 'Abrir Chatbot de Messi'
    },
      React.createElement('div', { className: 'relative' },
        React.createElement('span', { className: 'text-3xl font-bold' }, 'M'),
        React.createElement('span', {
          className: 'absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping'
        })
      )
    ),
    
    // Ventana de chat
    isChatOpen && React.createElement('div', {
      className: `rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col overflow-hidden border-2 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`,
      style: { 
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
      }
    },
      // Encabezado (SIMPLIFICADO)
      React.createElement('div', {
        className: `p-4 flex items-center justify-between ${darkMode ? 'bg-gradient-to-r from-gray-800 to-gray-900 text-white' : 'bg-gradient-to-r from-blue-600 to-purple-700 text-white'}`
      },
        React.createElement('div', { className: 'flex items-center space-x-3' },
          React.createElement('div', {
            className: 'w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg'
          },
            React.createElement('span', { className: 'text-2xl font-bold text-blue-600' }, 'M')
          ),
          React.createElement('div', null,
            React.createElement('h3', { className: 'font-bold text-lg' }, 'Messi Assistant'),
            React.createElement('p', { className: 'text-xs opacity-90' },
              'CRISP-DM NLP v2.0'
            )
          )
        ),
        React.createElement('div', { className: 'flex items-center space-x-2' },
          React.createElement('button', {
            onClick: () => setDarkMode(!darkMode),
            className: 'p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors',
            title: darkMode ? 'Modo claro' : 'Modo oscuro'
          },
            React.createElement('span', { className: 'text-lg' },
              darkMode ? '☀️' : '🌙'
            )
          ),
          React.createElement('button', {
            onClick: clearConversation,
            className: 'p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors',
            title: 'Reiniciar conversación'
          },
            React.createElement('span', { className: 'text-lg' }, '↻')
          ),
          React.createElement('button', {
            onClick: () => setIsChatOpen(false),
            className: 'p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors',
            title: 'Cerrar chat'
          },
            React.createElement('span', { className: 'text-lg' }, '×')
          )
        )
      ),
      
      // Indicadores de estado (SIMPLIFICADOS)
      React.createElement('div', {
        className: `px-4 py-2 text-xs flex justify-between items-center ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`
      },
        React.createElement('div', { className: 'flex items-center space-x-3' },
          React.createElement('span', { className: 'text-xs' }, isListening ? '🎤 Escuchando...' : 'Mic off'),
          React.createElement('span', { className: 'text-xs' }, isSpeaking ? '🔊 Hablando...' : 'Silencio'),
          React.createElement('span', { className: 'text-xs' }, voiceEnabled ? 'Voz on' : 'Voz off')
        ),
        React.createElement('div', null,
          React.createElement('span', { className: 'text-xs' }, `${messages.length} mensajes`)
        )
      ),
      
      // Área de mensajes
      React.createElement('div', {
        className: `flex-1 overflow-y-auto p-4 space-y-4 ${darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-gray-50 to-white'}`,
        style: { scrollBehavior: 'smooth' }
      },
        messages.map((msg) =>
          React.createElement('div', {
            key: msg.id,
            className: `flex ${msg.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`
          },
            React.createElement('div', {
              className: `max-w-[85%] p-4 rounded-2xl ${msg.isSystem ? 'bg-yellow-100 border border-yellow-200 text-yellow-800' : 
                msg.isUser ? 
                  `${darkMode ? 'bg-gradient-to-r from-blue-700 to-blue-800 text-white' : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'} rounded-br-none shadow-md` : 
                  `${darkMode ? 'bg-gray-800 text-gray-100 border border-gray-700' : 'bg-white text-gray-800 border border-gray-100'} rounded-bl-none shadow-sm`
              } transition-all duration-300 hover:shadow-lg`
            },
              // Cabecera del mensaje (SIMPLIFICADA)
              React.createElement('div', { className: 'flex items-center justify-between mb-2' },
                React.createElement('div', { className: 'flex items-center space-x-2' },
                  React.createElement('span', {
                    className: `${msg.isUser ? 'text-blue-200' : msg.isSystem ? 'text-yellow-600' : darkMode ? 'text-purple-400' : 'text-purple-600'} font-medium`
                  },
                    msg.isUser ? 'Tú' : msg.isSystem ? 'Sistema' : 'Asistente'
                  )
                ),
                React.createElement('span', {
                  className: `text-xs ${msg.isUser ? 'text-blue-200' : msg.isSystem ? 'text-yellow-600' : darkMode ? 'text-gray-500' : 'text-gray-400'}`
                },
                  msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
                )
              ),
              
              // Contenido del mensaje (SIMPLIFICADO)
              React.createElement('div', { className: 'message-content' },
                msg.text.split('\n').map((line, index) =>
                  React.createElement('p', {
                    key: index,
                    className: `text-sm leading-relaxed ${index > 0 ? 'mt-2' : ''} ${darkMode && !msg.isUser ? 'text-gray-100' : ''}`
                  }, line)
                )
              )
            )
          )
        ),
        
        // Indicador de transcripción (SIMPLIFICADO)
        transcript && isListening && React.createElement('div', { className: 'flex justify-end' },
          React.createElement('div', {
            className: 'bg-gradient-to-r from-green-100 to-blue-100 text-gray-800 p-3 rounded-2xl rounded-br-none border border-green-200 flex items-center space-x-2'
          },
            React.createElement('span', { className: 'animate-pulse' }, '🎤'),
            React.createElement('p', { className: 'text-sm italic font-medium' }, transcript)
          )
        ),
        
        // Indicador de procesamiento (SIMPLIFICADO)
        isProcessing && React.createElement('div', { className: 'flex justify-start' },
          React.createElement('div', {
            className: `${darkMode ? 'bg-gray-800 text-gray-100 border-gray-700' : 'bg-white text-gray-800 border-gray-100'} p-4 rounded-2xl rounded-bl-none border shadow-sm flex items-center space-x-3`
          },
            React.createElement('div', { className: 'flex space-x-1' },
              React.createElement('div', { 
                className: 'w-2 h-2 rounded-full bg-blue-600 animate-bounce' 
              }),
              React.createElement('div', { 
                className: 'w-2 h-2 rounded-full bg-blue-600 animate-bounce', 
                style: { animationDelay: '0.1s' } 
              }),
              React.createElement('div', { 
                className: 'w-2 h-2 rounded-full bg-blue-600 animate-bounce', 
                style: { animationDelay: '0.2s' } 
              })
            ),
            React.createElement('span', { 
              className: `text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`
            }, 'Analizando...')
          )
        ),
        
        React.createElement('div', { ref: messagesEndRef })
      ),
      
      // Controles de entrada (SIMPLIFICADOS)
      React.createElement('div', {
        className: `p-4 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`
      },
        // Botones de acción rápida
        React.createElement('div', { className: 'flex justify-center space-x-4 mb-3' },
          React.createElement('button', {
            onClick: toggleListening,
            className: `p-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
              isListening
                ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg animate-pulse'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md hover:shadow-lg'
            }`,
            title: isListening ? 'Detener grabación' : 'Hablar con voz'
          },
            React.createElement('span', { className: 'text-xl' },
              isListening ? '⏹️' : '🎤'
            )
          ),
          
          React.createElement('button', {
            onClick: () => setVoiceEnabled(!voiceEnabled),
            className: `p-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
              voiceEnabled
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg'
                : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md hover:shadow-lg'
            }`,
            title: voiceEnabled ? 'Silenciar voz' : 'Activar voz'
          },
            React.createElement('span', { className: 'text-xl' },
              voiceEnabled ? '🔊' : '🔇'
            )
          ),
          
          React.createElement('button', {
            onClick: () => handleSendMessage('¿Cuáles son los récords de Messi?'),
            className: `p-3 rounded-full transition-all duration-300 transform hover:scale-105 ${
              darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            } shadow-md hover:shadow-lg`,
            title: 'Pregunta rápida: Récords'
          },
            React.createElement('span', { className: 'text-xl' }, '🏆')
          )
        ),
        
        // Campo de entrada de texto
        React.createElement('div', { className: 'flex space-x-2' },
          React.createElement('div', { className: 'flex-1 relative' },
            React.createElement('textarea', {
              ref: inputRef,
              value: textInput,
              onChange: (e) => setTextInput(e.target.value),
              onKeyDown: handleKeyPress,
              placeholder: 'Pregunta sobre Lionel Messi...',
              rows: 1,
              className: `w-full px-4 py-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${darkMode ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400' : 'bg-gray-100 text-gray-800 border-gray-200 placeholder-gray-500'}`,
              style: { minHeight: '48px', maxHeight: '120px' },
              onInput: (e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
              }
            })
          ),
          React.createElement('button', {
            onClick: handleTextSubmit,
            disabled: !textInput.trim() || isProcessing,
            className: `p-3 rounded-full transition-all duration-300 transform hover:scale-105 ${darkMode ? 'bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900' : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'} text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`,
            title: 'Enviar mensaje'
          },
            React.createElement('span', { className: 'text-xl' }, '➤')
          )
        ),
        
        // Información del sistema (SIMPLIFICADA)
        React.createElement('div', { className: 'mt-2 text-center' },
          React.createElement('p', { className: `text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}` },
            `CRISP-DM NLP v2.0 | ${messages[messages.length - 1]?.intent?.replace(/_/g, ' ') || 'esperando consulta...'}`
          )
        )
      )
    )
  );
};

// ============================================================================
// INICIALIZACIÓN Y ESTILOS CSS
// ============================================================================

// Agregar estilos CSS dinámicos
const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  
  @keyframes ping {
    75%, 100% { transform: scale(2); opacity: 0; }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
  
  .animate-pulse {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  .animate-bounce {
    animation: bounce 0.5s infinite;
  }
  
  .animate-ping {
    animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
  }
  
  .message-content strong {
    font-weight: 700;
    color: inherit;
  }
  
  .message-content em {
    font-style: italic;
  }
  
  .message-content hr {
    border: none;
    height: 1px;
    background: linear-gradient(to right, transparent, currentColor, transparent);
    margin: 0.5rem 0;
  }
  
  /* Scrollbar personalizada */
  ::-webkit-scrollbar {
    width: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.3);
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(59, 130, 246, 0.5);
  }
`;

// Inyectar estilos
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

// ============================================================================
// RENDERIZAR COMPONENTE
// ============================================================================

const root = ReactDOM.createRoot(document.getElementById('messi-chatbot-root'));
root.render(React.createElement(MessiChatbot));

// ============================================================================
// EXPORTACIÓN PARA USO EXTERNO
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MESSI_KNOWLEDGE_BASE,
    AdvancedNLPEngine,
    IntentClassifier,
    ResponseGenerator,
    MessiChatbot
  };
}

console.log(`
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║   🚀 MESSI CHATBOT CRISP-DM NLP v2.0 INICIALIZADO CORRECTAMENTE   ║
║                                                                   ║
║   • Base de conocimiento: ${Object.keys(MESSI_KNOWLEDGE_BASE).length} categorías          ║
║   • Sistema de clasificación: ${Object.keys(new IntentClassifier(new AdvancedNLPEngine()).intents).length} intenciones ║
║   • Motor de PLN: Tokenización, NER, Análisis de Sentimiento     ║
║   • Interfaz: Voz + Texto + Modo Oscuro + Feedback               ║
║                                                                   ║
║   ¿Preguntas? Escribe sobre Lionel Messi y descubre todo         ║
║   sobre el mejor futbolista de todos los tiempos. 🐐             ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
`);