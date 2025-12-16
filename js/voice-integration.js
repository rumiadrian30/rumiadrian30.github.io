// ============================================
// CRISP-DM Implementation - Voice Integration for Dialogflow
// Integración de Voz DENTRO del df-messenger existente
// ============================================

/**
 * MARCO METODOLÓGICO CRISP-DM PARA PLN:
 * 
 * 1. Comprensión del Negocio: Añadir botón de voz dentro del chat existente
 * 2. Comprensión de Datos: Audio → Web Speech API → Texto → Dialogflow
 * 3. Preparación de Datos: Configuración de Web Speech API en español
 * 4. Modelado: Inyección del texto directamente en el input de df-messenger
 * 5. Evaluación: Feedback visual integrado en el chat
 * 6. Despliegue: Script que se integra sin modificar el HTML
 */

class DialogflowVoiceIntegration {
    constructor() {
        this.recognition = null;
        this.isRecording = false;
        this.dfMessenger = null;
        this.dfInput = null;
        this.textInput = null;
        this.voiceButton = null;
        this.retryCount = 0;
        this.maxRetries = 20;
        
        console.log('🚀 Iniciando integración de voz con Dialogflow...');
        this.init();
    }
    
    init() {
        this.waitForDialogflow();
    }
    
    // Esperar a que el df-messenger esté completamente cargado
    waitForDialogflow() {
        const checkInterval = setInterval(() => {
            this.dfMessenger = document.querySelector('df-messenger');
            
            if (this.dfMessenger && this.dfMessenger.shadowRoot) {
                // Buscar el componente de input dentro del shadow DOM
                this.dfInput = this.dfMessenger.shadowRoot.querySelector('df-messenger-user-input');
                
                if (this.dfInput && this.dfInput.shadowRoot) {
                    this.textInput = this.dfInput.shadowRoot.querySelector('input[type="text"]');
                    
                    if (this.textInput) {
                        clearInterval(checkInterval);
                        console.log('✅ Dialogflow messenger detectado');
                        console.log('✅ Input de texto encontrado');
                        
                        // Inicializar todo
                        this.initSpeechRecognition();
                        this.injectVoiceButton();
                        this.applyStyles();
                    }
                }
            }
            
            this.retryCount++;
            if (this.retryCount >= this.maxRetries) {
                clearInterval(checkInterval);
                console.error('❌ No se pudo encontrar el df-messenger después de', this.maxRetries, 'intentos');
            }
        }, 500);
    }
    
