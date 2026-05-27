/* ==========================================================================
   LATINOMÉRICA COMPARTE - LOGICA DE INTERACCIÓN DE PRODUCTO PREMIUM
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. EFECTO DE NAVBAR AL HACER SCROLL ---
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 2. CONTROL DE CAMBIO DE TEMA (OSCURO/CLARO) ---
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
    });

    function updateSvgIcon(isLight) {
        if (isLight) {
            // Icono de Luna
            themeSvg.innerHTML = `
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
            `;
        } else {
            // Icono de Sol
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

    // --- 3. TABS DEL ECOSISTEMA REGIONAL ---
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
        });
    });

    // --- 4. CAROUSEL DE CAPTURAS DE PANTALLA ---
    const galScroll = document.getElementById('gal-scroll');
    const galPrev = document.getElementById('gal-prev');
    const galNext = document.getElementById('gal-next');
    const scrollStep = 320; // Ancho aproximado del item + gap

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
        const walk = (x - startX) * 1.5; // Multiplicador de velocidad de arrastre
        galScroll.scrollLeft = scrollLeft - walk;
    });

    // --- 5. VISUALIZADOR DE CAPTURAS AMPLILADAS (LIGHTBOX) ---
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

    // Cerrar lightbox
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === lightboxClose) {
            closeLightbox();
        }
    });

    // Cerrar con Escape
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

    // --- 6. SIMULACIÓN DE DESCARGA DE APK ---
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
        
        let state = 'idle'; // idle, loading, done

        group.btn.addEventListener('click', () => {
            if (state !== 'idle') {
                if (state === 'done') {
                    alert('La descarga ha finalizado. Revisa tus archivos descargados.');
                }
                return;
            }

            state = 'loading';
            group.btn.style.pointerEvents = 'none';
            
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += Math.floor(Math.random() * 10) + 4;
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
                        
                        // Lanzar fake file download (crear enlace temporal)
                        const dummyLink = document.createElement('a');
                        dummyLink.href = 'assets/capturas/splash.jpg'; // Reutilizar un asset existente para simular la descarga
                        dummyLink.download = 'latinoamerica_comparte_admin.apk';
                        document.body.appendChild(dummyLink);
                        dummyLink.click();
                        document.body.removeChild(dummyLink);
                    }, 1000);
                } else {
                    group.bar.style.width = `${progress}%`;
                    group.txt.innerHTML = `Descargando... ${progress}%`;
                }
            }, 100);
        });
    });

    // --- 7. SIMULACIÓN DE CHAT EN VIVO (CHATBOT) ---
    const chatPanel = document.getElementById('live-chat-panel');
    const conversation = [
        { role: 'user', text: 'Muéstrame las solicitudes pendientes de Colombia.' },
        { role: 'bot', text: 'Buscando... Tienes 12 solicitudes pendientes en Colombia Comparte. 8 de ellas son testimonios comunitarios de emprendedores.' },
        { role: 'user', text: 'Publicar noticia sobre el taller en Chile.' },
        { role: 'bot', text: 'Excelente. Creando borrador de noticia para Chile Comparte. ¿Deseas seleccionar una imagen desde tu galería?' },
        { role: 'user', text: 'Sí, abrir galería.' },
        { role: 'bot', text: 'Selector multimedia activado. Elige tu imagen desde la galería en tu móvil.' },
        { role: 'user', text: 'Revisar logs de auditoría de Argentina.' },
        { role: 'bot', text: 'Accediendo de forma segura... Mostrando los últimos 3 registros en Argentina Comparte. Estado: Exitoso.' }
    ];

    let messageIndex = 0;

    function addChatBubble(role, text) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${role === 'user' ? 'outgoing' : 'incoming'}`;
        bubble.textContent = text;
        bubble.style.opacity = '0';
        bubble.style.transform = 'translateY(8px)';
        bubble.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        
        chatPanel.appendChild(bubble);
        chatPanel.scrollTop = chatPanel.scrollHeight;

        setTimeout(() => {
            bubble.style.opacity = '1';
            bubble.style.transform = 'translateY(0)';
        }, 50);
    }

    function runChatbotSimulation() {
        if (messageIndex < conversation.length) {
            const nextMessage = conversation[messageIndex];
            const writingDelay = nextMessage.role === 'bot' ? 2200 : 1300;

            setTimeout(() => {
                addChatBubble(nextMessage.role, nextMessage.text);
                messageIndex++;
                runChatbotSimulation();
            }, writingDelay);
        } else {
            // Reiniciar chat tras unos segundos
            setTimeout(() => {
                chatPanel.innerHTML = `
                    <div class="chat-bubble incoming">¡Hola! Soy tu asistente de Latinoamérica Comparte. ¿En qué puedo ayudarte hoy en el panel admin?</div>
                `;
                messageIndex = 0;
                runChatbotSimulation();
            }, 6000);
        }
    }

    // Iniciar simulación a los 2 segundos de carga
    setTimeout(runChatbotSimulation, 2000);
});
