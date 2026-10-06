import * as THREE from 'three';
import { shapedMountainHeight, shapedMountainSample, TERRAIN_SAMPLE_SPACING, TERRAIN_GENERATOR_VERSION } from '../core/terrain';
import { BOUNDARY_WALL_HEIGHT, BOUNDARY_WALL_THICKNESS, worldBounds, type World } from '../core/world';

export function mountWorld(canvas: HTMLCanvasElement, world: World): { draw: () => void; dispose: () => void } {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const { width, depth } = worldBounds(world);
  const span = Math.max(width, depth);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#bdd4d6');
  scene.fog = new THREE.Fog('#bdd4d6', span, span * 2.5);
  scene.add(new THREE.HemisphereLight(0xe7f2ff, 0x475539, 2.5));
  const sun = new THREE.DirectionalLight(0xffebce, 2.5); sun.position.set(width / 2 - span, span * 1.2, depth / 2 - span * .2); sun.target.position.set(width / 2, 0, depth / 2);
  sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -span, right: span, top: span, bottom: -span, near: 1, far: span * 4 });
  sun.shadow.normalBias = 0.05; scene.add(sun, sun.target);
  const camera = new THREE.PerspectiveCamera(70, 1, .1, span * 4);
  camera.position.set(world.player.x, world.player.eyeHeight, world.player.z);
  camera.lookAt(world.player.x + Math.sin(world.player.heading), world.player.eyeHeight, world.player.z - Math.cos(world.player.heading));
  const resources: Array<THREE.BufferGeometry | THREE.Material> = [];
  const groundGeometry = new THREE.PlaneGeometry(world.cellSize, world.cellSize);
  groundGeometry.rotateX(-Math.PI / 2);
  const groundMaterial = new THREE.MeshLambertMaterial({ color: '#a3b47e' });
  // Ground only covers passages; a full-map plane would hide terrain below road level.
  world.cells.forEach((row, z) => [...row].forEach((cell, x) => {
    if (cell !== 'o') return;
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.set((x + .5) * world.cellSize, 0, (z + .5) * world.cellSize);
    ground.receiveShadow = true; scene.add(ground);
  }));
  resources.push(groundGeometry, groundMaterial);
  const rock = new THREE.MeshLambertMaterial({ color: '#78877b', flatShading: true }); resources.push(rock);
  const mountainMaterial = new THREE.MeshLambertMaterial({ vertexColors: true }); resources.push(mountainMaterial);
  world.cells.forEach((row, z) => [...row].forEach((cell, x) => {
    if (cell !== 'x') return;
    const n = Math.ceil(world.cellSize / TERRAIN_SAMPLE_SPACING), vertices: number[] = [], indices: number[] = [], colors: number[] = [];
    for (let iz = 0; iz <= n; iz++) for (let ix = 0; ix <= n; ix++) {
      const px = (x + ix / n) * world.cellSize, pz = (z + iz / n) * world.cellSize;
      const sample = shapedMountainSample(world, px, pz);
      vertices.push(px, sample.height, pz);
      const color = new THREE.Color(sample.surface === 'grass' ? '#819469' : sample.surface === 'highRock' ? '#b1b3a3' : '#808a7d');
      colors.push(color.r, color.g, color.b);
    }
    for (let iz = 0; iz < n; iz++) for (let ix = 0; ix < n; ix++) {
      const a = iz * (n + 1) + ix, b = a + 1, c = a + n + 1, d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
    // Exposed cliffs stop at exactly the same cell edges as collision.
    const edges = [
      { neighbor: world.cells[z - 1]?.[x], points: Array.from({length:n+1},(_,i)=>i) },
      { neighbor: world.cells[z + 1]?.[x], points: Array.from({length:n+1},(_,i)=>n*(n+1)+i) },
      { neighbor: world.cells[z]?.[x - 1], points: Array.from({length:n+1},(_,i)=>i*(n+1)) },
      { neighbor: world.cells[z]?.[x + 1], points: Array.from({length:n+1},(_,i)=>i*(n+1)+n) },
    ];
    const cliff = new THREE.Color('#737c70');
    for (const edge of edges) {
      if (edge.neighbor === 'x') continue;
      for (let i=0;i<n;i++) {
        const a=edge.points[i], b=edge.points[i+1], c=vertices.length/3;
        // Separate cliff vertices keep the top normals smooth across cell boundaries.
        vertices.push(vertices[a*3],vertices[a*3+1],vertices[a*3+2],vertices[b*3],vertices[b*3+1],vertices[b*3+2],
          vertices[a*3],0,vertices[a*3+2],vertices[b*3],0,vertices[b*3+2]);
        for (let j = 0; j < 4; j++) colors.push(cliff.r, cliff.g, cliff.b);
        indices.push(c,c+1,c+2,c+1,c+3,c+2,c+1,c,c+2,c+3,c+1,c+2);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3)); geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices); geometry.computeVertexNormals();
    // Shared derivatives give identical top normals on neighboring cell edges.
    const normals = geometry.getAttribute('normal');
    for (let i = 0; i < (n + 1) * (n + 1); i++) {
      const px = vertices[i * 3], pz = vertices[i * 3 + 2], epsilon = 0.25;
      const hx = shapedMountainHeight(world, px + epsilon, pz) - shapedMountainHeight(world, px - epsilon, pz);
      const hz = shapedMountainHeight(world, px, pz + epsilon) - shapedMountainHeight(world, px, pz - epsilon);
      const normal = new THREE.Vector3(-hx / (2 * epsilon), 1, -hz / (2 * epsilon)).normalize();
      normals.setXYZ(i, normal.x, normal.y, normal.z);
    }
    const mountain = new THREE.Mesh(geometry, mountainMaterial);
    mountain.castShadow = true; mountain.receiveShadow = true; scene.add(mountain); resources.push(geometry);
  }));
  const horizontal = new THREE.BoxGeometry(width, BOUNDARY_WALL_HEIGHT, BOUNDARY_WALL_THICKNESS);
  const vertical = new THREE.BoxGeometry(BOUNDARY_WALL_THICKNESS, BOUNDARY_WALL_HEIGHT, depth);
  resources.push(horizontal, vertical);
  for (const z of [0, depth]) {
    const wall = new THREE.Mesh(horizontal, rock);
    wall.position.set(width / 2, BOUNDARY_WALL_HEIGHT / 2, z); wall.castShadow = true; wall.receiveShadow = true; scene.add(wall);
  }
  for (const x of [0, width]) {
    const wall = new THREE.Mesh(vertical, rock);
    wall.position.set(x, BOUNDARY_WALL_HEIGHT / 2, depth / 2); wall.castShadow = true; wall.receiveShadow = true; scene.add(wall);
  }
  const draw = () => {
    const {width,height}=canvas.getBoundingClientRect(); if (!width || !height) return;
    camera.position.set(world.player.x, world.player.eyeHeight, world.player.z);
    camera.lookAt(world.player.x + Math.sin(world.player.heading), world.player.eyeHeight, world.player.z - Math.cos(world.player.heading));
    renderer.setSize(width,height,false); camera.aspect=width/height; camera.updateProjectionMatrix(); renderer.render(scene,camera);
    canvas.dataset.player=JSON.stringify(world.player); canvas.dataset.ready='true'; canvas.dataset.cells=JSON.stringify(world.cells);
    canvas.dataset.seed=String(world.seed); canvas.dataset.generatorVersion=String(TERRAIN_GENERATOR_VERSION);
  };
  const observer=new ResizeObserver(draw); observer.observe(canvas); draw();
  return { draw, dispose: () => { observer.disconnect(); resources.forEach(resource=>resource.dispose()); renderer.dispose(); } };
}
