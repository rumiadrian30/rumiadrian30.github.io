// TechDivulga - API Integration Module

class TechDivulgaAPI {
    constructor() {
        this.baseURL = 'tables';
    }

    // Generic API methods
    async getAllRecords(tableName, options = {}) {
        const { page = 1, limit = 100, search = '', sort = '' } = options;
        const params = new URLSearchParams({
            page: page.toString(),
            limit: limit.toString()
        });
        
        if (search) params.append('search', search);
        if (sort) params.append('sort', sort);
        
        try {
            const response = await fetch(`${this.baseURL}/${tableName}?${params}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${tableName}:`, error);
            throw error;
        }
    }

    async getRecord(tableName, recordId) {
        try {
            const response = await fetch(`${this.baseURL}/${tableName}/${recordId}`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error fetching record ${recordId} from ${tableName}:`, error);
            throw error;
        }
    }

    async createRecord(tableName, data) {
        try {
            const response = await fetch(`${this.baseURL}/${tableName}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error creating record in ${tableName}:`, error);
            throw error;
        }
    }

    async updateRecord(tableName, recordId, data) {
        try {
            const response = await fetch(`${this.baseURL}/${tableName}/${recordId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error updating record ${recordId} in ${tableName}:`, error);
            throw error;
        }
    }

    async partialUpdateRecord(tableName, recordId, data) {
        try {
            const response = await fetch(`${this.baseURL}/${tableName}/${recordId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error(`Error partially updating record ${recordId} in ${tableName}:`, error);
            throw error;
        }
    }

    async deleteRecord(tableName, recordId) {
        try {
            const response = await fetch(`${this.baseURL}/${tableName}/${recordId}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return true;
        } catch (error) {
            console.error(`Error deleting record ${recordId} from ${tableName}:`, error);
            throw error;
        }
    }

    // Specific content methods
    async getArticulos(options = {}) {
        const defaultOptions = { sort: 'fecha_publicacion' };
        const result = await this.getAllRecords('articulos', { ...defaultOptions, ...options });
        
        // Filter only published articles for public view
        result.data = result.data.filter(article => article.publicado);
        
        return result;
    }

    async getArticulo(id) {
        return await this.getRecord('articulos', id);
    }

    async getTutoriales(options = {}) {
        const defaultOptions = { sort: 'valoracion' };
        const result = await this.getAllRecords('tutoriales', { ...defaultOptions, ...options });
        
        // Filter only published tutorials for public view
        result.data = result.data.filter(tutorial => tutorial.publicado);
        
        return result;
    }

    async getTutorial(id) {
        return await this.getRecord('tutoriales', id);
    }

    async getHerramientas(options = {}) {
        const defaultOptions = { sort: 'valoracion' };
        const result = await this.getAllRecords('herramientas', { ...defaultOptions, ...options });
        
        // Filter only published tools for public view
        result.data = result.data.filter(tool => tool.publicado);
        
        return result;
    }

    async getHerramienta(id) {
        return await this.getRecord('herramientas', id);
    }

    async getNoticias(options = {}) {
        const defaultOptions = { sort: 'fecha_publicacion' };
        const result = await this.getAllRecords('noticias', { ...defaultOptions, ...options });
        
        // Filter only published news for public view
        result.data = result.data.filter(news => news.publicado);
        
        return result;
    }

    async getNoticia(id) {
        return await this.getRecord('noticias', id);
    }

    // Search across all content
    async searchContent(query, contentTypes = ['articulos', 'tutoriales', 'herramientas', 'noticias']) {
        const results = {};
        
        for (const contentType of contentTypes) {
            try {
                const result = await this.getAllRecords(contentType, { search: query, limit: 5 });
                results[contentType] = result.data.filter(item => item.publicado);
            } catch (error) {
                console.error(`Error searching ${contentType}:`, error);
                results[contentType] = [];
            }
        }
        
        return results;
    }

    // Get featured content
    async getFeaturedContent() {
        try {
            const [articulos, tutoriales, herramientas, noticias] = await Promise.all([
                this.getArticulos({ limit: 6 }),
                this.getTutoriales({ limit: 6 }),
                this.getHerramientas({ limit: 8 }),
                this.getNoticias({ limit: 6 })
            ]);

            return {
                articulos: articulos.data,
                tutoriales: tutoriales.data,
                herramientas: herramientas.data,
                noticias: noticias.data
            };
        } catch (error) {
            console.error('Error fetching featured content:', error);
            throw error;
        }
    }

    // Get content statistics
    async getStats() {
        try {
            const [articulos, tutoriales, herramientas, noticias] = await Promise.all([
                this.getAllRecords('articulos', { limit: 1 }),
                this.getAllRecords('tutoriales', { limit: 1 }),
                this.getAllRecords('herramientas', { limit: 1 }),
                this.getAllRecords('noticias', { limit: 1 })
            ]);

            return {
                totalArticulos: articulos.total,
                totalTutoriales: tutoriales.total,
                totalHerramientas: herramientas.total,
                totalNoticias: noticias.total
            };
        } catch (error) {
            console.error('Error fetching stats:', error);
            return {
                totalArticulos: 0,
                totalTutoriales: 0,
                totalHerramientas: 0,
                totalNoticias: 0
            };
        }
    }

    // Newsletter subscription (mock implementation)
    async subscribeNewsletter(email) {
        // In a real implementation, this would save to a subscribers table
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: 'Suscripción exitosa'
                });
            }, 1000);
        });
    }

    // Comment system (mock implementation)
    async submitComment(contentType, contentId, commentData) {
        // In a real implementation, this would save to a comments table
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    comment: {
                        id: Date.now().toString(),
                        ...commentData,
                        fecha: new Date().toISOString()
                    }
                });
            }, 500);
        });
    }

    async getComments(contentType, contentId) {
        // Mock comments for demonstration
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: '1',
                        autor: 'Juan Martínez',
                        contenido: 'Excelente artículo! Me parece muy acertado el análisis sobre los metaframeworks.',
                        fecha: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
                    },
                    {
                        id: '2',
                        autor: 'Laura Silva',
                        contenido: '¿Qué opinas sobre Solid.js? Creo que podría ser una alternativa interesante a React para 2024.',
                        fecha: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5 hours ago
                    }
                ]);
            }, 300);
        });
    }
}

// Content formatting utilities
class ContentFormatter {
    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    static formatDateRelative(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'Ayer';
        if (diffDays < 7) return `hace ${diffDays} días`;
        if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semanas`;
        if (diffDays < 365) return `hace ${Math.floor(diffDays / 30)} meses`;
        return `hace ${Math.floor(diffDays / 365)} años`;
    }

    static truncateText(text, maxLength = 150) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength).trim() + '...';
    }

    static getLevelText(level) {
        const levels = {
            'principiante': 'Principiante',
            'intermedio': 'Intermedio',
            'avanzado': 'Avanzado'
        };
        return levels[level] || level;
    }

    static getLevelClass(level) {
        const classes = {
            'principiante': 'beginner',
            'intermedio': 'intermediate',
            'avanzado': 'advanced'
        };
        return classes[level] || 'beginner';
    }

    static getRelevanciaClass(relevancia) {
        const classes = {
            'baja': 'text-gray-600',
            'media': 'text-blue-600',
            'alta': 'text-orange-600',
            'critica': 'text-red-600'
        };
        return classes[relevancia] || 'text-gray-600';
    }

    static formatTags(tags) {
        if (!Array.isArray(tags)) return [];
        return tags.map(tag => tag.toLowerCase().replace(/\s+/g, '-'));
    }

    static generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let stars = '★'.repeat(fullStars);
        if (hasHalfStar) stars += '½';
        stars += '☆'.repeat(emptyStars);
        
        return stars;
    }
}

// Content rendering utilities
class ContentRenderer {
    constructor(api) {
        this.api = api;
        this.formatter = ContentFormatter;
    }

    renderArticleCard(article) {
        return `
            <article class="article-card card-hover" data-id="${article.id}">
                <div class="article-image" style="background-image: url('${article.imagen_url || ''}')"></div>
                <div class="article-content">
                    <div class="flex justify-between items-center mb-3">
                        <span class="article-category">${article.categoria}</span>
                        <span class="text-gray-500 text-sm">
                            <i class="fas fa-clock mr-1"></i>${article.tiempo_lectura}
                        </span>
                    </div>
                    <h3 class="article-title">${article.titulo}</h3>
                    <p class="article-excerpt">${this.formatter.truncateText(article.extracto)}</p>
                    <div class="article-meta">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <span>Por ${article.autor}</span>
                                <span class="mx-2">•</span>
                                <span>${this.formatter.formatDate(article.fecha_publicacion)}</span>
                            </div>
                            <button onclick="window.location.href='pages/articulo.html?id=${article.id}'" 
                                    class="text-blue-600 hover:text-blue-800 text-sm">
                                Leer más <i class="fas fa-arrow-right ml-1"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        `;
    }

    renderTutorialCard(tutorial) {
        return `
            <article class="tutorial-card card-hover" data-id="${tutorial.id}">
                <div class="tutorial-content">
                    <span class="tutorial-level ${this.formatter.getLevelClass(tutorial.nivel)}">${this.formatter.getLevelText(tutorial.nivel)}</span>
                    <h3 class="text-xl font-semibold text-gray-800 mb-2">${tutorial.titulo}</h3>
                    <p class="text-gray-600 text-sm mb-4">${this.formatter.truncateText(tutorial.descripcion)}</p>
                    <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
                        <span><i class="fas fa-clock mr-1"></i>${tutorial.duracion}</span>
                        <span><i class="fas fa-play-circle mr-1"></i>${tutorial.num_lecciones} lecciones</span>
                    </div>
                    <div class="flex justify-between items-center mb-3">
                        <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">${tutorial.categoria}</span>
                        <div class="flex items-center">
                            <span class="text-yellow-400 mr-1">${this.formatter.generateStars(tutorial.valoracion)}</span>
                            <span class="text-xs text-gray-500">(${tutorial.valoracion})</span>
                        </div>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-xs text-gray-500">${tutorial.num_estudiantes.toLocaleString()} estudiantes</span>
                        <button onclick="window.location.href='pages/tutorial.html?id=${tutorial.id}'" 
                                class="text-blue-600 hover:text-blue-800 font-medium text-sm">
                            Empezar <i class="fas fa-arrow-right ml-1"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;
    }

    renderToolCard(tool) {
        return `
            <article class="tool-card card-hover" data-id="${tool.id}">
                <div class="tool-icon text-blue-600">
                    <i class="${tool.icono}"></i>
                </div>
                <h3 class="tool-name">${tool.nombre}</h3>
                <p class="tool-description">${this.formatter.truncateText(tool.descripcion, 80)}</p>
                <div class="tool-rating text-lg">${this.formatter.generateStars(tool.valoracion)}</div>
                <div class="text-xs text-gray-500 mt-2 mb-3">${tool.categoria}</div>
                <div class="flex justify-between items-center">
                    <span class="text-xs px-2 py-1 rounded ${tool.precio === 'gratuita' ? 'bg-green-100 text-green-800' : tool.precio === 'freemium' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'}">
                        ${tool.precio.charAt(0).toUpperCase() + tool.precio.slice(1)}
                    </span>
                    ${tool.sitio_web ? `<a href="${tool.sitio_web}" target="_blank" class="text-blue-600 hover:text-blue-800 text-sm"><i class="fas fa-external-link-alt"></i></a>` : ''}
                </div>
            </article>
        `;
    }

    renderNewsCard(news) {
        return `
            <article class="news-card card-hover" data-id="${news.id}">
                <div class="news-content">
                    <div class="news-date">${this.formatter.formatDate(news.fecha_publicacion)}</div>
                    <h3 class="news-title">${news.titulo}</h3>
                    <p class="news-summary">${this.formatter.truncateText(news.resumen)}</p>
                    <div class="flex justify-between items-center mt-4">
                        <span class="text-xs bg-red-50 text-red-600 px-2 py-1 rounded">${news.categoria}</span>
                        <div class="flex items-center space-x-2">
                            <span class="text-xs ${this.formatter.getRelevanciaClass(news.relevancia)}">${news.relevancia}</span>
                            ${news.url_externa ? `<a href="${news.url_externa}" target="_blank" class="text-red-600 hover:text-red-800 text-sm font-medium">Leer más <i class="fas fa-external-link-alt ml-1"></i></a>` : ''}
                        </div>
                    </div>
                </div>
            </article>
        `;
    }
}

// Initialize global API instance
window.techDivulgaAPI = new TechDivulgaAPI();
window.contentRenderer = new ContentRenderer(window.techDivulgaAPI);
