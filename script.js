/* ==========================================================================
   LATINOMÉRICA COMPARTE - LOGICA DE INTERACCIÓN DE PRODUCTO PREMIUM
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SISTEMA DE PARTÍCULAS INTERACTIVAS (CANVAS 2D) ---
    const canvas = document.getElementById('bg-particles');
    const ctx = canvas.getContext('2d');

    let particlesArray = [];
    const numberOfParticles = 60;
    const connectionDistance = 110;
    const mouse = {
        x: null,
        y: null,
        radius: 100
    };

    // Ajustar tamaño del lienzo al redimensionar ventana
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Rastrear posición del mouse
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Clase Partícula
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.8;
            this.speedX = Math.random() * 0.4 - 0.2;
            this.speedY = Math.random() * 0.4 - 0.2;
            this.baseColor = 'rgba(0, 242, 254, 0.4)'; // Cyan sutil
            this.glowColor = 'rgba(0, 230, 153, 0.8)'; // Emerald brillante
            this.color = this.baseColor;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Rebote de bordes
            if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
            if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;

            // Interacción con el mouse (gravedad/repulsión sutil)
            if (mouse.x != null && mouse.y != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    this.color = this.glowColor;
                    this.size = Math.min(this.size + 0.05, 3.5);
                    // Empujar ligeramente
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x -= (dx / distance) * force * 1.2;
                    this.y -= (dy / distance) * force * 1.2;
                } else {
                    this.color = this.baseColor;
                    this.size = Math.max(this.size - 0.05, 1);
                }
            } else {
                this.color = this.baseColor;
            }
        }

        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Inicializar partículas
    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    // Dibujar líneas entre partículas cercanas
    function connectParticles() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    // Gradiente de transparencia según distancia
                    let opacity = (1 - (distance / connectionDistance)) * 0.08;
                    ctx.strokeStyle = `rgba(0, 242, 254, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    // Animación continua del canvas
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();


    // --- 2. EFECTO DE REVELADO AL HACER SCROLL (SCROLL REVEAL) ---
    const revealSections = document.querySelectorAll('.landing-section, .gallery-section-wrapper');
    
    revealSections.forEach(section => {
        section.classList.add('reveal-section');
    });

    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealSections.forEach(section => {
        sectionObserver.observe(section);
    });


    // --- 3. EFECTO DE NAVBAR AL HACER SCROLL ---
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 4. CONTROL DE CAMBIO DE TEMA (OSCURO/CLARO) ---
    const themeBtn = document.getElementById('theme-toggle-btn');
    const themeSvg = document.getElementById('theme-svg');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && systemPrefersLight)) {
        body.classList.add('light-mode');
        updateSvgIcon(true);
    } else {
        body.classList.remove('light-mode');
        updateSvgIcon(false);
    }

    themeBtn.addEventListener('click', () => {
        body.classList.toggle('light-mode');
        const isLight = body.classList.contains('light-mode');
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
        updateSvgIcon(isLight);
        
        // Registrar acción en la bitácora
        if (typeof addAuditLogEntry === 'function') {
            addAuditLogEntry(`Tema visual cambiado a modo ${isLight ? 'CLARO' : 'OSCURO'}`, 'USER');
        }
    });

    function updateSvgIcon(isLight) {
        if (isLight) {
            themeSvg.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
        } else {
            themeSvg.innerHTML = `
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            `;
        }
    }

    // --- 5. TABS DEL ECOSISTEMA REGIONAL ---
    const ecoTabBtns = document.querySelectorAll('.eco-tab-btn');
    const ecoTabContents = document.querySelectorAll('.eco-tab-content');

    ecoTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            ecoTabBtns.forEach(b => b.classList.remove('active'));
            ecoTabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const countryId = btn.getAttribute('data-eco-country');
            const targetContent = document.getElementById(`eco-${countryId}`);
            if (targetContent) {
                targetContent.classList.add('active');
            }

            // Registrar acción en la bitácora
            if (typeof addAuditLogEntry === 'function') {
                addAuditLogEntry(`Portal regional activo cambiado a: ${countryId.toUpperCase()}`, 'USER');
            }
        });
    });

    // --- 6. CAROUSEL DE CAPTURAS DE PANTALLA ---
    const galScroll = document.getElementById('gal-scroll');
    const galPrev = document.getElementById('gal-prev');
    const galNext = document.getElementById('gal-next');
    const scrollStep = 320; 

    galPrev.addEventListener('click', () => {
        galScroll.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    });

    galNext.addEventListener('click', () => {
        galScroll.scrollBy({ left: scrollStep, behavior: 'smooth' });
    });

    // Soporte para swipe en dispositivos móviles
    let startX = 0;
    let scrollLeft = 0;
    let isDown = false;

    galScroll.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - galScroll.offsetLeft;
        scrollLeft = galScroll.scrollLeft;
    });

    galScroll.addEventListener('touchend', () => {
        isDown = false;
    });

    galScroll.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - galScroll.offsetLeft;
        const walk = (x - startX) * 1.5; 
        galScroll.scrollLeft = scrollLeft - walk;
    });

    // --- 7. VISUALIZADOR DE CAPTURAS AMPLILADAS (LIGHTBOX) ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxClose = document.getElementById('lightbox-close');
    const zoomableScreenshots = document.querySelectorAll('.zoomable-screenshot');

    zoomableScreenshots.forEach(screenshot => {
        screenshot.addEventListener('click', () => {
            const title = screenshot.getAttribute('data-title');
            const src = screenshot.getAttribute('src');
            
            lightboxImg.setAttribute('src', src);
            lightboxTitle.textContent = title;
            lightbox.classList.add('active');
        });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lightboxClose) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        setTimeout(() => {
            lightboxImg.setAttribute('src', '');
        }, 300);
    }

    // --- 8. SIMULACIÓN DE DESCARGA DE APK ---
    const apkButtons = [
        {
            btn: document.getElementById('apk-download-btn'),
            bar: document.getElementById('apk-progress-bar'),
            txt: document.getElementById('apk-btn-text')
        },
        {
            btn: document.getElementById('apk-download-btn-bottom'),
            bar: document.getElementById('apk-progress-bar-bottom'),
            txt: document.getElementById('apk-btn-text-bottom')
        }
    ];

    apkButtons.forEach(group => {
        if (!group.btn) return;
        
        let state = 'idle'; 

        group.btn.addEventListener('click', () => {
            if (state !== 'idle') {
                if (state === 'done') {
                    alert('La descarga ha finalizado. Revisa tu carpeta de descargas.');
                }
                return;
            }

            state = 'loading';
            group.btn.style.pointerEvents = 'none';
            
            // Registrar acción en la bitácora
            if (typeof addAuditLogEntry === 'function') {
                addAuditLogEntry(`Solicitud de descarga de APK enviada al servidor`, 'USER');
            }

            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.floor(Math.random() * 12) + 6;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(progressInterval);
                    
                    group.bar.style.width = '100%';
                    group.txt.innerHTML = 'Preparando APK...';
                    
                    setTimeout(() => {
                        state = 'done';
                        group.btn.style.pointerEvents = 'auto';
                        group.bar.style.width = '0%';
                        group.txt.innerHTML = `
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            ¡Descarga Completa!
                        `;
                        
                        // Registrar acción en la bitácora
                        if (typeof addAuditLogEntry === 'function') {
                            addAuditLogEntry(`Compilación de APK generada y descargada: latinoamerica_comparte_admin.apk`, 'AUDIT');
                        }

                        const dummyLink = document.createElement('a');
                        dummyLink.href = 'https://drive.google.com/file/d/16ZzaVx_J4z4xzlxIAvwBjwxoH0KGB-Ve/view?usp=sharing';
                        dummyLink.target = '_blank';
                        document.body.appendChild(dummyLink);
                        dummyLink.click();
                        document.body.removeChild(dummyLink);
                    }, 1000);
                } else {
                    group.bar.style.width = `${progress}%`;
                    group.txt.innerHTML = `Descargando... ${progress}%`;
                }
            }, 120);
        });
    });


    // --- 9. MOTOR INTERACTIVO DEL CHATBOT DE ASISTENCIA ---
    
    // Respuestas automáticas según palabras clave
    const chatbotDatabase = {
        hola: "¡Hola! Soy tu asistente de Latinoamérica Comparte. ¿Deseas saber más de la app? Puedes consultarme sobre 'roles', 'colombia' (o portales), 'seguridad' o 'descarga'.",
        ayuda: "Claro, puedo guiarte en el uso del panel. ¿Quieres conocer las características técnicas, cómo descargar la APK o qué permisos tiene cada rol (RBAC)? Escribe 'roles' o 'tecnico'.",
        colombia: "El portal Colombia Comparte gestiona el mayor volumen. Permite crear noticias, aprobar testimonios y auditar logs. En tu app móvil real, puedes acceder a él usando los roles Superadmin o Admin País (Colombia).",
        ecuador: "Ecuador Comparte coordina testimonios sobre el cooperativismo y desarrollo agrícola regional. Requiere permisos asignados a tu rol.",
        argentina: "Argentina Comparte promueve foros de educación digital. Cuenta con filtros especiales antispam para los testimonios.",
        chile: "Chile Comparte es el portal más automatizado. Desde aquí puedes probar comandos y flujos directos del CMS.",
        descarga: "Puedes descargar la APK móvil de forma directa en esta web haciendo clic en 'Descargar APK Directo' en la cabecera o en el botón principal.",
        seguridad: "La aplicación móvil utiliza autenticación cifrada HTTPS (TLS 1.3). Las operaciones de los editores y administradores se auditan de forma segura e inalterable en la base de datos.",
        roles: "Los roles son: 👑 Superadmin (control total), 🌎 Admin País (control regional de un portal específico), ✍️ Editor (creación de noticias y subida de archivos) y 👁️ Invitado (solo lectura).",
        rbac: "El sistema RBAC filtra la visualización de botones a nivel móvil y bloquea operaciones en servidor. Si eres editor, no verás la bitácora ni las solicitudes pendientes.",
        video: "Puedes ver una demostración en video de la aplicación en la sección 'Video Tour' de esta página, donde mostramos el flujo de trabajo principal.",
        tecnico: "Detalles Técnicos: Construida nativamente con Flutter & Dart. Utiliza image_picker para cámara/galería y Material Design 3. Conexiones cifradas seguras.",
        gracias: "¡Con gusto! Estoy aquí para hacer más simple la gestión de Latinoamérica Comparte. 😊"
    };

    // Función para procesar respuestas del Chatbot
    function getChatbotReply(userInput) {
        const cleanedInput = userInput.toLowerCase().trim();
        
        // Buscar coincidencia en la base de datos
        for (let keyword in chatbotDatabase) {
            if (cleanedInput.includes(keyword)) {
                return chatbotDatabase[keyword];
            }
        }
        
        // Respuesta por defecto
        return "Entendido. Procesando comando administrativo en Latinoamérica Comparte... El sistema registra esta interacción en la bitácora local.";
    }

    // Agregar mensaje a un contenedor de chat con avatar
    function appendChatBubble(chatPanel, role, text) {
        const bubbleContainer = document.createElement('div');
        bubbleContainer.className = `chat-bubble-container ${role === 'user' ? 'user' : 'bot'}`;

        if (role === 'bot') {
            const avatar = document.createElement('img');
            avatar.src = 'assets/chatbot/male.png';
            avatar.className = 'chat-avatar-mini';
            avatar.alt = 'Bot';
            avatar.onerror = function() { this.style.display = 'none'; };
            bubbleContainer.appendChild(avatar);
        }

        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${role === 'user' ? 'outgoing' : 'incoming'}`;
        bubble.textContent = text;
        bubbleContainer.appendChild(bubble);

        chatPanel.appendChild(bubbleContainer);
        chatPanel.scrollTop = chatPanel.scrollHeight;
    }

    // Mostrar indicador de "escribiendo..."
    function showTypingIndicator(chatPanel) {
        const indicatorContainer = document.createElement('div');
        indicatorContainer.className = 'chat-bubble-container bot typing-indicator-container';
        
        const avatar = document.createElement('img');
        avatar.src = 'assets/chatbot/male.png';
        avatar.className = 'chat-avatar-mini';
        avatar.alt = 'Bot';
        avatar.onerror = function() { this.style.display = 'none'; };
        
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble incoming';
        bubble.innerHTML = '<span style="opacity:0.6;">Escribiendo...</span>';
        
        indicatorContainer.appendChild(avatar);
        indicatorContainer.appendChild(bubble);
        chatPanel.appendChild(indicatorContainer);
        chatPanel.scrollTop = chatPanel.scrollHeight;
        
        return indicatorContainer;
    }

    // Manejar envío de mensaje interactivo
    function handleSendMessage(inputElement, chatPanelElement) {
        const messageText = inputElement.value.trim();
        if (messageText === '') return;

        // 1. Mensaje del usuario
        appendChatBubble(chatPanelElement, 'user', messageText);
        inputElement.value = '';

        // Registrar consulta en bitácora
        if (typeof addAuditLogEntry === 'function') {
            addAuditLogEntry(`Editor consultó al chatbot: "${messageText.substring(0, 30)}${messageText.length > 30 ? '...' : ''}"`, 'USER');
        }

        // 2. Efecto de carga del bot
        const typingIndicator = showTypingIndicator(chatPanelElement);

        // 3. Respuesta simulada del bot
        setTimeout(() => {
            // Eliminar indicador
            typingIndicator.remove();
            
            const replyText = getChatbotReply(messageText);
            appendChatBubble(chatPanelElement, 'bot', replyText);

            // Registrar respuesta en bitácora
            if (typeof addAuditLogEntry === 'function') {
                addAuditLogEntry(`Chatbot IA resolvió consulta y generó logs locales`, 'AUDIT');
            }
        }, 1200);
    }

    // A. Chat principal de sección
    const mainChatInput = document.getElementById('live-chat-input');
    const mainChatSendBtn = document.getElementById('live-chat-send-btn');
    const mainChatPanel = document.getElementById('live-chat-panel');

    if (mainChatSendBtn && mainChatInput && mainChatPanel) {
        mainChatSendBtn.addEventListener('click', () => {
            handleSendMessage(mainChatInput, mainChatPanel);
        });

        mainChatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleSendMessage(mainChatInput, mainChatPanel);
            }
        });
    }

    // B. Chat flotante (Popup)
    const floatChatTrigger = document.getElementById('float-chat-trigger');
    const floatChatWindow = document.getElementById('float-chat-window');
    const floatChatClose = document.getElementById('float-chat-close');
    const floatChatBody = document.getElementById('float-chat-body');
    const floatChatInput = document.getElementById('float-chat-input');
    const floatChatSend = document.getElementById('float-chat-send');

    if (floatChatTrigger && floatChatWindow) {
        // Abrir/Cerrar popup
        floatChatTrigger.addEventListener('click', () => {
            floatChatWindow.classList.toggle('active');
            // Ocultar pulso al abrir
            const pulse = floatChatTrigger.querySelector('.chat-badge-pulse');
            if (pulse) pulse.style.display = 'none';
        });

        floatChatClose.addEventListener('click', () => {
            floatChatWindow.classList.remove('active');
        });

        // Enviar mensajes en chat flotante
        if (floatChatSend && floatChatInput && floatChatBody) {
            floatChatSend.addEventListener('click', () => {
                handleSendMessage(floatChatInput, floatChatBody);
            });

            floatChatInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    handleSendMessage(floatChatInput, floatChatBody);
                }
            });
        }
    }

    const rbacCards = document.querySelectorAll('.rbac-card');
    rbacCards.forEach(card => {
        card.addEventListener('click', () => {
            // Limpiar activos
            rbacCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            const role = card.querySelector('.rbac-role-name').textContent;
            
            // Registrar acción en la bitácora
            if (typeof addAuditLogEntry === 'function') {
                addAuditLogEntry(`Cambio de rol administrativo simulado a: ${role.toUpperCase()}`, 'USER');
            }

            // Retroalimentación al usuario
            const toast = document.createElement('div');
            toast.style.position = 'fixed';
            toast.style.bottom = '2rem';
            toast.style.left = '50%';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            toast.style.background = 'rgba(13, 17, 33, 0.95)';
            toast.style.border = '1px solid var(--border-hover)';
            toast.style.color = 'var(--primary)';
            toast.style.padding = '0.75rem 1.5rem';
            toast.style.borderRadius = '30px';
            toast.style.zIndex = '3000';
            toast.style.fontSize = '0.9rem';
            toast.style.fontWeight = '600';
            toast.style.boxShadow = '0 10px 25px rgba(0, 242, 254, 0.3)';
            toast.style.transition = 'all 0.3s ease';
            toast.style.opacity = '0';
            toast.textContent = `Visualización configurada para: ${role}`;
            
            document.body.appendChild(toast);
            
            setTimeout(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateX(-50%) translateY(0)';
            }, 50);
 
            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(-50%) translateY(20px)';
                setTimeout(() => toast.remove(), 300);
            }, 2500);
        });
    });

    // --- 11. MANEJO DE MENÚ DE NAVEGACIÓN MÓVIL (HAMBURGUESA DRAWER) ---
    const navToggleBtn = document.getElementById('nav-toggle-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu-item a');

    if (navToggleBtn && navMenu) {
        navToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navToggleBtn.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            if (typeof addAuditLogEntry === 'function') {
                const isOpen = navMenu.classList.contains('active');
                addAuditLogEntry(`Menú lateral móvil ${isOpen ? 'ABIERTO' : 'CERRADO'}`, 'USER');
            }
        });

        // Cerrar al hacer click en un enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggleBtn.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Cerrar al hacer click fuera
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !navToggleBtn.contains(e.target)) {
                navToggleBtn.classList.remove('active');
                navMenu.classList.remove('active');
                
                if (typeof addAuditLogEntry === 'function') {
                    addAuditLogEntry(`Menú lateral móvil CERRADO (clic fuera)`, 'USER');
                }
            }
        });
    }

    // --- 12. UTILERÍA DE AUDITORÍA EN TIEMPO REAL (TERMINAL SIMULADO) ---
    const auditLogTerminal = document.getElementById('audit-log-terminal');

    function addAuditLogEntry(action, type = 'USER') {
        if (!auditLogTerminal) return;
        
        const now = new Date();
        const timeString = now.toTimeString().split(' ')[0];
        const entry = document.createElement('div');
        entry.className = 'audit-log-entry';
        
        let prefix = `[${type}]`;
        if (type === 'SYS') {
            entry.style.color = 'var(--text-muted)';
        } else if (type === 'AUDIT') {
            entry.style.color = 'var(--emerald)';
        } else {
            entry.style.color = 'var(--primary)';
        }
        
        entry.textContent = `${prefix} ${timeString} - ${action}`;
        auditLogTerminal.appendChild(entry);
        
        // Limitar número de entradas en el DOM para rendimiento (ej: máximo 20)
        while (auditLogTerminal.children.length > 20) {
            auditLogTerminal.removeChild(auditLogTerminal.firstChild);
        }
        
        // Auto scroll
        auditLogTerminal.scrollTop = auditLogTerminal.scrollHeight;
    }

    // --- 13. SELECCIÓN DE PANTALLA HERO INTERACTIVO (CON AUTO-ROTACIÓN) ---
    const switcherBtns = document.querySelectorAll('.switcher-btn');
    const heroPhoneImg = document.getElementById('hero-phone-img');
    let autoCycleInterval;
    let userTimeout;
    const cycleDelay = 4000; // 4 segundos entre cambios de pantalla

    function changeScreen(btn, isAuto = false) {
        if (!btn) return;
        const screen = btn.getAttribute('data-screen');
        
        // Cambiar clase activa
        switcherBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (heroPhoneImg) {
            // Efecto de parpadeo suave al cambiar
            heroPhoneImg.style.transition = 'opacity 0.15s ease';
            heroPhoneImg.style.opacity = '0';
            
            setTimeout(() => {
                heroPhoneImg.src = `assets/capturas/${screen}.jpg`;
                
                // Manejar fallback de imagen por si no existe
                heroPhoneImg.onerror = function() {
                    this.src = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='280' height='570'><rect width='100%' height='100%' fill='%23070913'/><text x='50%' y='50%' font-family='Outfit' font-weight='bold' font-size='22' fill='%2300f2fe' text-anchor='middle'>${screen.toUpperCase()}</text></svg>`;
                };
                
                heroPhoneImg.style.opacity = '1';
            }, 150);
        }

        // Registrar acción en la bitácora
        if (typeof addAuditLogEntry === 'function') {
            const logType = isAuto ? 'SYS' : 'AUDIT';
            const logMsg = isAuto 
                ? `Rotación automática del simulador cambió vista a: ${screen.toUpperCase()}` 
                : `Vista del simulador de iPhone Hero cambiada a: ${screen.toUpperCase()}`;
            addAuditLogEntry(logMsg, logType);
        }
    }

    // Iniciar rotación automática
    function startAutoCycle() {
        autoCycleInterval = setInterval(() => {
            let activeIndex = 0;
            // Encontrar el índice activo actual
            switcherBtns.forEach((btn, index) => {
                if (btn.classList.contains('active')) {
                    activeIndex = index;
                }
            });

            // Siguiente botón
            const nextIndex = (activeIndex + 1) % switcherBtns.length;
            const nextBtn = switcherBtns[nextIndex];
            
            changeScreen(nextBtn, true);
        }, cycleDelay);
    }

    // Detener la rotación automática
    function stopAutoCycle() {
        if (autoCycleInterval) {
            clearInterval(autoCycleInterval);
        }
    }

    switcherBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Detener el auto-ciclo por interacción manual
            stopAutoCycle();
            clearTimeout(userTimeout);
            
            // Cambiar pantalla
            changeScreen(btn, false);
            
            // Reiniciar la rotación automática después de 10 segundos de inactividad
            userTimeout = setTimeout(() => {
                stopAutoCycle();
                startAutoCycle();
            }, 10000);
        });
    });

    // Iniciar por primera vez
    startAutoCycle();

});
