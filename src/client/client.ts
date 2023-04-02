import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as GUIUtils from '../client/gui'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import * as CANNON from 'cannon-es'
import * as utils from '../client/utils'
import { Vehicle } from '../client/vehicle'
import { Ground } from './ground';

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


const objLoader = new OBJLoader();
        let mesh = new THREE.Mesh();
        objLoader.load('models/eskei.obj',
        (sk8) => {
            mesh = sk8.children[0] as THREE.Mesh;
            mesh.material = new THREE.Material();
            console.log('model loaded');
            
        },
        ()=>console.log('loading model')
        );

// scene.add(skateMesh)



// VEHICLE
let vehicle = new Vehicle();
// vehicle.loadVehicleMesh();
// vehicle.addMesh(skateMesh);
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

    // rampMesh.position.copy(utils.copyVector(rampBody.position)); 
    // rampMesh.quaternion.copy(utils.copyQuaternion(rampBody.quaternion));
    
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