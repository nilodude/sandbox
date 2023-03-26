import { GUI } from "dat.gui"
import THREE = require("three");

let gui: GUI;

function startGUI(){
    gui = new GUI()
}
const limit = 1000;
//CUBE FOLDER
function addCubeFolder(cube: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>){
    const cubeFolder = gui.addFolder('Cube')
    const cubeRotationFolder = cubeFolder.addFolder('Rotation')
    cubeRotationFolder.add(cube.rotation, 'x', 0, Math.PI * 2)
    cubeRotationFolder.add(cube.rotation, 'y', 0, Math.PI * 2)
    cubeRotationFolder.add(cube.rotation, 'z', 0, Math.PI * 2)
    // cubeRotationFolder.open()
    const cubePositionFolder = cubeFolder.addFolder('Position')
    cubePositionFolder.add(cube.position, 'x', -limit, limit)
    cubePositionFolder.add(cube.position, 'y', -limit, limit)
    cubePositionFolder.add(cube.position, 'z', -limit, limit)
    // cubePositionFolder.open()
    const cubeScaleFolder = cubeFolder.addFolder('Scale')
    cubeScaleFolder.add(cube.scale, 'x', -15, 15)
    cubeScaleFolder.add(cube.scale, 'y', -15, 15)
    cubeScaleFolder.add(cube.scale, 'z', -35, 35)
    // cubeFolder.open()
}
//SPHERE FOLDER
function addSphereFolder(sphere: THREE.Mesh<THREE.SphereGeometry, THREE.MeshNormalMaterial>){
    const sphereFolder = gui.addFolder('sphere')
    const sphereRotationFolder = sphereFolder.addFolder('Rotation')
    sphereRotationFolder.add(sphere.rotation, 'x', 0, Math.PI * 2)
    sphereRotationFolder.add(sphere.rotation, 'y', 0, Math.PI * 2)
    sphereRotationFolder.add(sphere.rotation, 'z', 0, Math.PI * 2)
    // sphereRotationFolder.open()
    const spherePositionFolder = sphereFolder.addFolder('Position')
    spherePositionFolder.add(sphere.position, 'x', -limit, limit)
    spherePositionFolder.add(sphere.position, 'y', -limit, limit)
    spherePositionFolder.add(sphere.position, 'z', -limit, limit)
    // spherePositionFolder.open()
    const sphereScaleFolder = sphereFolder.addFolder('Scale')
    sphereScaleFolder.add(sphere.scale, 'x', -15, 15)
    sphereScaleFolder.add(sphere.scale, 'y', -15, 15)
    sphereScaleFolder.add(sphere.scale, 'z', -35, 35)
    // sphereFolder.open()
}
const rotationLimit = 5;
//CAMERA
function addCameraFolder(camera: THREE.PerspectiveCamera, label:string){
    const cameraFolder = gui.addFolder(label || 'New Camera')
    cameraFolder.add(camera.position, 'x', -limit, limit)
    cameraFolder.add(camera.position, 'y', -limit, limit)
    cameraFolder.add(camera.position, 'z', -limit, limit)
    const cameraRotationFolder = cameraFolder.addFolder('Rotation')
    cameraRotationFolder.add(camera.rotation, 'x', 0,  Math.PI * 2)
    cameraRotationFolder.add(camera.rotation, 'y', 0,  Math.PI * 2)
    cameraRotationFolder.add(camera.rotation, 'z',  0,  Math.PI * 2)
    // cameraRotationFolder.open();
    // cameraFolder.open()
}



export {startGUI, addCubeFolder,addCameraFolder,addSphereFolder}
