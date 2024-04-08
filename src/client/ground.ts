import * as THREE from 'three'
import * as CANNON from 'cannon-es'
import * as GUIUtils from '../client/gui'
import * as utils from '../client/utils'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { Vehicle } from './vehicle';

export class Ground {
    public groundMesh: THREE.Mesh = new THREE.Mesh;
    public groundBody: CANNON.Body= new CANNON.Body;
    
    addGroundMesh(scene: THREE.Scene, groundSize: number) {
        const groundGeo = new THREE.TorusGeometry(groundSize/8, groundSize/24);
        const groundMat = new THREE.MeshPhysicalMaterial({
            color: 0xaa00ff,
            side: THREE.DoubleSide,
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

    setupGround(scene: THREE.Scene, world: CANNON.World, groundSize: number, wheelPhysMat: CANNON.Material, vehicle: Vehicle) {

        //GROUND MESH
        this.groundMesh = this.addGroundMesh(scene, groundSize);

        //GROUND PHYSICS MATERIAL
        const groundPhysMat = new CANNON.Material();

        //GROUND BODY
        this.groundBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane(),
            material: groundPhysMat
        })
        this.groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0) // make it face up
        world.addBody(this.groundBody)

        // 'WHEEL <-> GROUND' PHYSICS
        const groundWheelContactMat = new CANNON.ContactMaterial(
            groundPhysMat,
            wheelPhysMat,
            {
                restitution: 0.69,
                friction: 0.7
            }
        );
        world.addContactMaterial(groundWheelContactMat);

        // 'VEHICLE <-> GROUND' PHYSICS
        const groundVehicleContactMat = new CANNON.ContactMaterial(
            groundPhysMat,
            vehicle.vehicleBody.material ? vehicle.vehicleBody.material : new CANNON.Material(),
            {
                restitution: 0.01,
                friction: 0.01
            }
        );
        world.addContactMaterial(groundVehicleContactMat);

        // const rampPhysMat = new CANNON.Material();
        // const rampMesh = utils.addRampMesh(scene);
        // const rampBody= utils.addRampBody(world,rampPhysMat);

        // // 'VEHICLE <-> RAMP' PHYSICS
        // const rampVehicleContactMat = new CANNON.ContactMaterial(
        //     rampPhysMat,
        //     vehicle.vehicleBody.material? vehicle.vehicleBody.material : new CANNON.Material(),
        //     {
        //         restitution: 0.71,
        //         friction: 0.07
        //     }
        // );
        // world.addContactMaterial(rampVehicleContactMat);

        // // 'WHEEL <-> RAMP' PHYSICS
        // const rampWheelContactMat = new CANNON.ContactMaterial(
        //     rampPhysMat,
        //     wheelPhysMat,
        //     {
        //         restitution: 0.71,
        //         friction: 0.71
        //     }
        // );
        // world.addContactMaterial(rampWheelContactMat);


        //NON PHYSICAL ELEMENTS
        //GRID HELPER
        //utils.showGridHelper(scene)

        //CUBE

        

        //MONO
        
        const objLoader = new OBJLoader();
        objLoader.load('models/mono.obj', (monkey) => {
            monkey.position.x = 0;
            monkey.position.y = 0;
            monkey.position.z = 0;
            monkey.add(new THREE.AxesHelper(5))
            scene.add(monkey);
        });

        //estas dos se podrian quitar si se crease el mesh con la misma orientacion que el body, la correcta (horizontal)
        
    }

    update(){
        this.groundMesh.position.copy(utils.copyVector(this.groundBody.position));
        this.groundMesh.quaternion.copy(utils.copyQuaternion(this.groundBody.quaternion));

        // rampMesh.position.copy(utils.copyVector(rampBody.position)); 
        // rampMesh.quaternion.copy(utils.copyQuaternion(rampBody.quaternion));
    }
}