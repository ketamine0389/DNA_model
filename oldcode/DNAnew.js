// https://stackoverflow.com/questions/11794277/glsl-shader-for-glossy-specular-reflections-on-an-cubemapped-surface
/* 
 * Setting up the scene
 */

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = Detector.webgl? new THREE.WebGLRenderer( { antialias: true } ): new THREE.CanvasRenderer();
const dna = new THREE.Object3D();
const holder = new THREE.Object3D();

renderer.setSize(window.innerWidth, window.innerHeight);
$('body').append(renderer.domElement);
camera.position.z = 20;


/* 
 * Colors
 */

const blue = new THREE.Vector3(0, 1, 1);            //0x84D0F0;
const yellow = new THREE.Vector3(1, 1, .3);         //0xFED162;
const purple = new THREE.Vector3(0.75, 0.3, 1);     //0x651E59;
const red = new THREE.Vector3(1, 0.2 , 0.3);        //0xF02727;
const pink = new THREE.Vector3(1, .5, 1);           //0xFF69B4;
const white = 0x404040;


/*
 * Shaders (written in GLSL)
 */

// const _VS = `
    // 
    // varying vec3 v_Normal;
// 
	// void main() {
		// gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        // v_Normal = normal;
	// }
// `;
// 
// const _FS = `
    // 
    // uniform vec3 color;
// 
    // varying vec3 v_Normal;
// 
    // void main() {
        // //gl_FragColor = vec4(v_Normal, 1.0);
        // gl_FragColor = vec4(color, 1.0);
    // }
// `;

const _VS = `
    uniform vec3 fvEyePosition;

    varying vec3 ViewDirection;
    varying vec3 Normal;

    void main(void)
    {
       gl_Position = ftransform();
       vec4 fvObjectPosition = gl_ModelViewMatrix * gl_Vertex;

       ViewDirection  = fvEyePosition - fvObjectPosition.xyz;
       Normal         = gl_NormalMatrix * gl_Normal;
    }
`;

const _FS = `
    uniform vec3 color;
    // uniform samplerCube cubeMap;

    varying vec3 ViewDirection;
    varying vec3 Normal;

    const float mother_pearl_brightness = 1.5;

    #define MOTHER_PEARL

    void main( void )
    {
       vec3  fvNormal         = normalize(Normal);
       vec3  fvViewDirection  = normalize(ViewDirection);
       vec3  fvReflection     = normalize(reflect(fvViewDirection, fvNormal)); 

    #ifdef MOTHER_PEARL
       float view_dot_normal = max(dot(fvNormal, fvViewDirection), 0.0);
       float view_dot_normal_inverse = 1.0 - view_dot_normal;

       gl_FragColor = textureCube(color, fvReflection) * view_dot_normal;
       gl_FragColor.r += mother_pearl_brightness * textureCube(color, fvReflection + vec3(0.1, 0.0, 0.0) * view_dot_normal_inverse) * (1.0 - view_dot_normal);
       gl_FragColor.g += mother_pearl_brightness * textureCube(color, fvReflection + vec3(0.0, 0.1, 0.0) * view_dot_normal_inverse) * (1.0 - view_dot_normal);
       gl_FragColor.b += mother_pearl_brightness * textureCube(color, fvReflection + vec3(0.0, 0.0, 0.1) * view_dot_normal_inverse) * (1.0 - view_dot_normal);
    #else
       gl_FragColor = textureCube(color, fvReflection);
    #endif
    }
`;

/*
 * Setting up the materials
 */

