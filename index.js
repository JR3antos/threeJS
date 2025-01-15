import * as THREE from 'three';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';
const scene = new THREE.Scene();
const w = window.innerWidth;
const h = window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
scene.add(camera);
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls( camera, renderer.domElement );

const boxGeo = new THREE.BoxGeometry(1,1,1);
const boxMat = new THREE.MeshStandardMaterial({
  color: 0x0000ff,
});
const box = new THREE.Mesh(boxGeo, boxMat);
scene.add(box);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x00000f);
scene.add(hemiLight);

function animate(){
  requestAnimationFrame(animate);
  box.rotation.y += 0.0001;
  box.rotation.z += 0.0001;
  controls.update();
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);