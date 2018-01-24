var camera, scene, renderer;
var light;
var cameraControls;
var mouse;
var count = 400;
var meshes = [];
var c = 0.25;

var camPosition = { x : 0, y: 0, z: 10 };


function init() {
  mouse = new THREE.Vector2(Math.random()*2-1, Math.random()*2-1);

  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 280);
  camera.position.set(camPosition.x, camPosition.y, camPosition.z);
  camera.lookAt(new THREE.Vector3(-50, 0, 0));

  cameraControls = new THREE.OrbitControls( camera );
  cameraControls.update();

  light = new THREE.PointLight( 0x112fb6, 2, 100 );
  light.position.set( 0, 0, 20 );
  scene.add( light );

  var geometry = new THREE.ConeGeometry(.25, .75, 32);
  var material = new THREE.MeshLambertMaterial();

  for(var i=0; i<count; i++) {
    var theta = i * 139.512 * Math.PI / 180;
    var radius = c * Math.sqrt(i);
    var x = radius * Math.cos(theta);
    var y = radius * Math.sin(theta);
    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = i*0.01;
    mesh.rotation.y = i*0.01;
    mesh.rotation.z = theta + 1.5*Math.PI;
    mesh.position.set(x,y,-i*0.015);
    meshes.push(mesh);
    scene.add(mesh);
  }

  createCamAnimations();

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild( renderer.domElement );
}

function createCamAnimations(  ) {
  var tween1 = new TWEEN.Tween(camPosition)
    .to({x: -9, y: 8, z: 15}, 6000)
    .delay(600)
    // .easing(TWEEN.Easing.Sinusoidal.InOut)
    .onUpdate(updateCam);

  var tween2 = new TWEEN.Tween(camPosition)
    .to({x: -6, y: 12, z: 0}, 6000)
    // .delay(2000)
    // .easing(TWEEN.Easing.Quintic.InOut)
    .onUpdate(updateCam);

  var tween3 = new TWEEN.Tween(camPosition)
    .to({x: -10, y: 8, z: -8}, 6000)
    // .delay(2000)
    // .easing(TWEEN.Easing.Circular.InOut)
    .onUpdate(updateCam);

  var tween4 = new TWEEN.Tween(camPosition)
    .to({x: -18, y: 20, z: -10}, 6000)
    // .delay(2000)
    // .easing(TWEEN.Easing.Circular.InOut)
    .onUpdate(updateCam);

  var tween5 = new TWEEN.Tween(camPosition)
    .to({x: -4, y: 9, z: 0}, 6000)
    // .delay(2000)
    // .easing(TWEEN.Easing.Circular.InOut)
    .onUpdate(updateCam);

  var tween6 = new TWEEN.Tween(camPosition)
    .to({x: 0, y: 0, z: 10}, 6000)
    // .delay(2000)
    // .easing(TWEEN.Easing.Circular.InOut)
    .onUpdate(updateCam);

  tween1.chain(tween2);
  tween2.chain(tween3);
  tween3.chain(tween4);
  tween4.chain(tween5);
  tween5.chain(tween6);
  tween6.chain(tween1);

  tween1.start();
}

function updateCam() {
    camera.position.x = camPosition.x;
    camera.position.y = camPosition.y;
    camera.position.z = camPosition.z;
    // camera.up = new THREE.Vector3(0,1,0);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
};

function animate() {
  requestAnimationFrame( animate );
  render();
}
  
function render() {
  // cameraControls.update();
  var timer = Date.now() * 0.0005;

  for(var i=0; i<count; i++) {
    mesh = meshes[i];
    mesh.rotation.x -= 0.05;
    mesh.rotation.y -= 0.05;
  }
  TWEEN.update();
  renderer.render(scene, camera);
}

init();
animate();