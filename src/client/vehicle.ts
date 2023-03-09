import THREE = require("three");

function createVehicle(){
    const carGeometry = new THREE.BoxGeometry(8, 1, 16);
const carMaterial = new THREE.MeshPhysicalMaterial({ 
	color: 0xaaaaaa,
	side: THREE.FrontSide,
	wireframe: false,
    roughness: 0.01,
    metalness: 0.9,
    reflectivity: 1,
    clearcoat:1,
    clearcoatRoughness: 0.01
 });
const carMesh = new THREE.Mesh(carGeometry, carMaterial);
return carMesh;
}

export {createVehicle}