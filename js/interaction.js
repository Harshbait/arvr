/**
 * interaction.js – Raycaster-based Exhibit Interaction & Modal Manager
 *
 * Responsibilities:
 *  - Screen-centre Raycasting to detect hovered exhibits
 *  - Dynamic crosshair and HUD prompt updates
 *  - Emissive hover highlighting of 3D objects & paintings
 *  - Information modal management (open, populate, close)
 *  - Procedural UI audio effects integration
 *  - Real-time orbital animation of planetary bodies and electrons
 */

import * as THREE from 'three';
import { soundManager } from './audio.js';

// ─────────────────────────────────────────────────────────────────────────────
// DOM Elements
// ─────────────────────────────────────────────────────────────────────────────
const crosshair         = document.getElementById('crosshair');
const interactionPrompt = document.getElementById('interaction-prompt');
const promptText        = document.getElementById('prompt-text');
const infoPanel         = document.getElementById('info-panel');
const infoClose         = document.getElementById('info-close');
const infoCategory      = document.getElementById('info-category');
const infoTitle         = document.getElementById('info-title');
const infoDescription   = document.getElementById('info-description');
const infoExtra         = document.getElementById('info-extra');
const infoFact          = document.getElementById('info-fact');
const infoSdg           = document.getElementById('info-sdg');

// ─────────────────────────────────────────────────────────────────────────────
// Raycaster & Interaction State
// ─────────────────────────────────────────────────────────────────────────────
const raycaster     = new THREE.Raycaster();
const screenCentre  = new THREE.Vector2(0, 0); // NDC centre
const INTERACT_DIST = 6.8;                     // Maximum interaction distance (meters)
let exhibitList     = [];
let currentHovered  = null;
let panelOpen       = false;

const SCALE_HIGHLIGHT = 1.05;

