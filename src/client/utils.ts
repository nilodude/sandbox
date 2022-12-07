import * as CANNON from 'cannon-es'
import THREE = require('three');

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

function copyPosQuat(input: THREE.Mesh<any,any>){
    let output = input;
    output.position.x= input.position.x;
    output.position.y= input.position.y;
    output.position.z= input.position.z;

}
export {copyVector,copyQuaternion}