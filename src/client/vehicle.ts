import * as THREE from 'three'
import * as CANNON from 'cannon-es'
export class Vehicle {
    vehicleGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(8, 1, 16);
    vehicleMaterial: THREE.MeshPhysicalMaterial = new THREE.MeshPhysicalMaterial({ 
	    color: 0xaaaaaa,
	    side: THREE.FrontSide,
	    wireframe: false,
        roughness: 0.01,
        metalness: 0.9,
        reflectivity: 1,
        clearcoat:1,
        clearcoatRoughness: 0.01
    });
    
    public vehicleMesh: THREE.Mesh = new THREE.Mesh(this.vehicleGeometry, this.vehicleMaterial);
    
    public vehicleBody: CANNON.Body = new CANNON.Body({
        mass: 120,
        position: new CANNON.Vec3(0, 2, 0),
        shape: new CANNON.Box(new CANNON.Vec3(4, 0.5, 8)),
    });

    axisWidth: number = 8.5;
    wheelPositions: CANNON.Vec3[] =[
        new CANNON.Vec3(this.axisWidth / 2, 0, -5),
        new CANNON.Vec3(-this.axisWidth / 2, 0, -5),
        new CANNON.Vec3(this.axisWidth / 2, 0, 5),
        new CANNON.Vec3(-this.axisWidth / 2, 0, 5)
    ];
    public wheelBodies: CANNON.Body[] = [];
    
    public rigidVehicle: CANNON.RigidVehicle = new CANNON.RigidVehicle({
        chassisBody: this.vehicleBody,
    });

    public addWheels(wheelBodyMaterial: CANNON.Material){
        //WHEELS
        const down = new CANNON.Vec3(0, -1, 0);
        const angularDamping = 0.8;
            
        let wheelPositions =[
            new CANNON.Vec3(this.axisWidth / 2, 0, -5),
            new CANNON.Vec3(-this.axisWidth / 2, 0, -5),
            new CANNON.Vec3(this.axisWidth / 2, 0, 5),
            new CANNON.Vec3(-this.axisWidth / 2, 0, 5)
        ];
        
        for(let i=0;i<4;i++){
            const wheelBody = new CANNON.Body({
                mass: 3, //kg
                angularDamping: angularDamping,
                shape: new CANNON.Sphere(1),
                material: wheelBodyMaterial // este spherePhysMat (o como se llame en cada sitio, wheelBodyMaterial) es el que se va a asociar con el groundPhysMat para definir la fisica del contacto entre esos dos materiales
            });
            
            this.wheelBodies.push(wheelBody);
            
            this.rigidVehicle.addWheel({
                body: wheelBody,
                position: wheelPositions[i],
                axis: new CANNON.Vec3(-1, 0, 0),
                direction: down,
            });
        }
    }
}


