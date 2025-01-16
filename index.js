import * as THREE from "three";
import { GLTFLoader } from 'jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const w = window.innerWidth;
const h = window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 2;
scene.add(camera);
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setSize(w, h);
renderer.setClearColor(0xffffff);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const loader = new GLTFLoader();
let morphMesh;
let modelLoaded = false;
loader.load('./Model.glb', (gltf) => {
    morphMesh = gltf.scene.getObjectByProperty('type', 'Mesh');
    if (morphMesh && morphMesh.morphTargetInfluences) {
        scene.add(morphMesh);
        modelLoaded = true;
    } else {
        console.error('No morph targets found!');
    }
});

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x00000f);
scene.add(hemiLight);

const slider1 = createSlider(20);
const slider2 = createSlider(40);
const slider3 = createSlider(60);

let lastSliderValues = [0, 0, 0];
function animate() {
    requestAnimationFrame(animate);

    if (!modelLoaded) return; // No hacer nada si el modelo aún no se ha cargado

    const newValues = [
        parseFloat(slider1.value),
        parseFloat(slider2.value),
        parseFloat(slider3.value),
    ];

    if (newValues[0] !== lastSliderValues[0] || newValues[1] !== lastSliderValues[1] || newValues[2] !== lastSliderValues[2]) {
        if (morphMesh && morphMesh.morphTargetInfluences) {
            for (let i = 0; i < newValues.length; i++) {
                if (i < morphMesh.morphTargetInfluences.length) {
                    morphMesh.morphTargetInfluences[i] = newValues[i];
                }
            }
        }
        lastSliderValues = newValues;
    }

    renderer.render(scene, camera);
    controls.update();
}
renderer.setAnimationLoop(animate);

function createSlider(bottom) {
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 1;
    slider.step = 0.01;
    slider.value = 0;
    slider.style.position = 'absolute';
    slider.style.bottom = `${bottom}px`;
    slider.style.left = '20px';
    slider.style.width = '200px';
    document.body.appendChild(slider);
    return slider;
}
