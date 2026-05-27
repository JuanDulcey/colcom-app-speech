# Plan de Implementación (Adiciones): Partículas de Fondo, Chatbot Real e Interactividad Avanzada

Agregar un sistema de partículas interactivo en 2D (HTML5 Canvas) que flote en el fondo de la landing page, incorporar los assets de imagen del chatbot proporcionados (`avatar.png`, `male.png` y `male_home.gif`) en los chats y flotantes, e implementar mejoras de interactividad y UX Pro Max 2026.

---

## User Review Required

> [!IMPORTANT]
> **Efecto de Partículas Interactivas:**
> Implementaremos un lienzo `<canvas>` de fondo completo con aceleración por hardware que dibuje pequeñas partículas de luz flotando lentamente. Estas partículas reaccionarán sutilmente al movimiento del ratón (se repelerán o brillarán más al acercarse), creando un efecto envolvente y de alta gama similar al sitio de Apple.

> [!TIP]
> **Integración Completa del Chatbot:**
> - `male_home.gif` se usará como el avatar animado principal en la sección de características del chatbot.
> - `male.png` se usará como la miniatura de remitente para todos los mensajes entrantes (burbujas del bot).
> - `avatar.png` se usará para crear un **botón flotante interactivo** en la esquina inferior derecha que abrirá un popup de chat de soporte rápido al pasar el cursor o hacer clic.

---

## Open Questions

Ninguna. Hemos localizado con éxito los archivos `avatar.png`, `male.png` y `male_home.gif` dentro de la carpeta `assets/chatbot/` y están listos para ser enlazados.

---

## Proposed Changes

### [Web App Component]

Se modificarán los archivos existentes en la raíz del proyecto:
- [MODIFY] [index.html](file:///C:/Users/juane/WebstormProjects/appWebColCom/index.html):
  - Añadir el elemento `<canvas id="bg-particles">` justo al iniciar el `body`.
  - Integrar las rutas de `assets/chatbot/male_home.gif`, `assets/chatbot/male.png` en el cuerpo del chatbot y mensajes.
  - Agregar un widget de chat flotante interactivo en la esquina inferior derecha con la foto `avatar.png`.
- [MODIFY] [styles.css](file:///C:/Users/juane/WebstormProjects/appWebColCom/styles.css):
  - Estilos fijos para el canvas de partículas y contenedor flotante de soporte.
  - Efectos hover con gradientes y giros para los avatars.
  - Ajustes en el visor de chat para incluir miniaturas de perfil.
- [MODIFY] [script.js](file:///C:/Users/juane/WebstormProjects/appWebColCom/script.js):
  - **Sistema de Partículas Canvas:** Dibuja y física de partículas con redimensionamiento dinámico y respuesta a coordenadas del mouse.
  - **Chatbot Interactivo Real:** Convertir el input de texto del simulador de chat en un campo funcional donde el usuario pueda escribir. Desarrollar un sistema de respuestas clave en JS (ej. al escribir "colombia", "seguridad", "roles", responder con diálogos útiles de la app).
  - **Animación Scroll Reveal:** Añadir animaciones de aparición al hacer scroll en las secciones del sitio.

---

## Plan de Verificación

### Pruebas Manuales
- Comprobar que el canvas de partículas no bloquee los clics en los botones reales (`pointer-events: none`).
- Verificar que el chat flotante se abra y cierre correctamente y sea responsivo en móvil.
- Probar a escribir palabras clave como "ayuda", "colombia", "roles" en la simulación de chat.
