var camera, scene, renderer;
var light;
var cameraControls;
var mouse;

var points = [];
var count = 10000;
var radius = 2;

var particles;
var perlin = new SimplexNoise();

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

function debugSphere() {
  var geometry = new THREE.SphereGeometry(radius, 8, 16);
  var material = new THREE.MeshLambertMaterial({color:0xffffff});
  var mesh = new THREE.Mesh(geometry,material);
  scene.add(mesh);
}

function initPoints() {
  var geometry = new THREE.SphereGeometry(.007, 8, 8);
  var material = new THREE.MeshLambertMaterial({color:0xff0000, opacity: 0.1});
  for(var i=0; i<count; i++) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(Math.random(), Math.random(), Math.random());
    mesh.inclination = Math.random() * 2 * Math.PI;
    mesh.azimuth = Math.random() * 2 * Math.PI;
    scene.add(mesh);
    points.push(mesh);
  }
}

function updatePoints(time) {
  for(var i=0; i<count; i++) {
    var p = points[i];
    var n = perlin.noise();

    var pos = p.position;

    var ts = Math.sin( Math.PI * time * 0.1);
    var tc = Math.cos( Math.PI * time * 0.1);

    var r1 = Math.random()*.05;
    var r2 = Math.random()*.06;

    var n1 = Math.sin((perlin.noise4d(pos.x+r1, pos.y+r2, pos.z+r1, ts)*0.5+0.5)*Math.PI) * 0.251;
    var n2 = Math.cos((perlin.noise4d(pos.z+r2, pos.x+r1, pos.y+r2, tc)*0.5+0.5)*Math.PI) * 0.251;

    p.azimuth +=  n1 ;
    p.inclination += n2 ;    

    var rad1 = radius;// + Math.random()*0.25;
    var rad2 = radius;// + Math.random()*0.25;
    var rad3 = (rad1+rad2)/2;

    var rad1 = radius + perlin.noise(tc,ts)*0.5;
    var rad2 = rad3 = rad1;
    var x = rad1*Math.sin(p.inclination) * Math.cos(p.azimuth);
    var y = rad2*Math.sin(p.inclination) * Math.sin(p.azimuth);
    var z = rad3*Math.cos(p.inclination);
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

  // debugSphere();
  initPoints();
  updatePoints(0);

  var p = points[0].position;
  // console.log()
  // console.log(perlin.noise(0.5*p.x/radius, 0.5*p.y/radius, 0.5*p.z/radius));

  renderer = new THREE.WebGLRenderer({antialias: true});
  // renderer.autoClearColor = false;
  // renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild( renderer.domElement );

  console.log(points[10].quaternion);
}

function animate() {
  requestAnimationFrame( animate );
  render();
}
  
function render() {
  var timer = Date.now() * 0.001;
  updatePoints(timer);
  renderer.render(scene, camera);
}

init();
animate();