# TechDivulga - Portal de Divulgación de Software

## 📋 Descripción del Proyecto

**TechDivulga** es una plataforma web moderna y completa dedicada a la divulgación de software y tecnología. Proporciona contenido educativo de alta calidad incluyendo artículos especializados, tutoriales paso a paso, reseñas de herramientas, noticias del sector tecnológico y recursos educativos curados.

### 🎯 Objetivos Principales

- **Educar**: Proporcionar contenido técnico accesible y bien estructurado
- **Actualizar**: Mantener a la comunidad informada sobre las últimas tendencias
- **Conectar**: Crear un espacio de intercambio de conocimiento
- **Inspirar**: Motivar el aprendizaje continuo en tecnología

## ✨ Características Implementadas

### 🏠 Página Principal
- **Hero Section**: Presentación atractiva con llamadas a la acción
- **Navegación Responsive**: Menú adaptativo para móviles y desktop
- **Secciones Organizadas**: Contenido bien estructurado por categorías
- **Newsletter**: Sistema de suscripción integrado
- **Footer Completo**: Enlaces y información de contacto

### 📚 Sistema de Contenidos
- **Artículos**: Contenido editorial sobre tendencias y tecnologías
- **Tutoriales**: Guías paso a paso con sistema de progreso
- **Herramientas**: Reseñas y comparativas de software
- **Noticias**: Actualizaciones del sector tecnológico
- **Recursos**: Biblioteca de materiales educativos

### 🎨 Diseño y UX
- **Diseño Responsive**: Optimizado para todos los dispositivos
- **Animaciones Suaves**: Transiciones y efectos CSS modernos
- **Tipografía Moderna**: Fuente Inter para mejor legibilidad
- **Iconografía**: Font Awesome para iconos consistentes
- **Colores Accesibles**: Paleta que cumple estándares de accesibilidad

### 🔧 Funcionalidades Técnicas
- **Table API Integration**: Sistema de gestión de contenido dinámico
- **Navegación Suave**: Scroll suave entre secciones
- **Búsqueda**: Funcionalidad de búsqueda integrada
- **Comentarios**: Sistema de comentarios (mock)
- **Carga Progresiva**: Skeleton loaders para mejor UX

## 🗂️ Estructura del Proyecto

```
techdivulga/
├── index.html              # Página principal
├── css/
│   └── style.css          # Estilos personalizados
├── js/
│   ├── main.js            # Lógica principal
│   └── api.js             # Integración con Table API
├── pages/
│   ├── articulo.html      # Template de artículo
│   └── tutorial.html      # Template de tutorial interactivo
└── README.md              # Documentación del proyecto
```

## 🚀 URIs Funcionales y Navegación

### Página Principal
- **URL**: `/` o `/index.html`
- **Secciones**:
  - `#inicio` - Hero section
  - `#articulos` - Artículos destacados
  - `#tutoriales` - Tutoriales disponibles
  - `#herramientas` - Herramientas reseñadas
  - `#noticias` - Últimas noticias
  - `#recursos` - Recursos educativos

### Páginas de Contenido
- **Artículo**: `/pages/articulo.html?id={article_id}`
- **Tutorial**: `/pages/tutorial.html?id={tutorial_id}`

### API Endpoints (Table API)
- **Artículos**: `GET /tables/articulos?page=1&limit=6`
- **Tutoriales**: `GET /tables/tutoriales?page=1&limit=6`
- **Herramientas**: `GET /tables/herramientas?page=1&limit=8`
- **Noticias**: `GET /tables/noticias?page=1&limit=6`

## 🗄️ Modelos de Datos

### Artículos
```javascript
{
  id: "string",
  titulo: "string",
  extracto: "string",
  contenido: "rich_text",
  categoria: "string",
  autor: "string",
  fecha_publicacion: "datetime",
  tiempo_lectura: "string",
  imagen_url: "string",
  tags: ["array"],
  publicado: "boolean"
}
```

### Tutoriales
```javascript
{
  id: "string",
  titulo: "string",
  descripcion: "string",
  nivel: "principiante|intermedio|avanzado",
  duracion: "string",
  num_lecciones: "number",
  categoria: "string",
  tecnologias: ["array"],
  objetivos: ["array"],
  prerequisitos: ["array"],
  valoracion: "number",
  num_estudiantes: "number",
  imagen_url: "string",
  publicado: "boolean"
}
```

### Herramientas
```javascript
{
  id: "string",
  nombre: "string",
  descripcion: "string",
  categoria: "string",
  icono: "string",
  valoracion: "number",
  precio: "gratuita|freemium|pago",
  plataformas: ["array"],
  sitio_web: "string",
  caracteristicas: ["array"],
  pros: ["array"],
  contras: ["array"],
  fecha_review: "datetime",
  publicado: "boolean"
}
```

