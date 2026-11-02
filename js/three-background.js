/**
 * Steampunk 3D Background Engine
 * Three.js Real-Time 3D Golden Gears & Floating Steam Particles
 * Mobile-First Optimized: 60fps, low draw-calls, DPR capped at 1.5
 */

(function () {
  'use strict';

  // Check WebGL availability
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  if (!isWebGLAvailable()) {
    console.warn('WebGL not supported, running in static steampunk fallback mode.');
    return;
  }

  const container = document.getElementById('three-canvas-container');
  if (!container) return;

  const canvas = document.getElementById('three-canvas');
  if (!canvas) return;

  // Scene, Camera, Renderer
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 0, 18);

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });

  // Mobile optimization: Limit DPR to 1.5 to save battery & maintain 60fps
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  // Reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Lighting: Warm golden rim lights & subtle blue fill
  const ambientLight = new THREE.AmbientLight(0x2a4468, 1.2);
  scene.add(ambientLight);

  // Directional Key Light (Warm Antique Gold)
  const dirLight1 = new THREE.DirectionalLight(0xffdf80, 2.2);
  dirLight1.position.set(12, 18, 15);
  scene.add(dirLight1);

  // Rim Light (Amber/Copper)
  const dirLight2 = new THREE.DirectionalLight(0xff8c00, 1.4);
  dirLight2.position.set(-15, -10, 10);
  scene.add(dirLight2);

  // Subtle Deep Blue Backlight for depth contrast
  const backLight = new THREE.DirectionalLight(0x0a3b75, 1.8);
  backLight.position.set(0, -15, -10);
  scene.add(backLight);

  // Materials
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.88,
    roughness: 0.25,
    emissive: 0x332205,
    emissiveIntensity: 0.2
  });

  const copperMaterial = new THREE.MeshStandardMaterial({
    color: 0xb87333,
    metalness: 0.82,
    roughness: 0.32,
    emissive: 0x2e1104,
    emissiveIntensity: 0.15
  });

  const darkBrassMaterial = new THREE.MeshStandardMaterial({
    color: 0x8c6d1f,
    metalness: 0.92,
    roughness: 0.35
  });

  /**
   * Procedural 3D Gear Generator
   * Creates an authentic bevelled mechanical gear with teeth and spokes
   */
  function createGearGeometry(numTeeth, pitchRadius, toothHeight, toothWidth, holeRadius, thickness) {
    const shape = new THREE.Shape();
    const toothAngle = (Math.PI * 2) / numTeeth;
    const halfTooth = toothAngle * 0.25;

    for (let i = 0; i < numTeeth; i++) {
      const angle = i * toothAngle;
      const r1 = pitchRadius - toothHeight * 0.4;
      const r2 = pitchRadius + toothHeight * 0.6;

      const a0 = angle - halfTooth;
      const a1 = angle - halfTooth * 0.5;
      const a2 = angle + halfTooth * 0.5;
      const a3 = angle + halfTooth;

      const p0 = { x: Math.cos(a0) * r1, y: Math.sin(a0) * r1 };
      const p1 = { x: Math.cos(a1) * r2, y: Math.sin(a1) * r2 };
      const p2 = { x: Math.cos(a2) * r2, y: Math.sin(a2) * r2 };
      const p3 = { x: Math.cos(a3) * r1, y: Math.sin(a3) * r1 };

      if (i === 0) {
        shape.moveTo(p0.x, p0.y);
      } else {
        shape.lineTo(p0.x, p0.y);
      }
      shape.lineTo(p1.x, p1.y);
      shape.lineTo(p2.x, p2.y);
      shape.lineTo(p3.x, p3.y);
    }
    shape.closePath();

    // Center axle hole
    if (holeRadius > 0) {
      const holePath = new THREE.Path();
      holePath.absarc(0, 0, holeRadius, 0, Math.PI * 2, true);
      shape.holes.push(holePath);

      // Add 4 decorative cutouts in the gear body for Victorian clockwork aesthetic
      const spokeCutoutRadius = (pitchRadius - toothHeight - holeRadius) * 0.42;
      const spokeCenterDist = holeRadius + spokeCutoutRadius + 0.15;
      if (spokeCutoutRadius > 0.25) {
        for (let s = 0; s < 4; s++) {
          const spokeAngle = (Math.PI / 2) * s + Math.PI / 4;
          const cx = Math.cos(spokeAngle) * spokeCenterDist;
          const cy = Math.sin(spokeAngle) * spokeCenterDist;
          const spokeHole = new THREE.Path();
          spokeHole.absarc(cx, cy, spokeCutoutRadius, 0, Math.PI * 2, true);
          shape.holes.push(spokeHole);
        }
      }
    }

    const extrudeSettings = {
      steps: 1,
      depth: thickness,
      bevelEnabled: true,
      bevelThickness: 0.08,
      bevelSize: 0.06,
      bevelOffset: 0,
      bevelSegments: 2
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.center();
    return geometry;
  }

  // Gear System Mesh Collection
  const gearGroup = new THREE.Group();
  scene.add(gearGroup);

  // 1. Grand Clockwork Gear (Top-Right Background)
  const geom1 = createGearGeometry(24, 3.8, 0.7, 0.4, 1.1, 0.35);
  const gear1 = new THREE.Mesh(geom1, goldMaterial);
  gear1.position.set(4.2, 5.5, -4);
  gear1.rotation.set(0.15, 0.25, 0);
  gearGroup.add(gear1);

  // 2. Interlocking Copper Gear
  const geom2 = createGearGeometry(16, 2.6, 0.6, 0.35, 0.8, 0.3);
  const gear2 = new THREE.Mesh(geom2, copperMaterial);
  gear2.position.set(-4.5, 3.2, -5);
  gear2.rotation.set(-0.1, -0.2, 0.4);
  gearGroup.add(gear2);

  // 3. Middle Floating Brass Gear
  const geom3 = createGearGeometry(18, 2.9, 0.65, 0.35, 0.9, 0.3);
  const gear3 = new THREE.Mesh(geom3, darkBrassMaterial);
  gear3.position.set(4.8, -4.5, -6);
  gear3.rotation.set(0.2, -0.15, 0.8);
  gearGroup.add(gear3);

  // 4. Small Delicate Escapement Wheel (Bottom-Left)
  const geom4 = createGearGeometry(12, 1.8, 0.5, 0.25, 0.5, 0.25);
  const gear4 = new THREE.Mesh(geom4, goldMaterial);
  gear4.position.set(-3.8, -6.0, -3.5);
  gear4.rotation.set(-0.25, 0.2, 0);
  gearGroup.add(gear4);

  // 5. Center Subtle Astrolabe Ring
  const ringGeom = new THREE.TorusGeometry(3.2, 0.08, 12, 48);
  const ring = new THREE.Mesh(ringGeom, goldMaterial);
  ring.position.set(0, 0, -8);
  gearGroup.add(ring);

  // =========================================================================
  // 3D Floating Steam Particles & Golden Embers
  // =========================================================================
  const particleCount = 70;
  const particleGeom = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const velocities = [];

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 16;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

    velocities.push({
      x: (Math.random() - 0.5) * 0.008,
      y: 0.008 + Math.random() * 0.018, // gentle upward drift
      z: (Math.random() - 0.5) * 0.005
    });
  }

  particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  // Circular soft glow particle canvas texture
  function createParticleTexture() {
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const ctx = pCanvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, 'rgba(255, 235, 170, 0.95)');
    grad.addColorStop(0.3, 'rgba(246, 205, 70, 0.5)');
    grad.addColorStop(0.7, 'rgba(184, 115, 51, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(pCanvas);
  }

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.55,
    map: createParticleTexture(),
    transparent: true,
    opacity: 0.65,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeom, particleMaterial);
  scene.add(particleSystem);

  // Parallax smooth interpolation
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;

  function onPointerMove(e) {
    const x = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : window.innerWidth / 2);
    const y = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : window.innerHeight / 2);
    targetMouseX = (x / window.innerWidth - 0.5) * 2;
    targetMouseY = (y / window.innerHeight - 0.5) * 2;
  }

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });

  // Optional Gyroscope support for mobile tilt
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', function (e) {
      if (e.gamma !== null && e.beta !== null) {
        // gamma: left-to-right [-90, 90], beta: front-to-back [-180, 180]
        targetMouseX = Math.max(-1, Math.min(1, e.gamma / 35));
        targetMouseY = Math.max(-1, Math.min(1, (e.beta - 45) / 35));
      }
    }, { passive: true });
  }

  // Animation Loop with Visibility Optimization
  let isRunning = true;
  let clock = new THREE.Clock();

  function animate() {
    if (!isRunning) return;
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const speed = prefersReducedMotion ? 0.15 : 1.0;

    // Smooth camera / scene tilt parallax
    currentMouseX += (targetMouseX - currentMouseX) * 0.04;
    currentMouseY += (targetMouseY - currentMouseY) * 0.04;

    camera.position.x = currentMouseX * 1.2;
    camera.position.y = -currentMouseY * 1.2;
    camera.lookAt(0, 0, 0);

    // Rotate Steampunk Gears according to gear teeth ratio
    gear1.rotation.z += 0.004 * speed;
    gear2.rotation.z -= (0.004 * (24 / 16)) * speed;
    gear3.rotation.z += 0.005 * speed;
    gear4.rotation.z -= (0.005 * (18 / 12)) * speed;

    ring.rotation.x += 0.002 * speed;
    ring.rotation.y += 0.003 * speed;

    // Animate Particles (Floating steam & sparks)
    const pos = particleGeom.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      pos[idx + 1] += velocities[i].y * speed;
      pos[idx] += velocities[i].x * speed;

      // Wrap around top/bottom
      if (pos[idx + 1] > 11) {
        pos[idx + 1] = -11;
        pos[idx] = (Math.random() - 0.5) * 16;
      }
    }
    particleGeom.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }

  // Pause rendering when tab is hidden to conserve mobile battery
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
    } else {
      isRunning = true;
      clock.start();
      animate();
    }
  });

  // Resize handler
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
  });

  // Expose gear spin boost for interactive tactile feedback
  window.boost3DGears = function () {
    if (prefersReducedMotion) return;
    const initialZ1 = gear1.rotation.z;
    const targetZ1 = initialZ1 + Math.PI * 0.45;
    const start = performance.now();
    const duration = 650;

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      gear1.rotation.z = initialZ1 + (targetZ1 - initialZ1) * ease;
      gear2.rotation.z -= 0.02 * (1 - ease);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  };

  animate();
})();

