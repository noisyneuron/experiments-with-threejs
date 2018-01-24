var camera, scene, renderer;
var cameraControls;
var mouse;
var count = 30;
var meshes = [];


function init() {
  mouse = new THREE.Vector2(Math.random()*2-1, Math.random()*2-1);

  scene = new THREE.Scene();
  scene.overrideMaterial = new THREE.MeshDepthMaterial();
  scene.overrideMaterial.depthFunc = 1;
  
  camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 40, 280);
  camera.position.set(0, 0, 50);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  cameraControls = new THREE.OrbitControls( camera );
  cameraControls.update();

  var geometry = new THREE.DodecahedronGeometry(10, 0);
  var material = new THREE.MeshLambertMaterial({color: 0xFFFFFF });
  for(var i=0; i<count; i++) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = i*0.2;
    meshes.push(mesh);
    scene.add(mesh);
  }

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild( renderer.domElement );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
}

function onDocumentMouseMove( event ) {
  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function animate() {
  requestAnimationFrame( animate );
  render();
}
  
function render() {
  cameraControls.update();
  var timer = Date.now() * 0.0005;
  for(var i=0; i<count; i++) {
    var mesh = meshes[i];
    var ang1 = i/count * Math.PI;
    var ang2 = (count-i)/count * Math.PI;
    // ang2 *= ang2;
    var x = mouse.x * Math.sin(ang1+timer)*10;
    var y = mouse.y * Math.cos(ang1+timer)*10;
    var z = Math.cos(ang2+timer)*30;
    mesh.position.set(x,y,z);
    mesh.rotation.x += .01;
    // mesh.rotation.y += ang1*0.01;
    // mesh.rotation.z += ang1*0.01;
  }
  renderer.render(scene, camera);
}

init();
animate();