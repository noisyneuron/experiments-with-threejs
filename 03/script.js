var camera, scene, renderer, camControls;
var path = "../img/";

var mygeo, mymesh;
var framecount = 1;

var originalVertices = [];
var targetVertices = [];

function kleinBottle2(u, v) {
  var a = 1;
  var n = 2;
  var m = 1.5;
  var u = u * Math.PI * 4;
  var v = v * Math.PI * 2;
  var p = new THREE.Vector3();
  p.x = (a + Math.cos(n*u/2.0) * Math.sin(v) - Math.sin(n*u/2.0) * Math.sin(2*v)) * Math.cos(m*u/2.0);
  p.y = (a + Math.cos(n*u/2.0) * Math.sin(v) - Math.sin(n*u/2.0) * Math.sin(2*v)) * Math.sin(m*u/2.0);
  p.z = Math.sin(n*u/2.0) * Math.sin(v) + Math.cos(n*u/2.0) * Math.sin(2*v);
  // 0 <= u <= 4 pi; 0 <= u <= 2 pi
  return p;
}

function kleinBottle(u, v) {
  var a = 4.5;
  var n = 12;
  var m = 4;
  var u = u * Math.PI * 4;
  var v = v * Math.PI * 2;
  var p = new THREE.Vector3();
  p.x = (a + Math.cos(n*u/2.0) * Math.sin(v) - Math.sin(n*u/2.0) * Math.sin(2*v)) * Math.cos(m*u/2.0);
  p.y = (a + Math.cos(n*u/2.0) * Math.sin(v) - Math.sin(n*u/2.0) * Math.sin(2*v)) * Math.sin(m*u/2.0);
  p.z = Math.sin(n*u/2.0) * Math.sin(v) + Math.cos(n*u/2.0) * Math.sin(2*v);
  // 0 <= u <= 4 pi; 0 <= u <= 2 pi
  return p;
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

  var directionalLight = new THREE.DirectionalLight();
  directionalLight.position.set(-0, 0, 50);
  scene.add(directionalLight);

  var directionalLight2 = new THREE.DirectionalLight();
  directionalLight2.position.set(0, 50, 0);
  scene.add(directionalLight2);

  // scene.add( new THREE.AmbientLight( 0xFF0000 ) );
  mygeo = new THREE.ParametricGeometry( kleinBottle, 100, 100 );
  mygeo.verticesNeedUpdate = true;
  mygeo.dynamic = true;
  
  var material = new THREE.MeshPhongMaterial( {color: 0xcc3333a, side: THREE.DoubleSide});
  mymesh = new THREE.Mesh( mygeo, material );
  mymesh.scale.set(8,8,8);
  scene.add( mymesh );

  var count =  mymesh.geometry.vertices.length;

  var mygeo2 = new THREE.ParametricGeometry( kleinBottle2, 100, 100 );
  console.log(mygeo2.vertices);
  for(var i=0; i<count; i++) {
    var v =  mymesh.geometry.vertices[i];
    originalVertices.push(new THREE.Vector3(v.x,v.y,v.z))
    var v2 = mygeo2.vertices[i];
    targetVertices.push(new THREE.Vector3(v2.x,v2.y,v2.z))
  }

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
}


function animate() {
  requestAnimationFrame( animate );
  mygeo.verticesNeedUpdate = true;
  mygeo.dynamic = true;
  var lerpAmountX = Math.sin(framecount*0.01) * 0.5 + 0.5;
  var lerpAmountY = Math.sin(framecount*0.02) * 0.5 + 0.5;
  var lerpAmountZ = Math.sin(framecount*0.03) * 0.5 + 0.5;
  
  var count =  mymesh.geometry.vertices.length;

  for(var i=0; i<count; i++) {
    mymesh.geometry.vertices[i].x = THREE.Math.lerp(originalVertices[i].x, targetVertices[i].x, lerpAmountX);
    mymesh.geometry.vertices[i].y = THREE.Math.lerp(originalVertices[i].y, targetVertices[i].y, lerpAmountY);
    mymesh.geometry.vertices[i].z = THREE.Math.lerp(originalVertices[i].z, targetVertices[i].z, lerpAmountZ);
  }
  framecount++;

  renderer.render( scene, camera );
}



init();
animate();