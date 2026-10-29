/**
 * museum.js – Complete architectural construction of the Virtual Museum
 *
 * Distinct Connected Wings:
 *  1. Main Lobby (Grand Entrance, Directory, Welcome Feature)
 *  2. Central Atrium (Connecting Hub, Earth & Satellite Showcase, SDG 4 Wall)
 *  3. Art Gallery (Classical hardwood parquet, framed master paintings, spotlights)
 *  4. Historical Artifacts Gallery (Travertine stone, pedestals, ancient relics)
 *  5. Science & Technology Wing (High-tech floor, Atom model, DNA helix, VR tech)
 *  6. Central Exhibition Hall (Solar System Orrery, Great Pyramid)
 *
 * All textures (marble, parquet, travertine, signs) are procedurally generated
 * via HTML5 Canvas API – 100% self-contained, CORS-free, and instantly loaded!
 */

import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────────────────────
// Gallery Zone Definitions (for HUD indicator & transition banners)
// ─────────────────────────────────────────────────────────────────────────────
export const GALLERY_ZONES = [
  { name: 'Main Lobby',                   xMin: -10, xMax:  10, zMin:   8, zMax:  22 },
  { name: 'Central Atrium',               xMin: -10, xMax:  10, zMin:  -7, zMax:   8 },
  { name: 'Art Gallery',                  xMin: -26, xMax: -10, zMin:  -7, zMax:  23 },
  { name: 'Historical Artifacts Gallery', xMin:  10, xMax:  26, zMin:  -7, zMax:  23 },
  { name: 'Science & Technology Wing',    xMin: -26, xMax:   0, zMin: -27, zMax:  -7 },
  { name: 'Central Exhibition Hall',      xMin:   0, xMax:  26, zMin: -27, zMax:  -7 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Procedural Canvas Texture Generators
// ─────────────────────────────────────────────────────────────────────────────

// 1. Polished Marble Tile with Subtle Veining
function createMarbleTexture(isDark = false) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = isDark ? '#14121a' : '#eae5d8';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle marble veins
  const veinColor = isDark ? 'rgba(80, 70, 95, 0.25)' : 'rgba(180, 170, 155, 0.35)';
  ctx.strokeStyle = veinColor;
  ctx.lineWidth = 3;
  for (let i = 0; i < 24; i++) {
    ctx.beginPath();
    let x = Math.random() * 1024;
    let y = Math.random() * 1024;
    ctx.moveTo(x, y);
    for (let j = 0; j < 6; j++) {
      x += (Math.random() - 0.5) * 220;
      y += (Math.random() - 0.3) * 220;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Tile grid lines (4x4 tiles per 1024px)
  ctx.strokeStyle = isDark ? 'rgba(201, 168, 76, 0.2)' : 'rgba(150, 140, 125, 0.4)';
  ctx.lineWidth = 4;
  for (let k = 0; k <= 1024; k += 256) {
    ctx.beginPath(); ctx.moveTo(k, 0); ctx.lineTo(k, 1024); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, k); ctx.lineTo(1024, k); ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// 2. Hardwood Parquet Herringbone Texture (Art Gallery)
function createParquetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Base warm wood tone
  ctx.fillStyle = '#3a2312';
  ctx.fillRect(0, 0, 512, 512);

  const plankW = 64;
  const plankH = 16;
  const woodTones = ['#452b16', '#3e2614', '#4b3019', '#351f0f', '#52341b'];

  for (let y = 0; y < 512; y += plankH) {
    for (let x = 0; x < 512; x += plankW) {
      ctx.fillStyle = woodTones[(x / plankW + y / plankH) % woodTones.length];
      ctx.fillRect(x + 1, y + 1, plankW - 2, plankH - 2);

      // Fine grain lines
      ctx.strokeStyle = 'rgba(20, 10, 5, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x + 5, y + 8);
      ctx.lineTo(x + plankW - 5, y + 8);
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// 3. Ancient Travertine Stone Tile Texture (History Gallery)
function createStoneTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#bfae95';
  ctx.fillRect(0, 0, 512, 512);

  // Noise / porous stone flecks
  for (let i = 0; i < 1500; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(70, 60, 45, 0.15)' : 'rgba(240, 230, 210, 0.2)';
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }

  // 2x2 large stone slabs
  ctx.strokeStyle = 'rgba(75, 60, 45, 0.45)';
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, 508, 508);
  ctx.beginPath(); ctx.moveTo(256, 0); ctx.lineTo(256, 512); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 256); ctx.lineTo(512, 256); ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// 4. High-Tech Grid Tile (Science & Tech Wing)
function createTechFloorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#10141f';
  ctx.fillRect(0, 0, 512, 512);

  // Subtle grid with cyan glow seams
  ctx.strokeStyle = 'rgba(60, 130, 200, 0.35)';
  ctx.lineWidth = 2;
  for (let i = 0; i <= 512; i += 64) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
  }

  // Corner tech markers
  ctx.fillStyle = 'rgba(80, 180, 255, 0.6)';
  for (let x = 64; x < 512; x += 128) {
    for (let y = 64; y < 512; y += 128) {
      ctx.fillRect(x - 3, y - 3, 6, 6);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

// ─────────────────────────────────────────────────────────────────────────────
// Museum Materials Collection
// ─────────────────────────────────────────────────────────────────────────────
function makeMaterials() {
  const marbleTex = createMarbleTexture(false);
  marbleTex.repeat.set(4, 4);

  const darkMarbleTex = createMarbleTexture(true);
  darkMarbleTex.repeat.set(4, 4);

  const parquetTex = createParquetTexture();
  parquetTex.repeat.set(8, 12);

  const stoneTex = createStoneTexture();
  stoneTex.repeat.set(6, 8);

  const techTex = createTechFloorTexture();
  techTex.repeat.set(8, 8);

  return {
    floorLobby: new THREE.MeshStandardMaterial({
      map: marbleTex,
      roughness: 0.2,
      metalness: 0.1,
    }),
    floorAtrium: new THREE.MeshStandardMaterial({
      map: marbleTex,
      roughness: 0.18,
      metalness: 0.12,
    }),
    floorArt: new THREE.MeshStandardMaterial({
      map: parquetTex,
      roughness: 0.35,
      metalness: 0.05,
    }),
    floorHistory: new THREE.MeshStandardMaterial({
      map: stoneTex,
      roughness: 0.55,
      metalness: 0.05,
    }),
    floorScience: new THREE.MeshStandardMaterial({
      map: techTex,
      roughness: 0.28,
      metalness: 0.25,
    }),
    floorCentral: new THREE.MeshStandardMaterial({
      map: darkMarbleTex,
      roughness: 0.22,
      metalness: 0.15,
    }),
    // Museum Wall Materials
    wallLobby: new THREE.MeshStandardMaterial({
      color: 0xf5f0e4,
      roughness: 0.85,
      metalness: 0.02,
    }),
    wallArt: new THREE.MeshStandardMaterial({
      color: 0x181722, // Rich dark dramatic gallery wall
      roughness: 0.8,
      metalness: 0.05,
    }),
    wallHistory: new THREE.MeshStandardMaterial({
      color: 0x221e1a, // Ancient terracotta/stone dark accent
      roughness: 0.85,
      metalness: 0.05,
    }),
    wallScience: new THREE.MeshStandardMaterial({
      color: 0x0f1524, // High-tech deep navy blue
      roughness: 0.75,
      metalness: 0.1,
    }),
    wallCentral: new THREE.MeshStandardMaterial({
      color: 0x161420, // Cosmic dark purple/grey
      roughness: 0.8,
      metalness: 0.05,
    }),
    // Architectural Trims & Accents
    ceiling: new THREE.MeshStandardMaterial({
      color: 0xf4eee2,
      roughness: 0.95,
      metalness: 0.0,
    }),
    trimGold: new THREE.MeshStandardMaterial({
      color: 0xc9a84c,
      roughness: 0.35,
      metalness: 0.75,
    }),
    skirtingBoard: new THREE.MeshStandardMaterial({
      color: 0x15121c,
      roughness: 0.5,
      metalness: 0.3,
    }),
    pillarStone: new THREE.MeshStandardMaterial({
      color: 0xe6e0d0,
      roughness: 0.45,
      metalness: 0.1,
    }),
    pedestalMat: new THREE.MeshStandardMaterial({
      color: 0x1e1a29,
      roughness: 0.4,
      metalness: 0.3,
    }),
    benchLeather: new THREE.MeshStandardMaterial({
      color: 0x4a2a16,
      roughness: 0.6,
      metalness: 0.05,
    }),
    benchMetal: new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      roughness: 0.3,
      metalness: 0.8,
    }),
    brassStanchion: new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.25,
      metalness: 0.85,
    }),
    velvetRope: new THREE.MeshStandardMaterial({
      color: 0x990012,
      roughness: 0.9,
    }),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Architectural Mesh Helpers
// ─────────────────────────────────────────────────────────────────────────────

function createBox(w, h, d, mat, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function createCylinder(rt, rb, h, seg, mat, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

// Fluted Classical Pillar with Capital and Base
function createPillar(scene, x, z, h, mat) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);

  // Plinth (Base Block)
  const plinth = createBox(0.9, 0.25, 0.9, mat.skirtingBoard, 0, 0.125, 0);
  group.add(plinth);

  // Molded Torus Base
  const baseRing = createBox(0.8, 0.15, 0.8, mat.pillarStone, 0, 0.325, 0);
  group.add(baseRing);

  // Fluted Shaft
  const shaft = createCylinder(0.28, 0.32, h - 0.8, 16, mat.pillarStone, 0, (h - 0.8) / 2 + 0.4, 0);
  group.add(shaft);

  // Capital (Top)
  const neck = createCylinder(0.35, 0.28, 0.15, 16, mat.trimGold, 0, h - 0.325, 0);
  group.add(neck);

  const abacus = createBox(0.85, 0.2, 0.85, mat.trimGold, 0, h - 0.1, 0);
  group.add(abacus);

  scene.add(group);
}

// Archway Surround with Gold Crown
function createArchway(scene, x, z, width, height, thickness, isXAxis, mat) {
  const archGroup = new THREE.Group();
  archGroup.position.set(x, 0, z);

  const halfW = width / 2;
  const pillarW = 0.5;

  if (isXAxis) {
    // Archway spanning across X (opening faces Z)
    // Left post
    archGroup.add(createBox(pillarW, height, thickness, mat.trimGold, -halfW - pillarW / 2, height / 2, 0));
    // Right post
    archGroup.add(createBox(pillarW, height, thickness, mat.trimGold, halfW + pillarW / 2, height / 2, 0));
    // Header lintel
    archGroup.add(createBox(width + pillarW * 2, 0.6, thickness * 1.2, mat.trimGold, 0, height + 0.3, 0));
  } else {
    // Archway spanning across Z (opening faces X)
    // Front post
    archGroup.add(createBox(thickness, height, pillarW, mat.trimGold, 0, height / 2, -halfW - pillarW / 2));
    // Back post
    archGroup.add(createBox(thickness, height, pillarW, mat.trimGold, 0, height / 2, halfW + pillarW / 2));
    // Header lintel
    archGroup.add(createBox(thickness * 1.2, 0.6, width + pillarW * 2, mat.trimGold, 0, height + 0.3, 0));
  }

  scene.add(archGroup);
}

// Museum Upholstered Leather Bench
function createBench(scene, x, z, ry = 0, mat) {
  const bench = new THREE.Group();
  bench.position.set(x, 0, z);
  bench.rotation.y = ry;

  // Leather seat cushion
  const seat = createBox(2.2, 0.18, 0.7, mat.benchLeather, 0, 0.55, 0);
  bench.add(seat);

  // Brass/dark metal frame and legs
  const leg1 = createBox(0.06, 0.46, 0.6, mat.benchMetal, -0.9, 0.23, 0);
  const leg2 = createBox(0.06, 0.46, 0.6, mat.benchMetal, 0.9, 0.23, 0);
  const support = createBox(1.8, 0.04, 0.06, mat.benchMetal, 0, 0.2, 0);
  bench.add(leg1);
  bench.add(leg2);
  bench.add(support);

  scene.add(bench);
}

// Velvet Stanchion Barrier (protective museum rope)
function createStanchionBarrier(scene, x, z, length, isXAxis, mat) {
  const barrier = new THREE.Group();
  barrier.position.set(x, 0, z);

  const post1 = createCylinder(0.03, 0.03, 0.9, 8, mat.brassStanchion, -length / 2, 0.45, 0);
  const post2 = createCylinder(0.03, 0.03, 0.9, 8, mat.brassStanchion, length / 2, 0.45, 0);
  const base1 = createCylinder(0.15, 0.15, 0.04, 12, mat.brassStanchion, -length / 2, 0.02, 0);
  const base2 = createCylinder(0.15, 0.15, 0.04, 12, mat.brassStanchion, length / 2, 0.02, 0);

  // Velvet draped rope
  const rope = createBox(length, 0.03, 0.03, mat.velvetRope, 0, 0.75, 0);

  barrier.add(post1); barrier.add(post2);
  barrier.add(base1); barrier.add(base2);
  barrier.add(rope);

  if (!isXAxis) barrier.rotation.y = Math.PI / 2;
  scene.add(barrier);
}

// Directional Signboard
function createDirectionSign(scene, lines, x, z, ry, mat) {
  const group = new THREE.Group();
  group.position.set(x, 0, z);
  group.rotation.y = ry;

  // Sturdy brass post
  const post = createCylinder(0.04, 0.05, 1.9, 8, mat.trimGold, 0, 0.95, 0);
  const base = createCylinder(0.25, 0.25, 0.05, 16, mat.skirtingBoard, 0, 0.025, 0);
  group.add(post);
  group.add(base);

  // Sign canvas
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0f0d1a';
  ctx.fillRect(0, 0, 512, 256);

  ctx.strokeStyle = '#c9a84c';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, 500, 244);

  ctx.fillStyle = '#c9a84c';
  ctx.font = 'bold 30px "Playfair Display", Georgia, serif';
  ctx.textAlign = 'center';
  ctx.fillText(lines[0], 256, 70);

  ctx.fillStyle = '#f0ead8';
  ctx.font = '22px "Inter", sans-serif';
  ctx.fillText(lines[1], 256, 130);

  if (lines[2]) {
    ctx.fillStyle = '#9e9683';
    ctx.font = 'italic 18px "Inter", sans-serif';
    ctx.fillText(lines[2], 256, 185);
  }

  const tex = new THREE.CanvasTexture(canvas);
  const board = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.7), new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide }));
  board.position.set(0, 1.9, 0);
  group.add(board);

  scene.add(group);
}

