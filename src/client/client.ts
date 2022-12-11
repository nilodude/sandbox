import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
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
const groundSize = 1000;
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)




const rectLight = new THREE.RectAreaLight( 0xffff00, 1000,  1000, 0.2);
rectLight.position.set( 0, 30, 0 );
rectLight.lookAt( 0, 0, 0 );
scene.add( rectLight )
const rectLight1 = new THREE.RectAreaLight( 0xffff00, 1000,  1000, 0.2);
rectLight1.position.set( 0, 30, 250 );
rectLight1.lookAt( 0, 0, 0 );
scene.add( rectLight1 )
const rectLight2 = new THREE.RectAreaLight( 0xffff00, 1000,  1000, 0.2);
rectLight2.position.set( 0, 30, -250 );
rectLight2.lookAt( 0, 0, 0 );
scene.add( rectLight2 )
const rectLight3 = new THREE.RectAreaLight( 0xffff00, 1000,  1000, 0.2);
rectLight3.position.set( 0, 30, -450 );
rectLight3.lookAt( 0, 0, 0 );
scene.add( rectLight3 )
const rectLight4 = new THREE.RectAreaLight( 0xffff00, 1000,  1000, 0.2);
rectLight4.position.set( 0, 30, 450 );
rectLight4.lookAt( 0, 0, 0 );
scene.add( rectLight4 )

const numLights = 12;
const lightsPerSide = numLights/4;
const spacing = groundSize/lightsPerSide;

for(let i=0;i<=lightsPerSide;i++){
    const spotlight1 = new THREE.SpotLight(0xffffff, 10, 1000, Math.PI / 8, 1)
    spotlight1.position.set(groundSize/2, 5,(groundSize/2)-i*spacing ) 
    spotlight1.target.position.set(0, 0, 0)
    
    const spotlight2 = new THREE.SpotLight(0xffffff, 10, 1000, Math.PI / 8, 1)
    spotlight2.position.set(-groundSize/2, 5,(groundSize/2)-i*spacing ) 
    spotlight2.target.position.set(0, 0, 0)
    
    const spotlight3 = new THREE.SpotLight(0xffffff, 10, 1000, Math.PI / 8, 1)
    spotlight3.position.set(-(groundSize/2)+i*spacing, 5,groundSize/2) 
    spotlight3.target.position.set(0, 0, 0)

    const spotlight4 = new THREE.SpotLight(0xffffff, 10, 1000, Math.PI / 8, 1)
    spotlight4.position.set(-(groundSize/2)+i*spacing, 5,-groundSize/2) 
    // spotlight4.target.position.set(0, 0, 0)
    
    scene.add(spotlight1)
    scene.add(spotlight2)
    scene.add(spotlight3)
    scene.add(spotlight4)
}

const lightsPosition = [{x:groundSize/2, z:groundSize/2},{x:groundSize/2, z:-groundSize/2},{x:-groundSize/2, z:groundSize/2},{x:-groundSize/2, z:-groundSize/2}]

// lightsPosition.forEach(lightPos=>{
//     const spotlight = new THREE.SpotLight(0xffffff, 0.9, 0, Math.PI / 4, 1)
//     spotlight.position.set(lightPos.x, 10, lightPos.z)
//     spotlight.target.position.set(0, 0, 0)
//     spotlight.castShadow = true
//     scene.add(spotlight)
// })



//GROUND MESH
const groundGeo = new THREE.PlaneGeometry(groundSize, groundSize);
const groundMat = new THREE.MeshPhysicalMaterial({ 
	color: 0xaa00ff,
	side: THREE.FrontSide,
	wireframe: false,
    sheenRoughness: 0.001,
    roughness: 0.001,
    metalness: 0.5,
    reflectivity: 1,
 });
const groundMesh = new THREE.Mesh(groundGeo, groundMat);
scene.add(groundMesh);


//PHYSICS WORLD
const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -20, 0), // m/s²
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
    position: new CANNON.Vec3(0, 2, 0),
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

let wheelsBody = [wheelBody1,wheelBody2,wheelBody3,wheelBody4]

vehicle.addToWorld(world);

const groundSphereContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    spherePhysMat,
    {restitution: 0.01, 
    friction: 0.7}
);
world.addContactMaterial(groundSphereContactMat);

