import * as THREE from 'three'
import * as CANNON from 'cannon-es'

let vehicleMesh: THREE.Mesh;
let vehicleBody: CANNON.Body;
let wheelBodies: CANNON.Body[] = [];

function createVehicleMesh(){
    const vehicleGeometry = new THREE.BoxGeometry(8, 1, 16);
    const vehicleMaterial = new THREE.MeshPhysicalMaterial({ 
	    color: 0xaaaaaa,
	    side: THREE.FrontSide,
	    wireframe: false,
        roughness: 0.01,
        metalness: 0.9,
        reflectivity: 1,
        clearcoat:1,
        clearcoatRoughness: 0.01
    });
    vehicleMesh = new THREE.Mesh(vehicleGeometry, vehicleMaterial);
    return vehicleMesh;
}

function createRigidVehicle(wheelBodyMaterial: CANNON.Material){
    vehicleBody = new CANNON.Body({
        mass: 120,
        position: new CANNON.Vec3(0, 2, 0),
        shape: new CANNON.Box(new CANNON.Vec3(4, 0.5, 8)),
    });
    
    const rigidVehicle = new CANNON.RigidVehicle({
        chassisBody: vehicleBody,
    });
    
    //WHEELS
    const axisWidth = 8.5;
    const down = new CANNON.Vec3(0, -1, 0);
    const angularDamping = 0.8;
        
    let wheelPositions =[
        new CANNON.Vec3(axisWidth / 2, 0, -5),
        new CANNON.Vec3(-axisWidth / 2, 0, -5),
        new CANNON.Vec3(axisWidth / 2, 0, 5),
        new CANNON.Vec3(-axisWidth / 2, 0, 5)
    ];
    
    for(let i=0;i<4;i++){
        const wheelBody = new CANNON.Body({
            mass: 3, //kg
            angularDamping: angularDamping,
            shape: new CANNON.Sphere(1),
            material: wheelBodyMaterial // este spherePhysMat (o como se llame en cada sitio, wheelBodyMaterial) es el que se va a asociar con el groundPhysMat para definir la fisica del contacto entre esos dos materiales
        });
        
        wheelBodies.push(wheelBody);
        
        rigidVehicle.addWheel({
            body: wheelBody,
            position: wheelPositions[i],
            axis: new CANNON.Vec3(-1, 0, 0),
            direction: down,
        });
    }

    return rigidVehicle;
}

export {createVehicleMesh,createRigidVehicle, vehicleBody, vehicleMesh, wheelBodies}