/**
 * main.js – Master Application Entry Point & Orchestrator
 *
 * Responsibilities:
 *  - Scene, Camera, WebGLRenderer configuration
 *  - High-performance animation and render loop
 *  - Synchronous PointerLockControls locking on user gesture
 *  - Zone transition tracking & HUD updates
 *  - Mini-map radar canvas renderer
 *  - Web Audio API sound initialization
 *  - Optional WebXR support
 */

import * as THREE from 'three';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

import { buildMuseum, GALLERY_ZONES } from './museum.js';
import { setupControls, updateMovement } from './controls.js';
import { setupInteraction, updateInteraction, isPanelOpen } from './interaction.js';
import { createAllExhibits, getExhibitObjects } from './exhibits.js';
import { soundManager } from './audio.js';

// ─────────────────────────────────────────────────────────────────────────────
// DOM References
// ─────────────────────────────────────────────────────────────────────────────
const loadingScreen       = document.getElementById('loading-screen');
const loaderBar           = document.getElementById('loader-bar');
const loaderStatus        = document.getElementById('loader-status');
const welcomeScreen       = document.getElementById('welcome-screen');
const enterBtn            = document.getElementById('enter-btn');
const canvasContainer     = document.getElementById('canvas-container');
const hud                 = document.getElementById('hud');
const galleryNameEl       = document.getElementById('gallery-name');
const helpBtn             = document.getElementById('help-btn');
const helpOverlay         = document.getElementById('help-overlay');
const helpClose           = document.getElementById('help-close');
const hudFps              = document.getElementById('hud-fps');
const pauseScreen         = document.getElementById('pause-screen');
const resumeBtn           = document.getElementById('resume-btn');
const galleryTransitionEl = document.getElementById('gallery-transition');
const gtNameEl            = document.getElementById('gt-name');
const audioToggleBtn      = document.getElementById('audio-toggle-btn');
const fullscreenBtn       = document.getElementById('fullscreen-btn');
const minimapCanvas       = document.getElementById('minimap-canvas');

// ─────────────────────────────────────────────────────────────────────────────
// Three.js Core Setup
// ─────────────────────────────────────────────────────────────────────────────

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0914);
scene.fog = new THREE.Fog(0x0a0914, 28, 75);

// Camera – Human First-Person Perspective (Starting at Lobby looking forward)
const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1.7, 18);

// WebGL Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
canvasContainer.appendChild(renderer.domElement);

// ─────────────────────────────────────────────────────────────────────────────
// PointerLockControls (First-Person Mouse Look)
// ─────────────────────────────────────────────────────────────────────────────
const controls = new PointerLockControls(camera, renderer.domElement);
scene.add(controls.getObject());

// Handle lock and unlock
controls.addEventListener('lock', () => {
  pauseScreen.classList.add('hidden');
  hud.classList.remove('hidden');
});

controls.addEventListener('unlock', () => {
  // If an exhibit info panel is open, do not show the pause screen
  if (museumRunning && !isPanelOpen()) {
    pauseScreen.classList.remove('hidden');
  }
});

document.addEventListener('pointerlockerror', () => {
  // Gracefully handle browser restrictions (e.g., iframe, headless, or rapid ESC)
  console.log('Pointer lock request was deferred or canceled by browser.');
});

// Resume on pause screen click
if (resumeBtn) {
  resumeBtn.addEventListener('click', () => {
    controls.lock();
  });
}
pauseScreen.addEventListener('click', () => {
  controls.lock();
});

