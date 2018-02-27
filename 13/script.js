var camera, scene, renderer;
var light;
var cameraControls;
var mouse;
var count = 800;
var meshes = [];
// var meshes2 = [];
var c1 = .03;
var c2 = 0.4;

function createShaderMaterial() {
  uniforms = {
    time: { value: 1.0 },
    resolution: { value: new THREE.Vector2() },
    uDirLightPos: { type: "v3", value: new THREE.Vector3() },
    uDirLightColor: { type: "c", value: new THREE.Color( 0xffffff ) },
    uAmbientLightColor: { type: "c", value: new THREE.Color( 0x050505 ) },
    uMaterialColor:  { type: "c", value: new THREE.Color( 0xffffff ) },
    uSpecularColor:  { type: "c", value: new THREE.Color( 0xaa5555 ) },
    uKd: { type: "f", value: 0.7 },
    uKs: { type: "f", value: 0.3 },
    shininess: { type: "f", value: 100.0 },
    uDropoff: { type: "f", value: 0.5 }
  };
  var vs = document.getElementById("vertex").textContent;
  var fs = document.getElementById("fragment").textContent;
  var material = new THREE.ShaderMaterial({ 
    uniforms: uniforms, 
    vertexShader: vs, 
    fragmentShader: fs
  });
  material.uniforms.uDirLightPos.value = light.position;
  material.uniforms.uDirLightColor.value = light.color;
  uniforms.shininess.value = 20;
  uniforms.uDropoff.value = 1.;
  uniforms.uKd.value = 1.2;
  uniforms.uKs.value = .4;
  return material;
}


function init() {
  mouse = new THREE.Vector2(Math.random()*2-1, Math.random()*2-1);

  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 280);
  camera.position.set(0,0,10);
  camera.rotation.x = 0;
  camera.up = new THREE.Vector3(0,1,0);
  camera.lookAt(new THREE.Vector3(0,0,0));

  cameraControls = new THREE.OrbitControls( camera );
  cameraControls.update();

  light = new THREE.PointLight( 0xffffff, 1, 100 );
  light.position.copy(camera.position);
  scene.add( light );

  var geometry = new THREE.ConeGeometry(.15, .35, );
  // var geometry = new THREE.SphereGeometry( .2,.2,16);
  var materialYellow = new THREE.MeshLambertMaterial({color:0xafbf00});
  var materialRed = new THREE.MeshLambertMaterial({color:0xaf0000});

  var material = createShaderMaterial();

  for(var i=0; i<count; i++) {
    var altitude = Math.abs(Math.acos(1 - (i / count)));//
    var azimuth = i * 137.508 * Math.PI / 180;
    var radius = c1 * Math.sqrt(i) + 2.;
    var x = radius * Math.sin(altitude) * Math.cos(azimuth);
    var y = radius * Math.sin(altitude) * Math.sin(azimuth);
    var z = radius * Math.cos(altitude);
    var mesh = new THREE.Mesh(geometry, material);
    var meshHolder = new THREE.Object3D();
    var container = new THREE.Object3D();
    var container2 = new THREE.Object3D();

    // 35 to 75 deg movement
    mesh.position.y = .5 * .35;
    meshHolder.rotation.x = 55 * Math.PI/180;
    meshHolder.originalRotation = {};
    meshHolder.originalRotation.x = meshHolder.rotation.x ;
    meshHolder.scale.x = 1.5;
    meshHolder.scale.y = (i/count) * 4 + 1;
    container.rotation.z = azimuth+ 1.5*Math.PI;
    container2.position.set(x,y,z);

    meshHolder.add(mesh);
    container.add(meshHolder);
    container2.add(container);
    scene.add(container2);

    meshes.push(meshHolder);
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
  // camera.rotation.z += 0.001;
  light.position.copy(camera.position);

  for(var i=0; i<count; i++) {
    var obj = meshes[i];
    var range = (10 + (i)/count * 10) * Math.PI/180;//0.15 + 0.05;
    var offset =  0;//Math.sin(timer * 0.01) * 0.25;
    obj.rotation.x = obj.originalRotation.x + Math.sin(1.*timer+i*offset)  * range;
  }
  renderer.render(scene, camera);
}

init();
animate();