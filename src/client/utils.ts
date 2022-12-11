import * as CANNON from 'cannon-es'
import THREE = require('three');
import * as GUIUtils from '../client/gui'

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
function getWireframeCube(){
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
    });
    const cube = new THREE.Mesh(geometry, material)
    GUIUtils.addCubeFolder(cube);
    return cube;
}
//SPHERE
function getWireframeSphere(){
    const geometry = new THREE.SphereGeometry()
    const material = new THREE.MeshNormalMaterial();
    const sphere = new THREE.Mesh(geometry, material)
    GUIUtils.addSphereFolder(sphere);
    return sphere;
}
export {copyVector,copyQuaternion, getWireframeCube, getWireframeSphere}