// Canvas click locks controls if museum is active and no modal open
canvasContainer.addEventListener('click', () => {
  if (museumRunning && !controls.isLocked && !isPanelOpen()) {
    controls.lock();
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// State
// ─────────────────────────────────────────────────────────────────────────────
let museumRunning  = false;
let currentGallery = 'Main Lobby';
let frameCount     = 0;
let fpsTimer       = 0;
const clock        = new THREE.Clock();
let transitionTimer = null;

// ─────────────────────────────────────────────────────────────────────────────
// Loading Sequence
// ─────────────────────────────────────────────────────────────────────────────
async function runLoadingSequence() {
  const steps = [
    { pct: 15, msg: 'Initializing Three.js WebGL rendering pipeline…' },
    { pct: 35, msg: 'Constructing galleries, columns, and marble floors…' },
    { pct: 60, msg: 'Procedurally painting canvas masterpieces & inscriptions…' },
    { pct: 80, msg: 'Assembling 3D artifacts, Bohr atom, and planetary orrery…' },
    { pct: 95, msg: 'Calibrating raycasters and audio synthesizers…' },
    { pct: 100, msg: 'Museum Ready! Click below to enter.' },
  ];

  for (const step of steps) {
    loaderBar.style.width = step.pct + '%';
    loaderStatus.textContent = step.msg;
    await delay(step.pct === 100 ? 350 : 220);
  }

  // Build the complete 3D environment
  buildMuseum(scene);
  createAllExhibits(scene);
  setupControls(controls, camera, scene);
  setupInteraction(camera, scene, getExhibitObjects(), controls);

  await delay(250);

  // Fade out loading screen into welcome landing page
  loadingScreen.style.transition = 'opacity 0.5s ease';
  loadingScreen.style.opacity = '0';
  await delay(500);
  loadingScreen.classList.add('hidden');
  welcomeScreen.classList.remove('hidden');
}

// ─────────────────────────────────────────────────────────────────────────────
// Enter Museum (Synchronous User Gesture Handled Here!)
// ─────────────────────────────────────────────────────────────────────────────
enterBtn.addEventListener('click', () => {
  // 1. Initialize procedural audio synthesizer on first direct user gesture
  soundManager.init();

  // 2. Request pointer lock synchronously to satisfy browser security policy
  controls.lock();

  // 3. Hide welcome screen and start simulation
  welcomeScreen.classList.add('hidden');
  hud.classList.remove('hidden');
  museumRunning = true;

  showGalleryTransition('Welcome to the Virtual Museum');
  animate();
});

// ─────────────────────────────────────────────────────────────────────────────
// Gallery Transition Toast
// ─────────────────────────────────────────────────────────────────────────────
function showGalleryTransition(name) {
  if (transitionTimer) clearTimeout(transitionTimer);
  gtNameEl.textContent = name;
  galleryTransitionEl.classList.remove('hidden');
  galleryTransitionEl.classList.remove('fade-out');

  transitionTimer = setTimeout(() => {
    galleryTransitionEl.classList.add('fade-out');
    setTimeout(() => {
      galleryTransitionEl.classList.add('hidden');
    }, 600);
  }, 2200);
}

// Detect which gallery zone the visitor currently occupies
function detectGallery() {
  const pos = camera.position;
  for (let i = 0; i < GALLERY_ZONES.length; i++) {
    const z = GALLERY_ZONES[i];
    if (pos.x >= z.xMin && pos.x <= z.xMax && pos.z >= z.zMin && pos.z <= z.zMax) {
      if (z.name !== currentGallery) {
        currentGallery = z.name;
        galleryNameEl.textContent = currentGallery;
        showGalleryTransition(currentGallery);
      }
      return;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HUD Mini-Map Radar Renderer
// ─────────────────────────────────────────────────────────────────────────────
function updateMinimap() {
  if (!minimapCanvas) return;
  const ctx = minimapCanvas.getContext('2d');
  const w = minimapCanvas.width;
  const h = minimapCanvas.height;

  ctx.clearRect(0, 0, w, h);

  // Background map box
  ctx.fillStyle = 'rgba(15, 12, 25, 0.85)';
  ctx.fillRect(0, 0, w, h);

  // Map coordinates: X from -26 to 26 (range 52), Z from -27 to 23 (range 50)
  const mapX = (x) => ((x + 28) / 56) * w;
  const mapZ = (z) => ((-z + 25) / 52) * h;

  // Draw gallery room outlines
  ctx.strokeStyle = 'rgba(201, 168, 76, 0.45)';
  ctx.lineWidth = 1.5;

  GALLERY_ZONES.forEach((zone) => {
    const x0 = mapX(zone.xMin);
    const z0 = mapZ(zone.zMax);
    const rw = mapX(zone.xMax) - x0;
    const rh = mapZ(zone.zMin) - z0;
    ctx.strokeRect(x0, z0, rw, rh);
  });

  // Player position dot
  const px = mapX(camera.position.x);
  const pz = mapZ(camera.position.z);

  // Player view direction cone
  const dir = new THREE.Vector3();
  controls.getDirection(dir);
  ctx.fillStyle = 'rgba(201, 168, 76, 0.3)';
  ctx.beginPath();
  ctx.moveTo(px, pz);
  ctx.arc(px, pz, 16, -Math.atan2(dir.x, dir.z) - Math.PI / 6, -Math.atan2(dir.x, dir.z) + Math.PI / 6);
  ctx.closePath();
  ctx.fill();

  // Player location beacon
  ctx.fillStyle = '#ffdf66';
  ctx.beginPath();
  ctx.arc(px, pz, 3.5, 0, Math.PI * 2);
  ctx.fill();
}

// ─────────────────────────────────────────────────────────────────────────────
// Audio & Fullscreen Buttons
// ─────────────────────────────────────────────────────────────────────────────
if (audioToggleBtn) {
  audioToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const muted = soundManager.toggleMute();
    audioToggleBtn.textContent = muted ? '🔇 Muted' : '🔊 Sound';
  });
}

if (fullscreenBtn) {
  fullscreenBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      fullscreenBtn.textContent = '⤓ Exit Full';
    } else {
      document.exitFullscreen().catch(() => {});
      fullscreenBtn.textContent = '⛶ Fullscreen';
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Help / Controls Overlay
// ─────────────────────────────────────────────────────────────────────────────
helpBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (controls.isLocked) controls.unlock();
  helpOverlay.classList.remove('hidden');
});
helpClose.addEventListener('click', () => helpOverlay.classList.add('hidden'));
helpOverlay.addEventListener('click', (e) => {
  if (e.target === helpOverlay) helpOverlay.classList.add('hidden');
});

// ─────────────────────────────────────────────────────────────────────────────
// Window Resize
// ─────────────────────────────────────────────────────────────────────────────
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ─────────────────────────────────────────────────────────────────────────────
// Main Animation & Render Loop
// ─────────────────────────────────────────────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  // FPS calculation
  frameCount++;
  fpsTimer += delta;
  if (fpsTimer >= 1.0) {
    hudFps.textContent = `${frameCount} fps`;
    frameCount = 0;
    fpsTimer = 0;
  }

  // Update exploration kinematics & gallery detection
  if (museumRunning && controls.isLocked) {
    updateMovement(delta, camera, controls);
    detectGallery();
  }

  // Update raycasting interaction
  updateInteraction(camera, scene, controls);

  // Update mini-map radar
  updateMinimap();

  // Animate rotating showcase objects (Earth, Atom, Pyramids, Sculptures)
  scene.traverse((obj) => {
    if (obj.userData.rotate && obj.userData.rotateSpeed) {
      obj.rotation.y += obj.userData.rotateSpeed * delta;
    }
  });

  renderer.render(scene, camera);
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────────────────────────────────────
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─────────────────────────────────────────────────────────────────────────────
// WebXR Support (Optional VR Headset Mode)
// ─────────────────────────────────────────────────────────────────────────────
if ('xr' in navigator) {
  navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
    if (supported) {
      renderer.xr.enabled = true;
      const vrBtn = document.createElement('button');
      vrBtn.id = 'vr-btn';
      vrBtn.textContent = '🥽 Enter VR';
      vrBtn.className = 'btn-vr';
      vrBtn.addEventListener('click', () => {
        navigator.xr.requestSession('immersive-vr', {
          optionalFeatures: ['local-floor', 'bounded-floor'],
        }).then((session) => {
          renderer.xr.setSession(session);
        });
      });
      document.body.appendChild(vrBtn);
    }
  }).catch(() => {});
}

// ─────────────────────────────────────────────────────────────────────────────
// Boot
// ─────────────────────────────────────────────────────────────────────────────
runLoadingSequence();
