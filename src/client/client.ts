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

const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)

const spotlight1 = new THREE.SpotLight(0xffffff, 0.9, 0, Math.PI / 4, 1)
spotlight1.position.set(200, 10, 200)
spotlight1.target.position.set(0, 0, 0)
const spotlight2 = new THREE.SpotLight(0xffffff, 0.9, 0, Math.PI / 4, 1)
spotlight2.position.set(200, 10, -200)
spotlight2.target.position.set(0, 0, 0)

const spotlight3 = new THREE.SpotLight(0xffffff, 0.9, 0, Math.PI / 4, 1)
spotlight3.position.set(-200, 10, 200)
spotlight3.target.position.set(0, 0, 0)

const spotlight4 = new THREE.SpotLight(0xffffff, 0.9, 0, Math.PI / 4, 1)
spotlight4.position.set(-200, 10, -200)
spotlight4.target.position.set(0, 0, 0)

// spotlight.castShadow = true

// spotlight.shadow.camera.near = 1
// spotlight.shadow.camera.far = 1000
// spotlight.shadow.camera.fov = 45

// // spotlight.shadow.bias = -0.0001
// spotlight.shadow.mapSize.width = 2048
// spotlight.shadow.mapSize.height = 2048

scene.add(spotlight1)
scene.add(spotlight2)
scene.add(spotlight3)
scene.add(spotlight4)

//GROUND MESH
const groundGeo = new THREE.PlaneGeometry(500, 500);
const groundMat = new THREE.MeshPhysicalMaterial({ 
	color: 0xff00ff,
	side: THREE.FrontSide,
	wireframe: false,
    sheenRoughness: 0.01,
    reflectivity: 1,
    clearcoat:1,
    clearcoatRoughness: 0.01
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
  mass: 2, // kg
  shape: new CANNON.Sphere(1),
  position: new CANNON.Vec3(8, 10, 0),
  material: spherePhysMat
})
sphereBody.linearDamping = 0.31;
sphereBody.angularDamping = 0.8;

world.addBody(sphereBody); // al añadir el sphereBody al sphereVehicle no hace falta añadirlo al world

const carBody = new CANNON.Body({
    mass: 80,
    position: new CANNON.Vec3(0, 7, 0),
    shape: new CANNON.Box(new CANNON.Vec3(4, 0.5, 8)),
});

const vehicle = new CANNON.RigidVehicle({
    chassisBody: carBody,
});

const mass = 3;
const axisWidth = 8.5;
const wheelShape = new CANNON.Sphere(1);
const wheelMaterial = spherePhysMat// new CANNON.Material('wheel');
const down = new CANNON.Vec3(0, -1, 0);
const angularDamping = 0.8;
let air = false;
const wheelBody1 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody1.addShape(wheelShape);
wheelBody1.angularDamping = angularDamping;
vehicle.addWheel({
  body: wheelBody1,
  position: new CANNON.Vec3( axisWidth / 2, 0,-5),
  axis: new CANNON.Vec3(-1, 0, 0),
  direction: down,
});

const wheelBody2 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody2.addShape(wheelShape);
wheelBody2.angularDamping = angularDamping;
vehicle.addWheel({
  body: wheelBody2,
  position: new CANNON.Vec3(-axisWidth / 2, 0, -5),
  axis: new CANNON.Vec3(-1, 0, 0),
  direction: down,
});

const wheelBody3 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody3.addShape(wheelShape);
wheelBody3.angularDamping = angularDamping;
vehicle.addWheel({
  body: wheelBody3,
  position: new CANNON.Vec3(axisWidth / 2, 0,  5),
  axis: new CANNON.Vec3(-1, 0, 0),
  direction: down,
});

const wheelBody4 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody4.addShape(wheelShape);
wheelBody4.angularDamping = angularDamping;
vehicle.addWheel({
  body: wheelBody4,
  position: new CANNON.Vec3(-axisWidth / 2, 0, 5),
  axis: new CANNON.Vec3(-1, 0, 0),
  direction: down,
});

vehicle.addToWorld(world);

const groundSphereContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    spherePhysMat,
    {restitution: 0.01, 
    friction: 0.7}
);
world.addContactMaterial(groundSphereContactMat);

let avgSpeed= 0;
let jumpVelocity = 70
let jumpReleased = true;
document.addEventListener('keydown', (event) => {
    let maxSteerVal = avgSpeed > 90 ? Math.PI / 16 :Math.PI / 8;
    const maxForce = avgSpeed < 30 ? 1200 : 900;
      
    switch (event.key) {
        case 'w':
        case 'ArrowUp':
            if (!air) {
                vehicle.setWheelForce(maxForce, 0);
                vehicle.setWheelForce(maxForce, 1);
            }
            break;

        case 's':
        case 'ArrowDown':
            if (!air) {
                vehicle.setWheelForce(-maxForce / 2, 0);
                vehicle.setWheelForce(-maxForce / 2, 1);
            }
            break;

        case 'a':
        case 'ArrowLeft':
            if (!air) {
                vehicle.setSteeringValue(maxSteerVal, 0);
                vehicle.setSteeringValue(maxSteerVal, 1);
            }
            break;

        case 'd':
        case 'ArrowRight':
            if (!air) {
                vehicle.setSteeringValue(-maxSteerVal, 0);
                vehicle.setSteeringValue(-maxSteerVal, 1);
            }
            break;

        case ' ':
        case 'Space':
            if (jumpReleased) {
                [wheelBody1, wheelBody2, wheelBody3, wheelBody4].forEach(wheel => wheel.velocity.y += jumpVelocity);
                jumpReleased = false;
            }
            break;
    }
});

// reset car force to zero when key is released
document.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w':
        case 'ArrowUp':
            vehicle.setWheelForce(0, 0);
            vehicle.setWheelForce(0, 1);
            break;

        case 's':
        case 'ArrowDown':
            vehicle.setWheelForce(-0, 0);
            vehicle.setWheelForce(0, 1);
            break;

        case 'a':
        case 'ArrowLeft':
            vehicle.setSteeringValue(0, 0);
            vehicle.setSteeringValue(0, 1);
            break;

        case 'd':
        case 'ArrowRight':
            vehicle.setSteeringValue(0, 0);
            vehicle.setSteeringValue(0, 1);
            break;

        case ' ':
        case 'Space':
            jumpReleased = true;
            break;
    }       
});


document.addEventListener('mousemove', (event) => {
    console.log(event.offsetX+','+event.offsetY)
    let mouseX = event.clientX;
    let mouseY = event.clientY;
    if(air){
        // if (event.movementX > 0) {
            var directionVector = new CANNON.Vec3(0, 0, event.movementX);
		    var directionVector = carBody.quaternion.vmult( directionVector );
		    carBody.angularVelocity.set( directionVector.x, directionVector.y, directionVector.z );

            var cameradirectionVector = new CANNON.Vec3(0, 0, -event.movementX);
		    var cameradirectionVector = carBody.quaternion.vmult( directionVector );
		    // camera.applyQuaternion(new THREE.Quaternion(cameradirectionVector.x, cameradirectionVector.y, cameradirectionVector.z ));
            // wheelBody1.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), wheelBody1.quaternion.z + 0.05)
            // wheelBody2.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), wheelBody2.quaternion.z + 0.05)
            // wheelBody3.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), wheelBody3.quaternion.z + 0.05)
            // wheelBody4.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), wheelBody4.quaternion.z + 0.05)
    //    }
        // if(event.movementX < 0)
            // carBody.quaternion.z -0.05 //setFromAxisAngle(new CANNON.Vec3(0,0,1),carBody.quaternion.z - 0.01)
       
        // carBody.quaternion.setFromAxisAngle(new CANNON.Vec3(0,0,1),event.movementX/10)
    }
})



//ELEMENTS
//camera
const camera = new THREE.PerspectiveCamera(35, size[0]/size[1], 1, 1000)
camera.position.x = 1;
camera.position.y = 20;
camera.position.z = 58;
camera.rotation.x=-.22;
camera.rotation.y=-0;
camera.rotation.z=0;
GUIUtils.addCameraFolder(camera);

