// voice-chatbot.js - Chatbot con clasificación de intenciones y PLN mejorado
const { useState, useRef, useEffect } = React;

const VoiceChatBot = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [isLoadingKnowledge, setIsLoadingKnowledge] = useState(true);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const messagesEndRef = useRef(null);

  // ==================== BASE DE CONOCIMIENTO ESTRUCTURADA ====================
  
  const MESSI_KNOWLEDGE_BASE = {
    // Biografía general (para preguntas como "quién es Messi")
    biografia: {
      id: "biografia",
      title: "Biografía de Lionel Messi",
      content: `Lionel Andrés Messi Cuccittini es un futbolista argentino nacido el 24 de junio de 1987 en Rosario, Argentina. Es considerado uno de los mejores futbolistas de todos los tiempos.

Actualmente juega en el Inter Miami de la MLS y es capitán de la selección argentina.

Entre sus logros destacan:
- 8 Balones de Oro (récord absoluto)
- 4 Champions League con el Barcelona
- Mundial 2022 y Copa América 2021 con Argentina
- Máximo goleador histórico del Barcelona y La Liga`,
      tags: ['biografia', 'quien es', 'presentacion', 'resumen']
    },
    
    // Información específica por categorías
    estadisticas: {
      barcelona: `ESTADÍSTICAS EN EL BARCELONA (2004-2021):
• Partidos: 778
• Goles: 672
• Asistencias: 305
• Promedio: 0.86 goles/partido
• Títulos: 35 trofeos`,
      
      psg: `ESTADÍSTICAS EN EL PSG (2021-2023):
• Partidos: 75
• Goles: 32
• Asistencias: 35
• Títulos: 3 (2 Ligas 1, 1 Supercopa)`,
      
      miami: `ESTADÍSTICAS EN INTER MIAMI (2023-ACTUAL):
• Partidos: 41 (hasta final 2024)
• Goles: 25
• Asistencias: 19
• Títulos: 1 (Leagues Cup 2023)`,
      
      argentina: `ESTADÍSTICAS CON ARGENTINA:
• Partidos: 180 (récord)
• Goles: 106 (récord)
• Asistencias: 56
• Títulos: Mundial 2022, Copa América 2021, Finalissima 2022`
    },
    
    premios: {
      balonesOro: `BALONES DE ORO: 8 (RÉCORD ABSOLUTO)
• 2009, 2010, 2011, 2012, 2015, 2019, 2021, 2023`,
      
      botasOro: `BOTAS DE ORO: 6 (RÉCORD ABSOLUTO)
• 2010 (34 goles), 2012 (50 goles), 2013 (46 goles)
• 2017 (37 goles), 2018 (34 goles), 2019 (36 goles)`,
      
      otrosPremios: `OTROS PREMIOS DESTACADOS:
• FIFA The Best: 2019, 2022
• Balón de Oro Mundial: 2014, 2022
• Pichichi de La Liga: 8 veces (récord)
• MVP Champions: 3 veces`
    },
    
    datosPersonales: {
      basicos: `DATOS PERSONALES BÁSICOS:
• Nombre completo: Lionel Andrés Messi Cuccittini
• Nacimiento: 24 de junio de 1987 (36 años)
• Lugar: Rosario, Argentina
• Altura: 1.70 metros
• Posición: Delantero / Mediocentro`,
      
      familia: `FAMILIA:
• Esposa: Antonela Roccuzzo (casados en 2017)
• Hijos: Thiago (2012), Mateo (2015), Ciro (2018)
• Hermanos: Rodrigo, Matías, María Sol`,
      
      vida: `OTROS DATOS:
• Problemas de crecimiento en la infancia
• Contrato inicial en servilleta (diciembre 2000)
• Fundación Leo Messi (ayuda a niños)`
    },
    
    actualidad: {
      equipoActual: `ACTUALMENTE JUEGA EN:
• Club: Inter Miami CF
• Liga: Major League Soccer (MLS)
• País: Estados Unidos
• Temporada: 2023-presente
• Compañeros: Busquets, Alba, Suárez`,
      
      ultimosLogros: `ÚLTIMOS LOGROS (2023-2024):
• Leagues Cup 2023 con Inter Miami
• Nominado Balón de Oro 2023
• Sigue activo con Argentina`
    }
  };

  // ==================== SISTEMA DE CLASIFICACIÓN DE INTENCIONES ====================
  
  // Patrones para clasificar intenciones
  const INTENT_PATTERNS = {
    // Preguntas sobre biografía/identidad
    quienEs: [
      /quién es\s+messi/i,
      /quien es\s+messi/i,
      /qué es\s+messi/i,
      /que es\s+messi/i,
      /hablame de messi/i,
      /cuéntame de messi/i,
      /^messi$/i,
      /^leo$/i,
      /^lionel$/i
    ],
    
    // Preguntas sobre edad
    edad: [
      /cuántos años tiene/i,
      /cuantos años tiene/i,
      /qué edad tiene/i,
      /que edad tiene/i,
      /edad de messi/i,
      /año de nacimiento/i,
      /cuándo nació/i,
      /cuando nació/i
    ],
    
    // Preguntas sobre premios específicos
    balonesOro: [
      /cuántos balones de oro/i,
      /cuantos balones de oro/i,
      /balones de oro tiene/i,
      /cuántos balón de oro/i,
      /balón de oro messi/i
    ],
    
    // Preguntas sobre equipo actual
    equipoActual: [
      /dónde juega actualmente/i,
      /donde juega actualmente/i,
      /en qué equipo juega/i,
      /en que equipo juega/i,
      /equipo actual de messi/i,
      /club actual/i,
      /actualmente messi/i
    ],
    
    // Preguntas sobre estadísticas
    estadisticas: [
      /cuántos goles/i,
      /cuantos goles/i,
      /estadísticas/i,
      /estadisticas/i,
      /números/i,
      /numeros/i,
      /partidos jugados/i,
      /goles totales/i
    ],
    
    // Preguntas sobre Barcelona
    barcelona: [
      /barcelona/i,
      /barça/i,
      /en el barça/i,
      /en barcelona/i,
      /etapa barcelona/i
    ],
    
    // Preguntas sobre PSG
    psg: [
      /psg/i,
      /paris/i,
      /en el psg/i,
      /en paris/i
    ],
    
    // Preguntas sobre Miami
    miami: [
      /miami/i,
      /inter miami/i,
      /en miami/i,
      /mls/i,
      /estados unidos/i
    ],
    
    // Preguntas sobre Argentina
    argentina: [
      /argentina/i,
      /selección/i,
      /seleccion/i,
      /mundial/i,
      /copa américa/i,
      /copa america/i
    ],
    
    // Saludos
    saludo: [
      /^hola$/i,
      /^hello$/i,
      /^hi$/i,
      /buenos días/i,
      /buenas tardes/i,
      /buenas noches/i
    ]
  };

  // ==================== FUNCIÓN DE CLASIFICACIÓN ====================
  
  const clasificarIntencion = (texto) => {
    const textoLimpio = texto.trim().toLowerCase();
    
    // Detectar si NO es sobre Messi
    const noEsMessi = [
      'iniesta', 'cristiano', 'ronaldo', 'neymar', 'mbappe',
      'dolar', 'tarjeta', 'fecha', 'siniestro', 'en esto'
    ];
    
    for (const palabra of noEsMessi) {
      if (textoLimpio.includes(palabra)) {
        return 'no_es_messi';
      }
    }
    
    // Clasificar intención
    for (const [intencion, patrones] of Object.entries(INTENT_PATTERNS)) {
      for (const patron of patrones) {
        if (patron.test(textoLimpio)) {
          return intencion;
        }
      }
    }
    
    // Si no coincide con ningún patrón pero tiene "messi", es sobre Messi
    if (textoLimpio.includes('messi')) {
      return 'general_messi';
    }
    
    return 'desconocida';
  };

  // ==================== GENERADOR DE RESPUESTAS ====================
  
  const generarRespuesta = (intencion, textoConsulta) => {
    switch (intencion) {
      case 'no_es_messi':
        return `Soy un asistente especializado exclusivamente en Lionel Messi.\n\nPuedo responderte sobre:\n• Su carrera y equipos\n• Premios y récords\n• Estadísticas\n• Datos personales\n\n¿Qué te gustaría saber sobre Messi?`;
      
      case 'saludo':
        return `¡Hola! Soy tu asistente especializado en Lionel Messi.\n\nPregúntame sobre su carrera, equipos, premios o cualquier dato sobre él.`;
      
      case 'quienEs':
        return MESSI_KNOWLEDGE_BASE.biografia.content;
      
      case 'edad':
        return `Lionel Messi nació el 24 de junio de 1987 en Rosario, Argentina.\n\nActualmente tiene ${new Date().getFullYear() - 1987} años.`;
      
      case 'balonesOro':
        return `Lionel Messi tiene ${MESSI_KNOWLEDGE_BASE.premios.balonesOro}\n\n${MESSI_KNOWLEDGE_BASE.premios.otrosPremios}`;
      
      case 'equipoActual':
        return `${MESSI_KNOWLEDGE_BASE.actualidad.equipoActual}\n\n${MESSI_KNOWLEDGE_BASE.actualidad.ultimosLogros}`;
      
      case 'estadisticas':
        return `ESTADÍSTICAS COMPLETAS DE MESSI:\n\n${MESSI_KNOWLEDGE_BASE.estadisticas.barcelona}\n\n${MESSI_KNOWLEDGE_BASE.estadisticas.psg}\n\n${MESSI_KNOWLEDGE_BASE.estadisticas.miami}\n\n${MESSI_KNOWLEDGE_BASE.estadisticas.argentina}`;
      
      case 'barcelona':
        return `${MESSI_KNOWLEDGE_BASE.estadisticas.barcelona}\n\nDebutó en 2004 y se fue en 2021 después de 17 años en el club.`;
      
      case 'psg':
        return `${MESSI_KNOWLEDGE_BASE.estadisticas.psg}\n\nJugó con Mbappé y Neymar de 2021 a 2023.`;
      
      case 'miami':
        return `${MESSI_KNOWLEDGE_BASE.estadisticas.miami}\n\n${MESSI_KNOWLEDGE_BASE.actualidad.equipoActual}`;
      
      case 'argentina':
        return `${MESSI_KNOWLEDGE_BASE.estadisticas.argentina}\n\nEs capitán de la selección desde 2011.`;
      
      case 'general_messi':
        // Para consultas generales sobre Messi, dar biografía
        return MESSI_KNOWLEDGE_BASE.biografia.content;
      
      default:
        // Si no reconoce la intención pero tiene "messi"
        if (textoConsulta.toLowerCase().includes('messi')) {
          return `Pregunta más específica sobre Messi. Por ejemplo:\n• "¿Cuántos Balones de Oro tiene?"\n• "¿Dónde juega actualmente?"\n• "¿Qué edad tiene?"\n• "Estadísticas en el Barcelona"`;
        }
        return `Soy un asistente especializado en Lionel Messi. Puedo responderte sobre su carrera, equipos, premios y datos personales.\n\n¿Qué te gustaría saber sobre él?`;
    }
  };

  // ==================== INICIALIZACIÓN ====================
  
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'es-ES';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece;
          } else {
            interimTranscript += transcriptPiece;
          }
        }

        setTranscript(finalTranscript || interimTranscript);

        if (finalTranscript) {
          handleSendMessage(finalTranscript);
          setTranscript('');
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Error de reconocimiento:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Simular carga
    setTimeout(() => {
      setIsLoadingKnowledge(false);
      setMessages([{
        text: "¡Hola! Soy tu asistente especializado en Lionel Messi.\n\nPregúntame sobre su carrera, equipos, premios o datos personales.",
        isUser: false,
        timestamp: new Date()
      }]);
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // ==================== PROCESAMIENTO DE CONSULTAS ====================
  
  const procesarConsulta = async (consulta) => {
    // 1. Clasificar la intención
    const intencion = clasificarIntencion(consulta);
    console.log(`Consulta: "${consulta}" -> Intención: ${intencion}`);
    
    // 2. Generar respuesta basada en la intención
    const respuesta = generarRespuesta(intencion, consulta);
    
    return respuesta;
  };

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const userMessage = {
      text: message,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsProcessing(true);

    // Pequeña pausa para simular procesamiento
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const responseText = await procesarConsulta(message);

      const botMessage = {
        text: responseText,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

      speak(responseText);
      
    } catch (error) {
      console.error("Error:", error);
      
      const errorMessage = {
        text: "Disculpa, hubo un error procesando tu pregunta. Por favor, intenta de nuevo.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      handleSendMessage(textInput);
      setTextInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTextSubmit();
    }
  };

  // ==================== FUNCIONES DE VOZ ====================
  
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      setIsSpeaking(false);
    }
  };

  const speak = (text) => {
    if (!voiceEnabled || !synthRef.current || !text) return;

    synthRef.current.cancel();
    
    // Tomar solo los primeros 300 caracteres para voz
    const cleanText = text.substring(0, 300);
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;

    const voices = synthRef.current.getVoices();
    const spanishVoice = voices.find(voice => voice.lang.startsWith('es'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  // ==================== RENDER ====================
  
  return React.createElement('div', { className: 'fixed bottom-6 right-6 z-50' },
    // Chat Button
    !isChatOpen && React.createElement('button', {
      onClick: () => setIsChatOpen(true),
      className: 'bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110'
    },
      React.createElement('i', { className: 'fas fa-comments text-3xl' })
    ),

    // Chat Window
    isChatOpen && React.createElement('div', {
      className: 'bg-white rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col overflow-hidden'
    },
      // Header
      React.createElement('div', {
        className: 'bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4 flex items-center justify-between'
      },
        React.createElement('div', { className: 'flex items-center space-x-3' },
          React.createElement('div', {
            className: 'w-10 h-10 bg-white rounded-full flex items-center justify-center'
          },
            React.createElement('span', { className: 'text-2xl' }, '⚽')
          ),
          React.createElement('div', null,
            React.createElement('h3', { className: 'font-bold text-lg' }, 'Asistente Messi'),
            React.createElement('p', { className: 'text-xs opacity-90' },
              'Inteligencia especializada'
            )
          )
        ),
        React.createElement('button', {
          onClick: () => setIsChatOpen(false),
          className: 'text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors'
        }, '✕')
      ),

      // Messages
      React.createElement('div', {
        className: 'flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50'
      },
        messages.map((msg, idx) =>
          React.createElement('div', {
            key: idx,
            className: `flex ${msg.isUser ? 'justify-end' : 'justify-start'}`
          },
            React.createElement('div', {
              className: `max-w-[85%] p-3 rounded-2xl ${
                msg.isUser
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
              }`
            },
              React.createElement('p', { className: 'text-sm whitespace-pre-wrap leading-relaxed' }, msg.text),
              React.createElement('p', {
                className: `text-xs mt-1 ${msg.isUser ? 'text-blue-100' : 'text-gray-400'}`
              }, msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }))
            )
          )
        ),

        isProcessing && React.createElement('div', { className: 'flex justify-start' },
          React.createElement('div', {
            className: 'bg-white p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center space-x-2'
          },
            React.createElement('i', { className: 'fas fa-spinner fa-spin text-blue-600' }),
            React.createElement('span', { className: 'text-sm text-gray-600' }, 'Analizando...')
          )
        ),

        transcript && isListening && React.createElement('div', { className: 'flex justify-end' },
          React.createElement('div', {
            className: 'bg-blue-100 text-blue-800 p-3 rounded-2xl rounded-br-none border border-blue-200 flex items-center space-x-2'
          },
            React.createElement('span', { className: 'animate-pulse' }, '🎤'),
            React.createElement('p', { className: 'text-sm italic' }, transcript + '...')
          )
        ),

        React.createElement('div', { ref: messagesEndRef })
      ),

      // Controls
      React.createElement('div', { className: 'p-4 bg-white border-t border-gray-200' },
        React.createElement('div', { className: 'flex justify-center space-x-4 mb-3' },
          React.createElement('button', {
            onClick: toggleListening,
            className: `p-3 rounded-full transition-all duration-300 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`,
            title: isListening ? 'Detener grabación' : 'Hablar'
          },
            React.createElement('i', {
              className: isListening ? 'fas fa-microphone-slash text-xl' : 'fas fa-microphone text-xl'
            })
          ),

          React.createElement('button', {
            onClick: () => setVoiceEnabled(!voiceEnabled),
            className: `p-3 rounded-full transition-all ${
              voiceEnabled
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-red-200 text-red-700 hover:bg-red-300'
            }`,
            title: voiceEnabled ? 'Silenciar voz' : 'Activar voz'
          },
            React.createElement('i', {
              className: voiceEnabled ? 'fas fa-volume-up text-xl' : 'fas fa-volume-mute text-xl'
            })
          )
        ),

        React.createElement('div', { className: 'flex space-x-2' },
          React.createElement('input', {
            type: 'text',
            value: textInput,
            onChange: (e) => setTextInput(e.target.value),
            onKeyPress: handleKeyPress,
            placeholder: 'Pregunta sobre Messi...',
            className: 'flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm'
          }),
          React.createElement('button', {
            onClick: handleTextSubmit,
            disabled: !textInput.trim(),
            className: 'bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          },
            React.createElement('i', { className: 'fas fa-paper-plane' })
          )
        ),

        React.createElement('p', { className: 'text-xs text-center text-gray-400 mt-2' },
          'Sistema de clasificación de intenciones activo'
        )
      )
    )
  );
};

// Renderizar el componente
const root = ReactDOM.createRoot(document.getElementById('voice-chat-root'));
root.render(React.createElement(VoiceChatBot));