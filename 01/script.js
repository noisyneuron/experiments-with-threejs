var camera, scene, renderer, light;
var boxes = [];
var boxCount = 10;
var boxSize = 0.3;
var boxSpacing = 1;
var frameCount = 1;
var path = "../img/";
var cameraRadius = 10;

init();
animate();


function init() {

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 20 );
  camera.angle = 0;
  camera.position.x = cameraRadius * Math.sin(camera.angle);
  camera.position.z = cameraRadius * Math.cos(camera.angle);
  scene = new THREE.Scene();

  // scene.add( new THREE.AmbientLight( 0x333333 ) );

  light = new THREE.DirectionalLight( 0xFFFFFF, 0.9 );
  // light = new THREE.PointLight( 0xFFFFFF, 0.9 );
  light.position.set( 0,0,10);
  // light.target.position = new THREE.Vector3(0,0,0);

  scene.add( light );
  // scene.add( light.target);

  var urls = [path + "sky/px.jpg", path + "sky/nx.jpg",
        path + "sky/py.jpg", path + "sky/ny.jpg",
        path + "sky/pz.jpg", path + "sky/nz.jpg"];
  var textureCube = THREE.ImageUtils.loadTextureCube( urls );
  textureCube.format = THREE.RGBFormat;

  // var shader = THREE.ShaderLib.cube;
  // shader.uniforms.tCube.value = textureCube;

  // var skyMaterial = new THREE.ShaderMaterial( {
  //   fragmentShader: shader.fragmentShader,
  //   vertexShader: shader.vertexShader,
  //   uniforms: shader.uniforms,
  //   depthWrite: false,
  //   side: THREE.BackSide
  // } );

  // var sky = new THREE.Mesh( new THREE.CubeGeometry( 5000, 5000, 5000 ), skyMaterial );
  // scene.add( sky );

  var geometry = new THREE.BoxGeometry(boxSize, boxSize, boxSize);
  var material = new THREE.MeshPhongMaterial(
    { color: 0xFFFFFF, envMap: textureCube } );

  var isEven = boxCount % 2 == 0;
  var offset = isEven ? 0.5*boxCount-0.5 : Math.floor(0.5*boxCount);

  for(var i=0; i<boxCount; i++) {
    var x = (i - offset)*boxSize*boxSpacing;
    boxes.push([]);
    
    for(var j=0; j<boxCount; j++) {
      var y = (j - offset)*boxSize*boxSpacing;
      boxes[i].push([]);
      
      for(var k=0; k<boxCount; k++) { 
        var z = (k - offset)*boxSize*boxSpacing;
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = x;
        // mesh.position.y = y;
        // mesh.position.z = z;
        mesh.originalPosition = new THREE.Vector3(x,y,z);
        boxes[i][j].push(mesh);
        scene.add( mesh );
      } 
    } 
  } 

  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

}

function animate() {

  requestAnimationFrame( animate );

  var offset = Math.sin(frameCount*0.01) + 2;
  camera.angle += 0.006;
  camera.position.x = cameraRadius * Math.sin(camera.angle);
  camera.position.z = cameraRadius * Math.cos(camera.angle);
  camera.up = new THREE.Vector3(0,1,0);
  camera.lookAt(new THREE.Vector3(0,0,0));

  light.position.copy(camera.position);


  for(var i=0; i<boxCount; i++) {
    for(var j=0; j<boxCount; j++) {
      for(var k=0; k<boxCount; k++) { 
        var m = boxes[i][j][k];
        var o = i+j+k;
        var offset = Math.sin((frameCount+o)*0.02) * 2 + 3;
        m.rotation.z += k*0.2*Math.PI/180;
        m.rotation.y += j*0.2*Math.PI/180;
        m.rotation.x += i*0.2*Math.PI/180;

        var pos = new THREE.Vector3();
        pos.copy(m.originalPosition);
        pos.multiplyScalar(offset);
  
        m.position.x = pos.x;
        m.position.y = pos.y;
        m.position.z = pos.z;
      }
    }
  }

  renderer.render( scene, camera );
  frameCount++;
}