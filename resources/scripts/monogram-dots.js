const canvas = document.getElementById('threejs-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 80; // Position initiale de la caméra

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

// PointsMaterial pour les points du cube
const material = new THREE.PointsMaterial({
  color: 0x1F1C1A,
  size: 0.3,
  transparent: false,
  alphaTest: 0.5,
  depthWrite: false,
});

// Variables pour le cube
let geometry;
let pointCloud;
const gridSize = 12; // Taille de la grille en X, Y et Z
const spacing = 5; // Espacement entre les points
let velocities = []; // Stocker les vitesses des points

// Variables pour l'effet de souris
let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();
const mouseInfluenceRadius = 20;
const mouseForce = 15;

// Variables pour la caméra
const defaultCameraZ = 80; // Position par défaut pour la section "hero"
let initialCameraZ = defaultCameraZ;
let mainScrollActive = false; // Indique si le scroll influence la caméra
let scrollStartPosition = 0; // Scroll de départ
let inHero = false; // Indique si nous sommes dans la section "hero"

// Fonction pour créer un cube de points
function createCube() {
  geometry = new THREE.BufferGeometry();
  const vertices = [];
  const initialPositions = [];
  velocities = [];

  for (let z = 0; z < gridSize; z++) {
    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const posX = x * spacing - ((gridSize - 1) * spacing) / 2;
        const posY = y * spacing - ((gridSize - 1) * spacing) / 2;
        const posZ = z * spacing - ((gridSize - 1) * spacing) / 2;

        vertices.push(posX, posY, posZ);
        initialPositions.push(posX, posY, posZ);
        velocities.push(0, 0, 0);
      }
    }
  }

  const verticesArray = new Float32Array(vertices);
  geometry.setAttribute('position', new THREE.BufferAttribute(verticesArray, 3));
  geometry.initialPositions = new Float32Array(initialPositions);
  geometry.velocities = new Float32Array(velocities);

  pointCloud = new THREE.Points(geometry, material);
  scene.add(pointCloud);
}

// Créer le cube
createCube();

// Fonction pour gérer le mouvement de la souris
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Fonction pour ajuster dynamiquement la caméra selon le scroll
function updateCameraFromScroll() {
  if (mainScrollActive) {
    const scrollPosition = window.scrollY - scrollStartPosition;
    const scrollFactor = 0.025; // Ajustez ce facteur si nécessaire
    camera.position.z = initialCameraZ + scrollPosition * scrollFactor;
  }
}

// Fonction pour réinitialiser la caméra dans la section "hero"
function resetCameraForHero() {
  camera.position.z = defaultCameraZ;
}

// Gestion des transitions entre sections
const heroSection = document.querySelector('#hero');
const mainSection = document.querySelector('main');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.target === heroSection) {
        inHero = entry.isIntersecting;
        if (inHero) {
          resetCameraForHero(); // Réinitialiser la caméra à la position par défaut
          mainScrollActive = false; // Désactiver l'effet de scroll
        }
      } else if (entry.target === mainSection) {
        mainScrollActive = entry.isIntersecting;
        if (mainScrollActive) {
          initialCameraZ = camera.position.z; // Fixer la position de départ pour le scroll
          scrollStartPosition = window.scrollY;
        }
      }
    });
  },
  { threshold: 0.2 } // Déclenche à 50% de visibilité
);

// Observer les sections
observer.observe(heroSection);
observer.observe(mainSection);

// Fonction pour perturber les points sous l'influence de la souris
function disturbPoints() {
  const positions = geometry.attributes.position.array;
  const initialPositions = geometry.initialPositions;
  const velocities = geometry.velocities;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(pointCloud);

  if (intersects.length > 0) {
    const point = intersects[0].point;

    for (let i = 0; i < positions.length; i += 3) {
      const dx = positions[i] - point.x;
      const dy = positions[i + 1] - point.y;
      const dz = positions[i + 2] - point.z;

      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (distance < mouseInfluenceRadius) {
        const force = (mouseInfluenceRadius - distance) / mouseInfluenceRadius * mouseForce;

        velocities[i] += (dx / distance) * force;
        velocities[i + 1] += (dy / distance) * force;
        velocities[i + 2] += (dz / distance) * force;
      }
    }
  }

  for (let i = 0; i < positions.length; i += 3) {
    const dx = initialPositions[i] - positions[i];
    const dy = initialPositions[i + 1] - positions[i + 1];
    const dz = initialPositions[i + 2] - positions[i + 2];

    const springForce = 0.02;

    velocities[i] += dx * springForce;
    velocities[i + 1] += dy * springForce;
    velocities[i + 2] += dz * springForce;

    const damping = 0.8;
    velocities[i] *= damping;
    velocities[i + 1] *= damping;
    velocities[i + 2] *= damping;

    positions[i] += velocities[i];
    positions[i + 1] += velocities[i + 1];
    positions[i + 2] += velocities[i + 2];
  }

  geometry.attributes.position.needsUpdate = true;
}

// Fonction principale d'animation
function animate() {
  requestAnimationFrame(animate);

  if (mainScrollActive) {
    updateCameraFromScroll();
  }

  disturbPoints();

  if (pointCloud) {
    pointCloud.rotation.x += 0.002;
    pointCloud.rotation.y += 0.002;
  }

  renderer.render(scene, camera);
}

// Gestion du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Lancer l'animation
animate();





