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
const groundSize = 3000;

//CAMERA
// const camera = utils.addCamera(size,'vehicle camera');

//LIGHTS
utils.addWorldLights(scene, groundSize);

//GROUND MESH
const groundMesh = utils.addGroundMesh(scene, groundSize);

//PHYSICS WORLD
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -60, 0), // m/s²
})

//WHEEL PHYSICS MATERIAL
const wheelPhysMat = new CANNON.Material();

//SPHERE BODY
const sphereBody = utils.addSphereBody(world,wheelPhysMat);
//SHPERE MESH
const sphereMesh = utils.spawnWireframeSphere(scene)


// VEHICLE
let vehicle = new Vehicle();
vehicle.addWheels(scene,wheelPhysMat);
vehicle.setupControls();
vehicle.addLights(scene);
vehicle.vehicleMesh.add(new THREE.AxesHelper(10));
vehicle.rigidVehicle.addToWorld(world);
vehicle.addCamera(size,'vehicle camera');

//GROUND PHYSICS MATERIAL
const groundPhysMat = new CANNON.Material();

//GROUND BODY
const groundBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
    material: groundPhysMat
})
groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
world.addBody(groundBody)

// 'WHEEL <-> GROUND' PHYSICS
const groundWheelContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    wheelPhysMat,
    {restitution: 0.71, 
    friction: 0.7}
);
world.addContactMaterial(groundWheelContactMat);

// 'VEHICLE <-> GROUND' PHYSICS
const groundVehicleContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    vehicle.vehicleBody.material? vehicle.vehicleBody.material : new CANNON.Material(),
    {
        restitution: 0.01,
        friction: 0.01
    }
);
world.addContactMaterial(groundVehicleContactMat);

//NON PHYSICAL ELEMENTS
//GRID HELPER
//utils.showGridHelper(scene)

//CUBE
const cube = utils.spawnWireframeCube(scene);

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

//each ANIMATION frame gets calculated
const timeStep = 1 / 60 // seconds
let lastCallTime: number;
let theta = 0;

function animate() {
    theta += 0.1;
    cube.rotation.y += 0.01 *Math.sin(theta);

    requestAnimationFrame(animate)

    //fixedStep is independent from frameRate
    // world.fixedStep(timeStep)
    
    //step depends on last call time
    //passing the time since last call
    const time = performance.now() / 1000 // seconds
    if (!lastCallTime) {
        world.step(timeStep)
    } else {
        const dt = time - lastCallTime
        world.step(timeStep, dt)
    }
    lastCallTime = time
    
    sphereBody.quaternion.z += 0.01 *Math.sin(theta);
    sphereMesh.position.copy(utils.copyVector(sphereBody.position))
    sphereMesh.quaternion.copy(utils.copyQuaternion(sphereBody.quaternion))

    //estas dos se podrian quitar si se crease el mesh con la misma orientacion que el body, la correcta (horizontal)
    groundMesh.position.copy(utils.copyVector(groundBody.position));
    groundMesh.quaternion.copy(utils.copyQuaternion(groundBody.quaternion));

    vehicle.updatePosition();

    //UPDATE HUD
    if (vehicle.shouldUpdateHUD) {
        vehicle.shouldUpdateHUD = false;
        
       Array.from(document.querySelectorAll(".numCamera")).forEach(nc=>{
        let numCamera = document.getElementById(nc.id);
        if(numCamera){
            if(parseInt(numCamera.innerHTML) != vehicle.cameraMode){
                numCamera.style.color = 'antiquewhite';
            }else{
                // numCamera.style.color = 'rgb(222 0 255)';
                numCamera.style.color = 'rgb(0 255 0)';
            }
        }
       });

    }
    render();
}

function render() {
    renderer.render(scene, vehicle.camera)
}

animate()