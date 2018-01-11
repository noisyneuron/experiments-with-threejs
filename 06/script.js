var camera, scene, renderer;

var raycaster, mouse;

var mesh;

function init() {
  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, .1, 200);
  camera.position.set(0, 0, 20);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // var ambientLight = new THREE.AmbientLight( 0xFF0000 );
  // scene.add( ambientLight );

  var material = new THREE.MeshBasicMaterial({ 
    vertexColors: THREE.VertexColors
  });

  var geometry = new THREE.SphereGeometry(4,32,8);

  for(var i=0;i<geometry.faces.length; i++) {
    var f = geometry.faces[i];
      f.vertexColors[0] = new THREE.Color(0,1,0);
      f.vertexColors[1] = new THREE.Color(0,0.615,0);
      f.vertexColors[2] = new THREE.Color(0,0.213,0);
  }

  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0,0,0);
  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize(window.innerWidth, window.innerHeight);
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
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObject(mesh);
  mesh.rotation.y += 0.01;
  if(intersects.length > 0) {
    var intersect = intersects[ 0 ];
    var face = intersect.face;
    face.vertexColors[0].setRGB(0,0,1);
    face.vertexColors[1].setRGB(0,0,0.615);
    face.vertexColors[2].setRGB(0,0,0.213);
    mesh.geometry.colorsNeedUpdate = true;
    mesh.material.needsUpdate = true;
    mesh.geometry.verticesNeedUpdate = true;
    mesh.geometry.dynamic = true;
  }
  renderer.render(scene, camera);
}

init();
animate();