const blueMaterial = new THREE.ShaderMaterial({
    uniforms: {
        color: {
            value: blue
        },
        fvEyePosition: {
            value: new THREE.Vector3(1, 1, 1)
        }
    },
    vertexShader: _VS,
    fragmentShader: _FS,
    side: THREE.DoubleSide,
    transparent: true,
    color: blue
});
const yellowMaterial = new THREE.ShaderMaterial({
    uniforms: {
        color: {
            value: yellow
        },
        fvEyePosition: {
            value: new THREE.Vector3(1, 1, 1)
        }
    },
    vertexShader: _VS,
    fragmentShader: _FS,
    side: THREE.DoubleSide,
    transparent: true
});
const purpleMaterial = new THREE.ShaderMaterial({
    uniforms: {
        color: {
            value: purple
        },
        fvEyePosition: {
            value: new THREE.Vector3(1, 1, 1)
        }
    },
    vertexShader: _VS,
    fragmentShader: _FS,
    side: THREE.DoubleSide,
    transparent: true
});
const redMaterial = new THREE.ShaderMaterial({
    uniforms: {
        color: {
            value: red
        },
        fvEyePosition: {
            value: new THREE.Vector3(1, 1, 1)
        }
    },
    vertexShader: _VS,
    fragmentShader: _FS,
    side: THREE.DoubleSide,
    transparent: true
});
const pinkMaterial = new THREE.ShaderMaterial({
    uniforms: {
        color: {
            value: pink
        },
        fvEyePosition: {
            value: new THREE.Vector3(1, 1, 1)
        }
    },
    vertexShader: _VS,
    fragmentShader: _FS,
    side: THREE.DoubleSide,
    transparent: true
});


/* 
 * Instantiate the geometry
 */

const ladderGeometry = new THREE.CylinderGeometry(0.3, 0.3, 6, 32);
const rectGeometry = new THREE.BoxGeometry(.75, 3, 1);


/*
 * Generating the "ladder"
 */

for (i=0; i <= 40; i++) {
    const meshArr = [
        new THREE.Mesh(ladderGeometry, blueMaterial),   // blue
        new THREE.Mesh(ladderGeometry, yellowMaterial), // yellow
        new THREE.Mesh(ladderGeometry, redMaterial),    // red
    ];

    let leftLadderMesh = meshArr[Math.floor(Math.random() * 3)];
    let rightLadderMesh = meshArr[Math.floor(Math.random() * 3)];

    leftLadderMesh.rotation.z = 90 * Math.PI/180;
    rightLadderMesh.rotation.z = 90 * Math.PI/180; 
    leftLadderMesh.position.x = -3;
    rightLadderMesh.position.x= 3;

    let purpleRect = new THREE.Mesh(rectGeometry, purpleMaterial);   // purple
    let pinkRect = new THREE.Mesh(rectGeometry, pinkMaterial);       // pink

    let rectRightMesh = Math.random() > 0.5 ?purpleRect:pinkRect;
    rectRightMesh.position.x = 6;
	rectRightMesh.rotation.x = -Math.PI/3.893;
	
    // this is stupid but it has to be here
    purpleRect = new THREE.Mesh(rectGeometry, purpleMaterial);   // purple
    pinkRect = new THREE.Mesh(rectGeometry, pinkMaterial);       // pink

    let rectLeftMesh = Math.random() > 0.5 ?purpleRect:pinkRect;
    rectLeftMesh.position.x = -6;
	rectLeftMesh.rotation.x = Math.PI/3.893;

    let row = new THREE.Object3D();
    row.add(leftLadderMesh);
    row.add(rightLadderMesh);
    row.add(rectRightMesh);
    row.add(rectLeftMesh);

    row.position.y = i*2;
    row.rotation.y = 20*i * Math.PI/180;

    dna.add(row);
}

dna.position.y = -40;

scene.add(dna);

dna.position.y = -40;
holder.add(dna);
scene.add(holder);

// const light = new THREE.PointLight( white, 1, 100 );
// light.position.set( 50, 75, 63 );
// scene.add( light );

// let viewConfig = function() {this.zoom = 20;};
// const view = new viewConfig();
// gui.add( view, 'zoom', 20, 40 ).onChange( function(value) { camera.position.z = value; });

// const amLight = new THREE.AmbientLight();
// scene.add( light );

const gui = new dat.GUI();
const cameraFolder = gui.addFolder('Camera');
cameraFolder.add( camera.position, 'z', 20, 40 ).name('Pos Z');
cameraFolder.add( camera.rotation, 'x', -Math.PI/7, Math.PI/7 ).name('Roll');
gui.close();


/*
 * Rendering everything to the page.
 */

const render = function () {
    requestAnimationFrame(render);

    // holder.rotation.x += 0.001; // rotate up / down
    holder.rotation.y += 0.01; // rotate left / right
    renderer.render(scene, camera);
}

render();