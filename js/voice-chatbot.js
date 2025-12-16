// voice-chatbot.js - Chatbot de Voz con RAG y CRISP-DM (Documentos pre-cargados)
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
  const [showInfoPanel, setShowInfoPanel] = useState(false);
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(typeof window !== 'undefined' ? window.speechSynthesis : null);
  const messagesEndRef = useRef(null);

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

    // Cargar documentos automáticamente al iniciar
    loadDocumentsFromDataFolder();

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

  // ==================== CARGA AUTOMÁTICA DE DOCUMENTOS ====================
  
  const loadDocumentsFromDataFolder = async () => {
    setIsLoadingKnowledge(true);
    
    const loadingMessage = {
      text: "📁 Cargando documentos desde la carpeta 'data'...\n\nBuscando archivos en:\nC:\\Users\\USER\\OneDrive\\Documentos\\GitHub\\rumiadrian30.github.io\\data\\",
      isUser: false,
      timestamp: new Date()
    };
    
    setMessages([loadingMessage]);
    
    try {
      // Intentar cargar desde el servidor backend
      const response = await fetch('http://localhost:3000/api/load-all-documents');
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.documents.length > 0) {
        // Procesar documentos del servidor
        const processedDocs = data.documents.map(doc => ({
          ...doc,
          chunks: chunkDocument(doc.content)
        }));
        
        setKnowledgeBase(processedDocs);
        
        // Mensaje de éxito
        const successMessage = {
          text: `✅ ¡Documentos cargados exitosamente!\n\nHe encontrado ${processedDocs.length} documento(s) en la carpeta 'data':\n${processedDocs.map(d => `📄 ${d.filename} (${d.type.toUpperCase()})`).join('\n')}\n\nPregúntame sobre cualquier contenido de estos documentos. Por ejemplo:\n• "¿Qué dice el documento sobre Messi?"\n• "Háblame del FC Barcelona"\n• "Resume el contenido del PDF"`,
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages([successMessage]);
        
        // Guardar en localStorage para futuras sesiones
        if (window.storage) {
          try {
            await window.storage.set('knowledge-base', JSON.stringify({
              documents: processedDocs,
              loadedAt: new Date().toISOString(),
              source: 'local-data-folder'
            }));
          } catch (storageError) {
            console.log('No se pudo guardar en storage local');
          }
        }
      } else {
        // No hay documentos en la carpeta
        const noDocsMessage = {
          text: `📂 La carpeta 'data' está vacía o no contiene documentos compatibles.\n\nPor favor, coloca archivos (PDF, TXT, JSON) en:\nC:\\Users\\USER\\OneDrive\\Documentos\\GitHub\\rumiadrian30.github.io\\data\\\n\nFormatos soportados:\n• PDF (como Messi_en_el_FC_Barcelona.pdf)\n• Archivos de texto (.txt)\n• JSON (.json)\n• Markdown (.md)\n\nLuego recarga la página o haz clic en 🔄 para recargar.`,
          isUser: false,
          timestamp: new Date()
        };
        
        setMessages([noDocsMessage]);
      }
      
    } catch (error) {
      console.error('Error cargando documentos:', error);
      
      // Verificar si el servidor está corriendo
      const serverCheck = await checkServerStatus();
      
      if (!serverCheck.running) {
        const serverErrorMsg = {
          text: `⚠️ **Servidor backend no detectado**\n\nPara leer documentos automáticamente:\n\n1. **Abre una terminal** en:\n   C:\\Users\\USER\\OneDrive\\Documentos\\GitHub\\rumiadrian30.github.io\n\n2. **Ejecuta:**\n   node server.js\n\n3. **Asegúrate de que:**\n   • Node.js esté instalado\n   • Los archivos estén en la carpeta 'data'\n   • El servidor muestre "✅ Servidor backend corriendo"\n\nLuego recarga esta página.`,
          isUser: false,
          timestamp: new Date()
        };
        setMessages([serverErrorMsg]);
      } else {
        const errorMessage = {
          text: `❌ Error al cargar documentos: ${error.message}\n\nAsegúrate de:\n1. Tener Node.js instalado\n2. Haber ejecutado 'npm install'\n3. Tener archivos en la carpeta 'data'`,
          isUser: false,
          timestamp: new Date()
        };
        setMessages([errorMessage]);
      }
    } finally {
      setIsLoadingKnowledge(false);
    }
  };

  // Función para verificar si el servidor está corriendo
  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/files', { 
        method: 'HEAD',
        mode: 'no-cors'
      });
      return { running: true };
    } catch (error) {
      try {
        // Segundo intento con timeout corto
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 1000);
        
        const response = await fetch('http://localhost:3000', {
          signal: controller.signal,
          mode: 'no-cors'
        });
        
        clearTimeout(timeoutId);
        return { running: true };
      } catch (secondError) {
        return { running: false, error: secondError.message };
      }
    }
  };

  // Función para manejar documentos PDF específicos
  const processSpecificPDF = async (filename) => {
    try {
      const response = await fetch('http://localhost:3000/api/process-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: filename })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const newDoc = {
          filename: data.filename,
          content: data.content,
          type: 'pdf',
          uploadDate: new Date().toISOString(),
          chunks: chunkDocument(data.content)
        };
        
        setKnowledgeBase(prev => [...prev, newDoc]);
        
        return {
          success: true,
          message: `PDF '${filename}' procesado exitosamente (${data.numPages} páginas)`
        };
      }
      
      return { success: false, message: data.error };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const simulateDocumentLoading = async () => {
    // Simulamos una carga con un pequeño delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Aquí es donde normalmente harías fetch a tu servidor
    // Por ahora, crearemos documentos de ejemplo basados en tu sitio web
    
    const sampleDocuments = [
      {
        filename: "RumiDivulga_Articulos.txt",
        content: `RumiDivulga - Artículos sobre Tecnología

        1. El Futuro de JavaScript en 2025
        JavaScript continúa evolucionando con nuevas características como decorators, mejoras en pattern matching y optimizaciones de rendimiento. Las tendencias incluyen más adopción de TypeScript, WebAssembly y frameworks más ligeros.

        2. Introducción a Machine Learning con Python
        Python sigue siendo el lenguaje líder en ML con bibliotecas como TensorFlow, PyTorch y scikit-learn. Los conceptos fundamentales incluyen: preprocessing de datos, modelos supervisados vs no supervisados, redes neuronales y validación de modelos.

        3. DevOps: Mejores Prácticas para CI/CD
        Las pipelines modernas de CI/CD incluyen: integración continua, pruebas automatizadas, despliegue gradual y rollback automático. Herramientas populares: GitHub Actions, GitLab CI, Jenkins, y ArgoCD.

        4. React 19: Nuevas Características
        React 19 introduce mejoras en el compilador, reducción de re-renders automática, mejor manejo de metadatos y APIs más simples para formularios y estados asíncronos.

        5. Arquitectura de Microservicios
        Patrones clave: service discovery, circuit breaker, API gateway, event sourcing. Consideraciones: consistencia eventual, monitoreo distribuido y gestión de configuraciones.

        6. Seguridad en Aplicaciones Web
        OWASP Top 10 2024: inyecciones, autenticación rota, exposición de datos sensibles, XML external entities, configuración de seguridad incorrecta.`,
        type: 'text',
        uploadDate: new Date().toISOString(),
        chunks: []
      },
      {
        filename: "RumiDivulga_Tutoriales.txt",
        content: `Tutoriales de RumiDivulga - Guías Paso a Paso

        1. React Hooks Completo (2 horas, Intermedio)
        - useState y useEffect fundamentales
        - Custom hooks avanzados
        - Context API con hooks
        - Optimización de performance
        - 12 lecciones prácticas

        2. Node.js y Express API (3 horas, Principiante)
        - Configuración de proyecto Node.js
        - Middlewares esenciales
        - Autenticación JWT
        - Conexión a bases de datos
        - Documentación con Swagger
        - 15 lecciones con ejemplos

        3. Docker para Desarrolladores (1.5 horas, Intermedio)
        - Dockerfiles optimizados
        - Docker Compose para desarrollo
        - Volúmenes y networking
        - Multi-stage builds
        - Integración con CI/CD
        - 8 módulos prácticos

        4. Python Data Science (4 horas, Avanzado)
        - Pandas para manipulación de datos
        - Scikit-learn para ML básico
        - Visualización con Matplotlib/Seaborn
        - Procesamiento de datos a gran escala
        - 20 ejercicios reales

        5. Git & GitHub Esencial (2 horas, Principiante)
        - Flujo de trabajo Git
        - Ramas y merges
        - Pull requests y code review
        - GitHub Actions básico
        - 10 ejercicios prácticos

        6. Vue.js 3 Fundamentos (2.5 horas, Intermedio)
        - Composition API
        - Reactividad avanzada
        - Componentes reutilizables
        - Vue Router y Pinia
        - 14 proyectos pequeños`,
        type: 'text',
        uploadDate: new Date().toISOString(),
        chunks: []
      },
      {
        filename: "RumiDivulga_Herramientas.json",
        content: JSON.stringify({
          herramientas: [
            { nombre: "VS Code", categoria: "Editor", rating: 5, descripcion: "Editor de código con amplia extensibilidad" },
            { nombre: "Git", categoria: "Control de Versiones", rating: 5, descripcion: "Sistema de control de versiones distribuido" },
            { nombre: "Postman", categoria: "API Testing", rating: 4, descripcion: "Plataforma para desarrollo y testing de APIs" },
            { nombre: "Docker", categoria: "Contenedores", rating: 5, descripcion: "Plataforma para contenerización de aplicaciones" },
            { nombre: "Figma", categoria: "Diseño", rating: 5, descripcion: "Herramienta de diseño colaborativo" },
            { nombre: "GitHub", categoria: "Repositorio", rating: 5, descripcion: "Plataforma de desarrollo colaborativo" },
            { nombre: "MongoDB", categoria: "Base de Datos", rating: 4, descripcion: "Base de datos NoSQL documental" },
            { nombre: "Webpack", categoria: "Build Tool", rating: 4, descripcion: "Empaquetador de módulos JavaScript" }
          ],
          tecnologias: ["JavaScript", "Python", "React", "Node.js", "Docker", "Git", "MongoDB", "PostgreSQL"],
          recursos: ["Documentación oficial", "Comunidades online", "Cursos recomendados", "Libros especializados"]
        }),
        type: 'json',
        uploadDate: new Date().toISOString(),
        chunks: []
      }
    ];

    // Procesar cada documento
    const processedDocs = sampleDocuments.map(doc => ({
      ...doc,
      chunks: chunkDocument(doc.content)
    }));

    setKnowledgeBase(processedDocs);
    
    // Mostrar mensaje de bienvenida
    const welcomeMessage = {
      text: `✅ ¡Hola! Soy OZUNA RAG, tu asistente de RumiDivulga. \n\nHe cargado automáticamente ${processedDocs.length} documentos sobre tecnología y desarrollo de software:\n• ${processedDocs.map(d => d.filename).join('\n• ')}\n\nPregúntame sobre JavaScript, React, Python, Docker, o cualquier tema tecnológico mencionado en RumiDivulga.`,
      isUser: false,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
    
    // Guardar en localStorage para persistencia
    if (window.storage) {
      try {
        await window.storage.set('knowledge-base', JSON.stringify(processedDocs));
      } catch (error) {
        console.log('No se pudo guardar en storage local');
      }
    }
  };

  // ==================== FUNCIONES DE PROCESAMIENTO ====================
  
  const chunkDocument = (text, chunkSize = 500) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const chunks = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > chunkSize && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += ' ' + sentence;
      }
    }

    if (currentChunk.trim().length > 0) {
      chunks.push(currentChunk.trim());
    }

    return chunks.length > 0 ? chunks : [text.substring(0, chunkSize)];
  };

  const searchKnowledgeBase = (query) => {
    if (knowledgeBase.length === 0) {
      return null;
    }

    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
    
    let bestMatch = null;
    let bestScore = 0;

    for (const doc of knowledgeBase) {
      for (const chunk of doc.chunks) {
        const chunkLower = chunk.toLowerCase();
        let score = 0;

        // Búsqueda por palabras clave
        for (const word of queryWords) {
          if (word.length > 3) {
            const regex = new RegExp(word, 'gi');
            const occurrences = (chunkLower.match(regex) || []).length;
            score += occurrences * 2;
          }
        }

        // Bonus por coincidencia exacta de frase
        if (chunkLower.includes(queryLower)) {
          score += 15;
        }

        // Bonus por términos técnicos comunes
        const techTerms = ['javascript', 'react', 'python', 'docker', 'git', 'api', 'database', 'frontend', 'backend'];
        for (const term of techTerms) {
          if (queryLower.includes(term) && chunkLower.includes(term)) {
            score += 10;
          }
        }

        if (score > bestScore) {
          bestScore = score;
          bestMatch = {
            content: chunk,
            source: doc.filename,
            score: score
          };
        }
      }
    }

    return bestScore > 3 ? bestMatch : null;
  };

  // ==================== VOICE FUNCTIONS ====================
  
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
    if (!voiceEnabled || !synthRef.current) return;

    synthRef.current.cancel();
    
    const cleanText = text.replace(/\n/g, '. ').substring(0, 500);
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'es-ES';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = synthRef.current.getVoices();
    const spanishVoice = voices.find(voice => voice.lang.startsWith('es'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  // ==================== PROCESAMIENTO DE MENSAJES ====================
  
  const processWithCRISPDM = async (userMessage) => {
    if (knowledgeBase.length === 0) {
      return "📚 Estoy cargando los documentos de RumiDivulga. Por favor, espera un momento...";
    }

    const cleanedQuery = cleanMessage(userMessage);
    const relevantInfo = searchKnowledgeBase(cleanedQuery);

    if (!relevantInfo || relevantInfo.score === 0) {
      const suggestions = [
        "JavaScript y sus nuevas características",
        "React 19 y sus mejoras",
        "Python para Machine Learning",
        "Docker y contenedores",
        "DevOps y CI/CD",
        "Arquitectura de microservicios",
        "Seguridad en aplicaciones web",
        "Git y GitHub",
        "Bases de datos NoSQL",
        "Herramientas de desarrollo"
      ];
      
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      
      return `🔍 En RumiDivulga tenemos información sobre muchos temas tecnológicos, pero no encontré algo específico sobre "${userMessage}".\n\nPodrías preguntar sobre:\n• ${randomSuggestion}\n\nTambién puedo hablarte sobre:\n• Tutoriales de React, Node.js, Docker\n• Herramientas como VS Code, Git, Postman\n• Tendencias en desarrollo web\n\n¿En qué te puedo ayudar específicamente?`;
    }

    const response = generateResponseFromKnowledge(userMessage, relevantInfo);
    return response;
  };

  const cleanMessage = (message) => {
    return message
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/[^\w\sáéíóúñ¿?¡!.,-]/g, '');
  };

  const generateResponseFromKnowledge = (query, matchInfo) => {
    const { content, source, score } = matchInfo;
    
    const words = content.split(/\s+/);
    const contextLength = Math.min(words.length, 250);
    const context = words.slice(0, contextLength).join(' ');
    
    let response = `📄 **Información de RumiDivulga** (${source}):\n\n`;
    response += context;
    
    if (words.length > contextLength) {
      response += '\n\n... (más información disponible en el artículo completo)';
    }
    
    response += `\n\n🎯 *Este contenido es ${Math.min(100, score * 3)}% relevante para tu pregunta*`;
    
    // Añadir sugerencias relacionadas
    if (query.toLowerCase().includes('javascript')) {
      response += '\n\n💡 *También podría interesarte:*\n• React y sus hooks\n• TypeScript para proyectos grandes\n• Node.js en el backend';
    } else if (query.toLowerCase().includes('python')) {
      response += '\n\n💡 *También podría interesarte:*\n• Data Science con Python\n• Machine Learning básico\n• Automatización con scripts';
    } else if (query.toLowerCase().includes('docker')) {
      response += '\n\n💡 *También podría interesarte:*\n• Kubernetes para orquestación\n• DevOps prácticas\n• CI/CD pipelines';
    }
    
    return response;
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

    await new Promise(resolve => setTimeout(resolve, 800));

    const responseText = await processWithCRISPDM(message);

    const botMessage = {
      text: responseText,
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsProcessing(false);

    if (voiceEnabled) {
      speak(responseText);
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

  const refreshKnowledgeBase = async () => {
    setIsLoadingKnowledge(true);
    setMessages([]);
    await loadDocumentsFromDataFolder();
  };

  // ==================== RENDER ====================
  
  return React.createElement('div', { className: 'fixed bottom-6 right-6 z-50' },
    // Chat Button
    !isChatOpen && React.createElement('button', {
      onClick: () => setIsChatOpen(true),
      className: 'bg-gradient-to-r from-blue-600 to-purple-700 text-white rounded-full p-4 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 relative'
    },
      React.createElement('i', { className: 'fas fa-comments text-3xl' }),
      isLoadingKnowledge && React.createElement('div', {
        className: 'absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-20'
      }),
      knowledgeBase.length > 0 && React.createElement('span', {
        className: 'absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold'
      }, knowledgeBase.length)
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
            React.createElement('span', { className: 'text-2xl' }, '🤖')
          ),
          React.createElement('div', null,
            React.createElement('h3', { className: 'font-bold text-lg' }, 'OZUNA RAG'),
            React.createElement('p', { className: 'text-xs opacity-90' },
              isLoadingKnowledge ? 'Cargando documentos...' : 
              `${knowledgeBase.length} docs de RumiDivulga`
            )
          )
        ),
        React.createElement('div', { className: 'flex items-center space-x-2' },
          React.createElement('button', {
            onClick: () => setShowInfoPanel(!showInfoPanel),
            className: 'text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors',
            title: 'Información'
          },
            React.createElement('i', { className: 'fas fa-info-circle' })
          ),
          React.createElement('button', {
            onClick: refreshKnowledgeBase,
            className: 'text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors',
            title: 'Recargar documentos'
          },
            isLoadingKnowledge ? 
            React.createElement('i', { className: 'fas fa-spinner fa-spin' }) :
            React.createElement('i', { className: 'fas fa-redo' })
          ),
          React.createElement('button', {
            onClick: () => setIsChatOpen(false),
            className: 'text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors'
          }, '✕')
        )
      ),

      // Info Panel
      showInfoPanel && React.createElement('div', {
        className: 'bg-blue-50 p-4 border-b border-blue-200'
      },
        React.createElement('div', { className: 'text-center' },
          React.createElement('i', { className: 'fas fa-database text-blue-600 text-3xl mb-2' }),
          React.createElement('p', { className: 'text-sm font-semibold text-gray-800 mb-1' }, 
            'Base de Conocimiento RumiDivulga'
          ),
          React.createElement('p', { className: 'text-xs text-gray-600 mb-3' },
            'Documentos cargados automáticamente desde la carpeta /data'
          ),
          knowledgeBase.length > 0 && React.createElement('div', {
            className: 'text-xs text-left max-h-32 overflow-y-auto bg-white p-3 rounded-lg'
          },
            React.createElement('p', { className: 'font-semibold text-gray-700 mb-2' }, '📚 Documentos disponibles:'),
            knowledgeBase.map((doc, idx) =>
              React.createElement('div', {
                key: idx,
                className: 'flex items-start space-x-2 text-gray-600 mb-2'
              },
                React.createElement('i', { 
                  className: doc.type === 'json' ? 'fas fa-code text-xs mt-1' : 'fas fa-file-alt text-xs mt-1' 
                }),
                React.createElement('span', { className: 'truncate' }, doc.filename)
              )
            )
          ),
          React.createElement('p', { className: 'text-xs text-gray-500 mt-3 italic' },
            'El chatbot responde basándose exclusivamente en los documentos de RumiDivulga'
          )
        )
      ),

      // Messages
      React.createElement('div', {
        className: 'flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50'
      },
        messages.length === 0 && isLoadingKnowledge && React.createElement('div', {
          className: 'text-center text-gray-500 mt-8'
        },
          React.createElement('i', { className: 'fas fa-spinner fa-spin text-3xl mb-4 text-blue-600' }),
          React.createElement('p', { className: 'text-sm font-semibold' }, 'Cargando RumiDivulga'),
          React.createElement('p', { className: 'text-xs mt-2' }, 'Estoy cargando todos los artículos,'),
          React.createElement('p', { className: 'text-xs' }, 'tutoriales y recursos automáticamente...')
        ),

        messages.map((msg, idx) =>
          React.createElement('div', {
            key: idx,
            className: `flex ${msg.isUser ? 'justify-end' : 'justify-start'}`
          },
            React.createElement('div', {
              className: `max-w-[85%] p-3 rounded-2xl ${
                msg.isUser
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none shadow-md'
              }`
            },
              React.createElement('p', { className: 'text-sm whitespace-pre-wrap' }, msg.text),
              React.createElement('p', {
                className: `text-xs mt-1 ${msg.isUser ? 'text-blue-100' : 'text-gray-400'}`
              }, msg.timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }))
            )
          )
        ),

        isProcessing && React.createElement('div', { className: 'flex justify-start' },
          React.createElement('div', {
            className: 'bg-white p-3 rounded-2xl rounded-bl-none shadow-md flex items-center space-x-2'
          },
            React.createElement('i', { className: 'fas fa-spinner fa-spin text-blue-600' }),
            React.createElement('span', { className: 'text-sm text-gray-600' }, 'Buscando en RumiDivulga...')
          )
        ),

        transcript && isListening && React.createElement('div', { className: 'flex justify-end' },
          React.createElement('div', {
            className: 'bg-blue-100 text-blue-800 p-3 rounded-2xl rounded-br-none border-2 border-blue-300 flex items-center space-x-2'
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
                ? 'bg-red-500 text-white animate-pulse shadow-lg'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`,
            title: isListening ? 'Detener grabación' : 'Hablar',
            disabled: isLoadingKnowledge
          },
            React.createElement('i', {
              className: isListening ? 'fas fa-microphone-slash text-xl' : 'fas fa-microphone text-xl'
            })
          ),

          React.createElement('button', {
            onClick: () => {
              if (isSpeaking) {
                stopSpeaking();
              } else {
                setVoiceEnabled(!voiceEnabled);
              }
            },
            className: `p-3 rounded-full transition-all ${
              isSpeaking
                ? 'bg-green-500 text-white animate-pulse shadow-lg'
                : voiceEnabled
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-red-200 text-red-700 hover:bg-red-300'
            }`,
            title: isSpeaking ? 'Detener voz' : voiceEnabled ? 'Silenciar voz' : 'Activar voz'
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
            placeholder: isLoadingKnowledge ? 
              'Cargando documentos de RumiDivulga...' : 
              'Pregunta sobre tecnología, programación...',
            className: 'flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm',
            disabled: isLoadingKnowledge
          }),
          React.createElement('button', {
            onClick: handleTextSubmit,
            disabled: isLoadingKnowledge || !textInput.trim(),
            className: 'bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
          },
            React.createElement('i', { className: 'fas fa-paper-plane' })
          )
        ),

        React.createElement('p', { className: 'text-xs text-center text-gray-400 mt-2' },
          isLoadingKnowledge ? 
            '🔄 Cargando contenido de RumiDivulga...' :
          `RAG System • ${knowledgeBase.length} docs • Cargado automáticamente`
        )
      )
    )
  );
};

// Renderizar el componente
const root = ReactDOM.createRoot(document.getElementById('voice-chat-root'));
root.render(React.createElement(VoiceChatBot));