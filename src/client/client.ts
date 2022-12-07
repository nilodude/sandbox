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
  mass: 1, // kg
  shape: new CANNON.Sphere(1),
  position: new CANNON.Vec3(5, 10, 0),
  material: spherePhysMat
})
sphereBody.linearDamping = 0.31;
sphereBody.angularDamping = 0.9;

world.addBody(sphereBody); // al añadir el sphereBody al sphereVehicle no hace falta añadirlo al world

const carBody = new CANNON.Body({
    mass: 10,
    position: new CANNON.Vec3(0, 6, 0),
    shape: new CANNON.Box(new CANNON.Vec3(4, 0.5, 2)),
});

const vehicle = new CANNON.RigidVehicle({
    chassisBody: carBody,
  });

const mass = 1;
const axisWidth = 5;
const wheelShape = new CANNON.Sphere(1);
const wheelMaterial = new CANNON.Material('wheel');
const down = new CANNON.Vec3(0, -1, 0);

const wheelBody1 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody1.addShape(wheelShape);
wheelBody1.angularDamping = 0.4;
vehicle.addWheel({
  body: wheelBody1,
  position: new CANNON.Vec3(-2, 0, axisWidth / 2),
  axis: new CANNON.Vec3(0, 0, 1),
  direction: down,
});

const wheelBody2 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody2.addShape(wheelShape);
wheelBody2.angularDamping = 0.4;
vehicle.addWheel({
  body: wheelBody2,
  position: new CANNON.Vec3(-2, 0, -axisWidth / 2),
  axis: new CANNON.Vec3(0, 0, 1),
  direction: down,
});

const wheelBody3 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody3.addShape(wheelShape);
wheelBody3.angularDamping = 0.4;
vehicle.addWheel({
  body: wheelBody3,
  position: new CANNON.Vec3(2, 0, axisWidth / 2),
  axis: new CANNON.Vec3(0, 0, 1),
  direction: down,
});

const wheelBody4 = new CANNON.Body({ mass, material: wheelMaterial });
wheelBody4.addShape(wheelShape);
wheelBody4.angularDamping = 0.4;
vehicle.addWheel({
  body: wheelBody4,
  position: new CANNON.Vec3(2, 0, -axisWidth / 2),
  axis: new CANNON.Vec3(0, 0, 1),
  direction: down,
});

vehicle.addToWorld(world);


const groundSphereContactMat = new CANNON.ContactMaterial(
    groundPhysMat,
    spherePhysMat,
    {restitution: 0.7}
);

world.addContactMaterial(groundSphereContactMat);

document.addEventListener('keydown', (event) => {
    const maxSteerVal = Math.PI / 4;
    const maxForce = 60;

    switch (event.key) {
        case 'w':
        case 'ArrowUp':
            vehicle.setWheelForce(maxForce, 0);
            vehicle.setWheelForce(maxForce, 1);
            break;

        case 's':
        case 'ArrowDown':
            vehicle.setWheelForce(-maxForce / 2, 0);
            vehicle.setWheelForce(-maxForce / 2, 1);
            break;

        case 'a':
        case 'ArrowLeft':
            vehicle.setSteeringValue(maxSteerVal, 0);
            vehicle.setSteeringValue(maxSteerVal, 1);
            break;

        case 'd':
        case 'ArrowRight':
            vehicle.setSteeringValue(-maxSteerVal, 0);
            vehicle.setSteeringValue(-maxSteerVal, 1);
            break;

        case ' ':
        case 'Space':
            wheelBody1.velocity.y += 30;
            wheelBody2.velocity.y += 30;
            wheelBody3.velocity.y += 20;
            wheelBody4.velocity.y += 20;
            

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
        vehicle.setWheelForce(0, 0);
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
    }
  });

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

//VEHICLE
const boxGeometry = new THREE.BoxGeometry(8, 1, 4);
const boxMaterial = new THREE.MeshNormalMaterial();
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
scene.add(boxMesh);

const sphereGeometry1 = new THREE.SphereGeometry(1);
const sphereMaterial1 = new THREE.MeshNormalMaterial();
const sphereMesh1 = new THREE.Mesh(sphereGeometry1, sphereMaterial1);
scene.add(sphereMesh1);

const sphereGeometry2 = new THREE.SphereGeometry(1);
const sphereMaterial2 = new THREE.MeshNormalMaterial();
const sphereMesh2 = new THREE.Mesh(sphereGeometry2, sphereMaterial2);
scene.add(sphereMesh2);

const sphereGeometry3 = new THREE.SphereGeometry(1);
const sphereMaterial3 = new THREE.MeshNormalMaterial();
const sphereMesh3 = new THREE.Mesh(sphereGeometry3, sphereMaterial3);
scene.add(sphereMesh3);

const sphereGeometry4 = new THREE.SphereGeometry(1);
const sphereMaterial4 = new THREE.MeshNormalMaterial();
const sphereMesh4 = new THREE.Mesh(sphereGeometry4, sphereMaterial4);
scene.add(sphereMesh4);

new OrbitControls(camera, renderer.domElement);
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
    sphere.position.copy(utils.copyVector(sphereBody.position))
    sphere.quaternion.copy(utils.copyQuaternion(sphereBody.quaternion))

    groundMesh.position.copy(utils.copyVector(groundBody.position));
    groundMesh.quaternion.copy(utils.copyQuaternion(groundBody.quaternion));

    boxMesh.position.copy(utils.copyVector(carBody.position));
      boxMesh.quaternion.copy(utils.copyQuaternion(carBody.quaternion));
      sphereMesh1.position.copy(utils.copyVector(wheelBody1.position));
      sphereMesh1.quaternion.copy(utils.copyQuaternion(wheelBody1.quaternion));
      sphereMesh2.position.copy(utils.copyVector(wheelBody2.position));
      sphereMesh2.quaternion.copy(utils.copyQuaternion(wheelBody2.quaternion));
      sphereMesh3.position.copy(utils.copyVector(wheelBody3.position));
      sphereMesh3.quaternion.copy(utils.copyQuaternion(wheelBody3.quaternion));
      sphereMesh4.position.copy(utils.copyVector(wheelBody4.position));
      sphereMesh4.quaternion.copy(utils.copyQuaternion(wheelBody4.quaternion));
    render();
}

function render() {
    renderer.render(scene, camera)
}

animate()