    // FASE 3: Preparación de Datos - Web Speech API
    initSpeechRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.warn('❌ Speech Recognition no soportado en este navegador');
            return;
        }
        
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        // Configuración óptima para español
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.lang = 'es-ES';
        this.recognition.maxAlternatives = 1;
        
        // EVENTOS
        this.recognition.onstart = () => {
            this.isRecording = true;
            this.updateButtonState('recording');
            console.log('🎤 Grabando...');
            this.showStatus('Escuchando...');
        };
        
        this.recognition.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            
            // Mostrar transcripción en tiempo real
            if (interimTranscript) {
                this.textInput.value = interimTranscript;
                this.showStatus('Transcribiendo: ' + interimTranscript);
            }
            
            // Cuando finaliza, enviar automáticamente
            if (finalTranscript) {
                console.log('📝 Transcripción final:', finalTranscript);
                this.textInput.value = finalTranscript;
                this.hideStatus();
                
                // Enviar el mensaje a Dialogflow
                setTimeout(() => {
                    this.sendToDialogflow(finalTranscript);
                }, 300);
            }
        };
        
        this.recognition.onerror = (event) => {
            console.error('❌ Error de reconocimiento:', event.error);
            this.isRecording = false;
            this.updateButtonState('idle');
            
            let errorMsg = '';
            switch(event.error) {
                case 'no-speech':
                    errorMsg = '⚠️ No se detectó voz';
                    break;
                case 'audio-capture':
                    errorMsg = '⚠️ No se puede acceder al micrófono';
                    break;
                case 'not-allowed':
                    errorMsg = '⚠️ Permiso de micrófono denegado';
                    break;
                default:
                    errorMsg = '⚠️ Error: ' + event.error;
            }
            
            this.showStatus(errorMsg);
            setTimeout(() => this.hideStatus(), 3000);
        };
        
        this.recognition.onend = () => {
            this.isRecording = false;
            this.updateButtonState('idle');
            console.log('🛑 Grabación finalizada');
        };
        
        console.log('✅ Speech Recognition inicializado');
    }
    
    // FASE 5: Evaluación - Inyectar botón de voz dentro del input
    injectVoiceButton() {
        if (!this.dfInput || !this.dfInput.shadowRoot) {
            console.error('❌ No se puede inyectar el botón de voz');
            return;
        }
        
        // Buscar el contenedor del input
        const inputContainer = this.dfInput.shadowRoot.querySelector('.input-box-wrapper') || 
                              this.dfInput.shadowRoot.querySelector('.input-container') ||
                              this.dfInput.shadowRoot.querySelector('[class*="input"]');
        
        if (!inputContainer) {
            console.error('❌ No se encontró el contenedor del input');
            return;
        }
        
        // Crear el botón de voz
        const voiceBtn = document.createElement('button');
        voiceBtn.id = 'df-voice-button';
        voiceBtn.type = 'button';
        voiceBtn.className = 'df-voice-btn';
        voiceBtn.title = 'Presiona para hablar';
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        
        // Insertar el botón junto al input
        inputContainer.style.position = 'relative';
        inputContainer.style.display = 'flex';
        inputContainer.style.alignItems = 'center';
        
        // Buscar el botón de envío para insertarlo antes
        const sendButton = this.dfInput.shadowRoot.querySelector('button[type="submit"]') ||
                          this.dfInput.shadowRoot.querySelector('.send-icon') ||
                          this.dfInput.shadowRoot.querySelector('[class*="send"]');
        
        if (sendButton) {
            sendButton.parentNode.insertBefore(voiceBtn, sendButton);
        } else {
            inputContainer.appendChild(voiceBtn);
        }
        
        this.voiceButton = voiceBtn;
        
        // Event listener
        this.voiceButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleVoiceInput();
        });
        
        console.log('✅ Botón de voz inyectado en df-messenger');
    }
    
    // Aplicar estilos al botón de voz
    applyStyles() {
        if (!this.dfInput || !this.dfInput.shadowRoot) return;
        
        const style = document.createElement('style');
        style.textContent = `
            .df-voice-btn {
                background: transparent;
                border: none;
                cursor: pointer;
                padding: 8px;
                margin: 0 4px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                width: 36px;
                height: 36px;
                color: #667eea;
            }
            
            .df-voice-btn:hover {
                background: rgba(102, 126, 234, 0.1);
                transform: scale(1.1);
            }
            
            .df-voice-btn.recording {
                background: #ef4444;
                color: white;
                animation: pulse-voice 1.5s infinite;
            }
            
            .df-voice-btn i {
                font-size: 18px;
            }
            
            @keyframes pulse-voice {
                0%, 100% {
                    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
                }
                50% {
                    box-shadow: 0 0 0 8px rgba(239, 68, 68, 0);
                    transform: scale(1.05);
                }
            }
            
            .df-voice-status {
                position: absolute;
                bottom: 100%;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.85);
                color: white;
                padding: 6px 12px;
                border-radius: 8px;
                font-size: 12px;
                white-space: nowrap;
                margin-bottom: 8px;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 1000;
            }
            
            .df-voice-status.show {
                opacity: 1;
            }
            
            .df-voice-status::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                transform: translateX(-50%);
                border: 6px solid transparent;
                border-top-color: rgba(0, 0, 0, 0.85);
            }
        `;
        
        this.dfInput.shadowRoot.appendChild(style);
        console.log('✅ Estilos aplicados');
    }
    
    toggleVoiceInput() {
        if (!this.recognition) {
            this.showNotification('⚠️ Reconocimiento de voz no disponible');
            return;
        }
        
        if (this.isRecording) {
            this.recognition.stop();
        } else {
            this.textInput.value = '';
            this.textInput.focus();
            this.recognition.start();
        }
    }
    
    updateButtonState(state) {
        if (!this.voiceButton) return;
        
        this.voiceButton.classList.remove('recording');
        
        if (state === 'recording') {
            this.voiceButton.classList.add('recording');
        }
    }
    
    showStatus(text) {
        if (!this.dfInput || !this.dfInput.shadowRoot) return;
        
        let statusElement = this.dfInput.shadowRoot.querySelector('.df-voice-status');
        
        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.className = 'df-voice-status';
            
            const inputContainer = this.dfInput.shadowRoot.querySelector('.input-box-wrapper') || 
                                  this.dfInput.shadowRoot.querySelector('.input-container');
            
            if (inputContainer) {
                inputContainer.style.position = 'relative';
                inputContainer.appendChild(statusElement);
            }
        }
        
        statusElement.textContent = text;
        statusElement.classList.add('show');
    }
    
    hideStatus() {
        if (!this.dfInput || !this.dfInput.shadowRoot) return;
        
        const statusElement = this.dfInput.shadowRoot.querySelector('.df-voice-status');
        if (statusElement) {
            statusElement.classList.remove('show');
        }
    }
    
    showNotification(message) {
        // Crear notificación flotante
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-family: 'Inter', sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // FASE 4: Modelado - Enviar mensaje a Dialogflow
    sendToDialogflow(text) {
        console.log('📤 Enviando a Dialogflow:', text);
        
        try {
            // Establecer el valor en el input
            this.textInput.value = text;
            
            // Simular el evento Enter para enviar el mensaje
            const enterEvent = new KeyboardEvent('keydown', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            });
            
            this.textInput.dispatchEvent(enterEvent);
            
            // También intentar con el evento keyup
            const enterUpEvent = new KeyboardEvent('keyup', {
                key: 'Enter',
                code: 'Enter',
                keyCode: 13,
                which: 13,
                bubbles: true,
                cancelable: true
            });
            
            this.textInput.dispatchEvent(enterUpEvent);
            
            // Intentar hacer clic en el botón de envío si existe
            const sendButton = this.dfInput.shadowRoot.querySelector('button[type="submit"]');
            if (sendButton) {
                setTimeout(() => sendButton.click(), 100);
            }
            
            console.log('✅ Mensaje enviado a Dialogflow');
            
        } catch (error) {
            console.error('❌ Error al enviar a Dialogflow:', error);
            this.showNotification('❌ Error al enviar mensaje');
        }
    }
}

// Agregar estilos de animación al documento principal
const globalStyles = document.createElement('style');
globalStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(globalStyles);

// FASE 6: Despliegue - Inicialización automática
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new DialogflowVoiceIntegration();
    });
} else {
    new DialogflowVoiceIntegration();
}