import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'dat.gui'
import * as GUIUtils from '../client/gui'
GUIUtils.startGUI();

//CANVAS
const width = window.innerWidth;
const height = window.innerHeight;
// const size = [870, 840]; // split screen
const size = [1740, 825]; // fullscreen
const canvas = document.getElementById('canvasID') as HTMLCanvasElement
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(size[0], size[1])

//SCENE
const scene = new THREE.Scene()
scene.add(new THREE.AxesHelper(20))

//ELEMENTS
//camera
const camera = new THREE.PerspectiveCamera(45, size[0]/size[1], 1, 100)
camera.position.x = 0.8;
camera.position.y = 4.9;
camera.position.z = 10;
camera.rotation.x=-.27;
camera.rotation.y=-.04;
camera.rotation.z=0;
GUIUtils.addCameraFolder(camera);

//grid
const gridHelper = new THREE.GridHelper(400, 100, 0x0000ff, 0x808080);
gridHelper.position.y = 0;
gridHelper.position.x = 0;
scene.add(gridHelper);

//cube
const cube = GUIUtils.getWireframeCube()
cube.position.y = 0.5;
scene.add(cube)
GUIUtils.addCubeFolder(cube);

//each animation frame gets calculated
let theta = 0;
function animate() {
    requestAnimationFrame(animate)
    theta += 0.1;
    cube.rotation.y += 0.01 *Math.sin(theta)
    render()
}

function render() {
    renderer.render(scene, camera)
}

animate()