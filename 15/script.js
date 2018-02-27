var camera, scene, renderer;
var light;
var cameraControls;
var mouse;

var points = [];
var count = 100;
var radius = 3;

var particles;

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


function initPoints() {
  var geometry = new THREE.BoxGeometry(.1, .1, .1);
  var material = new THREE.MeshLambertMaterial({color:0xff0000});
  for(var i=0; i<count; i++) {
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    points.push(mesh);
  }
}

function updatePoints() {
  for(var i=0; i<count; i++) {
    var p = points[i];
    var inclination = Math.random() * 2 * Math.PI;
    var azimuth = Math.random() * 2 * Math.PI;
    var x = Math.sin(inclination) * Math.cos(azimuth);
    var y = Math.sin(inclination) * Math.sin(azimuth);
    var z = Math.cos(inclination);
    p.position.set(x,y,z);
  }
}

function init() {
  mouse = new THREE.Vector2(Math.random()*2-1, Math.random()*2-1);

  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 280);
  camera.position.set(0,0,10);

  cameraControls = new THREE.OrbitControls( camera );
  cameraControls.update();

  light = new THREE.AmbientLight( 0xffffff, 1);
  light.position.copy(camera.position);
  scene.add( light );

  // initPoints();
  // updatePoints();

  var geometry = new THREE.SphereGeometry(2, 32, 32);
  var material = new THREE.PointsMaterial( { size: .1, color: 0x888888 } );

  // for (i = 0; i < count; i++) {
  //     var vertex = new THREE.Vector3();
  //     vertex.x = Math.random() * 2 - 1;
  //     vertex.y = Math.random() * 2 - 1;
  //     vertex.z = Math.random() * 2 - 1;
  //     geometry.vertices.push(vertex);
  // }

  particles = new THREE.PointCloud(geometry, material);
  scene.add(particles);

  // OBJECTS



  // // GRID
  // var gridXZ = new THREE.GridHelper( 10, 10, 0xffffff, 0x00ff00 );
  // scene.add( gridXZ );

  // var gridYZ = new THREE.GridHelper( 10, 10, 0xffffff, 0x0000ff );
  // gridYZ.rotation.z = Math.PI * 0.5;
  // scene.add( gridYZ );  

  // var gridXY = new THREE.GridHelper( 10, 10, 0xffffff, 0xff0000 );
  // gridXY.rotation.x = Math.PI * 0.5;
  // scene.add( gridXY );

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild( renderer.domElement );
  console.log(particles.quaternion);
}

function animate() {
  requestAnimationFrame( animate );
  render();
}
  
function render() {
  var timer = Date.now() * 0.001;
  var endQuaternion = new THREE.Quaternion();
  endQuaternion.setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), Math.PI  );
  
  particles.quaternion.slerp(endQuaternion, Math.sin(timer)*0.5+0.5);

  var vertices = particles.geometry.vertices;
  for(var i=0; i<vertices.length; i++) {
    // var v = vertices[i];
    // v.quaternion.slerp(endQuaternion, timer);
  }
  // mesh.rotation.z += 0.01;
  renderer.render(scene, camera);
}

init();
animate();