/**
 * Steampunk RSVP Application Logic
 * Mobile-First Interactive Handling for Ale's Invitation
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // DOM Elements
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  const audioIcon = document.getElementById('audio-icon');

  // Question 1: Uni / Servicio
  const btnUniSi = document.getElementById('btn-uni-si');
  const btnUniNo = document.getElementById('btn-uni-no');
  const telegramResponse = document.getElementById('telegram-response');
  const telegramResponseText = document.getElementById('telegram-response-text');
  const sectionInvitation = document.getElementById('section-invitation');

  // Question 2: RSVP Options
  const btnRsvpChance = document.getElementById('btn-rsvp-chance');
  const btnRsvpOtroDia = document.getElementById('btn-rsvp-otrodia');
  const btnRsvpNel = document.getElementById('btn-rsvp-nel');
  const gaugeNeedle = document.getElementById('gauge-needle');

  // Modal Dialog
  const modalOverlay = document.getElementById('modal-overlay');
  const modalHeaderIcon = document.getElementById('modal-header-icon');
  const modalTitle = document.getElementById('modal-title');
  const modalBodyText = document.getElementById('modal-body-text');
  const modalActions = document.getElementById('modal-actions');
  const btnCloseModal = document.getElementById('btn-close-modal');

  // Audio y Música de Fondo (musicadefondo.wav)
  const bgMusic = document.getElementById('bg-music');
  let isMuted = false;

  if (bgMusic) {
    bgMusic.volume = 0.55; // Volumen balanceado
  }

  function tryPlayMusic() {
    if (bgMusic && bgMusic.paused && !isMuted) {
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          if (audioIcon) audioIcon.textContent = '🎶';
          if (audioToggleBtn) audioToggleBtn.setAttribute('title', 'Música activada (Clic para silenciar)');
        }).catch(() => {
          // Si el navegador bloquea autoplay hasta interacción de usuario
        });
      }
    }
  }

  // 1. Intentar reproducir de inmediato al cargar la página
  tryPlayMusic();

  // 2. Desbloquear reproducción al primer toque/interacción en cualquier parte de la pantalla
  const unlockAudio = () => {
    tryPlayMusic();
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('pointerdown', unlockAudio);
  };
  document.addEventListener('click', unlockAudio, { passive: true });
  document.addEventListener('touchstart', unlockAudio, { passive: true });
  document.addEventListener('pointerdown', unlockAudio, { passive: true });

  // Control de silencio en el botón superior
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      if (window.soundFx) {
        window.soundFx.muted = isMuted;
      }
      if (bgMusic) {
        if (isMuted) {
          bgMusic.pause();
          if (audioIcon) audioIcon.textContent = '🔇';
          audioToggleBtn.setAttribute('title', 'Música silenciada');
        } else {
          bgMusic.play();
          if (audioIcon) audioIcon.textContent = '🎶';
          audioToggleBtn.setAttribute('title', 'Música activada');
          if (window.soundFx) window.soundFx.playClick();
        }
      }
    });
  }

  // Steam particle burst effect at coordinate
  function triggerSteamPuff(element) {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 14; i++) {
      const particle = document.createElement('div');
      particle.className = 'steam-particle';
      const size = Math.random() * 22 + 14;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${centerX}px`;
      particle.style.top = `${centerY}px`;

      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 80 + 30;
      const tx = Math.cos(angle) * distance;
      const ty = Math.sin(angle) * distance - 40;

      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);

      document.body.appendChild(particle);
      setTimeout(() => particle.remove(), 1600);
    }
  }

  // Respuestas del usuario
  let respuesta1 = null; // 'Sí' o 'No'
  let respuesta2 = null; // 'Chance', 'Hoy no puedo pero otro dia' o 'Nel'

  const btnEnviar = document.getElementById('btn-enviar');
  const submitHint = document.getElementById('submit-hint');
  const enviarStatus = document.getElementById('enviar-status');

  function checkReadyToSubmit() {
    if (!btnEnviar) return;
    if (respuesta1 && respuesta2) {
      btnEnviar.disabled = false;
      if (submitHint) {
        submitHint.classList.add('ready');
        submitHint.textContent = '¡Todo listo! Haz clic en "ENVIAR" para registrar tus respuestas';
      }
    } else {
      btnEnviar.disabled = true;
      if (submitHint) {
        submitHint.classList.remove('ready');
        submitHint.textContent = 'Selecciona ambas respuestas para habilitar el botón';
      }
    }
  }

  // Question 1 Answers (Sin desplazamiento automático; navegación libre)
  if (btnUniSi && btnUniNo) {
    btnUniSi.addEventListener('click', (e) => {
      respuesta1 = 'Sí';
      checkReadyToSubmit();

      if (window.soundFx) {
        window.soundFx.playClick();
        window.soundFx.playSteam();
      }
      if (window.boost3DGears) window.boost3DGears();
      triggerSteamPuff(btnUniSi);

      btnUniSi.classList.add('selected', 'active');
      btnUniNo.classList.remove('selected', 'active');

      telegramResponseText.innerHTML = `
        <strong style="color: #ffd966;">¡Uffff que agusto la neta! 🎉🥳</strong><br>
        Ya te hacia falta un descansito de la uni
      `;
      telegramResponse.classList.add('visible');

      if (gaugeNeedle) gaugeNeedle.style.transform = 'rotate(65deg)';
    });

    btnUniNo.addEventListener('click', (e) => {
      respuesta1 = 'No';
      checkReadyToSubmit();

      if (window.soundFx) {
        window.soundFx.playClick();
        window.soundFx.playSteam();
      }
      if (window.boost3DGears) window.boost3DGears();
      triggerSteamPuff(btnUniNo);

      btnUniNo.classList.add('selected', 'active');
      btnUniSi.classList.remove('selected', 'active');

      telegramResponseText.innerHTML = `
        <strong style="color: #ffd966;">Alv creo que la uvp nunca da descanso 😞...</strong><br>
        Eso esta muy sad como dicen los chavos
      `;
      telegramResponse.classList.add('visible');

      if (gaugeNeedle) gaugeNeedle.style.transform = 'rotate(-25deg)';
    });
  }

  // Question 2 RSVP Handlers (Selection Only - No Modal Dialogs)
  const rsvpOptions = [
    { btn: btnRsvpChance, label: 'Chance', angle: 75, sound: 'chime' },
    { btn: btnRsvpOtroDia, label: 'Hoy no puedo pero otro dia', angle: 20, sound: 'click' },
    { btn: btnRsvpNel, label: 'Nel', angle: -65, sound: 'boiler' }
  ];

  function selectOption(selectedItem) {
    respuesta2 = selectedItem.label;
    checkReadyToSubmit();

    rsvpOptions.forEach(({ btn }) => {
      if (btn) {
        btn.classList.remove('selected', 'active');
        const check = btn.querySelector('.btn-rsvp-check');
        if (check) check.textContent = '❯';
      }
    });

    if (selectedItem && selectedItem.btn) {
      selectedItem.btn.classList.add('selected', 'active');
      const check = selectedItem.btn.querySelector('.btn-rsvp-check');
      if (check) check.textContent = '✔';

      if (gaugeNeedle) {
        gaugeNeedle.style.transform = `rotate(${selectedItem.angle}deg)`;
      }

      if (window.soundFx) {
        if (selectedItem.sound === 'chime') window.soundFx.playChime();
        else if (selectedItem.sound === 'boiler') window.soundFx.playBoilerJolt();
        else window.soundFx.playClick();
        window.soundFx.playSteam();
      }

      if (window.boost3DGears) window.boost3DGears();
      triggerSteamPuff(selectedItem.btn);
    }
  }

  rsvpOptions.forEach(item => {
    if (item.btn) {
      item.btn.addEventListener('click', () => {
        selectOption(item);
      });
    }
  });

  // =========================================================================
  // Manejador del botón "ENVIAR": Guarda las respuestas en archivo .txt
  // =========================================================================
  if (btnEnviar) {
    btnEnviar.addEventListener('click', async () => {
      if (!respuesta1 || !respuesta2) {
        alert('Por favor selecciona ambas respuestas antes de enviar.');
        return;
      }

      if (window.soundFx) {
        window.soundFx.playChime();
        window.soundFx.playSteam();
      }
      if (window.boost3DGears) window.boost3DGears();
      triggerSteamPuff(btnEnviar);

      const fechaHora = new Date().toLocaleString();
      const txtContent = 
`=====================================================
         REGISTRO DE RESPUESTAS • ALE
=====================================================
Fecha y Hora: ${fechaHora}

Pregunta 1 (Cancelación de uni / deberes):
-> Respuesta: ${respuesta1}

Pregunta 2 (Acompañar en la tarde / café / despensa):
-> Respuesta: ${respuesta2}

=====================================================
Estado: Guardado con éxito
=====================================================
`;

      // 1. Guardar en el servidor (archivo respuestas_ale.txt en el proyecto)
      try {
        await fetch('/api/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pregunta1: respuesta1,
            pregunta2: respuesta2
          })
        });
      } catch (err) {
        console.error('Error al guardar en el servidor:', err);
      }

      // 2. Confirmación visual y apertura del modal 3D (Sin descarga en el cliente)
      btnEnviar.innerHTML = '<span>✅</span> RESPUESTAS GUARDADAS <span>⚙️</span>';
      if (submitHint) submitHint.style.display = 'none';
      if (enviarStatus) enviarStatus.style.display = 'block';

      // 3. Mostrar el modal del modelo 3D con el mensaje
      const portholeModal = document.getElementById('porthole-modal');
      if (portholeModal) {
        setTimeout(() => {
          portholeModal.classList.add('active');
        }, 300);
      }
    });
  }

  // Cerrar Modal del Modelo 3D
  const portholeModal = document.getElementById('porthole-modal');
  const btnClosePorthole = document.getElementById('btn-close-porthole');

  if (portholeModal) {
    btnClosePorthole?.addEventListener('click', () => {
      portholeModal.classList.remove('active');
      if (window.soundFx) window.soundFx.playClick();
      // Permite volver a responder si lo desea
      if (btnEnviar) {
        btnEnviar.disabled = false;
        btnEnviar.innerHTML = '<span class="btn-rsvp-icon">📜</span> <span class="btn-rsvp-label">ENVIAR</span> <span class="btn-rsvp-icon">⚙️</span>';
      }
    });

    portholeModal.addEventListener('click', (e) => {
      if (e.target === portholeModal) {
        portholeModal.classList.remove('active');
        if (window.soundFx) window.soundFx.playClick();
        if (btnEnviar) {
          btnEnviar.disabled = false;
          btnEnviar.innerHTML = '<span class="btn-rsvp-icon">📜</span> <span class="btn-rsvp-label">ENVIAR</span> <span class="btn-rsvp-icon">⚙️</span>';
        }
      }
    });
  }

  // Close Telegram Modal (si se usa)
  if (btnCloseModal) {
    btnCloseModal.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      if (window.soundFx) window.soundFx.playClick();
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        if (window.soundFx) window.soundFx.playClick();
      }
    });
  }
});