### Noticias
```javascript
{
  id: "string",
  titulo: "string",
  resumen: "string",
  contenido: "rich_text",
  categoria: "string",
  fecha_publicacion: "datetime",
  fuente: "string",
  url_externa: "string",
  imagen_url: "string",
  tags: ["array"],
  relevancia: "baja|media|alta|critica",
  publicado: "boolean"
}
```

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con Flexbox y Grid
- **JavaScript ES6+**: Funcionalidad interactiva moderna
- **Tailwind CSS**: Framework de utilidades CSS
- **Font Awesome**: Iconografía consistente
- **Google Fonts**: Tipografía Inter

### Integración de Datos
- **Table API**: Sistema RESTful para gestión de contenido
- **Fetch API**: Comunicación asíncrona con el backend
- **JSON**: Formato de intercambio de datos

### Herramientas de Desarrollo
- **Prism.js**: Syntax highlighting para código
- **Intersection Observer**: Animaciones en scroll
- **Local Storage**: Persistencia de preferencias del usuario

## 📱 Características Responsive

- **Breakpoints**:
  - Mobile: < 768px
  - Tablet: 768px - 1024px
  - Desktop: > 1024px
- **Navegación Adaptativa**: Menú hamburguesa en móviles
- **Grid Flexible**: Layouts que se adaptan al tamaño de pantalla
- **Imágenes Responsive**: Optimización automática según dispositivo

## 🎨 Sistema de Diseño

### Colores Principales
- **Primario**: Azul (#2563eb)
- **Secundario**: Púrpura (#7c3aed)
- **Accent**: Verde (#10b981)
- **Neutros**: Escala de grises
- **Estados**: Verde (éxito), Rojo (error), Amarillo (advertencia)

### Tipografía
- **Familia**: Inter (Google Fonts)
- **Pesos**: 300, 400, 500, 600, 700
- **Jerarquía**: H1-H6 bien definida

### Componentes
- **Cards**: Tarjetas con hover effects y sombras
- **Botones**: Estados hover y focus bien definidos
- **Forms**: Campos con validación visual
- **Navigation**: Menú con estados activos

## 🚧 Funcionalidades Pendientes

### Próximas Implementaciones
1. **Sistema de Búsqueda Avanzada**
   - Filtros por categoría, autor, fecha
   - Búsqueda en tiempo real
   - Sugerencias automáticas

2. **Gestión de Usuarios**
   - Registro y autenticación
   - Perfiles de usuario
   - Favoritos y listas personalizadas

3. **Sistema de Comentarios Completo**
   - Comentarios anidados
   - Moderación de contenido
   - Notificaciones

4. **Panel de Administración**
   - CRUD completo para contenido
   - Estadísticas y analytics
   - Gestión de usuarios

5. **Funcionalidades Sociales**
   - Compartir en redes sociales
   - Sistema de ratings
   - Recomendaciones personalizadas

6. **Optimizaciones de Performance**
   - Lazy loading de imágenes
   - Service Worker para cache
   - Optimización de bundle

7. **Accessibility Improvements**
   - Navegación por teclado completa
   - Screen reader optimizations
   - Alto contraste opcional

## 📈 Próximos Pasos Recomendados

### Fase 1: Mejoras de Contenido (2-3 semanas)
- [ ] Implementar sistema de búsqueda funcional
- [ ] Agregar más templates de páginas de contenido
- [ ] Crear sistema de categorías dinámico
- [ ] Implementar relacionados automáticos

### Fase 2: Interactividad Avanzada (3-4 semanas)
- [ ] Sistema completo de comentarios con Table API
- [ ] Newsletter funcional con confirmación
- [ ] Sistema de ratings y reviews
- [ ] Compartir en redes sociales

### Fase 3: Panel de Administración (4-5 semanas)
- [ ] Crear panel admin con autenticación
- [ ] CRUD completo para todos los contenidos
- [ ] Sistema de upload de imágenes
- [ ] Analytics y estadísticas

### Fase 4: Optimización y SEO (2-3 semanas)
- [ ] Implementar meta tags dinámicos
- [ ] Sitemap automático
- [ ] Optimización de imágenes
- [ ] Performance improvements

## 🔧 Instalación y Desarrollo

### Requisitos
- Navegador web moderno
- Servidor web local (opcional para desarrollo)

### Configuración
1. Clonar o descargar el proyecto
2. Abrir `index.html` en un navegador
3. Para desarrollo activo, usar servidor local:
   ```bash
   # Con Python
   python -m http.server 8000
   
   # Con Node.js
   npx serve .
   ```

### Estructura de Datos
- Los datos se gestionan a través de la Table API
- Esquemas predefinidos para artículos, tutoriales, herramientas y noticias
- Datos de ejemplo incluidos para demostración

## 📄 Licencia

Proyecto de código abierto desarrollado para fines educativos y de demostración.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Areas de mejora prioritarias:
- Accesibilidad web
- Performance optimization
- Nuevas funcionalidades
- Correcciones de bugs
- Mejoras en documentación

---

**TechDivulga** - Conectando desarrolladores con el conocimiento que necesitan para crear el futuro digital.