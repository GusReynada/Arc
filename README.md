# ⚙️ Invitación Web Steampunk & RSVP para Ale ✨

Sitio web interactivo de invitación y confirmación de asistencia (RSVP) diseñado especialmente para **Ale**, con un diseño **Mobile-First** (optimizado para teléfonos celulares), animaciones 3D en tiempo real (Three.js), estética **Steampunk** en tonos **azul medianoche profundo** y **dorado cobrizo**.

---

## 🎩 Características Principales

1. **Diseño Mobile-First**:
   - Diseñado y maquetado con prioridad absoluta para pantallas de smartphones (iOS y Android).
   - Botones táctiles de gran tamaño con respuesta háptica visual (profundidad 3D mecánica).
   - Tipografía fluida con escala áurea y contrastes optimizados.

2. **Estética Steampunk (Azul & Oro)**:
   - Fondo azul medianoche / navy profundo con viñeta y blueprint sutil.
   - Marcos victorianos dorados con remaches metálicos (`rivets`), bordes biselados y esquineros de filigrana.
   - Manómetro de vapor funcional con aguja oscilante según las respuestas seleccionadas.

3. **Animaciones 3D (Three.js)**:
   - Lienzo 3D en segundo plano con engranes dorados dentados y biselados que giran de forma sincronizada con materiales metálicos PBR (`MeshStandardMaterial`).
   - Sistema de partículas 3D con vapor y chispas doradas flotantes.
   - Efecto parallax 3D interactivo que reacciona al tacto, movimiento o giroscopio del móvil.
   - Optimizado para 60fps en móviles con limitador de DPR (1.5) y pausa automática cuando la pestaña está en segundo plano.

4. **Efectos de Sonido Retro-Futuristas (Web Audio API)**:
   - Clics mecánicos de relojería, siseos de válvulas de escape de vapor, campanas doradas armónicas y alertas de caldera sintetizados en tiempo real (sin necesidad de archivos externos).
   - Botón de silenciar/activar sonido en el encabezado.

5. **Flujo de Contenido**:
   - **Hero Superior**: GIF `img/saludo.gif` en marco dorado de alta precisión.
   - **Pregunta 1**: *"Que onda Ale te queria preguntar si hoy te habian cancelado la uni y el servicio jaja"*
   - **Botones**: `Sí` y `No` (con respuesta dinámica de telegrama al pulsar).
   - **Divisor Mecánico**: Tubería de latón y engrane central giratorio.
   - **Pregunta 2**: *"No quisieras acompañarme en la tarde a caminar o hacer despensa o alguna otra cosa?"*
   - **Segundo GIF**: `img/imagen2.gif` en marco victoriano.
   - **3 Opciones RSVP**:
     - `Chance`: Telegrama con confirmación y enlace directo a WhatsApp.
     - `Hoy no puedo pero otro dia`: Telegrama empático para agendar otra fecha.
     - `Nel`: Reacción juguetona con alerta de presión de caldera y vibración mecánica.
   - **Bonus**: Botón de inspección de artefacto 3D (`img/3dmodel.gif`) en una escotilla steampunk circular.

---

## 🚀 Cómo Visualizar la Invitación

### Opción 1: Servidor Local (Ya Activo)
El servidor HTTP local está ejecutándose en:
```
http://localhost:8080
```
Puedes abrir esa URL en cualquier navegador de tu computadora o abrirlo en modo emulación móvil (F12 -> icono de teléfono) en Chrome o Edge.

### Opción 2: Abrir en tu Celular (En la misma red Wi-Fi)
Para abrirlo directamente en el celular de Ale o en tu teléfono:
1. Abre una terminal y averigua tu IP local con `ipconfig` (ejemplo: `192.168.1.XX`).
2. En el navegador del celular entra a:
   ```
   http://TU_IP_LOCAL:8080
   ```

### Opción 3: Abrir Directamente el Archivo
También puedes hacer doble clic directamente en `index.html` en el explorador de archivos de Windows para abrirlo en tu navegador.

