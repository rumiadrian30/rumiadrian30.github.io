// main.js - Scripts principales de RumiDivulga

// ==================== INICIALIZACIÓN ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 RumiDivulga iniciado');
    
    // Inicializar componentes
    initMobileMenu();
    initSmoothScroll();
    initActiveNavigation();
    loadDynamicContent();
    initNewsletterForm();
});

// ==================== MOBILE MENU ====================

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            
            // Cambiar icono
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.className = 'fas fa-bars text-xl';
            } else {
                icon.className = 'fas fa-times text-xl';
            }
        });
        
        // Cerrar menú al hacer clic en un enlace
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuBtn.querySelector('i');
                icon.className = 'fas fa-bars text-xl';
            });
        });
    }
}

// ==================== SMOOTH SCROLL ====================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Ignorar enlaces que no son a secciones
            if (href === '#' || href === '#!') {
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Actualizar URL sin hacer scroll
                history.pushState(null, null, href);
            }
        });
    });
}

// ==================== ACTIVE NAVIGATION ====================

function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (sections.length === 0 || navLinks.length === 0) return;
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('text-blue-600', 'font-semibold');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('text-blue-600', 'font-semibold');
            }
        });
    });
}

// ==================== DYNAMIC CONTENT LOADING ====================

function loadDynamicContent() {
    loadArticles();
    loadTutorials();
    loadTools();
    loadNews();
}

// ==================== ARTÍCULOS ====================

async function loadArticles() {
    const articlesGrid = document.getElementById('articulos-grid');
    if (!articlesGrid) return;
    
    const articles = [
        {
            title: "El Futuro de JavaScript en 2025",
            excerpt: "Exploramos las nuevas características y tendencias que definirán JavaScript este año.",
            category: "Frontend",
            image: "https://via.placeholder.com/400x250/3B82F6/FFFFFF?text=JavaScript+2025",
            link: "#",
            date: "15 Dic 2024"
        },
        {
            title: "Introducción a Machine Learning con Python",
            excerpt: "Guía completa para comenzar en el mundo del ML usando Python y sus bibliotecas.",
            category: "IA/ML",
            image: "https://via.placeholder.com/400x250/10B981/FFFFFF?text=Python+ML",
            link: "#",
            date: "12 Dic 2024"
        },
        {
            title: "DevOps: Mejores Prácticas para CI/CD",
            excerpt: "Implementa pipelines eficientes de integración y despliegue continuo.",
            category: "DevOps",
            image: "https://via.placeholder.com/400x250/F59E0B/FFFFFF?text=DevOps+CI/CD",
            link: "#",
            date: "10 Dic 2024"
        },
        {
            title: "React 19: Nuevas Características",
            excerpt: "Descubre todo lo nuevo que trae React 19 y cómo aprovechar sus mejoras.",
            category: "Frontend",
            image: "https://via.placeholder.com/400x250/06B6D4/FFFFFF?text=React+19",
            link: "#",
            date: "08 Dic 2024"
        },
        {
            title: "Arquitectura de Microservicios",
            excerpt: "Aprende a diseñar y construir aplicaciones escalables con microservicios.",
            category: "Backend",
            image: "https://via.placeholder.com/400x250/8B5CF6/FFFFFF?text=Microservices",
            link: "#",
            date: "05 Dic 2024"
        },
        {
            title: "Seguridad en Aplicaciones Web",
            excerpt: "Guía completa sobre las mejores prácticas de seguridad para aplicaciones web modernas.",
            category: "Seguridad",
            image: "https://via.placeholder.com/400x250/EF4444/FFFFFF?text=Web+Security",
            link: "#",
            date: "03 Dic 2024"
        }
    ];
    
    articlesGrid.innerHTML = articles.map(article => `
        <article class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 fade-in">
            <img src="${article.image}" alt="${article.title}" class="w-full h-48 object-cover">
            <div class="p-6">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-xs font-semibold text-blue-600 uppercase">${article.category}</span>
                    <span class="text-xs text-gray-500">${article.date}</span>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mt-2 mb-3 hover:text-blue-600 transition-colors">${article.title}</h3>
                <p class="text-gray-600 text-sm mb-4">${article.excerpt}</p>
                <a href="${article.link}" class="text-blue-600 font-semibold hover:text-blue-700 inline-flex items-center group">
                    Leer más 
                    <i class="fas fa-arrow-right ml-2 transform group-hover:translate-x-1 transition-transform"></i>
                </a>
            </div>
        </article>
    `).join('');
}

// ==================== TUTORIALES ====================

async function loadTutorials() {
    const tutorialsGrid = document.getElementById('tutoriales-grid');
    if (!tutorialsGrid) return;
    
    const tutorials = [
        {
            title: "React Hooks Completo",
            duration: "2 horas",
            level: "Intermedio",
            icon: "fab fa-react",
            color: "blue",
            lessons: 12
        },
        {
            title: "Node.js y Express API",
            duration: "3 horas",
            level: "Principiante",
            icon: "fab fa-node",
            color: "green",
            lessons: 15
        },
        {
            title: "Docker para Desarrolladores",
            duration: "1.5 horas",
            level: "Intermedio",
            icon: "fab fa-docker",
            color: "sky",
            lessons: 8
        },
        {
            title: "Python Data Science",
            duration: "4 horas",
            level: "Avanzado",
            icon: "fab fa-python",
            color: "yellow",
            lessons: 20
        },
        {
            title: "Git & GitHub Esencial",
            duration: "2 horas",
            level: "Principiante",
            icon: "fab fa-git-alt",
            color: "orange",
            lessons: 10
        },
        {
            title: "Vue.js 3 Fundamentos",
            duration: "2.5 horas",
            level: "Intermedio",
            icon: "fab fa-vuejs",
            color: "emerald",
            lessons: 14
        }
    ];
    
    tutorialsGrid.innerHTML = tutorials.map(tutorial => `
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 fade-in">
            <div class="text-center">
                <div class="bg-${tutorial.color}-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="${tutorial.icon} text-4xl text-${tutorial.color}-600"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-800 mb-2">${tutorial.title}</h3>
                <div class="flex justify-center items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span><i class="far fa-clock mr-1"></i>${tutorial.duration}</span>
                    <span><i class="fas fa-signal mr-1"></i>${tutorial.level}</span>
                </div>
                <p class="text-xs text-gray-500 mb-4">${tutorial.lessons} lecciones</p>
                <button class="bg-${tutorial.color}-600 text-white px-6 py-2 rounded-lg hover:bg-${tutorial.color}-700 transition-colors w-full">
                    Comenzar Tutorial
                </button>
            </div>
        </div>
    `).join('');
}

