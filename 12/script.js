var container;
var camera, controls, scene, renderer, light;

var mesh, texture;
var worldWidth = 400, worldDepth = 400,
worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

var clock = new THREE.Clock();

var uniforms;

init();
animate();

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
  container = document.createElement('div');
  document.body.appendChild(container);

  // SCENE
  scene = new THREE.Scene();
  // scene.background = new THREE.Color( 0xefd1b5 );
  // scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0004 );

  // CAMERA & CONTROLS
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );
  camera.position.set(6000,-1500,100);
  camera.lookAt(new THREE.Vector3(0.,0.,0.));
  // camera.rotation.set(-0.5, .7, 40.4);
  controls = new THREE.OrbitControls( camera );

  // LIGHTS
  light = new THREE.DirectionalLight( 0xffffff, 1 );
  light.position.set( 0, 100, 0 );
  light.castShadow = true;
  scene.add( light );

  // TERRAIN
  var data = generateHeight( worldWidth, worldDepth );
  camera.position.y = data[ worldHalfWidth + worldHalfDepth * worldWidth ] * 10 + 100;

  var geometry = new THREE.PlaneBufferGeometry( 8500, 8500, worldWidth - 1, worldDepth - 1 );
  geometry.rotateX( - Math.PI / 2 );
  
  // var vertices = geometry.attributes.position.array;
  // for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
  //   vertices[ j + 1 ] = data[ i ] * 10;
  // }

  // geometry.computeVertexNormals();
  // geometry.computeFaceNormals(); 
  texture = new THREE.CanvasTexture( generateTexture( data, worldWidth, worldDepth ) );
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  var material = createShaderMaterial();
  // console.log(uniforms.time.value);
  // mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color: 0xff0000}) );
  mesh = new THREE.Mesh(geometry, material);  
  mesh.receiveShadow = true;
  mesh.castShadow = true;
  scene.add( mesh );

  // RENDERER
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.shadowMap.enabled = true;
  container.innerHTML = "";
  container.appendChild( renderer.domElement );
  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
  // controls.handleResize();
}

function generateHeight( width, height ) {
  var size = width * height, data = new Uint8Array( size ),
  perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 100;
  for ( var j = 0; j < 4; j ++ ) {
    for ( var i = 0; i < size; i ++ ) {
      var x = i % width, y = ~~ ( i / width );
      data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 2.5 );
    }
    quality *= 4;
  }
  return data;
}

function generateTexture( data, width, height ) {

  var canvas, canvasScaled, context, image, imageData,
  level, diff, vector3, sun, shade;

  vector3 = new THREE.Vector3( 0, 0, 0 );

  sun = new THREE.Vector3( 1, 1, 1 );
  sun.normalize();

  canvas = document.createElement( 'canvas' );
  canvas.width = width;
  canvas.height = height;

  context = canvas.getContext( '2d' );
  context.fillStyle = '#000';
  context.fillRect( 0, 0, width, height );

  image = context.getImageData( 0, 0, canvas.width, canvas.height );
  imageData = image.data;

  for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

    vector3.x = data[ j - 2 ] - data[ j + 2 ];
    vector3.y = 2;
    vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
    vector3.normalize();

    shade = vector3.dot( sun );

    imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
    imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
    imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
  }

  context.putImageData( image, 0, 0 );

  // Scaled 4x

  canvasScaled = document.createElement( 'canvas' );
  canvasScaled.width = width * 4;
  canvasScaled.height = height * 4;

  context = canvasScaled.getContext( '2d' );
  context.scale( 4, 4 );
  context.drawImage( canvas, 0, 0 );

  image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
  imageData = image.data;

  for ( var i = 0, l = imageData.length; i < l; i += 4 ) {

    var v = ~~ ( Math.random() * 5 );

    imageData[ i ] += v;
    imageData[ i + 1 ] += v;
    imageData[ i + 2 ] += v;

  }

  context.putImageData( image, 0, 0 );

  return canvasScaled;

}


function animate() {
  requestAnimationFrame( animate );
  render();
}

function render() {
  uniforms.time.value += clock.getDelta();
  renderer.render( scene, camera );
}