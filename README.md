# 📱 Latinoamérica Comparte - Landing Page Premium v1.0.0

Esta es una página de aterrizaje (landing page) premium, moderna y totalmente responsiva diseñada para simular la ficha de la Google Play Store y el ecosistema del **Panel de Administración Móvil (CMS)** del proyecto **Latinoamérica Comparte**.

Diseño, interactividad y UX/UI creados con los más altos estándares visuales (estilo SaaS / Apple 2026).

---

## 🚀 Características Clave

* 🌌 **Fondo de Partículas Interactivas (HTML5 Canvas 2D):** Sistema de física ligera y orbital que reacciona con repulsión y brillo al movimiento del cursor del ratón.
* 📲 **Simulador de iPhone Hero (Auto-rotativo & Interactivo):**
  - Muestra capturas reales de la aplicación móvil en un mockup de alta fidelidad.
  - Cuenta con un panel de botones de control para cambiar de pantalla bajo demanda (Splash, Login, Dashboard, etc.).
  - **Auto-slideshow:** Cicla de forma automática entre las capturas cada 4 segundos, pausándose al interactuar manualmente y reanudándose tras 10 segundos de inactividad.
* 🌎 **Ecosistema Regional (Tabs Autónomas):** Navegación por pestañas interactivas de los nodos de Colombia 🇨🇴, Ecuador 🇪🇨, Argentina 🇦🇷 y Chile 🇨🇱 con estadísticas independientes de artículos y solicitudes.
* 👑 **Simulador de Permisos RBAC:** Tarjetas de roles que configuran la visualización y disparan notificaciones dinámicas (*toast notifications*) en pantalla sobre el rol administrativo emulado.
* 🤖 **Asistente Virtual (Chatbots Interactivos):**
  - Widget principal en la sección de chatbot y asistente flotante en la esquina inferior derecha.
  - Conexión simulada con motor de respuestas en lenguaje natural basado en palabras clave (ej: consultando sobre *"roles"*, *"seguridad"*, *"descarga"*, *"colombia"*).
* 🛡️ **Bitácora de Auditoría en Vivo (Terminal Logger):** Widget terminal simulado en la parte inferior que registra y despliega cronológicamente cada acción del usuario (cambio de tema, clics, descargas, chats y roles).
* 📥 **Simulador de Descarga Seguro:** Los botones de APK muestran una barra de progreso interactiva (0% a 100%) y abren de forma segura la descarga del APK real de Google Drive en una nueva pestaña al completarse.
* 🌓 **Modo Oscuro / Claro Premium:** Conmutador inteligente de tema visual con persistencia en el navegador (`localStorage`) y cambio dinámico de iconos y colores de partículas.

---

## 🛠️ Arquitectura de Archivos

El proyecto está diseñado bajo una arquitectura limpia y eficiente de archivos estáticos (Frontend Vanilla):

* [index.html](file:///C:/Users/juane/WebstormProjects/appWebColCom/index.html) - Estructura semántica HTML5, metadatos optimizados para SEO y enlaces a los assets locales.
* [styles.css](file:///C:/Users/juane/WebstormProjects/appWebColCom/styles.css) - Reglas de diseño (CSS Vanilla) estructuradas con variables CSS, efectos de cristal (`glassmorphism`), animaciones, y un robusto sistema de queries responsivas móviles.
* [script.js](file:///C:/Users/juane/WebstormProjects/appWebColCom/script.js) - Motor lógico interactivo para el canvas, controladores de eventos, temporizadores, animaciones *Scroll Reveal* y motor del chatbot.

---

## 📱 Diseño Responsivo Móvil

La web ha sido optimizada para ofrecer una visualización espectacular en dispositivos móviles y tablets:
* **Menú lateral Drawer:** Un botón de hamburguesa animado que se transforma en una "X" y despliega un menú lateral de desenfoque de cristal.
* **Escala de Maquetas:** Los iPhones y mockups se autoajustan a un ancho máximo de `210px`/`190px` en móvil para evitar que obstaculicen el scroll o corten la pantalla.
* **Anchos Flexibles:** El chat flotante utiliza `width: calc(100vw - 2.5rem)` para adaptarse a pantallas desde 320px de ancho sin generar scrollbars horizontales.

---

## ⚙️ Instrucciones de Uso y Lanzamiento

Al ser un desarrollo frontend estático puro, no requiere compiladores, servidores NodeJS ni bases de datos activas:

1. **Abrir el Proyecto:** 
   Haz doble clic sobre el archivo [index.html](file:///C:/Users/juane/WebstormProjects/appWebColCom/index.html) desde tu explorador de archivos para cargarlo en tu navegador predeterminado (Chrome, Safari, Edge, Firefox, etc.).
2. **Uso en Servidor Local (Opcional):**
   Si deseas utilizar extensiones como *Live Server* en WebStorm o VSCode, puedes iniciarlo normalmente para ver los cambios en caliente.
3. **Descarga del APK Real:**
   Presiona en **"Descargar APK Directo"** para ver la barra de carga premium y obtener la APK oficial guardada en el Google Drive de Latinoamérica Comparte:
   - [Enlace de Descarga Directa](https://drive.google.com/file/d/16ZzaVx_J4z4xzlxIAvwBjwxoH0KGB-Ve/view?usp=sharing)
