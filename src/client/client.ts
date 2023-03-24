import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as GUIUtils from '../client/gui'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as CANNON from 'cannon-es'
import * as utils from '../client/utils'
import { Vehicle } from '../client/vehicle'

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
const groundSize = 1000;

//CAMERA
const camera = utils.addCamera(size);

//LIGHTS
utils.addWorldLights(scene, groundSize);

//GROUND MESH
const groundMesh = utils.addGroundMesh(scene, groundSize);

//PHYSICS WORLD
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -50, 0), // m/s²
})
//GROUND BODY
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
  mass: 2, // kg
  shape: new CANNON.Sphere(1),
  position: new CANNON.Vec3(8, 10, 0),
  material: spherePhysMat
})
sphereBody.linearDamping = 0.31;
sphereBody.angularDamping = 0.8;

world.addBody(sphereBody);

// VEHICLE
let vehicle = new Vehicle();
vehicle.addWheels(scene,spherePhysMat);
vehicle.setupControls(camera);
vehicle.addLights(scene);
vehicle.vehicleMesh.add(new THREE.AxesHelper(10));
vehicle.rigidVehicle.addToWorld(world);

const groundSphereContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    spherePhysMat,
    {restitution: 0.01, 
    friction: 0.7}
);
world.addContactMaterial(groundSphereContactMat);

//ELEMENTS
//GRID HELPER
//utils.showGridHelper(scene)

//CUBE
const cube = utils.spawnWireframeCube(scene);

//SHPERE MESH
const sphereMesh = utils.spawnWireframeSphere(scene)

//MONO
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


//new OrbitControls(camera, renderer.domElement);
world.broadphase = new CANNON.NaiveBroadphase(); // Detect coilliding objects

const clock = new THREE.Clock();
//each ANIMATION frame gets calculated
const timeStep = 1 / 60 // seconds
let lastCallTime: number;
let theta = 0;

function animate() {
    theta += 0.1;
    cube.rotation.y += 0.01 *Math.sin(theta);

    //fixedStep is independent from frameRate
    world.fixedStep(timeStep)
    requestAnimationFrame(animate)
    //passing the time since last call
    {// const time = performance.now() / 1000 // seconds
    // if (!lastCallTime) {
    //     world.step(timeStep)
    // } else {
    //     const dt = time - lastCallTime
    //     world.step(timeStep, dt)
    // }
    // lastCallTime = time
    // controls.update(dt)
    }

    sphereBody.quaternion.z += 0.01 *Math.sin(theta);

    //ROTATE VEHICLE WITH MOUSEX AND MOUSEY

    sphereMesh.position.copy(utils.copyVector(sphereBody.position))
    sphereMesh.quaternion.copy(utils.copyQuaternion(sphereBody.quaternion))

    //estas dos se podrian quitar si se crease el mesh con la misma orientacion que el body, la correcta (horizontal)
    groundMesh.position.copy(utils.copyVector(groundBody.position));
    groundMesh.quaternion.copy(utils.copyQuaternion(groundBody.quaternion));

    vehicle.vehicleMesh.position.copy(utils.copyVector(vehicle.vehicleBody.position));
    vehicle.vehicleMesh.quaternion.copy(utils.copyQuaternion(vehicle.vehicleBody.quaternion));
    
    vehicle.wheels.forEach(wheel=>{
        wheel.mesh.position.copy(utils.copyVector(wheel.body.position));
        wheel.mesh.quaternion.copy(utils.copyQuaternion(wheel.body.quaternion));
    });

    vehicle.avgSpeed = (vehicle.rigidVehicle.getWheelSpeed(2) +vehicle.rigidVehicle.getWheelSpeed(3))/2

    vehicle.air = !vehicle.wheels.map(wheel=>wheel.body.position.y).some(pos=>pos < 1.0)
    
    camera.lookAt(vehicle.vehicleMesh.position)
    // gridHelper.position.x += -(vehicleBody.velocity.x/2) * timeStep
    // gridHelper.position.z += -(vehicleBody.velocity.z/2) * timeStep

    // gridHelper.position.x = (gridHelper.position.x) % 40
    // gridHelper.position.z = (gridHelper.position.z) % 80
    
    render();
}

function render() {
    renderer.render(scene, camera)
}

animate()