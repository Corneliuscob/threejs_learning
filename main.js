import './style.css'

import  * as THREE from 'three';

import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';



// Instantiate a loader
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
loader.setDRACOLoader( dracoLoader );
// Load a glTF resource
loader.load(
	// resource URL
	'models/gltf/duck/duck.gltf',
	// called when the resource is loaded
	function ( gltf ) {

		scene.add( gltf.scene );

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object

	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

//need a scene camera and render
const scene = new THREE.Scene();

//perscpective camera is how we perceive the world
const camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight,0.1,1000);


const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector('#bg'),
});

//renderer pixel an screensize 
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth,window.innerHeight);
//curentyl set at position  0 00 
camera.position.setZ(30);
renderer.render(scene,camera);

const geometry = new THREE.TorusGeometry(10,3,16,100);
//mesh basic material  requires no lighting 
// const material = new THREE.MeshBasicMaterial({color: 0xFF6347,wireframe:true}); 
const material = new THREE.MeshStandardMaterial({color: 0xFF6347});
const torus = new THREE.Mesh (geometry,material);

scene.add(torus);
//to  show the torus we need to re render the scene and we can do taht by calling a render loop to continuously update the scene.

//point light is spotlight
const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(5,5,5);
//ambient light iseverythig is lit
const ambientLight = new THREE.AmbientLight(0xffffff);

scene.add(pointLight,ambientLight);
//this helper shows the location of our point light in  the scene.
const lightHelper = new THREE.PointLightHelper(pointLight);

const gridHelper = new THREE.GridHelper(200,50);

scene.add(lightHelper,gridHelper);

// we're giving orbit controls that change the camera and they're based no dom elements given by the mouse
const controls = new OrbitControls(camera,renderer.domElement)

function addStar(){
  //create a new star block (each star will be a sphere)
  const geometry = new THREE.SphereGeometry(0.25,24,24);
  const material = new THREE.MeshStandardMaterial({color: 0xffffff});
  const star = new THREE.Mesh(geometry,material);

  // to gie it ranom locations we create an array of x y and z locations and fill and map it with random locations
  //random locations given by floatspread and fills then maps. mapp applies a callback function to every element in the aray
  const [x,y,z] = Array(3).fill().map(()=> THREE.MathUtils.randFloatSpread(100));

  star.position.set(x,y,z);
  scene.add(star);

}
//fill fills in every element
// for each array in 200, fill itwith a value an the value is the add star function
Array(200).fill().forEach(addStar)

const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

//texture mapping 
const textureMap = new THREE.TextureLoader().load('space.jpg');

const spaceBlock = new THREE.Mesh(
  new THREE.BoxGeometry(3,3,3),
  new THREE.MeshBasicMaterial({map:textureMap})
)
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3,32,32),
  new THREE.MeshStandardMaterial({
    map:moonTexture,
    normalMap:normalTexture,
  })
);
//These two dont sem to work
// moon.setZ(30);
// moon.setX(-10);
// two ways to set position
moon.position.x = -10;
moon.position.z =  30;

scene.add(spaceBlock,moon);


function moveCamera(){
  //this gets the bounding rectangle of the crrent view port as well as how far the bounding rectangle is from the top

  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.01;
  moon.rotation.y += 0.005;
  moon.rotation.z += 0.01;

  spaceBlock.rotation.x += 0.01;
  spaceBlock.rotation.y += 0.005;
  spaceBlock.rotation.z += 0.01;
//top position is going to be negative so we move psitively agaisnt the negatives
  camera.position.z = -t*0.01;
  camera.position.x = -t*0.0002;
  camera.position.y = -t*0.0002;
}

//assign move camera function to operate on the onscroll event
document.body.onscroll = moveCamera;

function animate(){
  requestAnimationFrame(animate);


  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;
  controls.update();

  renderer.render(scene,camera);
}

animate() ;

