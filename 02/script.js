var camera, scene, renderer;
var path = "../img/";

var spheres = [];
var sphereCount = 36;
var sphereSize = 2;
var sphereSpacing = 2;
var radius = 20;
var frameCount = 1;
var planeSize = 100;

init();
animate();

function positionSpheres(frameCount) {
  for(var i=0; i<sphereCount; i++) {
    var mesh = spheres[i];
    mesh.position.x = sphereSpacing*i - (.5 * (sphereCount-1))*sphereSpacing;
    var angle = Math.PI * 2 / sphereCount;
    angle *= (sphereCount-i) * 0.2;
    angle *= frameCount*0.1;
    mesh.position.y = (i+1)/sphereCount * radius * Math.cos(angle);
    mesh.position.z = (i+1)/sphereCount * radius * Math.sin(angle);
  }
}

function init() {


  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 220 );
  camera.position.z = .6*planeSize;
  camera.position.x = .6*planeSize;
  camera.position.y = 0;//.5*planeSize;;
  camera.lookAt(new THREE.Vector3(-6, 0, -6));

  // camera.position.x = .5*planeSize;
  // camera.position.y = 0;
  // camera.position.z = 0;//.5*planeSize;;
  // camera.lookAt(new THREE.Vector3(-.5*planeSize, 0, 0));

  scene = new THREE.Scene();

  scene.add( new THREE.AmbientLight( 0x000000 ) );

  var lightFront = new THREE.SpotLight( 0xFFFFFF, .35 );
  lightFront.position.set( 0,0,2*planeSize);
  lightFront.castShadow = true;
  lightFront.shadow.radius = 2.5;
  lightFront.target.position.set(new THREE.Vector3(0, 0, 0));
  scene.add( lightFront );
  lightFront.shadow.mapSize.width = 1024;  
  lightFront.shadow.mapSize.height = 1024; 
  lightFront.shadow.camera.near = 2.75;       
  lightFront.shadow.camera.far = 1500;

  var lightTop = new THREE.SpotLight( 0xFFFFFF, .35 );
  lightTop.position.set( 0,2*planeSize,0);
  lightTop.castShadow = true;
  lightTop.shadow.radius = 2.5;
  scene.add( lightTop );
  lightTop.shadow.mapSize.width = 1024;  
  lightTop.shadow.mapSize.height = 1024; 
  lightTop.shadow.camera.near = 2.75;       
  lightTop.shadow.camera.far = 1500;

  var lightBottom = new THREE.SpotLight( 0xFFFFFF, .35 );
  lightBottom.position.set( 0,-2*planeSize,0);
  lightBottom.castShadow = true;
  lightBottom.shadow.radius = 2.5;
  scene.add( lightBottom );
  lightBottom.shadow.mapSize.width = 1024;  
  lightBottom.shadow.mapSize.height = 1024; 
  lightBottom.shadow.camera.near = 2.75;       
  lightBottom.shadow.camera.far = 1500;

  var lightRight = new THREE.SpotLight( 0xFFFFFF, .35 );
  lightRight.position.set( 2*planeSize,0,0);
  lightRight.castShadow = true;
  lightRight.shadow.radius = 2.5;
  scene.add( lightRight );
  lightRight.shadow.mapSize.width = 1024;  
  lightRight.shadow.mapSize.height = 1024; 
  lightRight.shadow.camera.near = 2.75;       
  lightRight.shadow.camera.far = 1500;



  var geometry = new THREE.SphereGeometry(sphereSize, 32, 16);
  // var geometry = new THREE.CylinderGeometry( 0.1, 0.1, .1, 32 );
  var material = new THREE.MeshPhongMaterial(
    { color: 0x6034DB , shininess: 150} );


  for(var i=0; i<sphereCount; i++) {
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = sphereSpacing*i - (.5 * (sphereCount-1))*sphereSpacing;
    var angle = Math.PI * 2 / sphereCount;
    angle *= (i+1) * 0.2;
    angle *= frameCount*0.1;
    mesh.position.y = radius * Math.cos(angle);
    mesh.position.z = radius * Math.sin(angle);
    mesh.castShadow = true;
    spheres.push(mesh);
    scene.add(mesh);
  }

  
  var planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
  var planeMat = new THREE.MeshPhongMaterial({ color: 0xFFFFFF } );

  var ground = new THREE.Mesh(planeGeo, planeMat);
  ground.rotation.x = -.5*Math.PI;
  ground.position.y = -0.5*planeSize;
  ground.receiveShadow = true;
  scene.add(ground);

  var backPlane = new THREE.Mesh(planeGeo, planeMat);
  backPlane.position.z = -0.5*planeSize;
  backPlane.receiveShadow = true;
  scene.add(backPlane);

  // var frontPlane = new THREE.Mesh(planeGeo, planeMat);
  // frontPlane.position.z = 0.5*planeSize;
  // frontPlane.rotation.y = -Math.PI;
  // frontPlane.receiveShadow = true;
  // scene.add(frontPlane);

  var planeLeft = new THREE.Mesh(planeGeo, planeMat);
  planeLeft.rotation.y = .5*Math.PI;
  planeLeft.position.x = -0.5*planeSize;
  planeLeft.receiveShadow = true;
  scene.add(planeLeft);


  var ceiling = new THREE.Mesh(planeGeo, planeMat);
  ceiling.rotation.x = .5*Math.PI;
  ceiling.position.y = 0.5*planeSize;
  // ceiling.receiveShadow = true;
  scene.add(ceiling);

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
}

function animate() {
  requestAnimationFrame( animate );
  positionSpheres(frameCount);
  renderer.render( scene, camera );
  frameCount++;
}