//grid
const gridHelper = new THREE.GridHelper(1000, 100, 0x0000ff, 0x808080);
gridHelper.position.y = 0;
gridHelper.position.x = 0;
gridHelper.position.z = -0.1;
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

//VEHICLE MESH
const carGeometry = new THREE.BoxGeometry(8, 1, 16);
const carMaterial = new THREE.MeshPhysicalMaterial({ 
	color: 0x888888,
	side: THREE.FrontSide,
	wireframe: false,
    sheenRoughness: 0.01,
    reflectivity: 1,
    clearcoat:1,
    clearcoatRoughness: 0.01
 });
const carMesh = new THREE.Mesh(carGeometry, carMaterial);
scene.add(carMesh);

carMesh.add(camera)

const wheelGeometry1 = new THREE.SphereGeometry(1);
const wheelMaterial1 = new THREE.MeshNormalMaterial();
const wheelMesh1 = new THREE.Mesh(wheelGeometry1,wheelMaterial1);
scene.add(wheelMesh1);

const wheelGeometry2 = new THREE.SphereGeometry(1);
const wheelMaterial2 = new THREE.MeshNormalMaterial();
const wheelMesh2 = new THREE.Mesh(wheelGeometry2, wheelMaterial2);
scene.add(wheelMesh2);

const wheelGeometry3 = new THREE.SphereGeometry(1);
const wheelMaterial3 = new THREE.MeshNormalMaterial();
const wheelMesh3 = new THREE.Mesh(wheelGeometry3, wheelMaterial3);
scene.add(wheelMesh3);

const wheelGeometry4 = new THREE.SphereGeometry(1);
const wheelMaterial4 = new THREE.MeshNormalMaterial();
const wheelMesh4 = new THREE.Mesh(wheelGeometry4, wheelMaterial4);
scene.add(wheelMesh4);

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

    //sphereBody.quaternion.z += 0.01 *Math.sin(theta);

    //ROTATE VEHICLE WITH MOUSEX AND MOUSEY

    sphere.position.copy(utils.copyVector(sphereBody.position))
    sphere.quaternion.copy(utils.copyQuaternion(sphereBody.quaternion))

    groundMesh.position.copy(utils.copyVector(groundBody.position));
    groundMesh.quaternion.copy(utils.copyQuaternion(groundBody.quaternion));

    carMesh.position.copy(utils.copyVector(carBody.position));
    carMesh.quaternion.copy(utils.copyQuaternion(carBody.quaternion));
    wheelMesh1.position.copy(utils.copyVector(wheelBody1.position));
    wheelMesh1.quaternion.copy(utils.copyQuaternion(wheelBody1.quaternion));
    wheelMesh2.position.copy(utils.copyVector(wheelBody2.position));
    wheelMesh2.quaternion.copy(utils.copyQuaternion(wheelBody2.quaternion));
    wheelMesh3.position.copy(utils.copyVector(wheelBody3.position));
    wheelMesh3.quaternion.copy(utils.copyQuaternion(wheelBody3.quaternion));
    wheelMesh4.position.copy(utils.copyVector(wheelBody4.position));
    wheelMesh4.quaternion.copy(utils.copyQuaternion(wheelBody4.quaternion));

    avgSpeed = (vehicle.getWheelSpeed(2) +vehicle.getWheelSpeed(3))/2
    air = ![wheelBody1.position.y,wheelBody2.position.y,wheelBody3.position.y,wheelBody4.position.y].some(pos=>pos < 1.0)
    
    

    // console.log(avgSpeed) 
    // console.log(wheelBody1.position.y) 
    
    // gridHelper.position.x += -(carBody.velocity.x/2) * timeStep
    // gridHelper.position.z += -(carBody.velocity.z/2) * timeStep

    // gridHelper.position.x = (gridHelper.position.x) % 40
    // gridHelper.position.z = (gridHelper.position.z) % 80
    
    render();
}

function render() {
    renderer.render(scene, camera)
}

animate()