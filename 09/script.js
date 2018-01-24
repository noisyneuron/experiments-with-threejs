var camera, scene, renderer;
var light;
var cameraControls;
var mouse;
var count = 400;
var meshes1 = [];
var meshes2 = [];
var c1 = 0.35;
var c2 = 0.4;

function init() {
  mouse = new THREE.Vector2(Math.random()*2-1, Math.random()*2-1);

  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 280);
  camera.position.set(6,-2,-26);
  camera.rotation.x = 0;
  camera.up = new THREE.Vector3(0,1,0);
  camera.lookAt(new THREE.Vector3(0,0,0));

  cameraControls = new THREE.OrbitControls( camera );
  cameraControls.update();

  light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.copy(camera.position);
  scene.add( light );

  var geometry = new THREE.ConeGeometry(.25, .75, 4);
  var materialYellow = new THREE.MeshLambertMaterial({color:0xafbf00});
  var materialRed = new THREE.MeshLambertMaterial({color:0xaf0000});

  for(var i=0; i<count; i++) {
    var theta = i * 137.512 * Math.PI / 180;
    var radius = c1 * Math.sqrt(i);
    var x = radius * Math.cos(theta);
    var y = radius * Math.sin(theta);
    var mesh = new THREE.Mesh(geometry, materialYellow);
    var container = new THREE.Object3D();
    mesh.rotation.x = (count-i)*0.008;

    container.rotation.z = theta + 1.5*Math.PI;
    container.position.set(x,y,-i*0.015);
    container.add(mesh);
    scene.add(container);

    meshes1.push(container);
  }

  for(var i=0; i<count; i++) {
    var theta = i * 137.512 * Math.PI / 180;
    var radius = c2 * Math.sqrt(i);
    var x = radius * Math.cos(theta);
    var y = radius * Math.sin(theta);
    var mesh = new THREE.Mesh(geometry, materialRed);
    var container = new THREE.Object3D();
    mesh.rotation.x = - (count-i)*0.001;

    container.rotation.z = theta + 1.5*Math.PI;
    container.position.set(x,y,-i*0.015);
    container.add(mesh);
    scene.add(container);

    meshes2.push(container);
  }

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild( renderer.domElement );
}


function animate() {
  requestAnimationFrame( animate );
  render();
}
  
function render() {
  var timer = Date.now() * 0.001;
  // camera.position.x = .2*Math.cos(timer);
  // camera.position.y = .2*Math.sin(timer);
  camera.rotation.z += .009;
  // camera.rotation.y = .6 * Math.sin(timer);
  // light.position.copy(camera.position);

  for(var i=0; i<count; i++) {
    var mesh1 = meshes1[i];
    var mesh2 = meshes2[i];
    mesh1.rotation.z += 0.03;
    mesh2.rotation.z -= 0.02;
  }


  renderer.render(scene, camera);
}

init();
animate();