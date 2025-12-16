# 🤖 RumiDivulga - Portal con Chatbot de Voz RAG

Portal de divulgación de software con chatbot de voz inteligente que implementa RAG (Retrieval-Augmented Generation) y metodología CRISP-DM.

## 🌟 Características Principales

### 🎯 Portal Web
- ✅ Diseño moderno y responsive con Tailwind CSS
- ✅ Secciones de artículos, tutoriales, herramientas y noticias
- ✅ Navegación suave (smooth scroll)
- ✅ Menú móvil responsive
- ✅ Animaciones al hacer scroll

### 🤖 Chatbot de Voz con IA
- ✅ **Reconocimiento de voz** (Speech-to-Text) en español
- ✅ **Síntesis de voz** (Text-to-Speech) para respuestas
- ✅ **Sistema RAG** (Retrieval-Augmented Generation)
- ✅ **Base de conocimiento personalizada** con PDFs y TXT
- ✅ **Metodología CRISP-DM** completa implementada
- ✅ **Storage persistente** para documentos
- ✅ **Búsqueda semántica** por relevancia

## 📋 Requisitos

### Navegador
- **Chrome/Edge**: Soporte completo ✅
- **Safari**: Soporte completo (iOS 14.5+) ✅
- **Firefox**: Solo síntesis de voz (no reconocimiento) ⚠️

### Servidor Web (opcional)
Para desarrollo local puedes usar:
- Python: `python -m http.server 8000`
- Node.js: `npx serve`
- PHP: `php -S localhost:8000`

## 🚀 Instalación

### Método 1: Uso Directo (Sin instalación)

1. Descarga todos los archivos
2. Abre `index.html` en tu navegador
3. ¡Listo! El sitio funciona sin servidor

### Método 2: Con Servidor Local

```bash
# Clonar o descargar el proyecto
cd rumidivulga-chatbot

# Opción A: Python
python -m http.server 8000

# Opción B: Node.js
npx serve

# Abrir en el navegador
# http://localhost:8000
```

### Método 3: Deploy en Vercel (Gratis)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Seguir las instrucciones
```

## 📁 Estructura del Proyecto

```
rumidivulga-chatbot/
├── index.html                 # Página principal
├── README.md                  # Este archivo
│
├── js/
│   ├── main.js               # Scripts del sitio
│   └── voice-chatbot.js      # Componente React del chatbot
│
├── data/
│   └── knowledge-base/       # Carpeta para documentos (PDFs, TXT)
│       ├── tutoriales/
│       ├── articulos/
│       └── herramientas/
│
└── docs/
    └── crisp-dm-methodology.md  # Documentación de la metodología
