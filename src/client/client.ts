import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GUI } from 'dat.gui'
import * as GUIUtils from '../client/gui'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, 1, 1, 100)
// const camera2 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
// const camera3 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
// const camera4 = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)

camera.position.x = 0.8;
camera.position.y = 2.1;
camera.position.z = 3.2;

camera.rotation.x=-.27;
camera.rotation.y=-.04;
camera.rotation.z=0;
// camera2.position.y = 1
// camera2.lookAt(new THREE.Vector3(0, 0, 0))
// camera3.position.z = 1
// camera4.position.x = 1
// camera4.lookAt(new THREE.Vector3(0, 0, 0))

const canvas1 = document.getElementById('c1') as HTMLCanvasElement
// const canvas2 = document.getElementById('c2') as HTMLCanvasElement
// const canvas3 = document.getElementById('c3') as HTMLCanvasElement
// const canvas4 = document.getElementById('c4') as HTMLCanvasElement
const renderer1 = new THREE.WebGLRenderer({ canvas: canvas1 })
renderer1.setSize(800, 800)
// const renderer2 = new THREE.WebGLRenderer({ canvas: canvas2 })
// renderer2.setSize(200, 200)
// const renderer3 = new THREE.WebGLRenderer({ canvas: canvas3 })
// renderer3.setSize(200, 200)
// const renderer4 = new THREE.WebGLRenderer({ canvas: canvas4 })
// renderer4.setSize(200, 200)

//document.body.appendChild(renderer.domElement)

// new OrbitControls(camera, renderer1.domElement)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})

const cube = new THREE.Mesh(geometry, material)
cube.position.y = 0.5;
scene.add(cube)

const gridHelper = new THREE.GridHelper(400, 100, 0x0000ff, 0x808080);
gridHelper.position.y = 0;
gridHelper.position.x = 0;
scene.add(gridHelper);

GUIUtils.startGUI();
GUIUtils.addCameraFolder(camera);
GUIUtils.addCubeFolder(cube);

function animate() {
    requestAnimationFrame(animate)

    // cube.rotation.x += 0.01
    // cube.rotation.y += 0.01

    render()
}

function render() {
    renderer1.render(scene, camera)
    // renderer2.render(scene, camera2)
    // renderer3.render(scene, camera3)
    // renderer4.render(scene, camera4)
}

animate()