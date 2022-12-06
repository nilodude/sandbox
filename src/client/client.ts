import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'dat.gui'
import * as GUIUtils from '../client/gui'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as CANNON from 'cannon-es'
import * as utils from '../client/utils'

GUIUtils.startGUI();

//CANVAS
const width = window.innerWidth;
const height = window.innerHeight;
// const size = [870, 840]; // split screen
const size = [width, height]; // fullscreen
const canvas = document.getElementById('canvasID') as HTMLCanvasElement
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(size[0], size[1])

//SCENE
const scene = new THREE.Scene()

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(ambientLight)

const spotlight = new THREE.SpotLight(0xffffff, 0.9, 0, Math.PI / 4, 1)
spotlight.position.set(10, 30, 20)
spotlight.target.position.set(0, 0, 0)

spotlight.castShadow = true

spotlight.shadow.camera.near = 10
spotlight.shadow.camera.far = 100
spotlight.shadow.camera.fov = 30

// spotlight.shadow.bias = -0.0001
spotlight.shadow.mapSize.width = 2048
spotlight.shadow.mapSize.height = 2048

scene.add(spotlight)

//GROUND MESH
const groundGeo = new THREE.PlaneGeometry(30, 30);
const groundMat = new THREE.MeshBasicMaterial({ 
	color: 0xffffff,
	side: THREE.DoubleSide,
	wireframe: true 
 });
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);


//PHYSICS WORLD
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
})
//GROUND
const groundPhysMat = new CANNON.Material();
const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
    material: groundPhysMat
})
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
world.addBody(groundBody)

//SPHERE BODY
const spherePhysMat = new CANNON.Material();
const sphereBody = new CANNON.Body({
  mass: 5, // kg
  shape: new CANNON.Sphere(1),
  position: new CANNON.Vec3(0, 10, 0),
  material: spherePhysMat
})
sphereBody.linearDamping = 0.31;
// const vehicle = new CANNON.RigidVehicle

world.addBody(sphereBody)

const groundSphereContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    spherePhysMat,
    {restitution: 0.7}
);

world.addContactMaterial(groundSphereContactMat);

// document.addEventListener('keydown', (event) => {
//     const maxSteerVal = Math.PI / 8;
//     const maxForce = 10;

//     switch (event.key) {
//       case 'w':
//       case 'ArrowUp':
//         vehicle.setWheelForce(maxForce, 0);
//         vehicle.setWheelForce(maxForce, 1);
//         break;

//       case 's':
//       case 'ArrowDown':
//         vehicle.setWheelForce(-maxForce / 2, 0);
//         vehicle.setWheelForce(-maxForce / 2, 1);
//         break;

//       case 'a':
//       case 'ArrowLeft':
//         vehicle.setSteeringValue(maxSteerVal, 0);
//         vehicle.setSteeringValue(maxSteerVal, 1);
//         break;

//       case 'd':
//       case 'ArrowRight':
//         vehicle.setSteeringValue(-maxSteerVal, 0);
//         vehicle.setSteeringValue(-maxSteerVal, 1);
//         break;
//     }
//   });

//ELEMENTS
//camera

const camera = new THREE.PerspectiveCamera(35, size[0]/size[1], 1, 1000)
camera.position.x = 0.8;
camera.position.y = 9;
camera.position.z = 25;
camera.rotation.x=-.14;
camera.rotation.y=-.04;
camera.rotation.z=0;
GUIUtils.addCameraFolder(camera);

//grid
const gridHelper = new THREE.GridHelper(400, 100, 0x0000ff, 0x808080);
gridHelper.position.y = 0;
gridHelper.position.x = 0;
//scene.add(gridHelper);

//cube
const cube = GUIUtils.getWireframeCube()
cube.position.x = 2;
cube.position.y = 3;
cube.position.z = 1;
cube.add(new THREE.AxesHelper(5))
scene.add(cube)

//sphere
const sphere = GUIUtils.getWireframeSphere()
sphere.position.x = -2;
sphere.position.y = 0.5;
sphere.add(new THREE.AxesHelper(5))
scene.add(sphere)


//ermono
const objLoader = new OBJLoader();
  objLoader.load('models/mono.obj', (monkey) => {
    
    monkey.position.x = 0;
    monkey.position.y = 0;
    monkey.position.z = 0;
    // root.scale.x *= 5
    // root.scale.y *= 5
    // root.scale.z *= 5
    monkey.add(new THREE.AxesHelper(5))
    scene.add(monkey);
}); 

new OrbitControls(camera, renderer.domElement);

//each animation frame gets calculated
const timeStep = 1 / 60 // seconds
let lastCallTime: number;
let theta = 0;
function animate() {
    requestAnimationFrame(animate)
    theta += 0.1;
    cube.rotation.y += 0.01 *Math.sin(theta);

    //fixedStep is independent from frameRate
    world.fixedStep()

    //passing the time since last call
    // const time = performance.now() / 1000 // seconds
    // if (!lastCallTime) {
    //     world.step(timeStep)
    // } else {
    //     const dt = time - lastCallTime
    //     world.step(timeStep, dt)
    // }
    // lastCallTime = time

    sphereBody.quaternion.z += 0.01 *Math.sin(theta);
    sphere.position.copy(utils.copyVector(sphereBody.position))
    sphere.quaternion.copy(utils.copyQuaternion(sphereBody.quaternion))

    groundMesh.position.copy(utils.copyVector(groundBody.position));
    groundMesh.quaternion.copy(utils.copyQuaternion(groundBody.quaternion));

    console.log(`Sphere y position: ${sphereBody.position.y}`)

    render();
}

function render() {
    renderer.render(scene, camera)
}

animate()