import * as CANNON from 'cannon-es'
import THREE = require('three');
import * as GUIUtils from '../client/gui'

// function addCamera(size: number[],label:string){
//     const camera = new THREE.PerspectiveCamera(35, size[0]/size[1], 1, 2000)
//     camera.position.x = 1;
//     camera.position.y = 20;
//     camera.position.z = 58;
//     camera.rotation.x=-.22;
//     camera.rotation.y=0;
//     camera.rotation.z=0;
    
//     GUIUtils.addCameraFolder(camera,label);
//     return camera;
// }
let sphereRadius = 3;

function copyVector(cannonVec:  CANNON.Vec3 ){
    let threeVec= new THREE.Vector3 ;
    threeVec.x=cannonVec.x;
    threeVec.y=cannonVec.y;
    threeVec.z=cannonVec.z;
    return threeVec;
}
function copyQuaternion(cannonQuat:   CANNON.Quaternion){
    let threeQuat= new THREE.Quaternion;
    threeQuat.x=cannonQuat.x;
    threeQuat.y=cannonQuat.y;
    threeQuat.z=cannonQuat.z;
    threeQuat.w = cannonQuat.w;
    return threeQuat;
}

//CUBE
function spawnWireframeCube(scene: THREE.Scene){
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
    });
    const cube = new THREE.Mesh(geometry, material)
    GUIUtils.addCubeFolder(cube);
    cube.position.x = 2;
    cube.position.y = 3;
    cube.position.z = 1;
    cube.add(new THREE.AxesHelper(5))
    scene.add(cube)
    return cube;
}

//SPHERE
function spawnWireframeSphere(scene: THREE.Scene){
    const geometry = new THREE.SphereGeometry(sphereRadius)
    const material = new THREE.MeshNormalMaterial();
    const sphere = new THREE.Mesh(geometry, material)
    GUIUtils.addSphereFolder(sphere);
    sphere.add(new THREE.AxesHelper(5))
    scene.add(sphere)
    return sphere;
}

//GRID HELPER
function showGridHelper(scene: THREE.Scene){
    const gridHelper = new THREE.GridHelper(1000, 100, 0x0000ff, 0x808080);
    gridHelper.position.y = 0.2;
    gridHelper.position.x = 0;
    gridHelper.position.z = -0.1;
    scene.add(gridHelper);
}
//LIGHTS
function addWorldLights(scene: THREE.Scene, groundSize: number){
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    // RECTANGLE LIGHTS
    const newRectLight = ()=>new THREE.RectAreaLight( 0xffff00, 1500,  groundSize, 0.2);
    const rectsPerGround = 14;
    const rectLightSpacing = groundSize / rectsPerGround;
    
    for(let i=0;i<=rectsPerGround;i++){
        const rectLight = newRectLight();
        rectLight.position.set( 0, 30, (groundSize/2)- i*rectLightSpacing);
        rectLight.lookAt( 0, 0, 0 );
        scene.add(rectLight);
    }
    
    //SPOTLIGHTS
    const numLights = 24;
    const lightsPerSide = numLights/4;
    const spacing = groundSize/lightsPerSide;
    
    const newSpotlight = ()=>new THREE.SpotLight(0xffffff, 50, 1000, Math.PI /4, 1)

    for(let i=0;i<=lightsPerSide;i++){
        const spotlight1 = newSpotlight()
        spotlight1.position.set(groundSize/2, 5,(groundSize/2)-i*spacing ) 
        spotlight1.target.position.set(0, 0, 0)
        
        const spotlight2 = newSpotlight()
        spotlight2.position.set(-groundSize/2, 5,(groundSize/2)-i*spacing ) 
        spotlight2.target.position.set(0, 0, 0)
        
        const spotlight3 = newSpotlight()
        spotlight3.position.set(-(groundSize/2)+i*spacing, 5,groundSize/2) 
        spotlight3.target.position.set(0, 0, 0)
    
        const spotlight4 = newSpotlight()
        spotlight4.position.set(-(groundSize/2)+i*spacing, 5,-groundSize/2) 
        spotlight4.target.position.set(0, 0, 0)
        
        scene.add(spotlight1)
        scene.add(spotlight2)
        scene.add(spotlight3)
        scene.add(spotlight4)
    }
}

function addGroundMesh(scene: THREE.Scene, groundSize: number) {
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
    return groundMesh;
}

function addRampMesh(scene: THREE.Scene) {
    const geometry = new THREE.CylinderGeometry(0.1, 200, 20, 4)
    const meshMaterial = new THREE.MeshNormalMaterial();
    const rampMesh = new THREE.Mesh(geometry, meshMaterial)
    scene.add(rampMesh);
    return rampMesh;
}

function addRampBody(world: CANNON.World,material: CANNON.Material) {
    const rampBody = new CANNON.Body({
        type: CANNON.Body.STATIC,
        shape: new CANNON.Cylinder(0.1, 200, 20, 4),
        material: material,
        position: new CANNON.Vec3(-100,10,-700)
    })
    rampBody.quaternion.setFromEuler(0, 0, 0) // make it face up
    world.addBody(rampBody);
    return rampBody;
}

function addSphereBody(world: CANNON.World,material: CANNON.Material){
    const sphereBody = new CANNON.Body({
        mass: 20, // kg
        shape: new CANNON.Sphere(sphereRadius),
        position: new CANNON.Vec3(8, 30, -50),
        material: material
      })
    sphereBody.linearDamping = 0.31;
    sphereBody.angularDamping = 0.8;
      
    world.addBody(sphereBody);
    return sphereBody;
}

function toggleHelp(show: boolean){
    let h = document.getElementById('help');
    if(h){
        h.style.display = show ? 'flex' : 'none';
    }
    let sh = document.getElementById('showHelp');
    if(sh){
        sh.innerHTML = 'H: '+(show?'HIDE':'SHOW')+' HELP';
    }
}

export {/*addCamera,*/
copyVector,
copyQuaternion,
addRampMesh,
addRampBody,
spawnWireframeCube,
spawnWireframeSphere,
showGridHelper, 
addWorldLights,
addGroundMesh,
addSphereBody,
toggleHelp}