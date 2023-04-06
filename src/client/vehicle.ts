import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import * as GUIUtils from '../client/gui'
import * as utils from '../client/utils'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export class Vehicle {
    // vehicleGeometry: THREE.ConeGeometry = new THREE.ConeGeometry(4,2);
    meshGeometry: THREE.BufferGeometry | undefined;
    meshMaterial: THREE.Material | undefined;
    public vehicleMesh: THREE.Mesh = new THREE.Mesh();
    public vehicleBody: CANNON.Body = new CANNON.Body();
    axisWidth: number  = 9;
    axisLength: number = 6;
    public wheelRadius: number = 1;
    wheelPositions: CANNON.Vec3[]  = [];
    wheelColors: THREE.Color[]  = [];
    public wheelBodies: CANNON.Body[] = [];
    public wheels: any[]= [];
    public rigidVehicle: CANNON.RigidVehicle = new  CANNON.RigidVehicle();
    public air: boolean = false;
    public avgSpeed: number=0;
    public camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera();
    public cameraMode: number | undefined;
    private mouseClicked = false;
    public shouldUpdateHUD = true;
    public showHelp = true;


    constructor(data: Partial<Vehicle>){
        console.log('INTO CONSTRUCTOR')
        Object.assign(this,data);
        console.log(this)
        if(this.meshGeometry && this.meshMaterial){
            this.vehicleMesh = new THREE.Mesh(this.meshGeometry,this.meshMaterial);
        }else{
            this.meshGeometry = this.vehicleMesh.geometry;
            this.meshMaterial = this.vehicleMesh.material as THREE.Material;
        }
        this.rigidVehicle = new CANNON.RigidVehicle({
            chassisBody: this.vehicleBody,
        });
        this.wheelPositions = [
            new CANNON.Vec3(this.axisWidth / 2, 0, -this.axisLength),
            new CANNON.Vec3(-this.axisWidth / 2, 0, -this.axisLength),
            new CANNON.Vec3(this.axisWidth / 2, 0, this.axisLength),
            new CANNON.Vec3(-this.axisWidth / 2, 0, this.axisLength)
        ]
        console.log('OUTTA CONSTRUCTOR')
    }

    
    // constructor(
    //     cameraMode = 1,
    //     // meshGeometry = new THREE.BoxGeometry(8, 1, 16),
    //     meshGeometry = new THREE.BufferGeometry(),
    //     meshMaterial = new THREE.MeshPhysicalMaterial({ 
    //         color: 0xaaaaaa,
    //         side: THREE.FrontSide,
    //         wireframe: false,
    //         roughness: 0.01,
    //         metalness: 0.9,
    //         reflectivity: 1,
    //         clearcoat:1,
    //         clearcoatRoughness: 0.01
    //     }),
    //     // meshMaterial = new THREE.Material(),
    //     mesh = new THREE.Mesh(meshGeometry,meshMaterial),
    //     axisWidth = 9,
    //     axisLength = 6,
    //     bodyMass = 120,
    //     bodyPosition = new CANNON.Vec3(-10, 40.5, 0),
    //     // bodyShape = new CANNON.Box(new CANNON.Vec3(meshGeometry.parameters.width/2, meshGeometry.parameters.height/2, meshGeometry.parameters.depth/2)),
    //     bodyShape = new CANNON.Box(new CANNON.Vec3(4, 0.5, 8)),

    //     bodyMaterial = new CANNON.Material({ friction: 2, restitution: 0.9 }),
    //     body  = new CANNON.Body({
    //         mass: bodyMass,
    //         position: bodyPosition,
    //         shape: bodyShape,
    //         material: bodyMaterial 
    //     }),
    //     rigidVehicle = new CANNON.RigidVehicle({
    //         chassisBody: body,
    //     }),
    //     wheelRadius = 1.1,
    //     wheelPositions=[
    //         new CANNON.Vec3(axisWidth / 2, 0, -axisLength),
    //         new CANNON.Vec3(-axisWidth / 2, 0, -axisLength),
    //         new CANNON.Vec3(axisWidth / 2, 0, axisLength),
    //         new CANNON.Vec3(-axisWidth / 2, 0, axisLength)
    //     ],
    //     wheelColors= [
    //         new THREE.Color(0,0,1),
    //         new THREE.Color(0,1,0),
    //         new THREE.Color(1,0,0),
    //         new THREE.Color(1,1,0),
    //     ]
    //     ){
    //     this.cameraMode = cameraMode;
    //     this.axisWidth = axisWidth;
    //     this.axisLength = axisLength;
    //     this.vehicleMeshGeometry = meshGeometry;
    //     this.vehicleMeshMaterial = meshMaterial;
    //     this.vehicleMesh = mesh;
    //     this.vehicleBody = body
    //     this.rigidVehicle = rigidVehicle;
    //     this.wheelRadius = wheelRadius;
    //     this.wheelPositions = wheelPositions;
    //     this.wheelColors = wheelColors;
    //     console.log('vehicle constructor')
    // }

    public addCamera(size: number[],label:string){
        this.camera = new THREE.PerspectiveCamera(35, size[0]/size[1], 1, 2000)
        this.camera.position.x = 1;
        this.camera.position.y = 20 + (Math.abs(this.vehicleMesh.position.z) + Math.abs(this.vehicleMesh.position.x)) / 2
        this.camera.position.z = 78;
        this.camera.rotation.x=-.22;
        this.camera.rotation.y=0;
        this.camera.rotation.z=0;
        
        GUIUtils.addCameraFolder(this.camera,label);
        return this.camera;
    }


    public addWheels(scene: THREE.Scene,wheelBodyMaterial: CANNON.Material){
        //WHEELS
        const down = new CANNON.Vec3(0, -1, 0);
        const angularDamping = 0.8;

        for(let i=0;i<4;i++){
            const wheelBody = new CANNON.Body({
                mass: 5, //kg
                angularDamping: angularDamping,
                shape: new CANNON.Sphere(this.wheelRadius),
                material: wheelBodyMaterial // este spherePhysMat (o como se llame en cada sitio, wheelBodyMaterial) es el que se va a asociar con el groundPhysMat para definir la fisica del contacto entre esos dos materiales
            });
            
            this.wheelBodies.push(wheelBody);
            
            this.rigidVehicle.addWheel({
                body: wheelBody,
                position: this.wheelPositions[i],
                axis: new CANNON.Vec3(-1, 0, 0),
                direction: down,
            });

            const wheelGeometry = new THREE.CylinderGeometry( this.wheelRadius, this.wheelRadius);

            const wheelMaterial = new THREE.MeshNormalMaterial();
            const wheelMesh = new THREE.Mesh(wheelGeometry,new THREE.MeshBasicMaterial({color:this.wheelColors[i],wireframe: true}));
            // wheelMesh.add(new THREE.AxesHelper(10))
            wheelMesh.geometry.rotateZ(-Math.PI/2);
            this.wheels.push({mesh: wheelMesh, body: this.wheelBodies[i]});
            scene.add(wheelMesh);
        }
    }

    public setupControls() {
        let jumpVelocity = 200
        let jumpReleased = true;
        utils.toggleHelp(this.showHelp);
        let maxSteerVal = this.avgSpeed > 90 ? Math.PI / 24 : Math.PI / 16;
        document.addEventListener('keydown', (event) => {
            
            const maxForce = this.avgSpeed < 50 ? 2200 : 1900;

            switch (event.key) {
                case 'h':
                    this.showHelp = !this.showHelp;
                    utils.toggleHelp(this.showHelp);
                    
                    break;
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
                    this.rigidVehicle.applyWheelForce(0,0);
                    this.rigidVehicle.applyWheelForce(0,1);
                    this.rigidVehicle.applyWheelForce(0,2);
                    this.rigidVehicle.applyWheelForce(0,3);
                    this.rigidVehicle.setSteeringValue(0, 0);
                    this.rigidVehicle.setSteeringValue(0, 1);
                    this.rigidVehicle.setSteeringValue(0, 2);
                    this.rigidVehicle.setSteeringValue(0, 3);
                    break;
                case '1':
                    this.shouldUpdateHUD = this.cameraMode != 1;
                    this.cameraMode = 1;
                    this.camera.position.x = 1;
                    this.camera.position.y = 20+ Math.sign(this.vehicleBody.position.z)*(this.vehicleBody.position.z/50);;
                    this.camera.position.z = 78;
                    this.camera.rotation.x = -.22;
                    this.camera.rotation.y = 0;
                    this.camera.rotation.z = 0
                    break;
                case '2':
                    this.shouldUpdateHUD = this.cameraMode !=  2;
                    this.cameraMode = 2;
                    this.camera.position.x = 1;
                    this.camera.position.y = 20;
                    this.camera.position.z = 78;
                    this.camera.rotation.x = -.22;
                    this.camera.rotation.y = 0;
                    this.camera.rotation.z = 0
                    break;
                case '3':
                    this.shouldUpdateHUD = this.cameraMode != 3;
                    this.cameraMode = 3;
                    this.camera.position.x = 1;
                    this.camera.position.y = 20;
                    this.camera.position.z = 78;
                    this.camera.rotation.x = -.22;
                    this.camera.rotation.y = 0;
                    this.camera.rotation.z = 0
                    break;    
                case '4':
                    this.shouldUpdateHUD = this.cameraMode !=  4;
                    this.cameraMode = 4;
                    this.camera.position.x = -500;
                    this.camera.position.y = 421;
                    this.camera.position.z = 421;
                    this.camera.rotation.x = -0.51;
                    this.camera.rotation.y = -0.62;
                    this.camera.rotation.z = -0.29;
                    break;
                case 'r':
                    this.vehicleBody.position.setZero();
                    this.vehicleBody.velocity.setZero();
                    this.vehicleBody.inertia = new CANNON.Vec3(0, 0, 0);
                    this.wheelBodies.forEach(wheelBody=>wheelBody.quaternion = wheelBody.initQuaternion)
                    
                    this.rigidVehicle.setWheelForce(0, 0);
                    this.rigidVehicle.setWheelForce(0, 1);
                    this.vehicleBody.torque.setZero();
                    this.vehicleBody.angularVelocity.set(0, 0, 0)
                    this.vehicleBody.quaternion = this.vehicleBody.initQuaternion;
                    this.vehicleBody.position.setZero();
                    this.vehicleMesh.position.set(0,0,0);
                    break;
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

        document.addEventListener('mousedown',(event)=>{
            console.log(event.button)
            this.mouseClicked = event.button === 0;  //left mouse
        })
        document.addEventListener('mouseup',(event)=>{
            console.log(event.button)
            if(event.button === 0){
                this.mouseClicked = false;
            }
        })

        document.addEventListener('mousemove', (event) => {
            const spinMult = 0.5;
            if (this.air && this.mouseClicked) {
                var directionVector = new CANNON.Vec3(- event.movementY * spinMult, this.vehicleBody.angularVelocity.y/10, -event.movementX * spinMult);
                directionVector = this.vehicleBody.quaternion.vmult(directionVector);
                this.vehicleBody.angularVelocity.set(
                    directionVector.x,
                    this.vehicleBody.angularVelocity.y/10   + directionVector.y,
                    directionVector.z);
                this.wheelBodies.forEach(wheelBody=>wheelBody.angularVelocity.set(directionVector.x, directionVector.y, directionVector.z));
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

    public updatePosition() {
        this.vehicleMesh.position.copy(utils.copyVector(this.vehicleBody.position));
        this.vehicleMesh.quaternion.copy(utils.copyQuaternion(this.vehicleBody.quaternion));

        this.wheels.forEach(wheel => {
            wheel.mesh.position.copy(utils.copyVector(wheel.body.position));
            wheel.mesh.quaternion.copy(utils.copyQuaternion(wheel.body.quaternion));
        });

        this.avgSpeed = (this.rigidVehicle.getWheelSpeed(2) + this.rigidVehicle.getWheelSpeed(3)) / 2

        this.air = !this.wheels.map(wheel => wheel.body.position.y).some(pos => pos < this.wheelRadius)

        if (this.cameraMode === 1) {
            let zpos = this.vehicleBody.position.z / 10;
            let sign = Math.sign(this.vehicleBody.position.z / 10);
            this.camera.position.y = 20 + (sign * (zpos));
        } else if (this.cameraMode == 2) {
            let magnitude = new CANNON.Vec3(this.vehicleBody.velocity.x,0,this.vehicleBody.velocity.z).length()/85;
            
            //NEED TO FIND A WAY TO DETECT WHEN VEHICLE SWITCHES DIRECTION FORWARDS/BACKWARDS.
            // console.table([this.rigidVehicle.getWheelSpeed(0),this.rigidVehicle.getWheelSpeed(1),this.rigidVehicle.getWheelSpeed(2),this.rigidVehicle.getWheelSpeed(3)]);
            
            // let forward = [this.rigidVehicle.getWheelSpeed(0),
            //     this.rigidVehicle.getWheelSpeed(1),
            //     this.rigidVehicle.getWheelSpeed(2),
            //     this.rigidVehicle.getWheelSpeed(3)].some(speed=>speed<0) && !this.air ? -1 : 1;

            
            // forward = 1 -> camera OK going forwards
            // forward = -1 -> camera OK going backwards
            let forward = 1;

            this.camera.position.x = this.vehicleMesh.position.x - forward*this.vehicleBody.velocity.x/magnitude;
            this.camera.position.y = this.vehicleMesh.position.y + 20;
            this.camera.position.z = this.vehicleMesh.position.z - forward*this.vehicleBody.velocity.z/magnitude;


        }else if(this.cameraMode == 3){
            this.camera.position.x = this.vehicleMesh.position.x;
            this.camera.position.y = this.vehicleMesh.position.y + 20;
            this.camera.position.z = this.vehicleMesh.position.z + 78;
        }

        this.camera.lookAt(this.vehicleMesh.position);
    }
}