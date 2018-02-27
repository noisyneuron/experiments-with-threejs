var camera, scene, renderer;
var light;
var cameraControls;
var mouse;

var count = 100;
var objs = [];

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
  var skybox = new THREE.CubeTextureLoader()
            .setPath( '../img/planet/' )
            .load( [ 'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg' ] );
  scene.background = skybox;

  camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 2000);
  camera.position.set(0,0,10);

  cameraControls = new THREE.OrbitControls( camera );
  cameraControls.update();

  light = new THREE.AmbientLight(  0xffffff, 1 );
  light.position.copy(camera.position);
  scene.add( light );

  var geometry = new THREE.SphereGeometry(1, 32, 32);
  var material = new THREE.MeshLambertMaterial({
    color: 0xfadc92, 
    envMap: skybox,
    shininess: 40 
  });

  for(var i=0; i<count; i++) {
    var mesh = new THREE.Mesh(geometry, material);
    var s = Math.random() * 12;
    mesh.scale.set(s,s,s);
    mesh.position.x = (Math.random() - 0.5) * 100;
    mesh.position.y = (Math.random() - 0.5) * 100;
    mesh.position.z = (Math.random() - 0.5) * 100;
    scene.add(mesh);
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
  // mesh.rotation.x = Math.sin(timer) + 2;
  // mesh.rotation.y = Math.cos(timer) + 2;
  renderer.render(scene, camera);
}

init();
animate();