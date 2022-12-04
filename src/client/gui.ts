import { GUI } from "dat.gui"

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
function addCameraFolder(camera: THREE.PerspectiveCamera){
    const cameraFolder = gui.addFolder('Camera')
    cameraFolder.add(camera.position, 'x', -10, 10)
    cameraFolder.add(camera.position, 'y', -10, 10)
    cameraFolder.add(camera.position, 'z', 0, 10)
    const cameraRotationFolder = cameraFolder.addFolder('Rotation')
    cameraRotationFolder.add(camera.rotation, 'x', -1, 1, 0.01)
    cameraRotationFolder.add(camera.rotation, 'y', -1, 1, 0.01)
    cameraRotationFolder.add(camera.rotation, 'z', -1, 1, 0.01)
    cameraRotationFolder.open();
    cameraFolder.open()
}

export {startGUI, addCubeFolder,addCameraFolder}
