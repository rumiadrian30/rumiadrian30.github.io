// TechDivulga - Main JavaScript File

// DOM Elements
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    loadInitialContent();
    setupAnimations();
    setupNewsletterForm();
});

// Navigation Functions
function initializeNavigation() {
    // Mobile menu toggle
    mobileMenuBtn?.addEventListener('click', toggleMobileMenu);
    
    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Update active navigation on scroll
    window.addEventListener('scroll', updateActiveNavigation);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!mobileMenu?.contains(e.target) && !mobileMenuBtn?.contains(e.target)) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    mobileMenu?.classList.toggle('hidden');
    
    // Toggle hamburger icon
    const icon = mobileMenuBtn?.querySelector('i');
    if (icon) {
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    }
}

function closeMobileMenu() {
    mobileMenu?.classList.add('hidden');
    const icon = mobileMenuBtn?.querySelector('i');
    if (icon) {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
}

function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.target.getAttribute('href');
    
    if (targetId.startsWith('#')) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80; // Account for fixed header
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
    
    // Close mobile menu after clicking
    closeMobileMenu();
}

function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100; // Account for header height
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Update active navigation link
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Content Loading Functions
function loadInitialContent() {
    if (window.techDivulgaAPI && window.contentRenderer) {
        loadArticles();
        loadTutorials();
        loadTools();
        loadNews();
    } else {
        // Wait for API to be available
        setTimeout(loadInitialContent, 100);
    }
}

async function loadArticles() {
    const articlesGrid = document.getElementById('articulos-grid');
    if (!articlesGrid) return;
    
    // Show loading skeleton
    showLoadingSkeleton(articlesGrid, 6, 'article');
    
    try {
        const result = await window.techDivulgaAPI.getArticulos({ limit: 6 });
        const articles = result.data;
        
        if (articles.length > 0) {
            articlesGrid.innerHTML = articles.map(article => window.contentRenderer.renderArticleCard(article)).join('');
            animateElements(articlesGrid.children);
        } else {
            articlesGrid.innerHTML = '<div class="col-span-full text-center text-gray-500">No hay artículos disponibles</div>';
        }
    } catch (error) {
        console.error('Error loading articles:', error);
        articlesGrid.innerHTML = '<div class="col-span-full text-center text-red-500">Error cargando artículos</div>';
    }
}

async function loadTutorials() {
    const tutorialesGrid = document.getElementById('tutoriales-grid');
    if (!tutorialesGrid) return;
    
    showLoadingSkeleton(tutorialesGrid, 6, 'tutorial');
    
    try {
        const result = await window.techDivulgaAPI.getTutoriales({ limit: 6 });
        const tutorials = result.data;
        
        if (tutorials.length > 0) {
            tutorialesGrid.innerHTML = tutorials.map(tutorial => window.contentRenderer.renderTutorialCard(tutorial)).join('');
            animateElements(tutorialesGrid.children);
        } else {
            tutorialesGrid.innerHTML = '<div class="col-span-full text-center text-gray-500">No hay tutoriales disponibles</div>';
        }
    } catch (error) {
        console.error('Error loading tutorials:', error);
        tutorialesGrid.innerHTML = '<div class="col-span-full text-center text-red-500">Error cargando tutoriales</div>';
    }
}

async function loadTools() {
    const herramientasGrid = document.getElementById('herramientas-grid');
    if (!herramientasGrid) return;
    
    showLoadingSkeleton(herramientasGrid, 8, 'tool');
    
    try {
        const result = await window.techDivulgaAPI.getHerramientas({ limit: 8 });
        const tools = result.data;
        
        if (tools.length > 0) {
            herramientasGrid.innerHTML = tools.map(tool => window.contentRenderer.renderToolCard(tool)).join('');
            animateElements(herramientasGrid.children);
        } else {
            herramientasGrid.innerHTML = '<div class="col-span-full text-center text-gray-500">No hay herramientas disponibles</div>';
        }
    } catch (error) {
        console.error('Error loading tools:', error);
        herramientasGrid.innerHTML = '<div class="col-span-full text-center text-red-500">Error cargando herramientas</div>';
    }
}

async function loadNews() {
    const noticiasGrid = document.getElementById('noticias-grid');
    if (!noticiasGrid) return;
    
    showLoadingSkeleton(noticiasGrid, 6, 'news');
    
    try {
        const result = await window.techDivulgaAPI.getNoticias({ limit: 6 });
        const news = result.data;
        
        if (news.length > 0) {
            noticiasGrid.innerHTML = news.map(newsItem => window.contentRenderer.renderNewsCard(newsItem)).join('');
            animateElements(noticiasGrid.children);
        } else {
            noticiasGrid.innerHTML = '<div class="col-span-full text-center text-gray-500">No hay noticias disponibles</div>';
        }
    } catch (error) {
        console.error('Error loading news:', error);
        noticiasGrid.innerHTML = '<div class="col-span-full text-center text-red-500">Error cargando noticias</div>';
    }
}

// Card Creation Functions
function createArticleCard(article) {
    return `
        <article class="article-card card-hover">
            <div class="article-image" style="background-image: url('${article.image}')"></div>
            <div class="article-content">
                <div class="flex justify-between items-center mb-3">
                    <span class="article-category">${article.category}</span>
                    <span class="text-gray-500 text-sm">
                        <i class="fas fa-clock mr-1"></i>${article.readTime}
                    </span>
                </div>
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt}</p>
                <div class="article-meta">
                    <div class="flex items-center">
                        <span>Por ${article.author}</span>
                        <span class="mx-2">•</span>
                        <span>${formatDate(article.date)}</span>
                    </div>
                </div>
            </div>
        </article>
    `;
}