// ─────────────────────────────────────────────────────────────────────────────
// Setup Listeners
// ─────────────────────────────────────────────────────────────────────────────
export function setupInteraction(camera, scene, exhibits, controls) {
  exhibitList = exhibits;

  // 'E' key press to interact
  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'e' && currentHovered && !panelOpen) {
      openInfoPanel(currentHovered.userData.exhibitData, controls);
    } else if (e.key === 'Escape' && panelOpen) {
      closeInfoPanel(controls);
    }
  });

  // Click on canvas while hovering an exhibit to open panel
  window.addEventListener('mousedown', (e) => {
    if (controls.isLocked && currentHovered && !panelOpen && e.button === 0) {
      openInfoPanel(currentHovered.userData.exhibitData, controls);
    }
  });

  // Close button
  infoClose.addEventListener('click', () => closeInfoPanel(controls));

  // Click backdrop outside modal to close
  infoPanel.addEventListener('click', (e) => {
    if (e.target === infoPanel) closeInfoPanel(controls);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Modal Actions
// ─────────────────────────────────────────────────────────────────────────────
export function openInfoPanel(data, controls) {
  if (!data) return;
  panelOpen = true;

  soundManager.playExhibitOpen();

  // Populate data fields
  infoCategory.textContent    = data.category || 'EXHIBIT';
  infoTitle.textContent       = data.title || 'Untitled Exhibit';
  infoDescription.textContent = data.description || '';
  infoExtra.textContent       = data.extra || '';
  infoFact.textContent        = data.fact || '';

  if (infoSdg) {
    infoSdg.textContent = data.sdg || 'SDG 4: Quality Education — Promoting accessible, immersive digital learning.';
  }

  // Release pointer lock so user can interact with the panel and read comfortably
  if (controls && controls.isLocked) {
    controls.unlock();
  }

  infoPanel.classList.remove('hidden');
  interactionPrompt.classList.add('hidden');
  crosshair.classList.remove('active');
}

export function closeInfoPanel(controls) {
  if (!panelOpen) return;
  panelOpen = false;

  soundManager.playExhibitClose();
  infoPanel.classList.add('hidden');

  // Note: Controls will re-lock when the user clicks back onto the canvas
}

export function isPanelOpen() {
  return panelOpen;
}

// ─────────────────────────────────────────────────────────────────────────────
// Per-Frame Raycasting & Hover Detection
// ─────────────────────────────────────────────────────────────────────────────
export function updateInteraction(camera, scene, controls) {
  // Update orbital simulations each frame
  updateOrbits(scene);

  // If modal is open or pointer not locked, suppress hover tests
  if (panelOpen || !controls.isLocked) {
    if (currentHovered) {
      unhighlightExhibit(currentHovered);
      currentHovered = null;
    }
    crosshair.classList.remove('active');
    interactionPrompt.classList.add('hidden');
    return;
  }

  // Cast ray directly through screen center (0, 0)
  raycaster.setFromCamera(screenCentre, camera);
  const hits = raycaster.intersectObjects(exhibitList, false);

  let newHovered = null;
  if (hits.length > 0 && hits[0].distance < INTERACT_DIST) {
    newHovered = hits[0].object;
  }

  // State change
  if (newHovered !== currentHovered) {
    if (currentHovered) unhighlightExhibit(currentHovered);
    currentHovered = newHovered;
    if (currentHovered) highlightExhibit(currentHovered);
  }

  // Update HUD prompt & Crosshair
  if (currentHovered) {
    crosshair.classList.add('active');
    const title = currentHovered.userData.exhibitData?.title || 'Exhibit';
    promptText.innerHTML = `<b>${title}</b> — Press <kbd>E</kbd> or Click to Explore`;
    interactionPrompt.classList.remove('hidden');
  } else {
    crosshair.classList.remove('active');
    interactionPrompt.classList.add('hidden');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Highlight Shaders / Emissive Modifiers
// ─────────────────────────────────────────────────────────────────────────────
function highlightExhibit(mesh) {
  if (!mesh || !mesh.material) return;

  const applyHighlight = (mat) => {
    if (mat.emissive) {
      mat._origEmissive = mat.emissive.clone();
      mat._origEmissiveIntensity = mat.emissiveIntensity || 0;
      mat.emissive.set(0x664411);
      mat.emissiveIntensity = Math.min((mat.emissiveIntensity || 0) + 0.6, 1.8);
    } else {
      if (!mesh.userData._highlightScaled) {
        mesh.scale.multiplyScalar(SCALE_HIGHLIGHT);
        mesh.userData._highlightScaled = true;
      }
    }
  };

  if (Array.isArray(mesh.material)) {
    mesh.material.forEach(applyHighlight);
  } else {
    applyHighlight(mesh.material);
  }
}

function unhighlightExhibit(mesh) {
  if (!mesh || !mesh.material) return;

  const removeHighlight = (mat) => {
    if (mat._origEmissive !== undefined) {
      mat.emissive.copy(mat._origEmissive);
      mat.emissiveIntensity = mat._origEmissiveIntensity || 0;
      delete mat._origEmissive;
      delete mat._origEmissiveIntensity;
    }
  };

  if (Array.isArray(mesh.material)) {
    mesh.material.forEach(removeHighlight);
  } else {
    removeHighlight(mesh.material);
  }

  if (mesh.userData._highlightScaled) {
    mesh.scale.divideScalar(SCALE_HIGHLIGHT);
    delete mesh.userData._highlightScaled;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Real-Time Orbital Kinematics (Planets & Subatomic Electrons)
// ─────────────────────────────────────────────────────────────────────────────
const orbitClock = new THREE.Clock();

function updateOrbits(scene) {
  const elapsed = orbitClock.getElapsedTime();

  scene.traverse((obj) => {
    // 1. Planetary Orbits in XZ plane
    if (obj.userData.orbitInXZ && obj.userData.orbitCentre) {
      const c = obj.userData.orbitCentre;
      const r = obj.userData.orbitRadius;
      const spd = obj.userData.orbitSpeed || 1.0;
      const ang = obj.userData.orbitAngle + elapsed * spd;
      obj.position.set(
        c.x + Math.cos(ang) * r,
        c.y,
        c.z + Math.sin(ang) * r
      );
    }

    // 2. Multi-axis Electron Orbits
    if (obj.userData.orbitRotX !== undefined && obj.userData.orbitCentre) {
      const c = obj.userData.orbitCentre;
      const r = obj.userData.orbitRadius;
      const spd = obj.userData.orbitSpeed || 1.0;
      const ang = obj.userData.orbitAngle + elapsed * spd;

      // Unrotated orbit vector
      const v = new THREE.Vector3(Math.cos(ang) * r, 0, Math.sin(ang) * r);
      v.applyEuler(new THREE.Euler(obj.userData.orbitRotX, 0, obj.userData.orbitRotZ));

      obj.position.copy(c).add(v);
    }
  });
}
