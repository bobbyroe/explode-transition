import * as THREE from "three";
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';
import { getTextMesh } from "./getTextMesh.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const canvas = document.getElementById('three-canvas');
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  canvas
});
renderer.setSize(w, h);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
controls.enableZoom = false;

let isExploding = false;
let wall;
const wallChunksGroup = new THREE.Group();
wallChunksGroup.visible = false;
scene.add(wallChunksGroup);
wallChunksGroup.userData.update = () => {
  const explosiveForce = 0.0005;
  wallChunksGroup.visible = true;
  wall.visible = false;
  wallChunksGroup.children.forEach((chunk) => {
    if (chunk.position.z < 8) {
      chunk.position.add(chunk.userData.velocity);
      chunk.userData.velocity.z += explosiveForce;
      chunk.rotation.x += chunk.userData.rotationRate.x;
      chunk.rotation.y += chunk.userData.rotationRate.y;
      chunk.rotation.z += chunk.userData.rotationRate.z;
    }
  });
}
const wallMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
});
const loader = new GLTFLoader();
loader.load( './assets/wallFractured.glb', (gltf) => {
    wallChunksGroup.add(...gltf.scene.children);
    wallChunksGroup.children.forEach((chunk) => {
      chunk.material = wallMat;
      chunk.userData = {
        rotationRate: new THREE.Vector3(
          Math.random() * 0.04 - 0.02,
          Math.random() * 0.04 - 0.02,
          Math.random() * 0.04 - 0.02
        ),
        velocity: new THREE.Vector3(
          Math.random() * 0.02 - 0.01,
          Math.random() * 0.02 - 0.01,
          Math.random() * 0.02 - 0.01
        ),
      };
    });
    wall = wallChunksGroup.children.find((chunk) => chunk.name === 'wall');
    wallChunksGroup.remove(wall);
    scene.add(wall);
});

const sunLight = new THREE.DirectionalLight(0xffffff, 3);
sunLight.position.set(2, 0, 5);
scene.add(sunLight);

const fillLight = new THREE.DirectionalLight(0x99aaff, 1);
fillLight.position.set(-2, 0, -5);
scene.add(fillLight);

const textMesh = await getTextMesh({ text: 'CLICK TO ENTER'});
textMesh.position.set(0, 0, 1);
scene.add(textMesh);

function animate() {
  requestAnimationFrame(animate);
  if (isExploding === true) {
    textMesh.visible = false;
    wallChunksGroup.userData.update();
  }
  renderer.render(scene, camera);
  controls.update();
}
animate();
const content = document.getElementById('container');
content.classList.add('rendered');

document.addEventListener('pointerdown', () => {
  isExploding = true;
});
function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);