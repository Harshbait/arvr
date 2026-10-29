/**
 * exhibits.js – Complete Exhibition Catalogue & 3D Interactive Models
 *
 * Distributed across 4 Gallery Spaces:
 *  - Art Gallery (West Wing): 5 Framed Masterpieces with Picture Lights & Plaques
 *  - Historical Artifacts (East Wing): 4 Ancient Relics & Sculptures on Pedestals
 *  - Science & Technology (South-West): Bohr Atom, DNA Double Helix, VR Headset
 *  - Central Hall & Atrium: Earth & Orbiting Satellite, Solar System Orrery, Great Pyramid
 *
 * All paintings, textures, and inscriptions are procedurally painted with CanvasTexture
 * to ensure 100% stability, zero external asset failures, and zero CORS restrictions.
 */

import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// Registry of Raycaster Interactive Targets
// ─────────────────────────────────────────────────────────────────────────────
const exhibitObjects = [];
export function getExhibitObjects() { return exhibitObjects; }

// ─────────────────────────────────────────────────────────────────────────────
// Canvas Artwork Painting Generators
// ─────────────────────────────────────────────────────────────────────────────

function createArtworkTexture(type, title, artist, year) {
  const W = 640;
  const H = 800;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  if (type === 'starry') {
    // 1. Van Gogh - The Starry Night style
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#09152e');
    bg.addColorStop(0.5, '#17366b');
    bg.addColorStop(0.85, '#224a7a');
    bg.addColorStop(1, '#0c1626');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Glowing swirling nebulae
    for (let i = 0; i < 9; i++) {
      ctx.beginPath();
      ctx.ellipse(120 + i * 50, 220 + Math.sin(i) * 45, 75 - i * 3, 30, i * 0.28, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(220, 235, 255, ${0.45 - i * 0.03})`;
      ctx.lineWidth = 10;
      ctx.stroke();
    }

    // Glowing Stars with halos
    const stars = [
      [140, 100, 16], [260, 160, 22], [380, 110, 18], [480, 180, 14],
      [180, 280, 15], [320, 310, 20], [450, 260, 17], [100, 380, 12],
    ];
    stars.forEach(([sx, sy, sr]) => {
      // Outer halo
      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr * 2.2);
      grad.addColorStop(0, '#fffbe6');
      grad.addColorStop(0.4, 'rgba(255, 215, 60, 0.7)');
      grad.addColorStop(1, 'rgba(255, 180, 30, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath(); ctx.arc(sx, sy, sr * 2.2, 0, Math.PI * 2); ctx.fill();
      // Star center
      ctx.fillStyle = '#ffffff';
      ctx.beginPath(); ctx.arc(sx, sy, sr * 0.45, 0, Math.PI * 2); ctx.fill();
    });

    // Brilliant Crescent Moon
    ctx.beginPath();
    ctx.arc(520, 95, 42, 0, Math.PI * 2);
    ctx.fillStyle = '#ffdf66';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(505, 90, 36, 0, Math.PI * 2);
    ctx.fillStyle = '#17366b';
    ctx.fill();

    // Dark brooding Cypress Tree in foreground
    ctx.fillStyle = '#0a1a0f';
    ctx.beginPath();
    ctx.moveTo(90, H);
    ctx.quadraticCurveTo(40, H * 0.5, 95, H * 0.25);
    ctx.quadraticCurveTo(140, H * 0.5, 120, H);
    ctx.closePath();
    ctx.fill();

    // Sleepy village rooftops at bottom
    ctx.fillStyle = '#060a12';
    ctx.fillRect(0, H - 90, W, 90);
    // Church spire
    ctx.beginPath();
    ctx.moveTo(330, H - 90); ctx.lineTo(345, H - 240); ctx.lineTo(360, H - 90);
    ctx.fill();

  } else if (type === 'mona_lisa') {
    // 2. Leonardo da Vinci - Mona Lisa style
    // Sfumato atmospheric landscape background
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, '#5a6e5a');
    bg.addColorStop(0.35, '#827f58');
    bg.addColorStop(0.65, '#4a3c28');
    bg.addColorStop(1, '#241a10');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Winding river and distant crags
    ctx.strokeStyle = '#7c9480';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(120, 350); ctx.quadraticCurveTo(180, 300, 240, 340);
    ctx.stroke();

    // Portrait Body & Dark Renaissance Drapery
    const robeGrad = ctx.createLinearGradient(0, 380, 0, H);
    robeGrad.addColorStop(0, '#2d251a');
    robeGrad.addColorStop(0.5, '#1e1810');
    robeGrad.addColorStop(1, '#0e0b07');
    ctx.fillStyle = robeGrad;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 190, H);
    ctx.quadraticCurveTo(W / 2 - 130, 420, W / 2, 400);
    ctx.quadraticCurveTo(W / 2 + 130, 420, W / 2 + 190, H);
    ctx.closePath();
    ctx.fill();

    // Folded hands
    ctx.fillStyle = '#caa37a';
    ctx.beginPath();
    ctx.ellipse(W / 2, H - 90, 85, 38, -0.1, 0, Math.PI * 2);
    ctx.fill();

    // Sfumato Face Oval
    const faceGrad = ctx.createRadialGradient(W / 2, 280, 20, W / 2, 280, 110);
    faceGrad.addColorStop(0, '#e8caa2');
    faceGrad.addColorStop(0.7, '#caa078');
    faceGrad.addColorStop(1, '#8c6848');
    ctx.fillStyle = faceGrad;
    ctx.beginPath();
    ctx.ellipse(W / 2, 280, 88, 115, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dark flowing veil & hair
    ctx.fillStyle = '#1c150c';
    ctx.beginPath();
    ctx.moveTo(W / 2 - 95, 230);
    ctx.quadraticCurveTo(W / 2, 170, W / 2 + 95, 230);
    ctx.quadraticCurveTo(W / 2 + 115, 380, W / 2 + 90, 450);
    ctx.quadraticCurveTo(W / 2 + 80, 290, W / 2 - 90, 450);
    ctx.closePath();
    ctx.fill();

    // Iconic Enigmatic Eyes & Soft Smile
    ctx.fillStyle = '#2a1a0c';
    ctx.beginPath(); ctx.ellipse(W / 2 - 32, 265, 12, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(W / 2 + 32, 265, 12, 6, 0, 0, Math.PI * 2); ctx.fill();

    // Subtle Smile line (sfumato shadow)
    ctx.strokeStyle = '#62442a';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 24, 328);
    ctx.quadraticCurveTo(W / 2, 336, W / 2 + 24, 328);
    ctx.stroke();

  } else if (type === 'wave') {
    // 3. Hokusai - The Great Wave off Kanagawa style
    // Soft sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#f2e8cf');
    sky.addColorStop(0.65, '#e4d2aa');
    sky.addColorStop(1, '#97b1a6');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Distant Snow-capped Mount Fuji
    ctx.fillStyle = '#2c4159';
    ctx.beginPath();
    ctx.moveTo(250, 480); ctx.lineTo(330, 360); ctx.lineTo(410, 480);
    ctx.fill();
    // Fuji Snow peak
    ctx.fillStyle = '#f8f9fa';
    ctx.beginPath();
    ctx.moveTo(310, 390); ctx.lineTo(330, 360); ctx.lineTo(350, 390);
    ctx.fill();

    // Towering Prussian Blue Wave Crests
    const waveGrad = ctx.createLinearGradient(0, 300, 0, H);
    waveGrad.addColorStop(0, '#102e52');
    waveGrad.addColorStop(0.4, '#1b4d82');
    waveGrad.addColorStop(1, '#091b33');
    ctx.fillStyle = waveGrad;

    // Main towering wave
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(0, 380);
    ctx.quadraticCurveTo(140, 240, 300, 200);
    ctx.quadraticCurveTo(460, 160, 420, 320);
    ctx.quadraticCurveTo(340, 380, 280, 440);
    ctx.quadraticCurveTo(420, 480, W, 520);
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fill();

    // Foam claws & spray
    ctx.fillStyle = '#ffffff';
    for (let c = 0; c < 28; c++) {
      const fx = 280 + Math.cos(c * 0.3) * (80 + c * 3);
      const fy = 190 + Math.sin(c * 0.3) * (50 + c * 2);
      ctx.beginPath();
      ctx.arc(fx, fy, 7 + Math.random() * 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Traditional Japanese Seal Stamp
    ctx.fillStyle = '#b32424';
    ctx.fillRect(40, 60, 45, 65);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px serif';
    ctx.fillText('冨嶽', 47, 90);
    ctx.fillText('三十', 47, 115);

  } else if (type === 'pearl') {
    // 4. Johannes Vermeer - Girl with a Pearl Earring style
    // Pure dark dramatic Baroque backdrop
    ctx.fillStyle = '#080a0c';
    ctx.fillRect(0, 0, W, H);

    // Ochre / golden drape
    ctx.fillStyle = '#8f6e2b';
    ctx.beginPath();
    ctx.moveTo(W / 2 - 140, H);
    ctx.quadraticCurveTo(W / 2 - 60, 460, W / 2 + 10, 460);
    ctx.quadraticCurveTo(W / 2 + 110, 490, W / 2 + 170, H);
    ctx.closePath();
    ctx.fill();

    // Ultramarine Blue & Yellow Turban
    ctx.fillStyle = '#1b3b6f';
    ctx.beginPath();
    ctx.ellipse(W / 2 - 20, 240, 95, 75, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d4a237';
    ctx.beginPath();
    ctx.moveTo(W / 2 + 20, 240);
    ctx.quadraticCurveTo(W / 2 + 90, 260, W / 2 + 110, 440);
    ctx.lineTo(W / 2 + 80, 440);
    ctx.closePath();
    ctx.fill();

    // Delicate Face
    const faceGrad = ctx.createRadialGradient(W / 2 - 20, 310, 10, W / 2 - 20, 310, 75);
    faceGrad.addColorStop(0, '#fae6d2');
    faceGrad.addColorStop(0.75, '#debfa3');
    faceGrad.addColorStop(1, '#85664d');
    ctx.fillStyle = faceGrad;
    ctx.beginPath();
    ctx.ellipse(W / 2 - 20, 315, 62, 78, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // Large Luminous Pearl Earring
    const pearlGrad = ctx.createRadialGradient(W / 2 + 18, 355, 2, W / 2 + 18, 355, 12);
    pearlGrad.addColorStop(0, '#ffffff');
    pearlGrad.addColorStop(0.5, '#dbe2ea');
    pearlGrad.addColorStop(1, '#4c5765');
    ctx.fillStyle = pearlGrad;
    ctx.beginPath();
    ctx.ellipse(W / 2 + 18, 358, 10, 14, 0, 0, Math.PI * 2);
    ctx.fill();

  } else {
    // 5. Piet Mondrian - Composition with Red, Blue, and Yellow
    ctx.fillStyle = '#f8f6f0';
    ctx.fillRect(0, 0, W, H);

    // Large Red Block (top-right)
    ctx.fillStyle = '#c72c21';
    ctx.fillRect(160, 0, W - 160, 480);

    // Vibrant Blue Block (bottom-left)
    ctx.fillStyle = '#1c4794';
    ctx.fillRect(0, 560, 160, H - 560);

    // Yellow Accent Block (bottom-right edge)
    ctx.fillStyle = '#f0c226';
    ctx.fillRect(W - 80, H - 120, 80, 120);

    // De Stijl Bold Black Grid Lines
    ctx.fillStyle = '#111115';
    ctx.fillRect(145, 0, 18, H);           // Vertical major
    ctx.fillRect(W - 85, 480, 18, H - 480); // Vertical minor
    ctx.fillRect(0, 470, W, 20);           // Horizontal major
    ctx.fillRect(0, 550, 160, 16);         // Horizontal lower
    ctx.fillRect(145, H - 125, W - 145, 16);// Horizontal yellow split
  }

  // Museum bottom identification tag
  ctx.fillStyle = 'rgba(12, 10, 20, 0.88)';
  ctx.fillRect(0, H - 65, W, 65);
  ctx.strokeStyle = '#c9a84c';
  ctx.lineWidth = 2;
  ctx.strokeRect(4, H - 61, W - 8, 57);

  ctx.fillStyle = '#c9a84c';
  ctx.font = 'bold 22px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, W / 2, H - 36);

  ctx.fillStyle = '#9e9683';
  ctx.font = 'italic 16px "Inter", sans-serif';
  ctx.fillText(`${artist}  •  ${year}`, W / 2, H - 14);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// ─────────────────────────────────────────────────────────────────────────────
// Museum Pedestal with Molded Chamfers & Plinth
// ─────────────────────────────────────────────────────────────────────────────
function createPedestal(scene, x, z, h = 1.0, w = 1.1) {
  const mat = new THREE.MeshStandardMaterial({
    color: 0x1f1b2b,
    roughness: 0.45,
    metalness: 0.25,
  });

  // Base plinth
  const base = new THREE.Mesh(new THREE.BoxGeometry(w * 1.2, 0.16, w * 1.2), mat);
  base.position.set(x, 0.08, z);
  base.receiveShadow = base.castShadow = true;
  scene.add(base);

  // Shaft column
  const shaft = new THREE.Mesh(new THREE.BoxGeometry(w, h - 0.26, w), mat);
  shaft.position.set(x, (h - 0.26) / 2 + 0.16, z);
  shaft.receiveShadow = shaft.castShadow = true;
  scene.add(shaft);

  // Top display surface with gold trim rim
  const top = new THREE.Mesh(new THREE.BoxGeometry(w * 1.12, 0.1, w * 1.12), mat);
  top.position.set(x, h - 0.05, z);
  top.receiveShadow = top.castShadow = true;
  scene.add(top);

  const rim = new THREE.Mesh(
    new THREE.BoxGeometry(w * 1.14, 0.03, w * 1.14),
    new THREE.MeshStandardMaterial({ color: 0xc9a84c, metalness: 0.8, roughness: 0.25 })
  );
  rim.position.set(x, h, z);
  scene.add(rim);

  return h + 0.02; // Returns exact Y coordinate of upper display surface
}

// ─────────────────────────────────────────────────────────────────────────────
// Physical Museum Info Card Plaque (placed beside each exhibit)
// ─────────────────────────────────────────────────────────────────────────────
function addExhibitPlaque(scene, title, category, x, y, z, ry = 0) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 180;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0f0d1b';
  ctx.fillRect(0, 0, 512, 180);

  ctx.strokeStyle = '#c9a84c';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, 504, 172);

  ctx.fillStyle = '#c9a84c';
  ctx.font = 'bold 30px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText(title, 256, 55);

  ctx.fillStyle = '#ded7c5';
  ctx.font = '22px "Inter", sans-serif';
  ctx.fillText(category, 256, 105);

  ctx.fillStyle = '#9e9683';
  ctx.font = 'italic 18px "Inter", sans-serif';
  ctx.fillText('[ Press E or Click to Inspect ]', 256, 148);

  const tex = new THREE.CanvasTexture(canvas);
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.85, 0.3),
    new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide })
  );
  mesh.position.set(x, y, z);
  mesh.rotation.y = ry;
  scene.add(mesh);
}

// ─────────────────────────────────────────────────────────────────────────────
// Framed Master Painting Constructor
// ─────────────────────────────────────────────────────────────────────────────
function createFramedPainting(scene, opts) {
  const { x, y, z, ry, w, h, type, title, artist, year, data } = opts;

  const group = new THREE.Group();
  group.position.set(x, y, z);
  group.rotation.y = ry;

  // 1. Ornate Multi-Tiered Gilded Frame
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0xb89230,
    roughness: 0.35,
    metalness: 0.75,
  });
  const border = 0.16;
  const outerFrame = new THREE.Mesh(
    new THREE.BoxGeometry(w + border * 2, h + border * 2, 0.08),
    frameMat
  );
  outerFrame.castShadow = true;
  group.add(outerFrame);

  // 2. Beveled Inner Fillet
  const filletMat = new THREE.MeshStandardMaterial({ color: 0x221b10, roughness: 0.8 });
  const innerFillet = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.04, h + 0.04, 0.09),
    filletMat
  );
  group.add(innerFillet);

  // 3. Stretched Canvas Artwork
  const artworkTex = createArtworkTexture(type, title, artist, year);
  const canvasMat = new THREE.MeshStandardMaterial({
    map: artworkTex,
    roughness: 0.85,
    metalness: 0.0,
  });
  const canvasMesh = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, 0.06),
    canvasMat
  );
  canvasMesh.position.z = 0.02;
  group.add(canvasMesh);

  // 4. Overhead Brass Picture Lamp Fixture
  const lampArm = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8),
    frameMat
  );
  lampArm.rotation.x = Math.PI / 2.5;
  lampArm.position.set(0, h / 2 + 0.18, 0.18);
  group.add(lampArm);

  const lampHood = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.04, w * 0.55, 12),
    frameMat
  );
  lampHood.rotation.z = Math.PI / 2;
  lampHood.position.set(0, h / 2 + 0.28, 0.26);
  group.add(lampHood);

  scene.add(group);

  // Dedicated Wall Spotlight aimed directly onto canvas
  const spot = new THREE.SpotLight(0xfffaea, 2.8, 7, 0.5, 0.45, 1.6);
  // Calculate light world position outward from frame
  const lightOffset = new THREE.Vector3(0, h / 2 + 0.8, 1.2).applyEuler(new THREE.Euler(0, ry, 0));
  spot.position.set(x + lightOffset.x, y + lightOffset.y, z + lightOffset.z);
  spot.target = canvasMesh;
  scene.add(spot);
  scene.add(spot.target);

  // Museum wall plaque mounted below the frame
  const plaqueOffset = new THREE.Vector3(0, -h / 2 - 0.26, 0.04).applyEuler(new THREE.Euler(0, ry, 0));
  addExhibitPlaque(scene, title, `${artist} (${year})`, x + plaqueOffset.x, y + plaqueOffset.y, z + plaqueOffset.z, ry);

  // Register Raycast Target
  canvasMesh.userData.isExhibit = true;
  canvasMesh.userData.exhibitData = data;
  exhibitObjects.push(canvasMesh);
}

// ═════════════════════════════════════════════════════════════════════════════
// 1. ART GALLERY EXHIBITS (West Wing)
// ═════════════════════════════════════════════════════════════════════════════

function createArtGallery(scene) {
  // Exhibit 1: The Starry Night (West Wall)
  createFramedPainting(scene, {
    x: -25.7, y: 2.8, z: 16, ry: Math.PI / 2, w: 2.6, h: 2.0,
    type: 'starry', title: 'The Starry Night', artist: 'Vincent van Gogh', year: '1889',
    data: {
      title: 'The Starry Night',
      category: 'Post-Impressionism  •  Oil on Canvas  •  1889',
      period: 'Late 19th Century European Art',
      description: 'Painted from the Saint-Paul asylum in Saint-Rémy-de-Provence shortly before sunrise, this masterpiece translates emotional turmoil into ecstatic cosmic rhythm. Van Gogh used thick, expressive impasto brushstrokes and turbulent spirals to capture a pulsating universe alive with spiritual energy.',
      extra: 'Van Gogh famously wrote to his brother Theo: "Looking at the stars always makes me dream, as simply as I dream of the black dots representing towns and villages on a map." The prominent cypress tree in the foreground represents eternity, linking terrestrial mortality with celestial infinity.',
      fact: '💡 Vincent van Gogh sold only a single painting during his lifetime ("The Red Vineyard"). Today, The Starry Night hangs in the Museum of Modern Art (MoMA) in New York and is among the most celebrated works in human history.',
      sdg: 'SDG 4 Connection: High-resolution digital twins allow students worldwide to study impasto brushwork and emotional expression in post-impressionism without expensive international travel.'
    }
  });

  // Exhibit 2: Mona Lisa (La Gioconda) (West Wall)
  createFramedPainting(scene, {
    x: -25.7, y: 2.8, z: 8, ry: Math.PI / 2, w: 2.2, h: 2.7,
    type: 'mona_lisa', title: 'Mona Lisa (La Gioconda)', artist: 'Leonardo da Vinci', year: '1503–1519',
    data: {
      title: 'Mona Lisa (La Gioconda)',
      category: 'Italian High Renaissance  •  Oil on Poplar  •  1503',
      period: 'Florentine Renaissance',
      description: 'Portrait of Lisa Gherardini, wife of merchant Francesco del Giocondo. Leonardo perfected "sfumato" (smoke-like transitions without hard outlines), creating an unprecedented sense of living breath and atmospheric depth. Her enigmatic gaze and elusive smile shift dynamically as the observer changes viewing angle.',
      extra: 'Leonardo kept this painting with him until his death in France in 1519. The background depicts an imaginary geological landscape with winding rivers and primeval mountains, symbolizing the macrocosm of nature reflected in the microcosm of the human spirit.',
      fact: '💡 The Mona Lisa has no visible eyebrows or eyelashes — common in high-society Renaissance grooming, though high-resolution multispectral scans by Pascal Cotte revealed that Leonardo originally painted microscopic brows that faded over five centuries of cleaning.',
      sdg: 'SDG 4 Connection: Demonstrates Leonardo’s synthesis of scientific anatomy, optics, and fine art, illustrating the interdisciplinary STEM+Arts (STEAM) curriculum essential for modern education.'
    }
  });

  // Exhibit 3: The Great Wave off Kanagawa (West Wall)
  createFramedPainting(scene, {
    x: -25.7, y: 2.8, z: 0, ry: Math.PI / 2, w: 2.6, h: 1.8,
    type: 'wave', title: 'The Great Wave off Kanagawa', artist: 'Katsushika Hokusai', year: '1831',
    data: {
      title: 'The Great Wave off Kanagawa',
      category: 'Ukiyo-e  •  Woodblock Print  •  c. 1831',
      period: 'Edo Period Japan',
      description: 'The crowning print of Hokusai’s "Thirty-Six Views of Mount Fuji" series. A monstrous crested wave with claw-like fingers dwarfs intrepid rowers in their slender "oshiokuri-bune" boats, while sacred Mount Fuji remains serene and steadfast in the distance, juxtaposing dynamic danger with timeless stillness.',
      extra: 'Hokusai was over 70 years old when he designed this masterwork. It was one of the earliest Japanese works to utilize imported synthetic Prussian Blue pigment, which revolutionized Japanese color palettes and later profoundly inspired European Impressionists such as Monet and Debussy.',
      fact: '💡 The fractal structure of Hokusai’s wave crests mathematically anticipates Mandelbrot sets and self-similar chaos theory, demonstrating how intuitive artist observation mirrors natural mathematics.',
      sdg: 'SDG 4 Connection: Teaches non-Western artistic heritage and Japanese printmaking techniques, fostering global cultural literacy in alignment with United Nations educational standards.'
    }
  });

  // Exhibit 4: Girl with a Pearl Earring (North Wall)
  createFramedPainting(scene, {
    x: -18, y: 2.8, z: 22.7, ry: Math.PI, w: 2.2, h: 2.6,
    type: 'pearl', title: 'Girl with a Pearl Earring', artist: 'Johannes Vermeer', year: '1665',
    data: {
      title: 'Girl with a Pearl Earring',
      category: 'Dutch Golden Age  •  Tronie  •  1665',
      period: '17th-Century Dutch Painting',
      description: 'Often called "The Mona Lisa of the North", this masterpiece is not a formal portrait but a "tronie" — a character study depicting an exotic figure in oriental dress with an impossible, luminescent teardrop pearl. Vermeer’s mastery of optical reflections and soft camera-obscura highlights produces an intimate moment caught mid-turn.',
      extra: 'Vermeer lived in Delft and produced fewer than 40 paintings in his entire lifetime. He used extremely costly natural ultramarine made from crushed Afghan lapis lazuli for the blue turban, a luxury that contributed to his family’s financial debts.',
      fact: '💡 Scientific analysis in 2020 at the Mauritshuis museum confirmed that the famous pearl is an optical illusion: painted with merely two deft brushstrokes of lead white, one representing the primary reflection and the other catching bounced collar light.',
      sdg: 'SDG 4 Connection: Illuminates Dutch scientific advances in lens-grinding, optics, and camera obscura technology, linking physics with golden-age European artistic techniques.'
    }
  });

  // Exhibit 5: Composition in Red, Blue, and Yellow (South Wall)
  createFramedPainting(scene, {
    x: -18, y: 2.8, z: -6.7, ry: 0, w: 2.4, h: 2.4,
    type: 'mondrian', title: 'Composition in Red, Blue, and Yellow', artist: 'Piet Mondrian', year: '1930',
    data: {
      title: 'Composition with Red, Blue, and Yellow',
      category: 'De Stijl  •  Neoplasticism  •  1930',
      period: 'Modern Abstract Movement',
      description: 'Mondrian stripped art of all representational distraction to seek universal balance through absolute geometric purity. Using only straight vertical and horizontal lines intersecting at 90 degrees, combined with the three primary colors (red, blue, yellow) and non-colors (white, grey, black), he created dynamic asymmetrical equilibrium.',
      extra: 'Mondrian believed this universal visual language would transcend linguistic and national barriers, fostering international harmony following the devastation of World War I. His theories directly influenced Bauhaus architecture and modern typography.',
      fact: '💡 Mondrian never used a ruler! Microscopic analysis proves he drafted every line freehand, making painstaking micro-adjustments with tape and brushes until he felt the energetic weight of each color block achieved perfection.',
      sdg: 'SDG 4 Connection: Demonstrates the foundations of graphic design, UI grid systems, and computational abstraction, essential for software design and computational thinking.'
    }
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// 2. HISTORICAL ARTIFACTS GALLERY (East Wing)
// ═════════════════════════════════════════════════════════════════════════════

function createHistoryGallery(scene) {
  // Exhibit 6: Egyptian Golden Sarcophagus
  const sarcY = createPedestal(scene, 18, 16, 0.9, 1.2);
  const sarcGroup = new THREE.Group();
  sarcGroup.position.set(18, sarcY, 16);

  // Gilded Mummy Casket Body
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xdfb135, roughness: 0.35, metalness: 0.85 });
  const lapisMat = new THREE.MeshStandardMaterial({ color: 0x143474, roughness: 0.4, metalness: 0.3 });

  const sarcBody = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.22, 1.35, 16), goldMat);
  sarcBody.rotation.x = 0;
  sarcBody.castShadow = true;
  sarcGroup.add(sarcBody);

  // Royal Nemes Headdress and Face
  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), goldMat);
  headMesh.scale.set(1.0, 1.3, 0.85);
  headMesh.position.set(0, 0.8, 0);
  sarcGroup.add(headMesh);

  // Inlaid Lapis Lazuli Ribbons
  for (let b = 0; b < 6; b++) {
    const band = new THREE.Mesh(new THREE.TorusGeometry(0.32 - b * 0.015, 0.025, 8, 24), lapisMat);
    band.rotation.x = Math.PI / 2;
    band.position.set(0, 0.45 - b * 0.18, 0);
    sarcGroup.add(band);
  }

  // Pharaonic Crook & Flail crossed over chest
  const regaliaMat = new THREE.MeshStandardMaterial({ color: 0x0099aa, metalness: 0.8, roughness: 0.3 });
  const crook = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.45, 8), regaliaMat);
  crook.rotation.z = Math.PI / 4;
  crook.position.set(-0.06, 0.4, 0.24);
  sarcGroup.add(crook);

  const flail = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.45, 8), regaliaMat);
  flail.rotation.z = -Math.PI / 4;
  flail.position.set(0.06, 0.4, 0.24);
  sarcGroup.add(flail);

  // Protective Glass Museum Vitrine
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.25,
    roughness: 0.05,
    transmission: 0.85,
    thickness: 0.5,
  });
  const vitrine = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.0, 1.0), glassMat);
  vitrine.position.set(0, 0.9, 0);
  sarcGroup.add(vitrine);

  // Slow rotation for visual inspection
  sarcGroup.userData.rotate = true;
  sarcGroup.userData.rotateSpeed = 0.25;
  scene.add(sarcGroup);

  // Overhead spotlight
  const spotSarc = new THREE.SpotLight(0xffea9f, 2.5, 6, 0.45, 0.4, 1.6);
  spotSarc.position.set(18, 5.2, 16);
  spotSarc.target = sarcBody;
  scene.add(spotSarc);
  scene.add(spotSarc.target);

  addExhibitPlaque(scene, 'Golden Sarcophagus', 'Ancient Egypt  •  c. 1332 BCE', 18, sarcY + 0.1, 14.8, 0);

  sarcBody.userData.isExhibit = true;
  sarcBody.userData.exhibitData = {
    title: 'Golden Sarcophagus of Pharaoh Tutankhamun',
    category: 'Ancient Egypt  •  18th Dynasty  •  c. 1332 BCE',
    period: 'New Kingdom Egypt',
    description: 'Discovered in 1922 by Howard Carter in the Valley of the Kings (tomb KV62), this innermost coffin contained the mummy of the boy king. Crafted from 110.4 kilograms of solid gold, it is inlaid with turquoise, carnelian, and lapis lazuli, depicting the pharaoh transformed into Osiris, god of the afterlife.',
    extra: 'The pharaoh holds the ceremonial crook (Heka) symbolizing shepherd rulership and the flail (Nekhakha) symbolizing fertility and defense. Protective wings of goddesses Isis and Nephthys embrace his torso in eternal resurrection spells from the Book of the Dead.',
    fact: '💡 When Carter first peered through a breach in the sealed tomb door with a flickering candle, Lord Carnarvon asked: "Can you see anything?" Carter famously replied: "Yes, wonderful things!"',
    sdg: 'SDG 4 Connection: 3D interactive preservation safeguards irreplaceable antiquities from war, looting, and environmental deterioration while guaranteeing global student access.'
  };
  exhibitObjects.push(sarcBody);

  // Exhibit 7: The Rosetta Stone
  const stoneY = createPedestal(scene, 18, 8, 1.0, 1.1);
  const rosettaGroup = new THREE.Group();
  rosettaGroup.position.set(18, stoneY + 0.4, 8);

  const basaltMat = new THREE.MeshStandardMaterial({
    color: 0x222225,
    roughness: 0.85,
    metalness: 0.15,
  });

  // Broken granodiorite slab geometry
  const slab = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.95, 0.18), basaltMat);
  slab.rotation.x = -0.15; // Tilted back on display stand
  slab.castShadow = true;
  rosettaGroup.add(slab);

  // Three distinct engraved text registers
  const scripts = ['HIEROGLYPHS (Sacred Script)', 'DEMOTIC (Daily Egyptian)', 'ANCIENT GREEK (Administration)'];
  scripts.forEach((scr, idx) => {
    const textCanvas = document.createElement('canvas');
    textCanvas.width = 512;
    textCanvas.height = 120;
    const tctx = textCanvas.getContext('2d');
    tctx.fillStyle = '#1c1c20';
    tctx.fillRect(0, 0, 512, 120);
    tctx.fillStyle = '#b0aba0';
    tctx.font = '16px monospace';
    for (let l = 0; l < 5; l++) {
      tctx.fillText(`|||  ...  ${scr.slice(0, 24)}  ...  |||`, 20, 24 + l * 20);
    }
    const sTex = new THREE.CanvasTexture(textCanvas);
    const sMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.66, 0.24),
      new THREE.MeshStandardMaterial({ map: sTex, roughness: 0.9 })
    );
    sMesh.position.set(0, 0.28 - idx * 0.28, 0.095);
    slab.add(sMesh);
  });

  scene.add(rosettaGroup);

  const spotStone = new THREE.SpotLight(0xfff5e0, 2.5, 6, 0.4, 0.4, 1.6);
  spotStone.position.set(18, 5.2, 8);
  spotStone.target = slab;
  scene.add(spotStone);
  scene.add(spotStone.target);

  addExhibitPlaque(scene, 'The Rosetta Stone', 'Ptolemaic Egypt  •  196 BCE', 18, stoneY + 0.1, 7.0, 0);

  slab.userData.isExhibit = true;
  slab.userData.exhibitData = {
    title: 'The Rosetta Stone',
    category: 'Ptolemaic Egypt  •  Granodiorite Stele  •  196 BCE',
    period: 'Hellenistic Ptolemaic Dynasty',
    description: 'Unearthed in 1799 near Rashid (Rosetta) by French soldiers under Napoleon Bonaparte, this stele records a royal decree by King Ptolemy V. Because the text is identical across three scripts — Hieroglyphic, Demotic, and Ancient Greek — it became the master key that unlocked ancient Egyptian writing.',
    extra: 'French philologist Jean-François Champollion deciphered the hieroglyphs in 1822 by matching the cartouches containing royal Greek names like Ptolemaios and Cleopatra with their phonetic hieroglyphic equivalents, reviving a language silent for 1,400 years.',
    fact: '💡 Today, the phrase "Rosetta Stone" is globally used as an idiom meaning the crucial key to unlocking previously incomprehensible mysteries or encrypted knowledge.',
    sdg: 'SDG 4 Connection: Illustrates historical linguistics, epigraphy, and the power of shared human communication in cross-cultural diplomacy.'
  };
  exhibitObjects.push(slab);

  // Exhibit 8: Roman Imperial Bust of Emperor Augustus
  const bustY = createPedestal(scene, 18, 0, 1.1, 0.9);
  const bustGroup = new THREE.Group();
  bustGroup.position.set(18, bustY, 0);

  const marbleMat = new THREE.MeshStandardMaterial({
    color: 0xeee8dc,
    roughness: 0.45,
    metalness: 0.08,
  });

  // Classical Draped Shoulders
  const shoulders = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.32, 0.38, 16), marbleMat);
  shoulders.position.y = 0.2;
  bustGroup.add(shoulders);

  // Sculpted Neck & Head
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 0.22, 12), marbleMat);
  neck.position.y = 0.48;
  bustGroup.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 18, 18), marbleMat);
  head.scale.set(1.0, 1.25, 1.05);
  head.position.y = 0.75;
  head.castShadow = true;
  bustGroup.add(head);

  // Augustus comma-shaped hair curls
  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.235, 16, 12, 0, Math.PI * 2, 0, Math.PI / 1.8),
    new THREE.MeshStandardMaterial({ color: 0xd8cebc, roughness: 0.6 })
  );
  hair.scale.set(1.02, 1.28, 1.08);
  hair.position.y = 0.77;
  bustGroup.add(hair);

  bustGroup.userData.rotate = true;
  bustGroup.userData.rotateSpeed = 0.2;
  scene.add(bustGroup);

  const spotBust = new THREE.SpotLight(0xfff2dc, 2.5, 6, 0.4, 0.4, 1.6);
  spotBust.position.set(18, 5.2, 0);
  spotBust.target = head;
  scene.add(spotBust);
  scene.add(spotBust.target);

  addExhibitPlaque(scene, 'Bust of Augustus', 'Roman Empire  •  c. 27 BCE', 18, bustY + 0.1, -1.0, 0);

  head.userData.isExhibit = true;
  head.userData.exhibitData = {
    title: 'Portrait Bust of Emperor Augustus',
    category: 'Roman Empire  •  Carrara Marble Sculpture  •  c. 27 BCE',
    period: 'Augustan Principate',
    description: 'Gaius Julius Caesar Octavianus became the first Emperor of Rome, ushering in the two-century "Pax Romana". Unlike earlier Republican veristic busts that highlighted wrinkles and scars, Augustus commissioned portraits that maintained ageless youth and Apollo-like grace, projecting political strength and divine sanction.',
    extra: 'His famous hairstyle features distinctive "tongs-and-comma" parted locks over the forehead. Such portrait busts were mass-reproduced in Rome and sent across provinces to serve as imperial symbols in law courts, temples, and forum squares.',
    fact: '💡 On his deathbed, Augustus famously uttered: "I found Rome a city of bricks and left it a city of marble."',
    sdg: 'SDG 4 Connection: Enhances classical history comprehension by teaching visual political iconography and marble sculpture conservation.'
  };
  exhibitObjects.push(head);

  // Exhibit 9: Norse Viking Dragon Battle Axe & Shield
  const axeY = createPedestal(scene, 18, -4, 0.9, 1.0);
  const axeGroup = new THREE.Group();
  axeGroup.position.set(18, axeY + 0.1, -4);

  const ironMat = new THREE.MeshStandardMaterial({ color: 0x666870, metalness: 0.85, roughness: 0.25 });
  const ashWoodMat = new THREE.MeshStandardMaterial({ color: 0x4a2a12, roughness: 0.85 });

  // Ash-wood Axe Handle
  const axeHaft = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.032, 0.85, 12), ashWoodMat);
  axeHaft.position.set(0, 0.42, 0);
  axeGroup.add(axeHaft);

  // Bearded Axe Head (Skeggøx)
  const axeHead = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.05, 8, 20, Math.PI * 0.85), ironMat);
  axeHead.rotation.z = Math.PI / 2.3;
  axeHead.position.set(0.12, 0.72, 0);
  axeHead.castShadow = true;
  axeGroup.add(axeHead);

  // Viking Round Shield Behind Axe
  const shieldWood = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 0.04, 24),
    new THREE.MeshStandardMaterial({ color: 0x1f3f6a, roughness: 0.7 })
  );
  shieldWood.rotation.x = Math.PI / 2;
  shieldWood.position.set(0, 0.45, -0.15);
  axeGroup.add(shieldWood);

  // Iron Shield Boss (Umbo)
  const umbo = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 12), ironMat);
  umbo.position.set(0, 0.45, -0.12);
  axeGroup.add(umbo);

  axeGroup.userData.rotate = true;
  axeGroup.userData.rotateSpeed = 0.25;
  scene.add(axeGroup);

  const spotAxe = new THREE.SpotLight(0xffe8c0, 2.5, 6, 0.45, 0.4, 1.6);
  spotAxe.position.set(18, 5.2, -4);
  spotAxe.target = axeHaft;
  scene.add(spotAxe);
  scene.add(spotAxe.target);

  addExhibitPlaque(scene, 'Viking Dragon Axe & Shield', 'Norse  •  c. 950 CE', 18, axeY + 0.1, -5.0, 0);

  axeHaft.userData.isExhibit = true;
  axeHaft.userData.exhibitData = {
    title: 'Viking Bearded Battle Axe & Round Shield',
    category: 'Norse Early Medieval  •  Pattern-Welded Iron & Ash  •  c. 950 CE',
    period: 'Viking Age Scandinavia',
    description: 'The "skeggøx" (bearded axe) was the defining weapon of Norse maritime warriors. The elongated lower cutting edge allowed the wielder to hook enemy shields in combat while retaining a lightweight, agile head for rapid cleaving. Paired with a linden-wood round shield reinforced with rawhide and an iron central umbo.',
    extra: 'Viking blacksmiths practiced pattern-welding — repeatedly folding and twisting iron billets with high-carbon steel strips to forge blades that were simultaneously razor-sharp and resilient against shattering in frigid Nordic climates.',
    fact: '💡 Contrary to 19th-century Wagnerian opera mythology, historical Vikings never wore horned helmets in battle, as horns would create dangerous leverage points easily exploited by enemy weapons.',
    sdg: 'SDG 4 Connection: Teaches early metallurgical science, marine archaeology, and debunks historical misconceptions through physical evidence.'
  };
  exhibitObjects.push(axeHaft);
}

// ═════════════════════════════════════════════════════════════════════════════
// 3. SCIENCE & TECHNOLOGY WING (South-West)
// ═════════════════════════════════════════════════════════════════════════════

function createScienceWing(scene) {
  // Exhibit 10: The Bohr Atomic Model (3D Interactive Rotating)
  const atomY = createPedestal(scene, -18, -17, 1.0, 1.2);
  const atomGroup = new THREE.Group();
  atomGroup.position.set(-18, atomY + 0.7, -17);

  // Glowing Dense Nucleus (Protons & Neutrons)
  const nucleusMat = new THREE.MeshStandardMaterial({
    color: 0xff3311,
    roughness: 0.3,
    metalness: 0.4,
    emissive: 0xaa2200,
    emissiveIntensity: 0.8,
  });
  const nucleus = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), nucleusMat);
  nucleus.castShadow = true;
  atomGroup.add(nucleus);

  // 3 Multi-Angle Electron Probability Rings
  const ringColors = [0x00d4ff, 0x00ff88, 0xffbb00];
  const ringAngles = [
    { rx: 0, ry: 0, rz: 0 },
    { rx: Math.PI / 3, ry: 0, rz: Math.PI / 4 },
    { rx: -Math.PI / 3, ry: Math.PI / 4, rz: -Math.PI / 4 },
  ];

  ringAngles.forEach((ang, idx) => {
    const ringGeo = new THREE.TorusGeometry(0.55 + idx * 0.08, 0.016, 8, 48);
    const ringMesh = new THREE.Mesh(
      ringGeo,
      new THREE.MeshStandardMaterial({
        color: ringColors[idx],
        emissive: ringColors[idx],
        emissiveIntensity: 0.6,
        roughness: 0.2,
      })
    );
    ringMesh.rotation.set(ang.rx, ang.ry, ang.rz);
    atomGroup.add(ringMesh);

    // Orbiting Electron Spheres
    const electron = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 12, 12),
      new THREE.MeshStandardMaterial({
        color: ringColors[idx],
        emissive: ringColors[idx],
        emissiveIntensity: 1.2,
      })
    );
    electron.userData.orbitCentre = new THREE.Vector3(-18, atomY + 0.7, -17);
    electron.userData.orbitRadius = 0.55 + idx * 0.08;
    electron.userData.orbitAngle = idx * (Math.PI * 2 / 3);
    electron.userData.orbitSpeed = 2.2 + idx * 0.7;
    electron.userData.orbitRotX = ang.rx;
    electron.userData.orbitRotZ = ang.rz;
    scene.add(electron);
  });

  atomGroup.userData.rotate = true;
  atomGroup.userData.rotateSpeed = 0.4;
  scene.add(atomGroup);

  const spotAtom = new THREE.SpotLight(0x70c0ff, 3.0, 7, 0.45, 0.4, 1.6);
  spotAtom.position.set(-18, 5.2, -17);
  spotAtom.target = nucleus;
  scene.add(spotAtom);
  scene.add(spotAtom.target);

  addExhibitPlaque(scene, 'Bohr Quantum Atomic Model', 'Theoretical Physics  •  1913', -18, atomY + 0.1, -18.0, 0);

  nucleus.userData.isExhibit = true;
  nucleus.userData.exhibitData = {
    title: 'The Bohr Model of the Atom',
    category: 'Quantum Physics  •  Subatomic Structure  •  1913',
    period: '20th Century Physics Revolution',
    description: 'Formulated by Danish physicist Niels Bohr, this model introduced the revolutionary concept that electrons travel only in discrete quantized orbits around the atomic nucleus without radiating energy, jumping between energy states by absorbing or emitting photons of specific frequencies.',
    extra: 'Though superseded by modern quantum mechanics and Erwin Schrödinger’s wave probability clouds (orbitals), Bohr’s quantized model successfully explained the spectral emission lines of hydrogen and earned him the 1922 Nobel Prize in Physics.',
    fact: '💡 Atoms are 99.999999999% empty space! If the atomic nucleus were enlarged to the size of a marble sitting on the 50-yard line of a stadium, the orbiting electrons would be gnats whizzing around the upper grandstand seats.',
    sdg: 'SDG 4 Connection: Spatial 3D interactive models make subatomic quantum mechanics tangible and intuitive for secondary and university physics students worldwide.'
  };
  exhibitObjects.push(nucleus);

  // Exhibit 11: DNA Double Helix (Animated 3D Twist)
  const dnaY = createPedestal(scene, -10, -17, 1.0, 1.2);
  const dnaGroup = new THREE.Group();
  dnaGroup.position.set(-10, dnaY + 0.65, -17);

  const strandMat1 = new THREE.MeshStandardMaterial({ color: 0x0066ff, emissive: 0x002288, emissiveIntensity: 0.5 });
  const strandMat2 = new THREE.MeshStandardMaterial({ color: 0xff0044, emissive: 0x880022, emissiveIntensity: 0.5 });
  const rungMat = new THREE.MeshStandardMaterial({ color: 0xffcc00, roughness: 0.4 });

  const totalSteps = 64;
  const helixH = 1.35;
  const helixR = 0.22;

  for (let i = 0; i <= totalSteps; i++) {
    const frac = i / totalSteps;
    const ang = frac * Math.PI * 4; // 2 complete turns
    const yPos = (frac - 0.5) * helixH;

    // Sugar-phosphate backbone strand A
    const sphereA = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), strandMat1);
    sphereA.position.set(Math.cos(ang) * helixR, yPos, Math.sin(ang) * helixR);
    dnaGroup.add(sphereA);

    // Complementary backbone strand B (180° offset)
    const sphereB = new THREE.Mesh(new THREE.SphereGeometry(0.032, 8, 8), strandMat2);
    sphereB.position.set(Math.cos(ang + Math.PI) * helixR, yPos, Math.sin(ang + Math.PI) * helixR);
    dnaGroup.add(sphereB);

    // Hydrogen-bonded base pairs (rung every 4 steps)
    if (i % 4 === 0) {
      const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, helixR * 2, 8), rungMat);
      rung.position.set(0, yPos, 0);
      rung.rotation.z = Math.PI / 2;
      rung.rotation.y = ang;
      dnaGroup.add(rung);
    }
  }

  dnaGroup.userData.rotate = true;
  dnaGroup.userData.rotateSpeed = 0.55;
  scene.add(dnaGroup);

  const spotDNA = new THREE.SpotLight(0x80aaff, 2.8, 7, 0.45, 0.4, 1.6);
  spotDNA.position.set(-10, 5.2, -17);
  spotDNA.target = dnaGroup;
  scene.add(spotDNA);
  scene.add(spotDNA.target);

  addExhibitPlaque(scene, 'DNA Double Helix', 'Molecular Biology  •  1953', -10, dnaY + 0.1, -18.0, 0);

  // Invisible proxy for crisp raycasting
  const dnaProxy = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.3, 1.45, 12),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  dnaProxy.position.set(-10, dnaY + 0.65, -17);
  dnaProxy.userData.isExhibit = true;
  dnaProxy.userData.exhibitData = {
    title: 'The DNA Double Helix',
    category: 'Molecular Biology  •  Genetics  •  1953',
    period: '20th Century Biological Revolution',
    description: 'Discovered in 1953 by James Watson, Francis Crick, Rosalind Franklin, and Maurice Wilkins at Cambridge. The double helix consists of two antiparallel spiraling sugar-phosphate backbones held together by hydrogen bonds between complementary nitrogenous bases: Adenine pairs with Thymine (A-T), and Guanine pairs with Cytosine (G-C).',
    extra: 'Rosalind Franklin’s critical X-ray diffraction image, "Photo 51", revealed the distinctive cross-shaped diffraction pattern of helical B-DNA. This architecture immediately revealed the mechanism of genetic replication: unzipping the two strands creates matching templates for cell division.',
    fact: '💡 If uncoiled, the DNA in a single human diploid cell measures approximately 2 meters in length. Across all 37 trillion cells in your body, your total DNA would stretch from the Sun to Pluto and back multiple times!',
    sdg: 'SDG 4 Connection: Democratizes life science education by allowing students to explore molecular genetics in interactive 3D space.'
  };
  scene.add(dnaProxy);
  exhibitObjects.push(dnaProxy);

  // Exhibit 12: VR Headset & Spatial Computing (Interactive 3D Technology)
  const vrY = createPedestal(scene, -6, -22, 1.0, 1.1);
  const vrGroup = new THREE.Group();
  vrGroup.position.set(-6, vrY + 0.35, -22);

  const plasticMat = new THREE.MeshStandardMaterial({ color: 0x181822, roughness: 0.35, metalness: 0.45 });
  const lensMat = new THREE.MeshStandardMaterial({
    color: 0x00aaff,
    roughness: 0.1,
    metalness: 0.2,
    emissive: 0x004488,
    emissiveIntensity: 0.6,
  });

  // Ergonomic Headset Visor
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.24, 0.22), plasticMat);
  visor.castShadow = true;
  vrGroup.add(visor);

  // Dual Fresnel Optical Lenses
  [-0.11, 0.11].forEach(lx => {
    const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.04, 16), lensMat);
    lens.rotation.x = Math.PI / 2;
    lens.position.set(lx, 0, 0.12);
    vrGroup.add(lens);
  });

  // Spatial Audio Headband Straps
  const strapMat = new THREE.MeshStandardMaterial({ color: 0x282835, roughness: 0.8 });
  const topStrap = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.38, 0.03), strapMat);
  topStrap.position.set(0, 0.24, -0.05);
  topStrap.rotation.x = -Math.PI / 3;
  vrGroup.add(topStrap);

  vrGroup.userData.rotate = true;
  vrGroup.userData.rotateSpeed = 0.3;
  scene.add(vrGroup);

  const spotVR = new THREE.SpotLight(0x00d4ff, 3.0, 7, 0.45, 0.4, 1.6);
  spotVR.position.set(-6, 5.2, -22);
  spotVR.target = visor;
  scene.add(spotVR);
  scene.add(spotVR.target);

  addExhibitPlaque(scene, 'Virtual Reality Headset', 'Spatial Computing  •  Modern XR', -6, vrY + 0.1, -22.8, 0);

  visor.userData.isExhibit = true;
  visor.userData.exhibitData = {
    title: 'Virtual Reality Headset & Spatial Computing',
    category: 'Human-Computer Interaction  •  Extended Reality (XR)  •  2024',
    period: 'The Spatial Computing Era',
    description: 'Modern VR headsets represent the culmination of spatial computing: integrating ultra-high-resolution stereoscopic micro-OLED displays, 6 Degrees of Freedom (6DoF) inside-out tracking, low-latency IMUs, and spatial audio to synthesize complete sensory immersion in computer-generated worlds.',
    extra: 'From Ivan Sutherland’s pioneering 1968 "Sword of Damocles" to contemporary standalone spatial headsets, VR bridges digital information directly into human spatial intuition, revolutionizing surgical simulation, aerospace engineering, and accessible distance learning.',
    fact: '💡 To prevent simulator motion sickness, modern VR displays refresh at 90Hz to 120Hz with motion-to-photon latency under 20 milliseconds — faster than the human brain’s conscious visual processing threshold!',
    sdg: 'SDG 4 Connection: Virtual Reality serves as the core medium for immersive education, proving that digital classrooms can offer experiential learning without geographical constraints.'
  };
  exhibitObjects.push(visor);
}

// ═════════════════════════════════════════════════════════════════════════════
// 4. CENTRAL ATRIUM & CENTRAL EXHIBITION HALL (Crossroads & South-East)
// ═════════════════════════════════════════════════════════════════════════════

function createCentralExhibits(scene) {
  // Exhibit 13: Planet Earth & Orbiting Satellite (Centerpiece of Central Atrium)
  const earthY = createPedestal(scene, 0, 0.5, 1.0, 1.4);
  const earthGroup = new THREE.Group();
  earthGroup.position.set(0, earthY + 0.7, 0.5);

  // High-Resolution Procedural Earth Canvas Texture
  const earthCanvas = document.createElement('canvas');
  earthCanvas.width = 1024;
  earthCanvas.height = 512;
  const ectx = earthCanvas.getContext('2d');

  // Deep Blue Oceans
  const oceanGrad = ectx.createLinearGradient(0, 0, 0, 512);
  oceanGrad.addColorStop(0, '#0a2342');
  oceanGrad.addColorStop(0.5, '#124578');
  oceanGrad.addColorStop(1, '#081d36');
  ectx.fillStyle = oceanGrad;
  ectx.fillRect(0, 0, 1024, 512);

  // Continental Landmasses (Green/Tan/Brown)
  ectx.fillStyle = '#2d6a4f';
  // Africa & Europe
  ectx.beginPath();
  ectx.ellipse(540, 260, 95, 125, 0.1, 0, Math.PI * 2);
  ectx.fill();
  ectx.fillStyle = '#40916c';
  ectx.beginPath();
  ectx.ellipse(530, 140, 75, 45, 0, 0, Math.PI * 2);
  ectx.fill();
  // Americas
  ectx.fillStyle = '#2d6a4f';
  ectx.beginPath();
  ectx.ellipse(280, 170, 70, 95, -0.3, 0, Math.PI * 2);
  ectx.ellipse(340, 330, 60, 90, 0.3, 0, Math.PI * 2);
  ectx.fill();
  // Asia & Australia
  ectx.beginPath();
  ectx.ellipse(750, 180, 140, 85, 0, 0, Math.PI * 2);
  ectx.ellipse(840, 370, 55, 45, 0, 0, Math.PI * 2);
  ectx.fill();

  // Swirling white cloud bands
  ectx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  for (let c = 0; c < 12; c++) {
    ectx.beginPath();
    ectx.ellipse(Math.random() * 1024, 80 + c * 30, 120 + Math.random() * 80, 15, Math.random() * 0.2, 0, Math.PI * 2);
    ectx.fill();
  }

  const earthTex = new THREE.CanvasTexture(earthCanvas);
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
      map: earthTex,
      roughness: 0.35,
      metalness: 0.1,
    })
  );
  globe.castShadow = true;
  earthGroup.add(globe);

  // Atmospheric Rayleigh Scattering Glow Rim
  const atmoGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.53, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0x4cc9f0,
      transparent: true,
      opacity: 0.22,
      side: THREE.BackSide,
    })
  );
  earthGroup.add(atmoGlow);

  // Orbiting Telecommunications Satellite
  const satGroup = new THREE.Group();
  const satBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.08, 0.12),
    new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 })
  );
  satGroup.add(satBody);

  // Gold Solar Panels
  const panelMat = new THREE.MeshStandardMaterial({ color: 0x1a3388, roughness: 0.2, metalness: 0.8 });
  [-0.14, 0.14].forEach(px => {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.01, 0.08), panelMat);
    panel.position.x = px;
    satGroup.add(panel);
  });

  satGroup.position.set(0.85, 0, 0);
  earthGroup.add(satGroup);

  earthGroup.userData.rotate = true;
  earthGroup.userData.rotateSpeed = 0.35;
  scene.add(earthGroup);

  const spotEarth = new THREE.SpotLight(0xffffff, 3.2, 8, 0.5, 0.4, 1.5);
  spotEarth.position.set(0, 5.5, 0.5);
  spotEarth.target = globe;
  scene.add(spotEarth);
  scene.add(spotEarth.target);

  addExhibitPlaque(scene, 'Planet Earth & Satellite', 'Geodesy & Space Science', 0, earthY + 0.1, -0.5, 0);

  globe.userData.isExhibit = true;
  globe.userData.exhibitData = {
    title: 'Planet Earth & Remote Sensing Satellite',
    category: 'Earth Science  •  Orbital Geodesy  •  Space Age',
    period: 'Contemporary Earth Observation',
    description: 'Earth is our home planet and the only known celestial body harboring life. Over 71% of its surface is covered by liquid water. Orbiting satellites in Low Earth Orbit (LEO) continuously monitor climate systems, oceanic temperatures, deforestation, and atmospheric dynamics, providing critical data for sustainable development.',
    extra: 'Earth’s active geodynamo core generates a protective magnetosphere that shields the biosphere from lethal solar wind radiation. Synthetic aperture radar (SAR) satellites can map terrain changes down to millimeter precision.',
    fact: '💡 Astronauts frequently experience the "Overview Effect" — a profound cognitive shift when viewing Earth suspended in the black void of space, feeling overwhelming unity and an urgent protective responsibility for our fragile biosphere.',
    sdg: 'SDG 4 & SDG 13 Connection: Educating future generations on planetary science and climate observation through interactive 3D digital globes.'
  };
  exhibitObjects.push(globe);

  // Exhibit 14: The Solar System Orrery (Central Exhibition Hall)
  const orreryGroup = new THREE.Group();
  orreryGroup.position.set(14, 1.2, -17);

  // Emissive Sun Core
  const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.42, 24, 24),
    new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xff6600,
      emissiveIntensity: 1.2,
      roughness: 0.6,
    })
  );
  orreryGroup.add(sunMesh);

  // Solar Corona Light
  const sunLight = new THREE.PointLight(0xffaa33, 2.8, 12, 1.5);
  orreryGroup.add(sunLight);

  // 6 Orbiting Planets with Real-Time Motion
  const planets = [
    { name: 'Mercury', dist: 0.75, r: 0.05, color: 0x9e9e9e, speed: 2.8 },
    { name: 'Venus',   dist: 1.10, r: 0.09, color: 0xe5a65d, speed: 2.0 },
    { name: 'Earth',   dist: 1.50, r: 0.10, color: 0x2266dd, speed: 1.6 },
    { name: 'Mars',    dist: 1.95, r: 0.07, color: 0xcc4422, speed: 1.2 },
    { name: 'Jupiter', dist: 2.65, r: 0.22, color: 0xc8965d, speed: 0.75 },
    { name: 'Saturn',  dist: 3.35, r: 0.18, color: 0xdfce8a, speed: 0.55 },
  ];

  planets.forEach((p, idx) => {
    // Thin gold orbital track ring
    const track = new THREE.Mesh(
      new THREE.TorusGeometry(p.dist, 0.008, 4, 64),
      new THREE.MeshBasicMaterial({ color: 0x554433, transparent: true, opacity: 0.4 })
    );
    track.rotation.x = Math.PI / 2;
    orreryGroup.add(track);

    // Planet mesh
    const planetMesh = new THREE.Mesh(
      new THREE.SphereGeometry(p.r, 16, 16),
      new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.6 })
    );
    planetMesh.castShadow = true;
    planetMesh.userData.orbitCentre = new THREE.Vector3(14, 1.2, -17);
    planetMesh.userData.orbitRadius = p.dist;
    planetMesh.userData.orbitAngle = idx * (Math.PI * 2 / planets.length);
    planetMesh.userData.orbitSpeed = p.speed * 0.45;
    planetMesh.userData.orbitInXZ = true;
    planetMesh.userData.rotate = true;
    planetMesh.userData.rotateSpeed = 0.5;
    scene.add(planetMesh);

    // Saturn's Iconic Rings
    if (p.name === 'Saturn') {
      const ringMesh = new THREE.Mesh(
        new THREE.TorusGeometry(p.r * 2.2, p.r * 0.45, 2, 32),
        new THREE.MeshStandardMaterial({ color: 0xd4c278, roughness: 0.9, side: THREE.DoubleSide })
      );
      ringMesh.rotation.x = Math.PI / 2.6;
      planetMesh.add(ringMesh);
    }
  });

  scene.add(orreryGroup);

  const spotSolar = new THREE.SpotLight(0xffeedd, 2.5, 9, 0.6, 0.4, 1.5);
  spotSolar.position.set(14, 5.5, -17);
  spotSolar.target = sunMesh;
  scene.add(spotSolar);
  scene.add(spotSolar.target);

  addExhibitPlaque(scene, 'Solar System Orrery', 'Astronomy  •  Scale Model', 14, 0.35, -20.5, 0);

  sunMesh.userData.isExhibit = true;
  sunMesh.userData.exhibitData = {
    title: 'The Solar System Orrery',
    category: 'Astronomy  •  Heliocentric Scale Model  •  Cosmology',
    period: 'Celestial Mechanics',
    description: 'This interactive orrery displays the Sun and the inner and outer planets revolving in accordance with Kepler’s Laws of Planetary Motion. The Sun contains 99.86% of the solar system’s total mass and powers all planetary weather and life through thermonuclear fusion in its core.',
    extra: 'First demonstrated mechanically by George Graham and Charles Boyle, 4th Earl of Orrery in 1704, orreries transformed public understanding from geocentric dogmas to the Copernican heliocentric universe.',
    fact: '💡 The Sun fuses 600 million tons of hydrogen into helium every second. It takes a single photon roughly 100,000 years to migrate from the core to the solar surface, but only 8 minutes and 20 seconds to reach Earth!',
    sdg: 'SDG 4 Connection: Spatial 3D simulation of celestial orbits fosters deep scientific literacy and astronomical curiosity across diverse educational backgrounds.'
  };
  exhibitObjects.push(sunMesh);

  // Exhibit 15: The Great Pyramid of Giza (Central Exhibition Hall)
  const pyrY = createPedestal(scene, 6, -17, 0.8, 1.3);
  const pyrGroup = new THREE.Group();
  pyrGroup.position.set(6, pyrY, -17);

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0xd4b886,
    roughness: 0.85,
    metalness: 0.05,
  });

  // 5 Stepped Monumental Tiers
  const tiers = [
    [1.10, 0.14, 1.10, 0.07],
    [0.90, 0.14, 0.90, 0.21],
    [0.70, 0.14, 0.70, 0.35],
    [0.50, 0.14, 0.50, 0.49],
    [0.30, 0.14, 0.30, 0.63],
  ];
  tiers.forEach(([tw, th, td, ty]) => {
    const tier = new THREE.Mesh(new THREE.BoxGeometry(tw, th, td), stoneMat);
    tier.position.y = ty;
    tier.castShadow = true;
    pyrGroup.add(tier);
  });

  // Golden Pyramidion Apex Capstone
  const apex = new THREE.Mesh(
    new THREE.ConeGeometry(0.18, 0.22, 4),
    new THREE.MeshStandardMaterial({ color: 0xdfb135, metalness: 0.9, roughness: 0.25 })
  );
  apex.position.y = 0.81;
  apex.rotation.y = Math.PI / 4;
  pyrGroup.add(apex);

  pyrGroup.userData.rotate = true;
  pyrGroup.userData.rotateSpeed = 0.2;
  scene.add(pyrGroup);

  const spotPyr = new THREE.SpotLight(0xffe0a0, 2.5, 6, 0.45, 0.4, 1.6);
  spotPyr.position.set(6, 5.2, -17);
  spotPyr.target = pyrGroup;
  scene.add(spotPyr);
  scene.add(spotPyr.target);

  addExhibitPlaque(scene, 'The Great Pyramid of Giza', 'Ancient Architecture  •  c. 2560 BCE', 6, pyrY + 0.1, -17.9, 0);

  const pyrProxy = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 1.0, 1.2),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  pyrProxy.position.set(6, pyrY + 0.45, -17);
  pyrProxy.userData.isExhibit = true;
  pyrProxy.userData.exhibitData = {
    title: 'The Great Pyramid of Khufu at Giza',
    category: 'Ancient Engineering  •  Old Kingdom Egypt  •  c. 2560 BCE',
    period: 'Fourth Dynasty of Egypt',
    description: 'The oldest and only substantially surviving wonder of the Seven Wonders of the Ancient World. Built over an estimated 27-year period as the tomb for Pharaoh Khufu, it remained the tallest man-made structure on Earth for over 3,800 years until the completion of Lincoln Cathedral in 1311 CE.',
    extra: 'Comprising approximately 2.3 million megalithic limestone and granite blocks weighing an average of 2.5 tonnes each. The pyramid is aligned to true north with an accuracy within 4 minutes of arc (1/15th of a degree), displaying astounding engineering and astronomical precision.',
    fact: '💡 Historical archaeological excavation of worker villages proved the pyramids were built not by slaves, but by a highly organized, skilled workforce of paid craftsmen and engineers provided with beer, meat rations, and medical care.',
    sdg: 'SDG 4 Connection: Bridges ancient geometry, structural architecture, and civil engineering history for students worldwide.'
  };
  scene.add(pyrProxy);
  exhibitObjects.push(pyrProxy);
}

// ─────────────────────────────────────────────────────────────────────────────
// Master Exhibit Creation Entry Point
// ─────────────────────────────────────────────────────────────────────────────
export function createAllExhibits(scene) {
  createArtGallery(scene);
  createHistoryGallery(scene);
  createScienceWing(scene);
  createCentralExhibits(scene);
  console.log(`Exhibits initialized successfully: ${exhibitObjects.length} interactive targets loaded.`);
}
