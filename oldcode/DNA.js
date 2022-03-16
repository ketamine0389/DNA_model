// import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = Detector.webgl? new THREE.WebGLRenderer( { antialias: true } ): new THREE.CanvasRenderer();

// const controls = new THREE.OrbitControls( camera, renderer.domElement );

const blue = 0x84D0F0;
const yellow = 0xFED162;
const purple = 0x651E59;
const red = 0xf02727;

renderer.setSize(window.innerWidth, window.innerHeight);
$('body').append(renderer.domElement);

camera.position.z = 20;

/*
 * Shader init
 */

const VS = `
	void main() {
		gl Position = projectMatrix * modelViewMatrix * vec4(position, 1.0); 
	}
`;

/*
 * Geometry / Materials
 */

const ladderGeometry = new THREE.Mesh(
	new THREE.CylinderGeometry(0.3, 0.3, 6, 32),
	new THREE.ShaderMaterial({
		uniforms: {}, 
		vertexShader: VS
	})
);
ladderGeometry.castShadow = true;

const rectGeometry = new THREE.Mesh(
	new THREE.BoxGeometry(.75, 3, 1),
	new THREE.ShaderMaterial({
		uniforms: {}, 
		vertexShader: VS
	})
);
rectGeometry.castShadow = true;

const blueMaterial = new THREE.MeshBasicMaterial( { color: blue } );
const yellowMaterial = new THREE.MeshBasicMaterial( { color: yellow } );
const purpleMaterial = new THREE.MeshBasicMaterial( { color: purple } );
const redMaterial = new THREE.MeshBasicMaterial( { color: red } );

const dna = new THREE.Object3D();
const holder = new THREE.Object3D();


for (i = 0; i <= 40; i++) { 
    /*
     * Generating the "ladder"
     */

    const basearr = [
        new THREE.Mesh(ladderGeometry, blueMaterial),   // blue
        new THREE.Mesh(ladderGeometry, yellowMaterial), // yellow
        new THREE.Mesh(ladderGeometry, redMaterial),    // red
    ];
    let baseLeft, baseRight;

    baseRight = basearr[Math.floor(Math.random() * 3)];
    baseLeft = basearr[Math.floor(Math.random() * 3)];

    console.log(baseLeft);

    baseLeft.rotation.z = 90 * Math.PI/180;
    baseRight.rotation.z = 90 * Math.PI/180; 
    baseLeft.position.x = -3;
    baseRight.position.x= 3;

    let rectRight = new THREE.Mesh( rectGeometry, purpleMaterial );
    rectRight.position.x = 6;
	rectRight.rotation.x = -Math.PI/3.893;
	
    let rectLeft = new THREE.Mesh( rectGeometry, purpleMaterial );
    rectLeft.position.x = -6;
	rectLeft.rotation.x = Math.PI/3.893;

    let row = new THREE.Object3D();
    row.add(baseLeft);
    row.add(baseRight);
    row.add(rectRight);
    row.add(rectLeft);

    row.position.y = i*2;
    row.rotation.y = 20*i * Math.PI/180;

    dna.add(row);
};

dna.position.y = -40;

scene.add(dna);

dna.position.y = -40;
holder.add(dna)
scene.add(holder);

let CubeConfigData = function() {
    this.zoom = 20;
};

let view = new CubeConfigData();
let gui = new dat.GUI();
gui.close();

gui.add( view, 'zoom', 20, 40 ).onChange( function(value) {
    camera.position.z = value;
});


const render = function () {
    requestAnimationFrame(render);

    // holder.rotation.x += 0.001; // rotate up / down
    holder.rotation.y += 0.01; // rotate left / right
    renderer.render(scene, camera);
}

render();