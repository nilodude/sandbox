import * as CANNON from 'cannon-es'
import THREE = require('three');

function copyVector(cannonVec:  CANNON.Vec3 ){
    let threeVec= new THREE.Vector3 ;
    threeVec.x=cannonVec.x;
    threeVec.y=cannonVec.y;
    threeVec.z=cannonVec.z;
    return threeVec;
}
function copyQuaternion(cannonVec:   CANNON.Quaternion){
    let threeQuat= new THREE.Quaternion;
    threeQuat.x=cannonVec.x;
    threeQuat.y=cannonVec.y;
    threeQuat.z=cannonVec.z;
    return threeQuat;
}

function copyPosQuat(input: THREE.Mesh<any,any>){
    let output = input;
    output.position.x= input.position.x;
    output.position.y= input.position.y;
    output.position.z= input.position.z;

}
export {copyVector,copyQuaternion}