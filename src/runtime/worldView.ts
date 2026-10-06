import * as THREE from 'three';
import { terrainHeight, type World } from '../core/world';

export function mountWorld(canvas: HTMLCanvasElement, world: World): { draw: () => void; dispose: () => void } {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#bdd4d6');
  scene.fog = new THREE.Fog('#bdd4d6', 30, 85);
  scene.add(new THREE.HemisphereLight(0xe7f2ff, 0x475539, 2.5));
  const sun = new THREE.DirectionalLight(0xffebce, 2.5); sun.position.set(-15, 25, 10); scene.add(sun);
  const camera = new THREE.PerspectiveCamera(70, 1, .1, 150);
  camera.position.set(world.player.x, world.player.eyeHeight, world.player.z);
  camera.lookAt(world.player.x + Math.sin(world.player.heading), world.player.eyeHeight, world.player.z - Math.cos(world.player.heading));
  const resources: Array<THREE.BufferGeometry | THREE.Material> = [];
  const groundGeometry = new THREE.PlaneGeometry(30, 30);
  groundGeometry.rotateX(-Math.PI / 2);
  const groundMaterial = new THREE.MeshLambertMaterial({ color: '#a3b47e' });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial); ground.position.set(15, 0, 15); scene.add(ground);
  resources.push(groundGeometry, groundMaterial);
  const rock = new THREE.MeshLambertMaterial({ color: '#78877b', flatShading: true }); resources.push(rock);
  world.cells.forEach((row, z) => [...row].forEach((cell, x) => {
    if (cell !== 'x') return;
    const n = 6, vertices: number[] = [], indices: number[] = [];
    for (let iz = 0; iz <= n; iz++) for (let ix = 0; ix <= n; ix++) {
      const px = (x + ix / n) * world.cellSize, pz = (z + iz / n) * world.cellSize;
      // Use the interior side of the boundary so the entire blocked cell is raised.
      const sampleX = Math.min((x + 1) * world.cellSize - .0001, px);
      const sampleZ = Math.min((z + 1) * world.cellSize - .0001, pz);
      vertices.push(px, terrainHeight(world, sampleX, sampleZ), pz);
    }
    for (let iz = 0; iz < n; iz++) for (let ix = 0; ix < n; ix++) {
      const a = iz * (n + 1) + ix, b = a + 1, c = a + n + 1, d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
    // Vertical skirts connect the raised terrain to the ground along all edges.
    for (const edge of [Array.from({length:n+1},(_,i)=>i), Array.from({length:n+1},(_,i)=>n*(n+1)+i), Array.from({length:n+1},(_,i)=>i*(n+1)), Array.from({length:n+1},(_,i)=>i*(n+1)+n)]) {
      for (let i=0;i<n;i++) {
        const a=edge[i], b=edge[i+1], c=vertices.length/3;
        vertices.push(vertices[a*3],0,vertices[a*3+2],vertices[b*3],0,vertices[b*3+2]);
        indices.push(a,b,c,b,c+1,c, b,a,c,c+1,b,c);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3)); geometry.setIndex(indices); geometry.computeVertexNormals();
    scene.add(new THREE.Mesh(geometry, rock)); resources.push(geometry);
  }));
  // Visible end boundaries, matching the movement stop distance.
  const endGeometry = new THREE.BoxGeometry(10, 3, .3); resources.push(endGeometry);
  for (const z of [0,30]) { const end = new THREE.Mesh(endGeometry, rock); end.position.set(15,1.5,z); scene.add(end); }
  const draw = () => {
    const {width,height}=canvas.getBoundingClientRect(); if (!width || !height) return;
    camera.position.set(world.player.x, world.player.eyeHeight, world.player.z);
    camera.lookAt(world.player.x + Math.sin(world.player.heading), world.player.eyeHeight, world.player.z - Math.cos(world.player.heading));
    renderer.setSize(width,height,false); camera.aspect=width/height; camera.updateProjectionMatrix(); renderer.render(scene,camera);
    canvas.dataset.player=JSON.stringify(world.player); canvas.dataset.ready='true';
  };
  const observer=new ResizeObserver(draw); observer.observe(canvas); draw();
  return { draw, dispose: () => { observer.disconnect(); resources.forEach(resource=>resource.dispose()); renderer.dispose(); } };
}