function createTutorialCard(tutorial) {
    return `
        <article class="tutorial-card card-hover">
            <div class="tutorial-content">
                <span class="tutorial-level ${tutorial.level}">${getLevelText(tutorial.level)}</span>
                <h3 class="text-xl font-semibold text-gray-800 mb-2">${tutorial.title}</h3>
                <p class="text-gray-600 text-sm mb-4">${tutorial.description}</p>
                <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
                    <span><i class="fas fa-clock mr-1"></i>${tutorial.duration}</span>
                    <span><i class="fas fa-play-circle mr-1"></i>${tutorial.lessons} lecciones</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">${tutorial.category}</span>
                    <button class="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        Empezar <i class="fas fa-arrow-right ml-1"></i>
                    </button>
                </div>
            </div>
        </article>
    `;
}

function createToolCard(tool) {
    const stars = '★'.repeat(tool.rating) + '☆'.repeat(5 - tool.rating);
    
    return `
        <article class="tool-card card-hover">
            <div class="tool-icon text-blue-600">
                <i class="${tool.icon}"></i>
            </div>
            <h3 class="tool-name">${tool.name}</h3>
            <p class="tool-description">${tool.description}</p>
            <div class="tool-rating text-lg">${stars}</div>
            <div class="text-xs text-gray-500 mt-2">${tool.category}</div>
        </article>
    `;
}

function createNewsCard(newsItem) {
    return `
        <article class="news-card card-hover">
            <div class="news-content">
                <div class="news-date">${formatDate(newsItem.date)}</div>
                <h3 class="news-title">${newsItem.title}</h3>
                <p class="news-summary">${newsItem.summary}</p>
                <div class="flex justify-between items-center mt-4">
                    <span class="text-xs bg-red-50 text-red-600 px-2 py-1 rounded">${newsItem.category}</span>
                    <button class="text-red-600 hover:text-red-800 text-sm font-medium">
                        Leer más <i class="fas fa-external-link-alt ml-1"></i>
                    </button>
                </div>
            </div>
        </article>
    `;
}

// Utility Functions
function showLoadingSkeleton(container, count, type) {
    const skeletonHTML = Array(count).fill().map(() => createSkeletonCard(type)).join('');
    container.innerHTML = skeletonHTML;
}

function createSkeletonCard(type) {
    if (type === 'article') {
        return `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                <div class="skeleton skeleton-image"></div>
                <div class="p-6">
                    <div class="skeleton skeleton-text w-1/3 mb-3"></div>
                    <div class="skeleton skeleton-title mb-3"></div>
                    <div class="skeleton skeleton-text mb-2"></div>
                    <div class="skeleton skeleton-text w-2/3"></div>
                </div>
            </div>
        `;
    } else if (type === 'tutorial') {
        return `
            <div class="bg-white rounded-lg shadow-lg border-l-4 border-green-500">
                <div class="p-6">
                    <div class="skeleton skeleton-text w-1/4 mb-4"></div>
                    <div class="skeleton skeleton-title mb-3"></div>
                    <div class="skeleton skeleton-text mb-2"></div>
                    <div class="skeleton skeleton-text w-3/4"></div>
                </div>
            </div>
        `;
    } else if (type === 'tool') {
        return `
            <div class="bg-white rounded-lg shadow-lg p-6 text-center">
                <div class="skeleton w-12 h-12 rounded mx-auto mb-4"></div>
                <div class="skeleton skeleton-title mb-3"></div>
                <div class="skeleton skeleton-text mb-2"></div>
                <div class="skeleton skeleton-text w-1/2 mx-auto"></div>
            </div>
        `;
    } else if (type === 'news') {
        return `
            <div class="bg-white rounded-lg shadow-lg">
                <div class="p-6">
                    <div class="skeleton skeleton-text w-1/4 mb-2"></div>
                    <div class="skeleton skeleton-title mb-3"></div>
                    <div class="skeleton skeleton-text mb-2"></div>
                    <div class="skeleton skeleton-text w-2/3"></div>
                </div>
            </div>
        `;
    }
}

function animateElements(elements) {
    Array.from(elements).forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('fade-in-up');
        }, index * 100);
    });
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function getLevelText(level) {
    const levels = {
        'beginner': 'Principiante',
        'intermediate': 'Intermedio',
        'advanced': 'Avanzado'
    };
    return levels[level] || level;
}

function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe sections for scroll animations
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

function setupNewsletterForm() {
    const newsletterForm = document.querySelector('form') || createNewsletterForm();
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
}

function createNewsletterForm() {
    // Create form element if it doesn't exist
    const emailInput = document.querySelector('input[type="email"]');
    const subscribeBtn = emailInput?.nextElementSibling;
    
    if (emailInput && subscribeBtn) {
        const form = document.createElement('form');
        form.className = 'max-w-md mx-auto flex';
        
        emailInput.parentNode.insertBefore(form, emailInput);
        form.appendChild(emailInput);
        form.appendChild(subscribeBtn);
        
        return form;
    }
    
    return null;
}

function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const emailInput = e.target.querySelector('input[type="email"]');
    const submitBtn = e.target.querySelector('button');
    
    if (!emailInput || !emailInput.value) {
        showNotification('Por favor, ingresa un email válido', 'error');
        return;
    }
    
    // Show loading state
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Suscribiendo...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showNotification('¡Gracias por suscribirte! Recibirás nuestras novedades pronto.', 'success');
        emailInput.value = '';
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'error' ? 'bg-red-500 text-white' :
        'bg-blue-500 text-white'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('fade-in'), 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Search functionality (for future implementation)
function setupSearch() {
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();
    // Implement search logic here
    console.log('Searching for:', query);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