let avgSpeed= 0;
let jumpVelocity = 100
let jumpReleased = true;
let cameraMode = 1;
document.addEventListener('keydown', (event) => {
    let maxSteerVal = avgSpeed > 90 ? Math.PI / 16 :Math.PI / 10;
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
            if (jumpReleased) {
                [wheelBody1, wheelBody2, wheelBody3, wheelBody4].forEach(wheel => wheel.velocity.y += jumpVelocity);
                jumpReleased = false;
            }
            break;
        case 'c':
            //PRESSING C CHANGES CAMERA POSITION AND ROTATION
            if (cameraMode == 1) {
                carMesh.add(camera)
                cameraMode = 2;
                camera.position.x = 1;
                camera.position.y = 20;
                camera.position.z = 58;
                camera.rotation.x = -.22;
                camera.rotation.y = 0;
                camera.rotation.z = 0
            }else if (cameraMode == 2){
                carMesh.remove(camera)
                cameraMode = 3;
                camera.position.x = -500;
                camera.position.y = 421//221;
                camera.position.z = 421//500;
                camera.rotation.x = -0.51//-.17;
                camera.rotation.y = -0.62//-.73;
                camera.rotation.z = -0.29//-.73;
            }else{
                cameraMode = 1;
                camera.position.x = 1;
                camera.position.z = 58;
                camera.rotation.x = -.22;
                camera.rotation.y = 0;
                camera.rotation.z = 0
                camera.position.y = 10+(Math.abs(carMesh.position.z)+ Math.abs(carMesh.position.x))/10
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
    if (air) {
        var directionVector = new CANNON.Vec3(0, 0, event.movementX / 10);
        var directionVector = carBody.quaternion.vmult(directionVector);
        carBody.angularVelocity.set(directionVector.x, directionVector.y, directionVector.z);
    }
})

//ELEMENTS
//camera
const camera = new THREE.PerspectiveCamera(35, size[0]/size[1], 1, 2000)
camera.position.x = 1;
camera.position.y = 20;
camera.position.z = 58;
camera.rotation.x=-.22;
camera.rotation.y=0;
camera.rotation.z=0;

GUIUtils.addCameraFolder(camera);

//grid
const gridHelper = new THREE.GridHelper(1000, 100, 0x0000ff, 0x808080);
gridHelper.position.y = 0;
gridHelper.position.x = 0;
gridHelper.position.z = -0.1;
// scene.add(gridHelper);

//cube
const cube = utils.getWireframeCube()
cube.position.x = 2;
cube.position.y = 3;
cube.position.z = 1;
cube.add(new THREE.AxesHelper(5))
scene.add(cube)

//sphere
const sphere = utils.getWireframeSphere()
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


//VEHICLE LIGHTS
const spotlight = new THREE.SpotLight(0x5522aa, 2,500, 3*  Math.PI, 1)
spotlight.position.set(0, 0.5, 0)
// spotlight.target.position.set(0, 0, 0)  //para que parezcan neones del coche se deja de apuntar al centro
spotlight.castShadow = true
// spotlight.shadow.camera.near = 1
// spotlight.shadow.camera.far = 1000
// spotlight.shadow.camera.fov = 45

// spotlight.shadow.bias = -0.0001
// spotlight.shadow.mapSize.width = 2048
// spotlight.shadow.mapSize.height = 2048
scene.add(spotlight)


//VEHICLE MESH
const carGeometry = new THREE.BoxGeometry(8, 1, 16);
const carMaterial = new THREE.MeshPhysicalMaterial({ 
	color: 0xaaaaaa,
	side: THREE.FrontSide,
	wireframe: false,
    roughness: 0.01,
    metalness: 0.9,
    reflectivity: 1,
    clearcoat:1,
    clearcoatRoughness: 0.01
 });
const carMesh = new THREE.Mesh(carGeometry, carMaterial);
spotlight.target = carMesh;

// carMesh.add(camera)
carMesh.add(spotlight)

scene.add(carMesh);

// let wheelsMesh = [];
// for(let i=0;i<4;i++){
//     const wheelGeometry = new THREE.SphereGeometry(1);
//     const wheelMaterial = new THREE.MeshNormalMaterial();
//     const wheelMesh = new THREE.Mesh(wheelGeometry,wheelMaterial);
//     wheelsMesh.push(wheelMesh);
//     scene.add(wheelMesh);
// }

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

    sphereBody.quaternion.z += 0.01 *Math.sin(theta);

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
    
    camera.lookAt(carMesh.position)
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