// ==================== HERRAMIENTAS ====================

async function loadTools() {
    const toolsGrid = document.getElementById('herramientas-grid');
    if (!toolsGrid) return;
    
    const tools = [
        { name: "VS Code", icon: "fas fa-code", rating: 5, category: "Editor" },
        { name: "Git", icon: "fab fa-git-alt", rating: 5, category: "Control" },
        { name: "Postman", icon: "fas fa-paper-plane", rating: 4, category: "API" },
        { name: "Docker", icon: "fab fa-docker", rating: 5, category: "Container" },
        { name: "Figma", icon: "fas fa-pencil-ruler", rating: 5, category: "Diseño" },
        { name: "GitHub", icon: "fab fa-github", rating: 5, category: "Repo" },
        { name: "MongoDB", icon: "fas fa-database", rating: 4, category: "DB" },
        { name: "Webpack", icon: "fas fa-box", rating: 4, category: "Build" }
    ];
    
    toolsGrid.innerHTML = tools.map(tool => `
        <div class="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-center fade-in">
            <i class="${tool.icon} text-4xl text-blue-600 mb-3"></i>
            <h4 class="font-semibold text-gray-800 mb-1">${tool.name}</h4>
            <p class="text-xs text-gray-500 mb-2">${tool.category}</p>
            <div class="text-yellow-400 text-sm">
                ${'★'.repeat(tool.rating)}${'☆'.repeat(5-tool.rating)}
            </div>
        </div>
    `).join('');
}

// ==================== NOTICIAS ====================

async function loadNews() {
    const newsGrid = document.getElementById('noticias-grid');
    if (!newsGrid) return;
    
    const news = [
        {
            title: "Nuevo Framework JavaScript Revoluciona el Desarrollo",
            date: "Hace 2 días",
            source: "TechNews",
            category: "Frontend"
        },
        {
            title: "Python 3.13 Lanzado con Mejoras de Rendimiento",
            date: "Hace 1 semana",
            source: "Python.org",
            category: "Lenguajes"
        },
        {
            title: "GitHub Copilot Actualizado con Nuevas Capacidades de IA",
            date: "Hace 3 días",
            source: "GitHub Blog",
            category: "IA"
        },
        {
            title: "Docker Desktop Añade Soporte para WebAssembly",
            date: "Hace 5 días",
            source: "Docker",
            category: "DevOps"
        },
        {
            title: "React Native 0.73 Trae Mejoras Significativas",
            date: "Hace 4 días",
            source: "React Native",
            category: "Mobile"
        },
        {
            title: "TypeScript 5.3: Nuevas Características y Optimizaciones",
            date: "Hace 6 días",
            source: "TypeScript",
            category: "Lenguajes"
        }
    ];
    
    newsGrid.innerHTML = news.map(item => `
        <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 fade-in">
            <div class="flex items-start justify-between mb-3">
                <span class="text-xs font-semibold text-red-600 uppercase">${item.source}</span>
                <span class="text-xs text-gray-500">${item.date}</span>
            </div>
            <span class="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-100 rounded mb-2">
                ${item.category}
            </span>
            <h4 class="font-bold text-gray-800 mb-2 hover:text-blue-600 transition-colors">${item.title}</h4>
            <a href="#" class="text-blue-600 text-sm font-semibold hover:text-blue-700 inline-flex items-center group">
                Leer noticia completa 
                <i class="fas fa-arrow-right ml-1 transform group-hover:translate-x-1 transition-transform"></i>
            </a>
        </div>
    `).join('');
}

// ==================== NEWSLETTER ====================

function initNewsletterForm() {
    const newsletterInputs = document.querySelectorAll('input[type="email"]');
    const newsletterButtons = document.querySelectorAll('button');
    
    newsletterButtons.forEach(button => {
        if (button.textContent.includes('Suscribirse')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const input = button.previousElementSibling;
                if (input && input.type === 'email') {
                    const email = input.value.trim();
                    if (validateEmail(email)) {
                        alert(`¡Gracias por suscribirte! Confirma tu email: ${email}`);
                        input.value = '';
                    } else {
                        alert('Por favor, ingresa un email válido');
                    }
                }
            });
        }
    });
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ==================== ANIMATIONS ====================

// Intersection Observer para animaciones al scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos cuando el DOM esté listo
setTimeout(() => {
    document.querySelectorAll('.fade-in').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}, 100);

// ==================== UTILITIES ====================

// Logger para desarrollo
const logger = {
    log: (message, data) => {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`[RumiDivulga] ${message}`, data || '');
        }
    },
    error: (message, error) => {
        console.error(`[RumiDivulga ERROR] ${message}`, error);
    }
};

// Exportar para uso en otros scripts
window.RumiDivulga = {
    logger,
    loadArticles,
    loadTutorials,
    loadTools,
    loadNews
};

logger.log('✅ Todos los scripts cargados correctamente');