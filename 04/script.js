var camera, scene, renderer, camControls, light;
var path = "../img/";
var clock = new THREE.Clock();
var uniforms;

function loadShader(shadertype) {
  return document.getElementById(shadertype).textContent;
}

function createShaderMaterial() {
  uniforms = {
    time: { value: 1.0 },
    resolution: { value: new THREE.Vector2() },
    uDirLightPos: { type: "v3", value: new THREE.Vector3() },
    uDirLightColor: { type: "c", value: new THREE.Color( 0xffffff ) },
    uAmbientLightColor: { type: "c", value: new THREE.Color( 0x050505 ) },
    uMaterialColor:  { type: "c", value: new THREE.Color( 0xff0000 ) },
    uSpecularColor:  { type: "c", value: new THREE.Color( 0xaa5555 ) },
    uKd: { type: "f", value: 0.7 },
    uKs: { type: "f", value: 0.3 },
    shininess: { type: "f", value: 100.0 },
    uDropoff: { type: "f", value: 0.5 }
  };
  var vs = loadShader("vertex");
  var fs = loadShader("fragment");
  var material = new THREE.ShaderMaterial({ uniforms: uniforms, vertexShader: vs, fragmentShader: fs });
  material.uniforms.uDirLightPos.value = light.position;
  material.uniforms.uDirLightColor.value = light.color;
  uniforms.shininess.value = 20;
  uniforms.uDropoff.value = 1.;
  uniforms.uKd.value = 1.2;
  uniforms.uKs.value = .4;
  return material;
}

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 2000);
  // camControls = new THREE.TrackballControls(camera);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 150;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize( window.innerWidth, window.innerHeight );

  cameraControls = new THREE.OrbitControls( camera );

  light = new THREE.SpotLight(0xffffff, .8);
  light.position.set(-0, 30, 450);
  scene.add(light);

  var geometry = new THREE.SphereGeometry(30,32,64);
  var material = createShaderMaterial(); 
  var sphereMesh = new THREE.Mesh(geometry, material);
  scene.add(sphereMesh);

  cameraControls.update();
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
}


function animate() {
  requestAnimationFrame( animate );
  var delta = clock.getDelta();
  uniforms.time.value += delta;
  cameraControls.update();
  renderer.render( scene, camera );
}



init();
animate();