// ─────────────────────────────────────────────────────────────────────────────
// Build Museum Environment
// ─────────────────────────────────────────────────────────────────────────────
export function buildMuseum(scene) {
  const mat = makeMaterials();
  const wallH = 6.0;   // Height of all gallery walls
  const wallT = 0.45;  // Solid structural wall thickness

  // ═══════════════════════════════════════════════════════════════════════════
  // 1. LIGHTING SETUP – Cinematic Gallery Illumination
  // ═══════════════════════════════════════════════════════════════════════════

  // Ambient Fill Light
  const ambient = new THREE.AmbientLight(0xfff7e8, 0.38);
  scene.add(ambient);

  // Hemisphere Light (Sky cool blue, Ground warm marble bounce)
  const hemi = new THREE.HemisphereLight(0x7c8cb8, 0x3d3020, 0.3);
  scene.add(hemi);

  // Directional Sunlight pouring through Skylight
  const sunLight = new THREE.DirectionalLight(0xfffaea, 0.75);
  sunLight.position.set(6, 16, 8);
  sunLight.castShadow = true;
  sunLight.shadow.mapSize.set(1024, 1024);
  sunLight.shadow.camera.near = 1;
  sunLight.shadow.camera.far = 70;
  sunLight.shadow.camera.left = -32;
  sunLight.shadow.camera.right = 32;
  sunLight.shadow.camera.top = 32;
  sunLight.shadow.camera.bottom = -32;
  sunLight.shadow.bias = -0.0005;
  scene.add(sunLight);

  // Gallery Wing Characteristic Point Lights (atmospheric glows)
  const zonePointLights = [
    // Main Lobby
    { x:  0, y: 4.8, z:  15, color: 0xfff6dd, intensity: 1.5, dist: 22 },
    // Central Atrium
    { x:  0, y: 4.8, z:   0, color: 0xfff8e8, intensity: 1.6, dist: 24 },
    // Art Gallery (Warm classical gallery feel)
    { x: -18, y: 4.2, z:  14, color: 0xffecc0, intensity: 1.3, dist: 18 },
    { x: -18, y: 4.2, z:   0, color: 0xffecc0, intensity: 1.3, dist: 18 },
    // Historical Artifacts (Rich golden museum tone)
    { x:  18, y: 4.2, z:  14, color: 0xffe4b0, intensity: 1.3, dist: 18 },
    { x:  18, y: 4.2, z:   0, color: 0xffe4b0, intensity: 1.3, dist: 18 },
    // Science & Tech Wing (Cybernetic cyan / blue glow)
    { x: -14, y: 4.5, z: -17, color: 0x90d4ff, intensity: 1.5, dist: 22 },
    // Central Exhibition Hall (Celestial violet / pure white)
    { x:  14, y: 4.5, z: -17, color: 0xe0dcff, intensity: 1.5, dist: 22 },
  ];

  zonePointLights.forEach(pl => {
    const light = new THREE.PointLight(pl.color, pl.intensity, pl.dist, 1.4);
    light.position.set(pl.x, pl.y, pl.z);
    scene.add(light);
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // 2. FLOORS – Seamless Architectural Sections
  // ═══════════════════════════════════════════════════════════════════════════

  // Main Lobby Floor
  scene.add(createBox(20, 0.2, 14, mat.floorLobby, 0, -0.1, 15));

  // Central Atrium Floor
  scene.add(createBox(20, 0.2, 15, mat.floorAtrium, 0, -0.1, 0.5));

  // Art Gallery Floor (Hardwood Parquet)
  scene.add(createBox(16, 0.2, 30, mat.floorArt, -18, -0.1, 8));

  // History Gallery Floor (Ancient Travertine)
  scene.add(createBox(16, 0.2, 30, mat.floorHistory, 18, -0.1, 8));

  // Science & Technology Wing Floor (High-Tech Grid)
  scene.add(createBox(24, 0.2, 20, mat.floorScience, -14, -0.1, -17));

  // Central Exhibition Hall Floor (Celestial Marble)
  scene.add(createBox(24, 0.2, 20, mat.floorCentral, 14, -0.1, -17));

  // ═══════════════════════════════════════════════════════════════════════════
  // 3. WALLS & DOORWAYS – Seamless Interconnected Floorplan
  // ═══════════════════════════════════════════════════════════════════════════

  // --- A. EXTERIOR BOUNDARY WALLS ---
  // North Outer Walls
  scene.add(createBox(20, wallH, wallT, mat.wallLobby, 0, wallH / 2, 22 + wallT / 2));     // Lobby North (Entrance)
  scene.add(createBox(16, wallH, wallT, mat.wallArt, -18, wallH / 2, 23 + wallT / 2));     // Art North
  scene.add(createBox(16, wallH, wallT, mat.wallHistory, 18, wallH / 2, 23 + wallT / 2));  // History North

  // West Outer Walls
  scene.add(createBox(wallT, wallH, 30, mat.wallArt, -26 - wallT / 2, wallH / 2, 8));     // Art West
  scene.add(createBox(wallT, wallH, 20, mat.wallScience, -26 - wallT / 2, wallH / 2, -17));// Science West

  // East Outer Walls
  scene.add(createBox(wallT, wallH, 30, mat.wallHistory, 26 + wallT / 2, wallH / 2, 8));   // History East
  scene.add(createBox(wallT, wallH, 20, mat.wallCentral, 26 + wallT / 2, wallH / 2, -17)); // Central Hall East

  // South Outer Walls (Back of Museum)
  scene.add(createBox(24, wallH, wallT, mat.wallScience, -14, wallH / 2, -27 - wallT / 2)); // Science South
  scene.add(createBox(24, wallH, wallT, mat.wallCentral, 14, wallH / 2, -27 - wallT / 2));  // Central Hall South

  // --- B. INTERIOR PARTITION WALLS & ARCHWAYS ---

  // 1. Divider Wall at x = -10 (Between Lobby/Atrium and Art Gallery)
  // Segments:
  // - North section (z: 18 to 22, length 4)
  scene.add(createBox(wallT, wallH, 4, mat.wallLobby, -10, wallH / 2, 20));
  // Archway 1: Lobby -> Art Gallery (z: 12 to 18, 6m wide opening)
  createArchway(scene, -10, 15, 6, 4.2, wallT, false, mat);
  // - Middle section (z: 5 to 12, length 7)
  scene.add(createBox(wallT, wallH, 7, mat.wallLobby, -10, wallH / 2, 8.5));
  // Archway 2: Central Atrium -> Art Gallery (z: -1 to 5, 6m wide opening)
  createArchway(scene, -10, 2, 6, 4.2, wallT, false, mat);
  // - South section (z: -7 to -1, length 6)
  scene.add(createBox(wallT, wallH, 6, mat.wallLobby, -10, wallH / 2, -4));

  // 2. Divider Wall at x = 10 (Between Lobby/Atrium and History Gallery)
  // Segments:
  // - North section (z: 18 to 22, length 4)
  scene.add(createBox(wallT, wallH, 4, mat.wallLobby, 10, wallH / 2, 20));
  // Archway 1: Lobby -> History Gallery (z: 12 to 18, 6m wide opening)
  createArchway(scene, 10, 15, 6, 4.2, wallT, false, mat);
  // - Middle section (z: 5 to 12, length 7)
  scene.add(createBox(wallT, wallH, 7, mat.wallLobby, 10, wallH / 2, 8.5));
  // Archway 2: Central Atrium -> History Gallery (z: -1 to 5, 6m wide opening)
  createArchway(scene, 10, 2, 6, 4.2, wallT, false, mat);
  // - South section (z: -7 to -1, length 6)
  scene.add(createBox(wallT, wallH, 6, mat.wallLobby, 10, wallH / 2, -4));

  // 3. Divider Wall at z = 8 (Between Lobby and Central Atrium)
  // Wide open colonnade passage in center (x: -6 to 6 is open, 12m wide!)
  // Left wing partition (x: -10 to -6, width 4)
  scene.add(createBox(4, wallH, wallT, mat.wallLobby, -8, wallH / 2, 8));
  // Right wing partition (x: 6 to 10, width 4)
  scene.add(createBox(4, wallH, wallT, mat.wallLobby, 8, wallH / 2, 8));
  // Overhead decorative arch lintel across center opening
  scene.add(createBox(12, 0.8, wallT * 1.2, mat.trimGold, 0, wallH - 0.4, 8));

  // 4. Divider Wall at z = -7 (Between Front Wings and Back Wings)
  // - Art to Science passage (x: -20 to -16 open, 4m wide)
  scene.add(createBox(6, wallH, wallT, mat.wallArt, -23, wallH / 2, -7)); // x: -26 to -20
  createArchway(scene, -18, -7, 4, 4.0, wallT, true, mat);
  scene.add(createBox(6, wallH, wallT, mat.wallArt, -13, wallH / 2, -7)); // x: -16 to -10

  // - Central Atrium to Science Wing passage (x: -8 to -2 open, 6m wide)
  scene.add(createBox(2, wallH, wallT, mat.wallCentral, -9, wallH / 2, -7));
  createArchway(scene, -5, -7, 6, 4.2, wallT, true, mat);
  scene.add(createBox(4, wallH, wallT, mat.wallCentral, 0, wallH / 2, -7)); // Center column

  // - Central Atrium to Central Exhibition Hall passage (x: 2 to 8 open, 6m wide)
  createArchway(scene, 5, -7, 6, 4.2, wallT, true, mat);
  scene.add(createBox(2, wallH, wallT, mat.wallCentral, 9, wallH / 2, -7));

  // - History to Central Exhibition passage (x: 16 to 20 open, 4m wide)
  scene.add(createBox(6, wallH, wallT, mat.wallHistory, 13, wallH / 2, -7));
  createArchway(scene, 18, -7, 4, 4.0, wallT, true, mat);
  scene.add(createBox(6, wallH, wallT, mat.wallHistory, 23, wallH / 2, -7));

  // 5. Dividing Wall at x = 0 (Between Science Wing and Central Exhibition Hall)
  // Wall from z: -27 to -7, with a grand archway at z: -19 to -13 (6m wide opening)
  scene.add(createBox(wallT, wallH, 8, mat.wallScience, 0, wallH / 2, -23)); // z: -27 to -19
  createArchway(scene, 0, -16, 6, 4.2, wallT, false, mat);
  scene.add(createBox(wallT, wallH, 6, mat.wallScience, 0, wallH / 2, -10)); // z: -13 to -7

  // ═══════════════════════════════════════════════════════════════════════════
  // 4. CEILINGS & SKYLIGHTS
  // ═══════════════════════════════════════════════════════════════════════════
  const ceilY = wallH + 0.15;

  // Lobby Ceiling (with central recessed opening for skylight glow)
  scene.add(createBox(20, 0.3, 14, mat.ceiling, 0, ceilY, 15));
  // Central Atrium Ceiling
  scene.add(createBox(20, 0.3, 15, mat.ceiling, 0, ceilY, 0.5));
  // Art Gallery Ceiling
  scene.add(createBox(16, 0.3, 30, mat.ceiling, -18, ceilY, 8));
  // History Gallery Ceiling
  scene.add(createBox(16, 0.3, 30, mat.ceiling, 18, ceilY, 8));
  // Science Wing Ceiling
  scene.add(createBox(24, 0.3, 20, mat.ceiling, -14, ceilY, -17));
  // Central Exhibition Hall Ceiling
  scene.add(createBox(24, 0.3, 20, mat.ceiling, 14, ceilY, -17));

  // ═══════════════════════════════════════════════════════════════════════════
  // 5. ARCHITECTURAL PILLARS & COLONNADES
  // ═══════════════════════════════════════════════════════════════════════════

  // Colonnade around the Lobby/Atrium boundary
  const colonnadePositions = [
    [-6, 8], [6, 8],
    [-6, 1], [6, 1],
    [-6, -6], [6, -6],
  ];
  colonnadePositions.forEach(([px, pz]) => {
    createPillar(scene, px, pz, wallH, mat);
  });

  // Pillars flanking the grand wing archways
  createPillar(scene, -9.5, 18.2, wallH, mat);
  createPillar(scene, -9.5, 11.8, wallH, mat);
  createPillar(scene,  9.5, 18.2, wallH, mat);
  createPillar(scene,  9.5, 11.8, wallH, mat);

  // ═══════════════════════════════════════════════════════════════════════════
  // 6. MUSEUM BENCHES & FURNITURE
  // ═══════════════════════════════════════════════════════════════════════════

  // Lobby Benches
  createBench(scene, -4, 18, 0, mat);
  createBench(scene,  4, 18, 0, mat);

  // Art Gallery Viewing Benches
  createBench(scene, -18, 14, Math.PI / 2, mat);
  createBench(scene, -18, 2,  Math.PI / 2, mat);

  // History Gallery Viewing Benches
  createBench(scene, 18, 14, -Math.PI / 2, mat);
  createBench(scene, 18, 2,  -Math.PI / 2, mat);

  // Science Wing Modern Bench
  createBench(scene, -14, -10, 0, mat);

  // Central Exhibition Hall Bench
  createBench(scene, 14, -10, 0, mat);

  // ═══════════════════════════════════════════════════════════════════════════
  // 7. DIRECTIONAL SIGNAGE & DIRECTORY BOARDS
  // ═══════════════════════════════════════════════════════════════════════════

  // Central Hub Directory (Atrium Crossroads)
  createDirectionSign(scene, ['ART GALLERY', '← WEST WING', 'Classical Masterpieces'], -5, 5, 0, mat);
  createDirectionSign(scene, ['HISTORY GALLERY', 'EAST WING →', 'Antiquities & Relics'], 5, 5, 0, mat);
  createDirectionSign(scene, ['SCIENCE & TECH', '↓ SOUTH-WEST', 'Physics, DNA & VR'], -5, -4, 0, mat);
  createDirectionSign(scene, ['EXHIBITION HALL', 'SOUTH-EAST ↓', 'Solar System & Pyramids'], 5, -4, 0, mat);

  // ═══════════════════════════════════════════════════════════════════════════
  // 8. GRAND LOBBY WELCOME WALL & SDG 4 EDUCATIONAL DISPLAY
  // ═══════════════════════════════════════════════════════════════════════════

  // Grand Entrance Board on Lobby North Wall
  const lobbyBannerCanvas = document.createElement('canvas');
  lobbyBannerCanvas.width = 1024;
  lobbyBannerCanvas.height = 320;
  const lbctx = lobbyBannerCanvas.getContext('2d');

  lbctx.fillStyle = '#0d0b18';
  lbctx.fillRect(0, 0, 1024, 320);

  lbctx.strokeStyle = '#c9a84c';
  lbctx.lineWidth = 8;
  lbctx.strokeRect(10, 10, 1004, 300);

  lbctx.fillStyle = '#c9a84c';
  lbctx.font = 'bold 44px "Playfair Display", Georgia, serif';
  lbctx.textAlign = 'center';
  lbctx.fillText('VIRTUAL REALITY MUSEUM', 512, 85);

  lbctx.fillStyle = '#f0ead8';
  lbctx.font = '28px "Inter", sans-serif';
  lbctx.fillText('Explore  •  Learn  •  Experience', 512, 145);

  lbctx.fillStyle = '#9e9683';
  lbctx.font = '20px "Inter", sans-serif';
  lbctx.fillText('WASD: Walk  |  Mouse: Look  |  E / Click: Inspect Exhibit  |  ESC: Pause', 512, 210);

  lbctx.fillStyle = '#c9a84c';
  lbctx.font = 'italic 18px "Inter", sans-serif';
  lbctx.fillText('Foundations of Virtual Reality  •  CIAP Academic Project', 512, 265);

  const lobbyBannerTex = new THREE.CanvasTexture(lobbyBannerCanvas);
  const lobbyBannerMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(8.0, 2.5),
    new THREE.MeshStandardMaterial({ map: lobbyBannerTex, roughness: 0.5 })
  );
  lobbyBannerMesh.position.set(0, 3.2, 21.9);
  lobbyBannerMesh.rotation.y = Math.PI;
  scene.add(lobbyBannerMesh);

  // SDG 4 Quality Education Feature Board in Central Atrium
  const sdgCanvas = document.createElement('canvas');
  sdgCanvas.width = 1024;
  sdgCanvas.height = 512;
  const sctx = sdgCanvas.getContext('2d');

  sctx.fillStyle = '#0b1e16';
  sctx.fillRect(0, 0, 1024, 512);

  sctx.strokeStyle = '#27ae60';
  sctx.lineWidth = 8;
  sctx.strokeRect(10, 10, 1004, 492);

  sctx.fillStyle = '#2ecc71';
  sctx.font = 'bold 38px "Playfair Display", Georgia, serif';
  sctx.textAlign = 'center';
  sctx.fillText('UNITED NATIONS SDG 4: QUALITY EDUCATION', 512, 75);

  sctx.fillStyle = '#f0ead8';
  sctx.font = '24px "Inter", sans-serif';
  sctx.fillText('"Ensure inclusive and equitable quality education and promote', 512, 140);
  sctx.fillText('lifelong learning opportunities for all."', 512, 180);

  sctx.fillStyle = '#a8e6cf';
  sctx.font = '20px "Inter", sans-serif';
  sctx.fillText('🎓 Digital Twin & VR Accessibility: Breaking Geographical Barriers', 512, 250);
  sctx.fillText('🏛️ Cultural Preservation: Democratizing Artifacts for Every Student', 512, 295);
  sctx.fillText('🔬 Interactive Discovery: Active Spatial Exploration Boosts Retention', 512, 340);
  sctx.fillText('🌍 Zero Cost & Travel: Sustainable, Global Lifelong Learning Access', 512, 385);

  sctx.fillStyle = '#f39c12';
  sctx.font = 'italic 20px "Inter", sans-serif';
  sctx.fillText('Virtual Reality as an Engine for Democratic & Equitable Education', 512, 450);

  const sdgTex = new THREE.CanvasTexture(sdgCanvas);
  const sdgMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(6.5, 3.2),
    new THREE.MeshStandardMaterial({ map: sdgTex, roughness: 0.4 })
  );
  sdgMesh.position.set(0, 2.8, -6.8);
  scene.add(sdgMesh);

  // Warm spotlight highlighting the SDG board
  const sdgSpot = new THREE.SpotLight(0xaaffcc, 2.0, 12, 0.6, 0.4, 1.5);
  sdgSpot.position.set(0, 5.5, -3.5);
  sdgSpot.target = sdgMesh;
  scene.add(sdgSpot);
  scene.add(sdgSpot.target);
}
