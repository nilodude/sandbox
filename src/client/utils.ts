import * as CANNON from 'cannon-es'
import THREE = require('three');
import * as GUIUtils from '../client/gui'

function addCamera(size: number[],label:string){
    const camera = new THREE.PerspectiveCamera(35, size[0]/size[1], 1, 2000)
    camera.position.x = 1;
    camera.position.y = 20;
    camera.position.z = 58;
    camera.rotation.x=-.22;
    camera.rotation.y=0;
    camera.rotation.z=0;
    
    GUIUtils.addCameraFolder(camera,label);
    return camera;
}

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
    const geometry = new THREE.SphereGeometry()
    const material = new THREE.MeshNormalMaterial();
    const sphere = new THREE.Mesh(geometry, material)
    GUIUtils.addSphereFolder(sphere);
    sphere.position.x = -2;
    sphere.position.y = 0.5;
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

function addSphereBody(world: CANNON.World,material: CANNON.Material){
    const sphereBody = new CANNON.Body({
        mass: 2, // kg
        shape: new CANNON.Sphere(1),
        position: new CANNON.Vec3(8, 10, 0),
        material: material
      })
    sphereBody.linearDamping = 0.31;
    sphereBody.angularDamping = 0.8;
      
    world.addBody(sphereBody);
    return sphereBody;
}
export {addCamera,copyVector,copyQuaternion, spawnWireframeCube, spawnWireframeSphere,showGridHelper, addWorldLights,addGroundMesh,addSphereBody}