```

## 🎓 Metodología CRISP-DM Implementada

El chatbot implementa las 6 fases de CRISP-DM:

### 1️⃣ Comprensión del Negocio
- Verifica disponibilidad de documentos
- Identifica el objetivo de la consulta

### 2️⃣ Comprensión de Datos
- Extrae palabras clave de la consulta
- Identifica entidades relevantes

### 3️⃣ Preparación de Datos
- Divide documentos en chunks de 500 palabras
- Normaliza y limpia el texto
- Crea índice de búsqueda

### 4️⃣ Modelado
- Búsqueda por similitud de texto
- Scoring de relevancia
- Ranking de resultados

### 5️⃣ Evaluación
- Valida calidad de resultados
- Verifica relevancia mínima
- Control de calidad

### 6️⃣ Despliegue
- Genera respuesta contextual
- Cita fuente del documento
- Síntesis de voz (opcional)

## 💡 Cómo Usar el Chatbot

### Paso 1: Cargar Documentos

1. Haz clic en el botón del chatbot (esquina inferior derecha)
2. Haz clic en el icono ⬆️ (Upload)
3. Selecciona archivos PDF, TXT o JSON
4. Espera a que se procesen

### Paso 2: Hacer Preguntas

**Opción A: Por Voz**
1. Haz clic en el botón del micrófono 🎤
2. Habla tu pregunta en español
3. El chatbot transcribe y busca automáticamente

**Opción B: Por Texto**
1. Escribe tu pregunta en el campo de texto
2. Presiona Enter o el botón de enviar ➤

### Paso 3: Escuchar Respuestas

- Las respuestas se leen automáticamente si la voz está activa 🔊
- Usa el botón de volumen para silenciar 🔇
- Las respuestas siempre citan la fuente del documento 📄

## 🔧 Configuración Avanzada

### Personalizar Chunks (Tamaño de fragmentos)

En `voice-chatbot.js`, línea ~180:

```javascript
const chunkDocument = (text, chunkSize = 500) => {
  // Cambiar chunkSize a 300 para fragmentos más pequeños
  // o 1000 para fragmentos más grandes
}
```

### Ajustar Scoring de Búsqueda

En `voice-chatbot.js`, línea ~240:

```javascript
score += occurrences * 2; // Cambiar peso por palabra
score += 10; // Cambiar bonus por coincidencia exacta
score += consecutiveMatches * 5; // Cambiar bonus por palabras consecutivas
```

### Cambiar Voz de Síntesis

En `voice-chatbot.js`, línea ~305:

```javascript
utterance.rate = 0.9; // Velocidad (0.1 - 2.0)
utterance.pitch = 1;  // Tono (0.0 - 2.0)
utterance.volume = 1; // Volumen (0.0 - 1.0)
```

## 📚 Tipos de Documentos Soportados

### ✅ Soportados Actualmente
- **PDF**: Extracción básica de texto
- **TXT**: Texto plano en UTF-8
- **JSON**: Datos estructurados

### 🔜 Próximamente
- DOCX (Microsoft Word)
- MD (Markdown)
- CSV (Datos tabulares)

## 🎨 Personalización Visual

### Colores del Chatbot

En `voice-chatbot.js`, buscar las clases de Tailwind:

```javascript
// Cambiar colores del gradiente
"bg-gradient-to-r from-blue-600 to-purple-700"

// Cambiar a verde-azul
"bg-gradient-to-r from-green-600 to-blue-700"

// Cambiar a rojo-naranja
"bg-gradient-to-r from-red-600 to-orange-700"
```

## 🐛 Resolución de Problemas

### El chatbot no aparece
- ✅ Verifica que React y Babel estén cargados
- ✅ Abre la consola del navegador (F12)
- ✅ Verifica errores en la consola

### El reconocimiento de voz no funciona
- ✅ Usa Chrome o Edge (Firefox no soporta Web Speech API)
- ✅ Da permisos de micrófono al navegador
- ✅ Verifica que tu micrófono funcione

### Los PDFs no se procesan bien
- ✅ Implementación actual es básica
- ✅ Para producción, instala PDF.js:
```bash
npm install pdfjs-dist
```

### Los documentos no se guardan
- ✅ Verifica que el navegador soporte `window.storage`
- ✅ Limpia el storage: `window.storage.delete('knowledge-base')`
- ✅ Recarga la página

## 📈 Mejoras Futuras

### Corto Plazo
- [ ] Integración con PDF.js para mejor extracción
- [ ] Soporte para DOCX y Markdown
- [ ] Historial de conversaciones
- [ ] Exportar conversaciones a PDF

### Medio Plazo
- [ ] Embeddings con TensorFlow.js
- [ ] Búsqueda semántica avanzada
- [ ] Multi-idioma (inglés, portugués)
- [ ] Análisis de sentimientos

### Largo Plazo
- [ ] Integración con Claude API
- [ ] Vector database (Pinecone/Weaviate)
- [ ] Fine-tuning con documentos específicos
- [ ] Dashboard de analytics

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**RumiDivulga Team**
- Email: contacto@rumidivulga.com
- GitHub: [@rumidivulga](https://github.com/rumidivulga)

## 🙏 Agradecimientos

- **Tailwind CSS** - Framework CSS
- **React** - Biblioteca UI
- **Lucide React** - Iconos
- **Web Speech API** - Reconocimiento y síntesis de voz
- **CRISP-DM** - Metodología de Data Mining

## 📞 Soporte

Si tienes problemas o preguntas:

1. Revisa la sección de **Resolución de Problemas**
2. Abre un [Issue en GitHub](https://github.com/rumidivulga/chatbot/issues)
3. Contáctanos en: soporte@rumidivulga.com

---

**Hecho con ❤️ por RumiDivulga**

*Última actualización: Diciembre 2024*