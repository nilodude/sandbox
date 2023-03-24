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
    
    public wheels: any[]= [];

    public rigidVehicle: CANNON.RigidVehicle = new CANNON.RigidVehicle({
        chassisBody: this.vehicleBody,
    });

    public air: boolean = false;

    public avgSpeed: number=0;

    public vehicleCamera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();

    
    constructor(position = new CANNON.Vec3(0, 1.5, 0), material = new CANNON.Material({ friction: 2, restitution: 0.9 })){
        this.vehicleBody.position = position;
        this.vehicleBody.material = material;
    }

    public addWheels(scene: THREE.Scene,wheelBodyMaterial: CANNON.Material){
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

            const wheelGeometry = new THREE.SphereGeometry(1);
            const wheelMaterial = new THREE.MeshNormalMaterial();
            const wheelMesh = new THREE.Mesh(wheelGeometry,wheelMaterial);
            this.wheels.push({mesh: wheelMesh, body: this.wheelBodies[i]});
            scene.add(wheelMesh);
        }
    }

    public setupControls(camera: THREE.PerspectiveCamera) {
        let jumpVelocity = 300
        let jumpReleased = true;
        let cameraMode = 1;
        
        document.addEventListener('keydown', (event) => {
            let maxSteerVal = this.avgSpeed > 90 ? Math.PI / 18 : Math.PI / 12;
            const maxForce = this.avgSpeed < 30 ? 2200 : 1900;

            switch (event.key) {
                case 'w':
                case 'ArrowUp':
                    if (!this.air) {
                        this.rigidVehicle.setWheelForce(maxForce, 0);
                        this.rigidVehicle.setWheelForce(maxForce, 1);
                    }
                    break;

                case 's':
                case 'ArrowDown':
                    if (!this.air) {
                        this.rigidVehicle.setWheelForce(-maxForce, 0);
                        this.rigidVehicle.setWheelForce(-maxForce, 1);
                    }
                    break;

                case 'a':
                case 'ArrowLeft':
                    if (!this.air) {
                        this.rigidVehicle.setSteeringValue(maxSteerVal, 0);
                        this.rigidVehicle.setSteeringValue(maxSteerVal, 1);
                    }
                    break;

                case 'd':
                case 'ArrowRight':
                    if (!this.air) {
                        this.rigidVehicle.setSteeringValue(-maxSteerVal, 0);
                        this.rigidVehicle.setSteeringValue(-maxSteerVal, 1);
                    }
                    break;

                case ' ':
                    if (jumpReleased) {
                        this.rigidVehicle.wheelBodies.forEach(wheel => wheel.velocity.y += jumpVelocity);
                        jumpReleased = false;
                    }
                    break;
                case 'c':
                    //PRESSING C CHANGES CAMERA POSITION AND ROTATION
                    if (cameraMode == 1) {
                        this.vehicleMesh.add(camera)
                        cameraMode = 2;
                        camera.position.x = 1;
                        camera.position.y = 20;
                        camera.position.z = 58;
                        camera.rotation.x = -.22;
                        camera.rotation.y = 0;
                        camera.rotation.z = 0
                    } else if (cameraMode == 2) {
                        this.vehicleMesh.remove(camera)
                        cameraMode = 3;
                        camera.position.x = -500;
                        camera.position.y = 421//221;
                        camera.position.z = 421//500;
                        camera.rotation.x = -0.51//-.17;
                        camera.rotation.y = -0.62//-.73;
                        camera.rotation.z = -0.29//-.73;
                    } else {
                        cameraMode = 1;
                        camera.position.x = 1;
                        camera.position.z = 58;
                        camera.rotation.x = -.22;
                        camera.rotation.y = 0;
                        camera.rotation.z = 0
                        camera.position.y = 10 + (Math.abs(this.vehicleMesh.position.z) + Math.abs(this.vehicleMesh.position.x)) / 10
                    }
                    break;
                case 'r':
                    // vehicleBody.quaternion.set(vehicleBody.quaternion.x,vehicleBody.quaternion.y,vehicleBody.quaternion.z,vehicleBody.quaternion.w);
                    this.vehicleBody.position.setZero();
                    this.vehicleBody.inertia = new CANNON.Vec3(0, 0, 0);
                    this.rigidVehicle.setWheelForce(0, 0);
                    this.rigidVehicle.setWheelForce(0, 1);
                    this.vehicleBody.torque.setZero();
                    this.vehicleBody.angularVelocity.set(0, 0, 0)
                    this.vehicleBody.quaternion.set(0, 0, 0, this.vehicleBody.quaternion.w);
                    this.vehicleBody.velocity.setZero();
            }
        });

        // reset car force to zero when key is released
        document.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'w':
                case 'ArrowUp':
                    this.rigidVehicle.setWheelForce(0, 0);
                    this.rigidVehicle.setWheelForce(0, 1);
                    break;
                case 's':
                case 'ArrowDown':
                    this.rigidVehicle.setWheelForce(0, 0);
                    this.rigidVehicle.setWheelForce(0, 1);
                    break;

                case 'a':
                case 'ArrowLeft':
                    this.rigidVehicle.setSteeringValue(0, 0);
                    this.rigidVehicle.setSteeringValue(0, 1);
                    break;

                case 'd':
                case 'ArrowRight':
                    this.rigidVehicle.setSteeringValue(0, 0);
                    this.rigidVehicle.setSteeringValue(0, 1);
                    break;
                case ' ':
                case 'Space':
                    jumpReleased = true;
                    break;
            }
        });

        document.addEventListener('mousemove', (event) => {
            const spinMult = 0.5;
            if (this.air) {
                var directionVector = new CANNON.Vec3(- event.movementY * spinMult, 0, event.movementX * spinMult);
                var directionVector = this.vehicleBody.quaternion.vmult(directionVector);
                this.vehicleBody.angularVelocity.set(directionVector.x, directionVector.y, directionVector.z);
            }
        })
    }

    public addLights(scene: THREE.Scene) {
        //VEHICLE LIGHTS
        const spotlight = new THREE.SpotLight(0x5522aa, 2, 500, 3 * Math.PI, 1)
        spotlight.position.set(0, 0.5, 0)
        // spotlight.target.position.set(0, 0, 0)  //para que parezcan neones del coche se deja de apuntar al centro
        spotlight.castShadow = true
        scene.add(spotlight)

        //VEHICLE MESH
        spotlight.target = this.vehicleMesh;
        this.vehicleMesh.add(spotlight)
        scene.add(this.vehicleMesh);
    }

    public addCamera(){
        // this.vehicleCamera = utils.addCamera(size);
    }
}


