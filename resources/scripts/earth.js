const canvas = document.getElementById('earth-map');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2; // Position initiale de la caméra

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);

// Earth Radius
const earthRadius = 1;

// Function to Convert Lat/Lon to 3D Coordinates
function latLonToXYZ(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180); // Latitude to phi
  const theta = (lon + 180) * (Math.PI / 180); // Longitude to theta

  return {
    x: radius * Math.sin(phi) * Math.cos(theta),
    y: radius * Math.cos(phi),
    z: -radius * Math.sin(phi) * Math.sin(theta), // Invert Z-axis
  };
}

// Create a group for Earth to apply rotation
const earthGroup = new THREE.Group();
earthGroup.rotation.x = 23.5 * (Math.PI / 180); // Inclinaison de la Terre
scene.add(earthGroup);

// GeoJSON Data for Continents
const borderPoints = []; // Array to store border points

// Validate Coordinates
function validateCoordinates(lat, lon) {
  return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
}

// Load GeoJSON Data and Extract Border Points
async function loadContinents() {
  try {
    const response = await fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_coastline.geojson');
    const data = await response.json();

    const positions = [];

    // Parse GeoJSON Data
    data.features.forEach(feature => {
      const geometry = feature.geometry;
      if (geometry.type === "LineString" || geometry.type === "MultiLineString") {
        const coords = geometry.type === "LineString" ? [geometry.coordinates] : geometry.coordinates;

        coords.forEach(line => {
          for (let i = 0; i < line.length - 1; i++) {
            const [lon1, lat1] = line[i];
            const [lon2, lat2] = line[i + 1];

            if (validateCoordinates(lat1, lon1) && validateCoordinates(lat2, lon2)) {
              const point1 = latLonToXYZ(lat1, lon1, earthRadius);
              const point2 = latLonToXYZ(lat2, lon2, earthRadius);

              positions.push(point1.x, point1.y, point1.z);
              positions.push(point2.x, point2.y, point2.z);
            }
          }
        });
      }
    });

    // Create Line Geometry
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    // Line Material
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xCFC9C5 }); // Set the color of the lines

    // Create Line Segments
    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lineSegments);

    animate();
  } catch (error) {
    console.error('Error loading GeoJSON data:', error);
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);

  // Rotate the globe
  scene.rotation.y += 0.0008;
  renderer.render(scene, camera);
}

// Load Data and Start
loadContinents();

// Handle Window Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
