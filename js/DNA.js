import ColoredMaterial from './ColoredMaterial.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/controls/OrbitControls.js';

/* 
 * Setting up the scene
 */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = Detector.webgl? new THREE.WebGLRenderer( { alpha: true, antialias: true } ): new THREE.CanvasRenderer();
const dna = new THREE.Object3D();
const holder = new THREE.Object3D();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
camera.position.z = 20;

let controller = new OrbitControls(camera, renderer.domElement);
controller.enabled = false;

/* 
 * Colors
 */

const blue = 0x189BCC;
const yellow = 0xFED162;
const purple = 0x651E59;
const red = 0xF02727;
const pink = 0xFF69B4;
const softWhite = 0x909090;
const white = 0xffffff;


/*
 * Setting up the materials
 */

const blueMaterial   = new THREE.MeshPhysicalMaterial(new ColoredMaterial(blue));
const yellowMaterial = new THREE.MeshPhysicalMaterial(new ColoredMaterial(yellow));
const purpleMaterial = new THREE.MeshPhysicalMaterial(new ColoredMaterial(purple));
const redMaterial    = new THREE.MeshPhysicalMaterial(new ColoredMaterial(red));
const pinkMaterial   = new THREE.MeshPhysicalMaterial(new ColoredMaterial(pink));
const whiteMaterial  = new THREE.MeshPhysicalMaterial(new ColoredMaterial(white));

/* 
 * Instantiate the geometry
 */

const ladderGeometry = new THREE.CylinderGeometry(0.3, 0.3, 6, 32);
const bigSphereGeometry = new THREE.SphereGeometry(0.8,32,32);
const smallSphereGeometry = new THREE.SphereGeometry(0.6,32,32);

const randomNum = function ( min, max ) { return Math.floor(Math.random() * (max - min + 1)) + min; }

/*
 * Generating the "ladder"
 */

for (var i=0; i <= 40; i++) {
    let meshArr = [
        new THREE.Mesh(ladderGeometry, blueMaterial),
        new THREE.Mesh(ladderGeometry, whiteMaterial),
        new THREE.Mesh(ladderGeometry, yellowMaterial),
        new THREE.Mesh(ladderGeometry, redMaterial)
    ];

    let leftLadderMesh;
    let rightLadderMesh;

    if ( randomNum( 0, 4 ) >= 2 ) {
        let int = randomNum( 0, 1 );
        leftLadderMesh = meshArr[int];
        rightLadderMesh = meshArr[Math.abs(int-1)];    
    } else {
        let int = randomNum( 0, 1 );
        leftLadderMesh = meshArr[int+2];
        rightLadderMesh = meshArr[Math.abs(int-1)+2];    
    }

    
    /*
     * Positioning the elements
     */

    leftLadderMesh.rotation.z = 90 * Math.PI/180;
    rightLadderMesh.rotation.z = 90 * Math.PI/180;
    leftLadderMesh.position.x = -3;
    rightLadderMesh.position.x= 3;


    /* 
     * Making the outer spheres
     */

    let sphLeft = new THREE.Mesh( bigSphereGeometry, purpleMaterial );
    let sphLeftUpper = new THREE.Mesh( smallSphereGeometry, pinkMaterial );
    let sphRight = new THREE.Mesh( bigSphereGeometry, purpleMaterial );
    let sphRightUpper = new THREE.Mesh( smallSphereGeometry, pinkMaterial );
    
    sphLeft.position.x = 6;
    sphLeftUpper.position.x = 6;
    sphRight.position.x = -6;
    sphRightUpper.position.x = -6;
    
    sphLeftUpper.position.y = 1;
    sphLeftUpper.position.z = -1;
    sphRightUpper.position.y = 1;
    sphRightUpper.position.z = 1;

    let row = new THREE.Object3D();
    row.add(leftLadderMesh);
    row.add(rightLadderMesh);
    row.add(sphLeft);
    row.add(sphLeftUpper);
    row.add(sphRight);
    row.add(sphRightUpper);

    row.position.y = i*2;
    row.rotation.y = 20*i * Math.PI/180;

    dna.add(row);
}

dna.position.y = -40;

scene.add(dna);

dna.position.y = -40;
holder.add(dna);
scene.add(holder);

const light1 = new THREE.PointLight( softWhite, 10, 150, 2 );
light1.position.set( 0, 50, 50 );
const light2 = new THREE.PointLight( softWhite, 10, 150, 2 );
light2.position.set( 0, -50, -50 );
scene.add( light1 );
scene.add( light2 );

const gui = new dat.GUI();
const cameraFolder = gui.addFolder( 'Camera' );
const sceneFolder = gui.addFolder( 'Scene' );

const DummyConfig = function() { this.intensity = 10; this.speed = 0.01; this.orbit = false; }
let dummy = new DummyConfig();

cameraFolder.add( camera.position, 'z', 20, 40 ).name( 'Pos Z' );
cameraFolder.add( camera.rotation, 'x', -Math.PI/7, Math.PI/7 ).name( 'Roll' );
cameraFolder.add( dummy, 'orbit' ).name( 'Controls' ).onChange( function(value) { this.orbit = value; controller.enabled = value; } );

sceneFolder.add( dummy, 'intensity', 10, 20 ).name( 'Brightness' ).onChange( function(value) { light1.intensity = value; light2.intensity = value;} );
sceneFolder.add( dummy, 'speed', 0, 0.02 ).name( 'Speed' ).onChange( function(value) { this.speed = value; });
sceneFolder.open();
cameraFolder.open();

const gui2 = new dat.GUI({width:150});
const g1 = gui2.addFolder( 'Purple = Deoxyribose' );
const g2 = gui2.addFolder( 'Pink = Phosphate' );
const g3 = gui2.addFolder( 'Blue = Adenine' );
const g6 = gui2.addFolder( 'White = Thymine' );
const g4 = gui2.addFolder( 'Red = Guanine' );
const g5 = gui2.addFolder( 'Yellow = Cytosine' );


/*
 * Rendering everything to the page.
 */

const render = function () {
    requestAnimationFrame( render );
    
    /* holder.rotation.x += 0.001; up down */
    holder.rotation.y += dummy.speed; /* left right */
    renderer.render( scene, camera );
}

render();