
var container, stats;
var camera, scene, renderer;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
init();
animate();
function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
	camera.position.z = 250;
	// scene
	scene = new THREE.Scene();
	var ambient = new THREE.AmbientLight( 0x444444 );
	scene.add( ambient );
	var directionalLight = new THREE.DirectionalLight( 0xffeedd );
	directionalLight.position.set( 0, 0, 1 ).normalize();
	scene.add( directionalLight );
	// model
	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
		}
	};
	var onError = function ( xhr ) { };
	//THREE.Loader.Handlers.add( /\.dds$/i, new THREE.DDSLoader() );
	var mtlLoader = new THREE.MTLLoader();
	mtlLoader.load( 'assets/mtl/rx480model.mtl', function( materials ) {
		materials.preload();
		var objLoader = new THREE.OBJLoader();
		var objLoader2 = new THREE.OBJLoader();
		objLoader.setMaterials( materials );
		objLoader.load( 'assets/obj/rx480model.obj', function ( object ) {

			object.position.x = 0;
	        object.rotation.x = 20* Math.PI / 180;
	        object.rotation.z = 20* Math.PI / 180;
	        object.scale.x = 8;
	        object.scale.y = 8;
	        object.scale.z = 8;
            obj = object
			scene.add( obj );
		}, onProgress, onError );

		objLoader2.load( 'assets/obj/test-object.obj', function ( object ) {
			var texture = new THREE.TextureLoader().load( "bump.jpg" );
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.repeat.set( 4, 4 );
			var meshMaterial = new THREE.MeshPhongMaterial({color: 0x7777ff, bumpMap: texture});

		   object.traverse( function ( child ) {

		        if ( child instanceof THREE.Mesh ) {

		            child.material = meshMaterial;

		        }

		    } );

			object.position.x = 0;
			object.position.y = 10;
	        object.rotation.x = 20* Math.PI / 180;
	        object.rotation.z = 20* Math.PI / 180;
	        object.scale.x = 8;
	        object.scale.y = 8;
	        object.scale.z = 8;
            obj2 = object;

			scene.add( obj2 );
		}, onProgress, onError );


	});

	var loader = new THREE.FontLoader();
		loader.load( 'assets/font/Arial_Regular.json', function ( font ) {
			var xMid, text;
			var textShape = new THREE.BufferGeometry();
			var color = 0x006699;
			var matDark = new THREE.LineBasicMaterial( {
				color: color,
				side: THREE.DoubleSide
			} );
			var matLite = new THREE.MeshBasicMaterial( {
				color: color,
				transparent: true,
				opacity: 1,
				side: THREE.DoubleSide
			} );
			var message = "rx480model";
			var shapes = font.generateShapes( message, 5, 2 );
			var geometry = new THREE.ShapeGeometry( shapes );
			geometry.computeBoundingBox();
			xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
			geometry.translate( xMid, 0, 0 );
			// make shape ( N.B. edge view not visible )
			textShape.fromGeometry( geometry );
			text = new THREE.Mesh( textShape, matLite );
			text.position.x = 30;
			text.position.y = 75;
			text.position.z = 25;
	        text.rotation.x = 20* Math.PI / 180;
	        text.rotation.z = 20* Math.PI / 180;

			scene.add( text );
		} ); //end load function

		var material = new THREE.LineBasicMaterial({
	color: 0x0000ff
});

// line that connects text and object
var geometry = new THREE.Geometry();
geometry.vertices.push(
	new THREE.Vector3( 0, 40, -5 ),
	new THREE.Vector3( 0, 65, -5 ),
	new THREE.Vector3( 30, 65, -5 )
);
var line = new THREE.Line( geometry, material );
line.rotation.x = 20* Math.PI / 180;
line.rotation.z = 20* Math.PI / 180;
scene.add( line );

	//
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	//
	window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

var mouseDown = false;
document.body.onmousedown = function() { 
	mouseDown = true;
}
document.body.onmouseup = function() {
	mouseDown = false;
}
document.body.ondblclick = function() {
	var position = { x : 0, y: 10, z: 0 };
	var target = { x : -100, y: 15, z: 30 };

if(obj2.position.y == 15){
	var position = { x : -100, y: 15, z: 30  };
	var target = { x : 0, y: 10, z: 0  };
}
var tween = new TWEEN.Tween(position).to(target, 500);

tween.onUpdate(function(){
    obj2.position.x = position.x;
    obj2.position.y = position.y;
	});

	tween.start();
}

function onMouseDown(evt) {
    evt.preventDefault();

    mouseDown = true;
    mouseX = evt.clientX;
    mouseY = evt.clientY;
}

function onMouseUp(evt) {
    evt.preventDefault();

    mouseDown = false;
}


function onDocumentMouseMove( evt ) {
        if (!mouseDown) {
            return;
        }

        evt.preventDefault();

        if (!mouseDown) {
            return;
        }

        mouseX = ( evt.clientX - windowHalfX ) / 2;
		mouseY = ( evt.clientY - windowHalfY ) / 2;

		camera.position.x += ( mouseX*1.5 - camera.position.x );
		camera.position.y += ( - mouseY*1.5 - camera.position.y );

}
//

function animate() {
	requestAnimationFrame( animate );
	render();
}
function render() {
	camera.lookAt( scene.position );
	renderer.render( scene, camera );

	TWEEN.update();
}

function zoomIn(){
	camera.zoom = 10;
}

function zoomOut(){
	camera.zoom = 0.1;
}
