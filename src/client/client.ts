import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as GUIUtils from '../client/gui'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as CANNON from 'cannon-es'
import * as utils from '../client/utils'
import { Vehicle } from '../client/vehicle'
import { Ground } from './ground';
import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect';

GUIUtils.startGUI();

//CANVAS
const width = window.innerWidth;
const height = window.innerHeight;
// const size = [870, 840]; // split screen
const size = [width, height]; // fullscreen
const canvas = document.getElementById('canvasID') as HTMLCanvasElement
const renderer = new THREE.WebGLRenderer({ canvas: canvas }) // se le quita el canvas para ver solo ascii
renderer.setSize(width, height)

//SCENE
const scene = new THREE.Scene()
const groundSize = 3000;
//LIGHTS
utils.addWorldLights(scene, groundSize);

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


document.addEventListener('keydown',(event)=>{
    
    if( event.key == 'Enter'){

    }
})
let initialPos = new CANNON.Vec3( 220, -100, 0)
// VEHICLE
let vehicle = new Vehicle({
    cameraMode : 3,
    initialPosition: initialPos,
    meshGeometry: new THREE.BoxGeometry(8, 1, 16),
    meshMaterial: new THREE.MeshPhysicalMaterial({ 
        color: 0xaaaaaa,
        side: THREE.FrontSide,
        wireframe: false,
        roughness: 0.01,
        metalness: 0.9,
        reflectivity: 1,
        clearcoat:1,
        clearcoatRoughness: 0.01
    }),
    // vehicleMesh: await utils.loadVehicleMesh() as THREE.Mesh<THREE.BufferGeometry, THREE.Material>,    
    axisWidth : 9,
    axisLength : 6,
    vehicleBody: new CANNON.Body({
        mass: 50,
        position: initialPos,
        shape: new CANNON.Box(new CANNON.Vec3(4, 0.5, 8)),
        material:  new CANNON.Material({ friction: 2, restitution: 0.9 }) 
    }),
    wheelRadius : 2,
    wheelColors: [
        new THREE.Color(0, 0, 1),
        new THREE.Color(0, 1, 0),
        new THREE.Color(1, 0, 0),
        new THREE.Color(1, 1, 0),
    ]}
);
// vehicle.loadMesh();
console.log(vehicle)
vehicle.addWheels(scene,wheelPhysMat);
vehicle.setupControls();
vehicle.addLights(scene);
vehicle.vehicleMesh.add(new THREE.AxesHelper(10));
vehicle.rigidVehicle.addToWorld(world);
vehicle.addCamera(size,'vehicle camera');

const ground = new Ground();
ground.setupGround(scene, world, groundSize, wheelPhysMat,vehicle);

const cube = utils.spawnWireframeCube(scene);

//new OrbitControls(camera, renderer.domElement);

world.broadphase = new CANNON.NaiveBroadphase(); // Detect coilliding objects

//each ANIMATION frame gets calculated
const timeStep = 1 / 60 // seconds
let lastCallTime: number;
let theta = 0;

// renderer.setClearColor(0xfff0f0); //cambiando esto se consigue manipular el contraste

let effect = new AsciiEffect(renderer);
effect.setSize(width,height);

// let container = document.createElement('div');
// document.body.appendChild(container);
// container.appendChild(effect.domElement);
// vehicle.vehicleBody.position.x = 50+groundSize/8
// vehicle.vehicleBody.position.y = 50+groundSize/8

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

    ground.update();

    
    if(vehicle){
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
    }
    render();
}

function render() {
    effect.render(scene, vehicle.camera);
    // renderer.render(scene, vehicle.camera)
}

animate()