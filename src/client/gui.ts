import { GUI } from "dat.gui"
import THREE = require("three");

let gui: GUI;

function startGUI(){
    gui = new GUI()
}

function addCubeFolder(cube: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>){
    const cubeFolder = gui.addFolder('Cube')
    const cubeRotationFolder = cubeFolder.addFolder('Rotation')
    cubeRotationFolder.add(cube.rotation, 'x', 0, Math.PI * 2)
    cubeRotationFolder.add(cube.rotation, 'y', 0, Math.PI * 2)
    cubeRotationFolder.add(cube.rotation, 'z', 0, Math.PI * 2)
    // cubeRotationFolder.open()
    const cubePositionFolder = cubeFolder.addFolder('Position')
    cubePositionFolder.add(cube.position, 'x', -10, 10)
    cubePositionFolder.add(cube.position, 'y', -10, 10)
    cubePositionFolder.add(cube.position, 'z', -10, 10)
    // cubePositionFolder.open()
    const cubeScaleFolder = cubeFolder.addFolder('Scale')
    cubeScaleFolder.add(cube.scale, 'x', -15, 15)
    cubeScaleFolder.add(cube.scale, 'y', -15, 15)
    cubeScaleFolder.add(cube.scale, 'z', -35, 35)
    cubeFolder.open()
}
function addSphereFolder(sphere: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>){
    const sphereFolder = gui.addFolder('sphere')
    const sphereRotationFolder = sphereFolder.addFolder('Rotation')
    sphereRotationFolder.add(sphere.rotation, 'x', 0, Math.PI * 2)
    sphereRotationFolder.add(sphere.rotation, 'y', 0, Math.PI * 2)
    sphereRotationFolder.add(sphere.rotation, 'z', 0, Math.PI * 2)
    // sphereRotationFolder.open()
    const spherePositionFolder = sphereFolder.addFolder('Position')
    spherePositionFolder.add(sphere.position, 'x', -10, 10)
    spherePositionFolder.add(sphere.position, 'y', -10, 10)
    spherePositionFolder.add(sphere.position, 'z', -10, 10)
    // spherePositionFolder.open()
    const sphereScaleFolder = sphereFolder.addFolder('Scale')
    sphereScaleFolder.add(sphere.scale, 'x', -15, 15)
    sphereScaleFolder.add(sphere.scale, 'y', -15, 15)
    sphereScaleFolder.add(sphere.scale, 'z', -35, 35)
    sphereFolder.open()
}
const pakeviakreaunavariable = 50;
function addCameraFolder(camera: THREE.PerspectiveCamera){
    const cameraFolder = gui.addFolder('Camera')
    cameraFolder.add(camera.position, 'x', -pakeviakreaunavariable, pakeviakreaunavariable)
    cameraFolder.add(camera.position, 'y', -pakeviakreaunavariable, pakeviakreaunavariable)
    cameraFolder.add(camera.position, 'z', -pakeviakreaunavariable, pakeviakreaunavariable)
    const cameraRotationFolder = cameraFolder.addFolder('Rotation')
    cameraRotationFolder.add(camera.rotation, 'x', -1, 1, 0.01)
    cameraRotationFolder.add(camera.rotation, 'y', -1, 1, 0.01)
    cameraRotationFolder.add(camera.rotation, 'z', -1, 1, 0.01)
    cameraRotationFolder.open();
    cameraFolder.open()
}


function getWireframeCube(){
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
    });
    return new THREE.Mesh(geometry, material)
}

function getWireframeSphere(){
    const geometry = new THREE.SphereGeometry()
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
    });
    return new THREE.Mesh(geometry, material)
}

export {startGUI, addCubeFolder,addCameraFolder,getWireframeCube,addSphereFolder, getWireframeSphere}
