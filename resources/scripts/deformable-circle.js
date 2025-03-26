const canvas = document.getElementById('deformable-circle');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 0); // transparent

// POINT CLOUD SETUP
const radius = 2.5;
const pointCount = 10000;
const positions = [];
const originalPositions = [];
const velocities = [];

const material = new THREE.PointsMaterial({
  color: 0x1f1c1a,
  size: 0.02,
  sizeAttenuation: true,
});

for (let i = 0; i < pointCount; i++) {
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(THREE.MathUtils.lerp(-1, 1, Math.pow(Math.random(), 0.25))); // + densité sur X-Y

  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);

  positions.push(x, y, z);
  originalPositions.push(x, y, z);
  velocities.push(0, 0, 0);
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
const points = new THREE.Points(geometry, material);
scene.add(points);

// SOURIS
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

function animate() {
  requestAnimationFrame(animate);
  const pos = geometry.attributes.position.array;

  // Souris projetée dans le plan Z = 0
  const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5).unproject(camera);
  const dir = vector.sub(camera.position).normalize();
  const distance = -camera.position.z / dir.z;
  const hit = camera.position.clone().add(dir.multiplyScalar(distance));

  const influence = 2;

  for (let i = 0; i < pos.length; i += 3) {
    const dx = pos[i] - hit.x;
    const dy = pos[i + 1] - hit.y;
    const dz = pos[i + 2] - hit.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist > 0 && dist < influence) {
      const normalized = dist / influence;
      const softness = 1 - Math.pow(normalized, 3); // force douce
      const force = softness * 0.1;

      const angleXY = Math.atan2(dy, dx);
      const angleZ = dz / dist;

      velocities[i] += Math.cos(angleXY) * force;
      velocities[i + 1] += Math.sin(angleXY) * force;
      velocities[i + 2] += angleZ * force;
    }

    // Recentrage + inertia
    const ox = originalPositions[i];
    const oy = originalPositions[i + 1];
    const oz = originalPositions[i + 2];

    const ddx = ox - pos[i];
    const ddy = oy - pos[i + 1];
    const ddz = oz - pos[i + 2];

    velocities[i] += ddx * 0.01;
    velocities[i + 1] += ddy * 0.01;
    velocities[i + 2] += ddz * 0.01;

    velocities[i] *= 0.7;
    velocities[i + 1] *= 0.7;
    velocities[i + 2] *= 0.7;

    pos[i] += velocities[i];
    pos[i + 1] += velocities[i + 1];
    pos[i + 2] += velocities[i + 2];
  }

  geometry.attributes.position.needsUpdate = true;
  points.rotation.y += 0.0012;
  points.rotation.x += 0.0004;

  camera.position.z += (scrollTargetZ - camera.position.z) * 0.005;

  renderer.render(scene, camera);
}

let scrollTargetZ = camera.position.z;

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const scrollFactor = 0.005; // Sensibilité du recul
  scrollTargetZ = 8 + scrollY * scrollFactor;
});


animate();
