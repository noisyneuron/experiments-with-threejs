var camera, scene, renderer, camControls, light, mixer;
var path = "../_models/";
var clock = new THREE.Clock();

var radius = 60;

var birds = [];

var frameCount = 1;
var count = 25;

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 2500);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 450;
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setClearColor(0x000000, 1.0);
  renderer.setSize( window.innerWidth, window.innerHeight );

  cameraControls = new THREE.OrbitControls( camera );

  light = new THREE.DirectionalLight(0xffffff, .8);
  light.position.set(0, 0, 120);
  scene.add(light);

  var ambientLight = new THREE.AmbientLight( 0xcccccc );
  scene.add( ambientLight );

  initBirds();

  cameraControls.update();
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
}

function initBirds() {
  mixer = new THREE.AnimationMixer( scene );
  var loader = new THREE.JSONLoader();

  loader.load( path+'flamingo.js', function ( geometry, materials ) {
    // adjust color a bit
    var material = materials[ 0 ];
    material.morphTargets = true;
    material.color.setHex( 0xffaaaa );

    for(var i=0; i<count; i++) {
      birds.push([]);
      var ringCount = 2*i + 3;
      var radius = i * 10;
      var zOffset = 100*Math.sin(i*0.3);
      for(var j=0; j<ringCount; j++) {
        var angle = 2* Math.PI * j / ringCount;
        var mesh = new THREE.Mesh( geometry, materials );
        mesh.position.x = radius * Math.cos(angle);
        mesh.position.y = radius * Math.sin(angle);
        mesh.position.z = zOffset;
        mesh.scale.set( 0.1,0.1,0.1 );
        // mesh.rotation.y = THREE.Math.randFloat( -0.25, 0.25 );
        mesh.matrixAutoUpdate = false;
        mesh.updateMatrix();
        scene.add( mesh );
        mixer.clipAction( geometry.animations[ 0 ], mesh )
            .setDuration( 1 )     // one second
            .startAt(Math.cos((i+j)*0.1) * 0.5 + 0.5) // random phase (already running)
            .play();          // let's go
        birds[i].push(mesh);
      }
    }
    console.log(birds);
  });
  
}

function updateBirds(timer) {
  for(var i=0; i<count; i++) {
    var ringCount = 2*i + 3;
    var zOffset = 100*Math.sin(i*0.3+timer*2.);
    for(var j=0; j<ringCount; j++) {
      birds[i][j].position.z = zOffset;
      birds[i][j].updateMatrix();
    }
  }
}

function animate() {
  requestAnimationFrame( animate );
  var delta = clock.getDelta();
  var timer = Date.now() * 0.0005;
  cameraControls.update();
  mixer.update( delta );
  if(birds[0]!==undefined) {
    // console.log('here');
    updateBirds( timer );
  }
  renderer.render( scene, camera );
}



init();
animate();