//
var __DEV__ = true;
//

var container, stats;
var camera, scene, renderer;
var particleMaterial;
var raycaster;
var mouse;
var objects = [];
var particleSystem = new THREE.Group();
var particleSystemIntermediate;
// var highlight = undefined;
var data;
var meta = [];
var dataPane;
var loader = new THREE.FontLoader();
var font;
var scaleFactor = 2.2;
var animationFrames = 50;
var cameraAnimationFrames = animationFrames * 1.9;
var animationState = { y: 0, z: 0, camera: 0 };
var view = 0;
var thisCurve = undefined;
var pt1;
var pt2;
var linesZero = [];
var linesOne = [];
var cameraPosition = [
	{
		x: 0,
		y: 0,
		z: 100
	},
	{
		x: 2065,
		y: 160,
		z: 5
	}
];
var lookAt = [
	{
		x: 0,
		y: 0,
		z: 0
	},
	{
		x: 2065,
		y: 40,
		z: 5
	},
	{
		x: 2065,
		y: 0,
		z: 5
	}
]
var countryOrder = [
	"Canada",
	"United States",
	"Mexico",
	"Cuba",
	"Dominican Republic",
	"Haiti",
	"Trinidad & Tobago",
	"Antigua & Deps",
	"St Kitts & Nevis",
	"Barbados",
	"Bahamas",
	"Jamaica",
	"Belize",
	"Guatemala",
	"El Salvador",
	"Honduras",
	"Nicaragua",
	"Costa Rica",
	"Panama",
	"Ecuador",
	"Colombia",
	"Peru",
	"Bolivia",
	"Chile",
	"Argentina",
	"Brazil",
	"Guyana",
	"Iceland",
	"Ireland {Republic}",
	"United Kingdom",
	"Portugal",
	"Spain",
	"Andorra",
	"France",
	"Monaco",
	"Luxembourg",
	"Belgium",
	"Netherlands",
	"Denmark",
	"Norway",
	"Sweden",
	"Finland",
	"Germany",
	"Switzerland",
	"Czech Republic",
	"Liechtenstein",
	"Italy",
	"Vatican City",
	"Malta",
	"Austria",
	"Slovenia",
	"Poland",
	"Estonia",
	"Latvia",
	"Lithuania",
	"Hungary",
	"Slovakia",
	"Croatia",
	"Bosnia Herzegovina",
	"Serbia",
	"Montenegro",
	"Albania",
	"Macedonia",
	"Greece",
	"Bulgaria",
	"Romania",
	"Moldova",
	"Ukraine",
	"Russian Federation",
	"Turkey",
	"Azerbaijan",
	"Armenia",
	"Georgia",
	"Syria",
	"Israel",
	"Jordan",
	"Lebanon",
	"Iraq",
	"Kuwait",
	"Iran",
	"United Arab Emirates",
	"Qatar",
	"Yemen",
	"Oman",
	"Egypt",
	"Algeria",
	"Tunisia",
	"Morocco",
	"Mauritius",
	"Gambia",
	"Sierra Leone",
	"Ghana",
	"Burkina",
	"Congo {Democratic Rep}",
	"Uganda",
	"Kenya",
	"Tanzania",
	"Madagascar",
	"Mozambique",
	"Namibia",
	"Zimbabwe",
	"Botswana",
	"South Africa",
	"Lesotho",
	"Mongolia",
	"Kazakhstan",
	"Uzbekistan",
	"Afghanistan",
	"Pakistan",
	"Nepal",
	"India",
	"Sri Lanka",
	"Bangladesh",
	"Myanmar, {Burma}",
	"Thailand",
	"Malaysia",
	"Singapore",
	"Maldives",
	"Indonesia",
	"Papua New Guinea",
	"East Timor",
	"Philippines",
	"Samoa",
	"Vanuatu",
	"Fiji",
	"Laos",
	"Cambodia",
	"Vietnam",
	"Taiwan",
	"China",
	"Korea South",
	"Korea North",
	"Japan",
	"Australia",
	"New Zealand"
]
var curveSystem = [];
var oldOlabel = undefined;
var oldDLabel = undefined;
var screenEdges;

init();
loadData(buildScene);
animate();

function init() {
	loadingMessage();

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  camera.position.x = cameraPosition[0].x;
  camera.position.y = cameraPosition[0].y;
  camera.position.z = cameraPosition[0].z;
	camera.lookAt( new THREE.Vector3( lookAt[0].x, lookAt[0].y, lookAt[0].z ) );
	// camera.up = new THREE.Vector3( 0, .5, -.5 );
  camera.updateProjectionMatrix();
	camera.userData.animation = [];
	for (var i = 0; i <= cameraAnimationFrames; i++) {
		camera.userData.animation.push({
			x: cameraPosition[0].x,
			y: cameraPosition[0].y - ((cameraPosition[0].y - cameraPosition[1].y) * (i)/(cameraAnimationFrames)),
			z: cameraPosition[0].z - ((cameraPosition[0].z - cameraPosition[1].z) * (i)/(cameraAnimationFrames))
		});
	}
	camera.userData.lookAt = [];
	for (var i = 0; i <= cameraAnimationFrames; i++) {
		if (i <= cameraAnimationFrames / 2) {
			camera.userData.lookAt.push({
				x: lookAt[0].x,
				y: lookAt[0].y - ((lookAt[0].y - lookAt[1].y) * (i*2)/(cameraAnimationFrames)),
				z: lookAt[0].z - ((lookAt[0].z - lookAt[1].z) * (i*2)/(cameraAnimationFrames)),
			});
		} else {
			camera.userData.lookAt.push({
				x: lookAt[1].x,
				y: lookAt[1].y - ((lookAt[1].y - lookAt[2].y) * (i*2)/(cameraAnimationFrames)),
				z: lookAt[1].z - ((lookAt[1].z - lookAt[2].z) * (i*2)/(cameraAnimationFrames)),
			});
		}
	}

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xf0f0f0 );

  raycaster = new THREE.Raycaster();

  mouse = new THREE.Vector2();

  renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  // var light = new THREE.DirectionalLight( 0xffffff, 1 );
  // light.position.set( 1, -1, 1 ).normalize();
  // scene.add( light );
  // light = new THREE.DirectionalLight( 0x222222, 1 );
  // light.position.set( -1, 1, -1 ).normalize();
  // scene.add( light );

  window.addEventListener( 'resize', onWindowResize, false );
  // document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	// document.addEventListener( 'touchend', onDocumentMouseMove, false )
  // document.addEventListener( 'mouseleave', onDocumentMouseLeave, false );

	// setAxisLabels();
	screenEdges = findScreenEdgesAt(0);
	console.log(screenEdges);
	// cb();
}

function setAxisLabels() {
	var xLabels = [
		[scaleYears(1880), 5, -1],
		[scaleYears(1890), 5, -1],
		[scaleYears(1900), 5, -1],
		[scaleYears(1910), 5, -1],
		[scaleYears(1920), 5, -1],
		[scaleYears(1930), 5, -1],
		[scaleYears(1940), 5, -1],
		[scaleYears(1950), 5, -1],
		[scaleYears(1960), 5, -1],
		[scaleYears(1970), 5, -1],
		[scaleYears(1980), 5, -1],
		[scaleYears(1990), 5, -1],
		[scaleYears(2000), 5, -1],
		[scaleYears(2010), 5, -1]
	];
	var yLabels = [
		[scaleYears(1875), 10, -1],
		[scaleYears(1875), 20, -1],
		[scaleYears(1875), 30, -1],
		[scaleYears(1875), 40, -1],
		[scaleYears(1875), 50, -1],
		[scaleYears(1875), 60, -1],
		[scaleYears(1875), 70, -1],
		[scaleYears(1875), 80, -1],
		[scaleYears(1875), 90, -1],
		[scaleYears(1875), 100, -1],
		[scaleYears(1875), 110, -1],
		[scaleYears(1875), 120, -1],
		[scaleYears(1875), 130, -1],
		[scaleYears(1875), 140, -1],
		[scaleYears(1875), 150, -1],
		[scaleYears(1875), 160, -1],
		[scaleYears(1875), 170, -1]
	];
	var zLabels = [
		[scaleYears(1875), -1, scaleZ(1)],
		[scaleYears(1875), -1, scaleZ(2)],
		[scaleYears(1875), -1, scaleZ(3)],
		[scaleYears(1875), -1, scaleZ(4)],
		[scaleYears(1875), -1, scaleZ(5)],
		[scaleYears(1875), -1, scaleZ(6)],
		[scaleYears(1875), -1, scaleZ(7)],
		[scaleYears(1875), -1, scaleZ(8)],
		[scaleYears(1875), -1, scaleZ(9)],
		[scaleYears(1875), -1, scaleZ(10)],
		[scaleYears(1875), -1, scaleZ(11)]
	];

	for (var i = 0; i < xLabels.length; i++) {
		var pos = new THREE.Vector3(
			xLabels[i][0] - camera.position.x,
			xLabels[i][1] - camera.position.y,
			xLabels[i][2] - camera.position.z
		);
		var posXY = pos.applyMatrix4(camera.projectionMatrix);
		var left = pos.x * window.innerWidth / 2 + window.innerWidth / 2;
		var bottom = pos.y * window.innerHeight / 2 + window.innerHeight / 2;
		var box = document.createElement("DIV");
		box.setAttribute("class", "x-label");
		box.style.left = left;
		box.style.bottom = bottom;
		var label = document.createElement("P");
		var labelText = document.createTextNode( 10 * i + 1880 );
		box.appendChild( label );
		label.appendChild( labelText );
		document.body.appendChild( box );
	}
	for (var i = 0; i < yLabels.length; i++) {
		var pos = new THREE.Vector3(
			yLabels[i][0] - camera.position.x,
			yLabels[i][1] - camera.position.y,
			yLabels[i][2] - camera.position.z
		);
		var posXY = pos.applyMatrix4(camera.projectionMatrix);
		var left = posXY.x * window.innerWidth / 2 + window.innerWidth / 2;
		var bottom = posXY.y * window.innerHeight / 2 + window.innerHeight / 2;
		if (i == Math.floor(yLabels.length / 2)) {
			var axisLabelDiv = document.createElement("DIV");
			var axisLabelP = document.createElement("P");
			var axisLabelText = document.createTextNode("Career WAR");
			axisLabelP.appendChild( axisLabelText );
			axisLabelDiv.setAttribute("id", "y-axis-label");
			axisLabelDiv.appendChild( axisLabelP );
			axisLabelDiv.style.left = left;
			axisLabelDiv.style.bottom = bottom;
			document.body.appendChild( axisLabelDiv );
		}

		var box = document.createElement("DIV");
		box.setAttribute("class", "y-label");
		box.style.left = left;
		box.style.bottom = bottom;
		var label = document.createElement("P");
		var labelText = document.createTextNode( 10 * i + 10 );
		box.appendChild( label );
		label.appendChild( labelText );
		document.body.appendChild( box );
	}

	for (var i = 0; i < zLabels.length; i++) {
		var pos = new THREE.Vector3(
			zLabels[i][0] - cameraPosition[1].x,
			zLabels[i][2] - cameraPosition[1].z,
			zLabels[i][1] - cameraPosition[1].y
		);
		var posXY = pos.applyMatrix4(camera.projectionMatrix);
		var left = posXY.x * window.innerWidth / 2 + window.innerWidth / 2;
		var bottom = posXY.y * window.innerHeight / 2 + window.innerHeight / 2;
		if (i == Math.floor(zLabels.length / 2)) {
			var axisLabelDiv = document.createElement("DIV");
			var axisLabelP = document.createElement("P");
			var axisLabelText = document.createTextNode("Career WAR per 162 game season");
			axisLabelP.appendChild( axisLabelText );
			axisLabelDiv.setAttribute("id", "z-axis-label");
			axisLabelDiv.appendChild( axisLabelP );
			axisLabelDiv.style.left = left;
			axisLabelDiv.style.bottom = bottom;
			document.body.appendChild( axisLabelDiv );
		}

		var box = document.createElement("DIV");
		box.setAttribute("class", "z-label");
		box.style.left = left;
		box.style.bottom = bottom;
		var label = document.createElement("P");
		var labelText = document.createTextNode( 11- 1 * i );
		box.appendChild( label );
		label.appendChild( labelText );
		document.body.appendChild( box );
	}
}

function moveAxisLabels() {
	var xLabels = [
		[scaleYears(1880), 5, -1],
		[scaleYears(1890), 5, -1],
		[scaleYears(1900), 5, -1],
		[scaleYears(1910), 5, -1],
		[scaleYears(1920), 5, -1],
		[scaleYears(1930), 5, -1],
		[scaleYears(1940), 5, -1],
		[scaleYears(1950), 5, -1],
		[scaleYears(1960), 5, -1],
		[scaleYears(1970), 5, -1],
		[scaleYears(1980), 5, -1],
		[scaleYears(1990), 5, -1],
		[scaleYears(2000), 5, -1],
		[scaleYears(2010), 5, -1]
	];
	var yLabels = [
		[scaleYears(1875), 10, -1],
		[scaleYears(1875), 20, -1],
		[scaleYears(1875), 30, -1],
		[scaleYears(1875), 40, -1],
		[scaleYears(1875), 50, -1],
		[scaleYears(1875), 60, -1],
		[scaleYears(1875), 70, -1],
		[scaleYears(1875), 80, -1],
		[scaleYears(1875), 90, -1],
		[scaleYears(1875), 100, -1],
		[scaleYears(1875), 110, -1],
		[scaleYears(1875), 120, -1],
		[scaleYears(1875), 130, -1],
		[scaleYears(1875), 140, -1],
		[scaleYears(1875), 150, -1],
		[scaleYears(1875), 160, -1],
		[scaleYears(1875), 170, -1]
	];
	var zLabels = [
		[scaleYears(1875), -1, scaleZ(1)],
		[scaleYears(1875), -1, scaleZ(2)],
		[scaleYears(1875), -1, scaleZ(3)],
		[scaleYears(1875), -1, scaleZ(4)],
		[scaleYears(1875), -1, scaleZ(5)],
		[scaleYears(1875), -1, scaleZ(6)],
		[scaleYears(1875), -1, scaleZ(7)],
		[scaleYears(1875), -1, scaleZ(8)],
		[scaleYears(1875), -1, scaleZ(9)],
		[scaleYears(1875), -1, scaleZ(10)],
		[scaleYears(1875), -1, scaleZ(11)]
	];

	var axisLabels = document.getElementsByClassName("x-label");
	for (var i = 0; i < axisLabels.length; i++) {
		var pos = new THREE.Vector3(
			xLabels[i][0] - cameraPosition[0].x,
			xLabels[i][1] - cameraPosition[0].y,
			xLabels[i][2] - cameraPosition[0].z
		);
		var posXY = pos.applyMatrix4(camera.projectionMatrix);
		var left = pos.x * window.innerWidth / 2 + window.innerWidth / 2;
		var bottom = pos.y * window.innerHeight / 2 + window.innerHeight / 2;
		axisLabels[i].style.left = left;
		axisLabels[i].style.bottom = bottom;
	}

	var axisLabels = document.getElementsByClassName("y-label");
	for (var i = 0; i < axisLabels.length; i++) {
		var pos = new THREE.Vector3(
			yLabels[i][0] - cameraPosition[0].x,
			yLabels[i][1] - cameraPosition[0].y,
			yLabels[i][2] - cameraPosition[0].z
		);
		var posXY = pos.applyMatrix4(camera.projectionMatrix);
		var left = pos.x * window.innerWidth / 2 + window.innerWidth / 2;
		var bottom = pos.y * window.innerHeight / 2 + window.innerHeight / 2;
		axisLabels[i].style.left = left;
		axisLabels[i].style.bottom = bottom;
		var axisTitle = document.getElementById("y-axis-label");
		if (i == Math.floor(yLabels.length / 2)) {
			axisTitle.style.left = left;
			axisTitle.style.bottom = bottom;
		}
	}

	var axisLabels = document.getElementsByClassName("z-label");
	for (var i = 0; i < axisLabels.length; i++) {
		var pos = new THREE.Vector3(
			zLabels[i][0] - cameraPosition[1].x,
			zLabels[i][2] - cameraPosition[1].z,
			zLabels[i][1] - cameraPosition[1].y
		);
		var posXY = pos.applyMatrix4(camera.projectionMatrix);
		var left = pos.x * window.innerWidth / 2 + window.innerWidth / 2;
		var bottom = pos.y * window.innerHeight / 2 + window.innerHeight / 2;
		axisLabels[i].style.left = left;
		axisLabels[i].style.bottom = bottom;

		var axisTitle = document.getElementById("z-axis-label");
		if (i == Math.floor(zLabels.length / 2)) {
			axisTitle.style.left = left;
			axisTitle.style.bottom = bottom;
		}
	}

	// for (var i = 0; i < xLabels.length; i++) {
	// 	var pos = new THREE.Vector3(
	// 		xLabels[i][0] - camera.position.x,
	// 		xLabels[i][1] - camera.position.y,
	// 		xLabels[i][2] - camera.position.z
	// 	);
	// 	var posXY = pos.applyMatrix4(camera.projectionMatrix);
	// 	var left = pos.x * window.innerWidth / 2 + window.innerWidth / 2;
	// 	var bottom = pos.y * window.innerHeight / 2 + window.innerHeight / 2;
	// 	// var box = document.createElement("DIV");
	// 	var xLabels = document.getElementsByClassName("x-label");
	// 	for (var i = 0; i < xLabels.length; i++) {
	// 		console.log(xLabels[i]);
	// 	}
	// 	box.setAttribute("class", "x-label");
	// 	box.style.left = left;
	// 	box.style.bottom = bottom;
	// 	var label = document.createElement("P");
	// 	var labelText = document.createTextNode( 10 * i + 1880 );
	// 	box.appendChild( label );
	// 	label.appendChild( labelText );
	// 	document.body.appendChild( box );
	// }
	// for (var i = 0; i < yLabels.length; i++) {
	// 	var pos = new THREE.Vector3(
	// 		yLabels[i][0] - camera.position.x,
	// 		yLabels[i][1] - camera.position.y,
	// 		yLabels[i][2] - camera.position.z
	// 	);
	// 	var posXY = pos.applyMatrix4(camera.projectionMatrix);
	// 	var left = posXY.x * window.innerWidth / 2 + window.innerWidth / 2;
	// 	var bottom = posXY.y * window.innerHeight / 2 + window.innerHeight / 2;
	// 	if (i == Math.floor(yLabels.length / 2)) {
	// 		var axisLabelDiv = document.createElement("DIV");
	// 		var axisLabelP = document.createElement("P");
	// 		var axisLabelText = document.createTextNode("Career WAR");
	// 		axisLabelP.appendChild( axisLabelText );
	// 		axisLabelDiv.setAttribute("id", "y-axis-label");
	// 		axisLabelDiv.appendChild( axisLabelP );
	// 		axisLabelDiv.style.left = left;
	// 		axisLabelDiv.style.bottom = bottom;
	// 		document.body.appendChild( axisLabelDiv );
	// 	}
	//
	// 	var box = document.createElement("DIV");
	// 	box.setAttribute("class", "y-label");
	// 	box.style.left = left;
	// 	box.style.bottom = bottom;
	// 	var label = document.createElement("P");
	// 	var labelText = document.createTextNode( 10 * i + 10 );
	// 	box.appendChild( label );
	// 	label.appendChild( labelText );
	// 	document.body.appendChild( box );
	// }
	//
	// for (var i = 0; i < zLabels.length; i++) {
	// 	var pos = new THREE.Vector3(
	// 		zLabels[i][0] - cameraPosition[1].x,
	// 		zLabels[i][2] - cameraPosition[1].z,
	// 		zLabels[i][1] - cameraPosition[1].y
	// 	);
	// 	var posXY = pos.applyMatrix4(camera.projectionMatrix);
	// 	var left = posXY.x * window.innerWidth / 2 + window.innerWidth / 2;
	// 	var bottom = posXY.y * window.innerHeight / 2 + window.innerHeight / 2;
	// 	if (i == Math.floor(zLabels.length / 2)) {
	// 		var axisLabelDiv = document.createElement("DIV");
	// 		var axisLabelP = document.createElement("P");
	// 		var axisLabelText = document.createTextNode("Career WAR per 162 game season");
	// 		axisLabelP.appendChild( axisLabelText );
	// 		axisLabelDiv.setAttribute("id", "z-axis-label");
	// 		axisLabelDiv.appendChild( axisLabelP );
	// 		axisLabelDiv.style.left = left;
	// 		axisLabelDiv.style.bottom = bottom;
	// 		document.body.appendChild( axisLabelDiv );
	// 	}
	//
	// 	var box = document.createElement("DIV");
	// 	box.setAttribute("class", "z-label");
	// 	box.style.left = left;
	// 	box.style.bottom = bottom;
	// 	var label = document.createElement("P");
	// 	var labelText = document.createTextNode( 11- 1 * i );
	// 	box.appendChild( label );
	// 	label.appendChild( labelText );
	// 	document.body.appendChild( box );
	// }
}

function loadData(cb) {
  loadJSON(function(response) {
    buildScene(parseData(response));
  })
}

function buildScene(data) {
	var curve = new THREE.EllipseCurve(
		0,  0,            // ax, aY
		50, 50,           // xRadius, yRadius
		0,  2 * Math.PI,  // aStartAngle, aEndAngle
		false,            // aClockwise
		0                 // aRotation
	);

	var points = curve.getPoints( 100 );
	var geometry = new THREE.BufferGeometry().setFromPoints( points );

	var material = new THREE.LineBasicMaterial( { color : 0x000000 } );

	// Create the final object to add to the scene
	var ellipse = new THREE.Line( geometry, material );
	scene.add(ellipse)

	var usedForOrigin = [];
	var usedForDestination = [];
	var offset = {}
	countryOrder.map(function(c) {
		offset[c] = 0;
	});
	// console.log(offset);
	for (var i = 0; i < data.favorites.length; i++) {
		var arcPosStart = curve.getPoint( ( data.favUniques.indexOf(data.favorites[i][0] ) + offset[data.favorites[i][0]]) / data.favUniques.length);
		var arcPosEnd = curve.getPoint( ( data.favUniques.indexOf(data.favorites[i][1] ) + offset[data.favorites[i][1]] ) / data.favUniques.length);
		var oName = data.favorites[i][0];
		var dName = data.favorites[i][1];
		addArc(arcPosStart, arcPosEnd, oName, dName);
		offset[data.favorites[i][0]] += 1;
		offset[data.favorites[i][1]] += 1;
		// data.favorites[i]
	}

}

function addArc(vec1, vec2, origin, destination) {
	var curve = new THREE.QuadraticBezierCurve(
		vec1,
		new THREE.Vector2( 0, 0 ),
		vec2
	);

	var points = curve.getPoints( 50 );
	var geometry = new THREE.BufferGeometry().setFromPoints( points );
	var count = geometry.attributes.position.count;
	geometry.addAttribute( 'color', new THREE.BufferAttribute( new Float32Array( count * 3 ), 3 ) );
	var color = new THREE.Color();
	// var positions = geometry.attributes.position;
	// var colors = geometry.attributes.color;
	for ( var i = 0; i < count; i ++ ) {
		color.setRGB( 0, i / count, 0 );
		geometry.attributes.color.setXYZ( i, color.r, color.g, color.b );
	}

	//Create the final object to add to the scene
	var lineVertexShader = document.getElementById("line-vertexshader").textContent;
	var lineFragmentShader = document.getElementById("line-fragmentshader").textContent;
	var curveObject = new THREE.Line( geometry , new THREE.ShaderMaterial({
	  uniforms: {
	    colorFallback: {
	      value: new THREE.Color(0x00ff00)
	    },
	    length: {
	      value: curve.getLength()
	    },
			origin: {
				value: new THREE.Vector3()
			},
			opacity: {
				value: 0.4
			}
	  },
	  vertexShader: lineVertexShader,
	  fragmentShader: lineFragmentShader,
	  transparent: true
	}));
	curveObject.geometry.attributes.color.needsUpdate = true;
	curveObject.userData = {
		origin: origin,
		destination: destination
	}
	scene.add(curveObject);
	curveSystem.push(curveObject);
}

function addPoints(curveObj) {
	var startPoint = curveObj.geometry.attributes.position.array.slice(0, 3);
	var endPoint = curveObj.geometry.attributes.position.array.slice(-3);
	var geometry1 = new THREE.CircleGeometry(2, 32);
	var material1 = new THREE.MeshBasicMaterial( { color: 0x000000 } );
	pt1 = new THREE.Mesh( geometry1, material1 );
	pt1.position.x = startPoint[0];
	pt1.position.y = startPoint[1];
	pt1.position.z = startPoint[2];
	console.log(pt1);

	var geometry2 = new THREE.CircleGeometry(2, 32);
	var material2 = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	pt2 = new THREE.Mesh( geometry2, material2 );
	pt2.position.x = endPoint[0];
	pt2.position.y = endPoint[1];
	pt2.position.z = endPoint[2];
	scene.add(pt1);
	scene.add(pt2);

	addLabels(startPoint, endPoint, curveObj.userData.origin, curveObj.userData.destination);
}

function deletePoints() {
	scene.remove(pt1);
	scene.remove(pt2);
}

function addLabels(oPt, dPt, oLabel, dLabel) {

	if (oldOlabel !== undefined) {
		document.body.removeChild(oldOlabel);
		document.body.removeChild(oldDLabel);
	}
	var origin = new THREE.Vector3(oPt[0], oPt[1], oPt[2]);
	var destination = new THREE.Vector3(dPt[0], dPt[1], dPt[2]);
	var transMat = new THREE.Matrix3();
	transMat.multiplyScalar(1.2);

	console.log(destination);
	var originScreenPos = {
		x: origin.x / Math.abs(screenEdges.l) * ( window.innerWidth / 2 ) + window.innerWidth / 2,
		y: - origin.y / Math.abs(screenEdges.t) * ( window.innerHeight / 2 ) + window.innerHeight / 2
	}
	var destinationScreenPos = {
		x: destination.x / Math.abs(screenEdges.l) * ( window.innerWidth / 2 ) + window.innerWidth / 2,
		y: - destination.y / Math.abs(screenEdges.t) * ( window.innerHeight / 2 ) + window.innerHeight / 2
	}
	console.log(originScreenPos);
	console.log(destinationScreenPos);

	// var point = oPt
	var oLabelText = document.createTextNode(oLabel);
	var oLabelElement = document.createElement("P");
	var oLabelParent = document.createElement("DIV");
	oLabelElement.appendChild(oLabelText);
	oLabelParent.appendChild(oLabelElement);
	oLabelParent.style.top = originScreenPos.y;
	oLabelParent.style.left = originScreenPos.x;
	var dLabelText = document.createTextNode(dLabel);
	var dLabelElement = document.createElement("P");
	dLabelElement.style.color = "#00ff00";
	var dLabelParent = document.createElement("DIV");
	dLabelElement.appendChild(dLabelText);
	dLabelParent.appendChild(dLabelElement);
	dLabelParent.style.top = destinationScreenPos.y;
	dLabelParent.style.left = destinationScreenPos.x;


	// find quardant
	if (oPt[0] >= 0 && oPt[1] >= 0) {
		oLabelParent.setAttribute("class", "top-right");
	} else if (oPt[0] >= 0 && oPt[1] < 0) {
		oLabelParent.setAttribute("class", "bottom-right");
	} else if (oPt[0] < 0 && oPt[1] >= 0) {
		oLabelParent.setAttribute("class", "top-left");
	} else {
		oLabelParent.setAttribute("class", "bottom-left");
	}
	if (dPt[0] >= 0 && dPt[1] >= 0) {
		dLabelParent.setAttribute("class", "top-right");
	} else if (dPt[0] >= 0 && dPt[1] < 0) {
		dLabelParent.setAttribute("class", "bottom-right");
	} else if (dPt[0] < 0 && dPt[1] >= 0) {
		dLabelParent.setAttribute("class", "top-left");
	} else {
		dLabelParent.setAttribute("class", "bottom-left");
	}

	oldOlabel = oLabelParent;
	oldDLabel = dLabelParent;
	document.body.appendChild(oLabelParent);
	document.body.appendChild(dLabelParent);

}

function appendText(data) {
	if (document.getElementById("pane")) {
		document.getElementById("pane").outerHTML = "";
	}
  var pane = document.createElement("Div");
  pane.setAttribute("id", "pane");
  document.body.appendChild( pane );

	var title = document.createElement("H2");
	title.setAttribute("id", "title");
	var titleText = document.createTextNode( data.name );
	title.appendChild( titleText );
	pane.appendChild( title );

	var stat4 = document.createElement("DIV");
	stat4.setAttribute("class", "years");
	pane.appendChild( stat4 );

	var statName = document.createElement("P");
	stat4.appendChild( statName );
	var statNameText = document.createTextNode( "Years Active: " );
	statName.appendChild( statNameText );

	var statValHolder = document.createElement("P");
	stat4.appendChild( statValHolder );

	var statVal = document.createElement("SPAN");
	var statNameVal = document.createTextNode( "( " );
	statValHolder.appendChild( statVal );
	statVal.appendChild( statNameVal );
	var statVal = document.createElement("SPAN");
	var statNameVal = document.createTextNode( data.data.stats[0].year );
	statValHolder.appendChild( statVal );
	statVal.appendChild( statNameVal );
	var statVal = document.createElement("SPAN");
	var statNameVal = document.createTextNode( " - " );
	statValHolder.appendChild( statVal );
	statVal.appendChild( statNameVal );
	var statVal = document.createElement("SPAN");
	var statNameVal = document.createTextNode( data.data.stats[data.data.stats.length -1].year );
	statValHolder.appendChild( statVal );
	statVal.appendChild( statNameVal );
	var statVal = document.createElement("SPAN");
	var statNameVal = document.createTextNode( " )" );
	statValHolder.appendChild( statVal );
	statVal.appendChild( statNameVal );

	var stat1 = document.createElement("P");
	stat1.setAttribute("class", "stats");
	pane.appendChild( stat1 );

	var statName = document.createElement("SPAN");
	var statNameText = document.createTextNode( "Career WAR: " );
	stat1.appendChild( statName );
	statName.appendChild( statNameText );
	var statVal = document.createElement("SPAN");
	var statNameVal = document.createTextNode( data.careerWar.toFixed(1) );
	statVal.setAttribute("class", "numbers");
	stat1.appendChild( statVal );
	statVal.appendChild( statNameVal );

	var stat2 = document.createElement("P");
	stat2.setAttribute("class", "stats");
	pane.appendChild( stat2 );

	var statName = document.createElement("SPAN");
	var statNameText = document.createTextNode( "Career Games: " );
	stat2.appendChild( statName );
	statName.appendChild( statNameText );
	var statVal = document.createElement("SPAN");
	var statNameVal = document.createTextNode( data.careerGames );
	statVal.setAttribute("class", "numbers");
	stat2.appendChild( statVal );
	statVal.appendChild( statNameVal );

	var stat3 = document.createElement("P");
	stat3.setAttribute("class", "stats");
	pane.appendChild( stat3 );

	var statName = document.createElement("SPAN");
	var statNameText = document.createTextNode( "WAR per 162: " );
	stat3.appendChild( statName );
	statName.appendChild( statNameText );
	var statVal = document.createElement("SPAN");
	var statNameVal = document.createTextNode( data.warPer162.toFixed(1) );
	statVal.setAttribute("class", "numbers");
	stat3.appendChild( statVal );
	statVal.appendChild( statNameVal );


}

function animatePoints() {
	view = checkRadio();
	if (view == 0 && animationState.camera !== 0) {
		animationState.camera = animationState.camera - 1;
		camera.position.y = camera.userData.animation[animationState.camera].y;
		camera.position.z = camera.userData.animation[animationState.camera].z;
		camera.lookAt( new THREE.Vector3(
			camera.userData.lookAt[animationState.camera].x,
			camera.userData.lookAt[animationState.camera].y,
			camera.userData.lookAt[animationState.camera].z
		) );
		camera.updateProjectionMatrix();
		for (var i = 0; i < linesZero.length; i++) {
			linesZero[i].material.opacity = 1 - animationState.camera / cameraAnimationFrames;
			linesZero[i].material.needsUpdate = true;
		}
		for (var i = 0; i < linesOne.length; i++) {
			linesOne[i].material.opacity = animationState.camera / cameraAnimationFrames;
			linesOne[i].material.needsUpdate = true;
		}

	}
	if (view == 1 && animationState.camera !== cameraAnimationFrames) {
		animationState.camera = animationState.camera + 1;
		camera.position.y = camera.userData.animation[animationState.camera].y;
		camera.position.z = camera.userData.animation[animationState.camera].z;
		camera.lookAt( new THREE.Vector3(
			camera.userData.lookAt[animationState.camera].x,
			camera.userData.lookAt[animationState.camera].y,
			camera.userData.lookAt[animationState.camera].z
		) );
		camera.updateProjectionMatrix();
		for (var i = 0; i < linesZero.length; i++) {
			linesZero[i].material.opacity = 1 - animationState.camera / cameraAnimationFrames;
			linesZero[i].material.needsUpdate = true;
		}
		for (var i = 0; i < linesOne.length; i++) {
			linesOne[i].material.opacity = animationState.camera / cameraAnimationFrames;
			linesOne[i].material.needsUpdate = true;
		}
	}
	if (view == 0 && animationState.z !== 0) {

		animationState.z = animationState.z - 1;
		for (var i = 0; i < particleSystem.children.length; i++) {
			particleSystem.children[i].position.z = particleSystem.children[i].userData.animateZOut[animationState.z].z;
		}
	} else if (view == 0 && animationState.z === 0 && animationState.y !== animationFrames) {
		animationState.y = animationState.y + 1;
		for (var i = 0; i < particleSystem.children.length; i++) {
			particleSystem.children[i].position.y = particleSystem.children[i].userData.animateYOut[animationState.y].y;
		}
	} else if (view == 1 && animationState.y !== 0) {
		animationState.y = animationState.y - 1;
		for (var i = 0; i < particleSystem.children.length; i++) {
			particleSystem.children[i].position.y = particleSystem.children[i].userData.animateYOut[animationState.y].y;
		}
	} else if (view == 1 && animationState.z !== animationFrames) {
		animationState.z = animationState.z + 1;
		for (var i = 0; i < particleSystem.children.length; i++) {
			particleSystem.children[i].position.z = particleSystem.children[i].userData.animateZOut[animationState.z].z;
		}
	}

	if (animationState.y == animationFrames && animationState !== animationFrames) {
		var showAxis = document.getElementsByClassName("y-label");
		var axisLabel = document.getElementById("y-axis-label");
		axisLabel.style.opacity = 1;
		for (var i = 0; i < showAxis.length; i++) {
			showAxis[i].style.opacity = 1;
		}
		var showAxis = document.getElementsByClassName("x-label");
		for (var i = 0; i < showAxis.length; i++) {
			showAxis[i].style.opacity = 1;
		}
	}
	if (animationState.y == animationFrames - 1 && animationState !== animationFrames) {
		var showAxis = document.getElementsByClassName("y-label");
		var axisLabel = document.getElementById("y-axis-label");
		axisLabel.style.opacity = 0;
		for (var i = 0; i < showAxis.length; i++) {
			showAxis[i].style.opacity = 0;
		}
		var showAxis = document.getElementsByClassName("x-label");
		for (var i = 0; i < showAxis.length; i++) {
			showAxis[i].style.opacity = 0;
		}
	}
	if (animationState.z == animationFrames && animationState.y !== animationFrames) {
		var showAxis = document.getElementsByClassName("z-label");
		var axisLabel = document.getElementById("z-axis-label");
		axisLabel.style.opacity = 1;
		for (var i = 0; i < showAxis.length; i++) {
			showAxis[i].style.opacity = 1;
		}
		var showAxis = document.getElementsByClassName("x-label");
		for (var i = 0; i < showAxis.length; i++) {
			showAxis[i].style.opacity = 1;
		}
	}
	if (animationState.z == animationFrames - 1 && animationState !== animationFrames) {
		var showAxis = document.getElementsByClassName("z-label");
		var axisLabel = document.getElementById("z-axis-label");
		axisLabel.style.opacity = 0;
		for (var i = 0; i < showAxis.length; i++) {
			showAxis[i].style.opacity = 0;
		}
		var showAxis = document.getElementsByClassName("x-label");
		for (var i = 0; i < showAxis.length; i++) {
			showAxis[i].style.opacity = 0;
		}
	}
}

function animate() {
  requestAnimationFrame( animate );

	// animatePoints();

  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( objects );
  if ( intersects.length > 0 ) {
    for (var i = 0; i < intersects.length; i++) {
      // for each intersected object
    }

  }

  renderer.render( scene, camera );
}


function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );

	moveAxisLabels();
	findScreenEdgesAt(0);
}

function checkRadio() {
	var radios = document.getElementsByName('view-radio');

	for (var i = 0, length = radios.length; i < length; i++) {
	    if (radios[i].checked) {
	        // do whatever you want with the checked radio
	        return radios[i].value;

	        // only one radio can be logically checked, don't check the rest
	        break;
	    }
	}
}

function onDocumentMouseMove( event ) {
  event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( curveSystem, true );
  if ( intersects.length > 0 ) {
		// console.log();
		// intersects[0].object.material.uniforms.opacity.value = 1.0;
		// intersects[0].object.material.needsUpdate = true;
		if ( thisCurve === undefined ) {
			thisCurve = intersects[0].object;
			intersects[0].object.material.uniforms.opacity.value = 1.0;
			intersects[0].object.material.needsUpdate = true;
			addPoints(thisCurve);
		}
		if (intersects[0].object.uuid !== thisCurve.uuid) {
			deletePoints();
			thisCurve.material.uniforms.opacity.value = 0.2;
			thisCurve.material.needsUpdate = true;
			thisCurve = intersects[0].object;
			intersects[0].object.material.uniforms.opacity.value = 1.0;
			intersects[0].object.material.needsUpdate = true;
			addPoints(thisCurve);

			// thisPoint = intersects[0].object.uuid;
			// console.log(intersects[0].object.geometry.attributes.position);
		}

    // appendText(meta[thisPoint]);

  } else {
		deletePoints();
	}
  /*
  // Parse all the faces
  for ( var i in intersects ) {
  	intersects[ i ].face.material[ 0 ].color.setHex( Math.random() * 0xffffff | 0x80000000 );
  }
  */
}

function loadJSON(callback) {
   var xobj = new XMLHttpRequest();
       xobj.overrideMimeType("application/json");
   xobj.open('GET', 'static/survey_results.json', true); // Replace 'my_data' with the path to your file || true/false for async/sync
   xobj.onreadystatechange = function () {
         if (xobj.readyState == 4 && xobj.status == "200") {
           // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
           callback(xobj.responseText);
         }
   };
   xobj.send(null);
}

function parseData(data) {
	var results = JSON.parse(data);
	var disappoints = [];
	var favorites = [];
	for (var i = 0; i < results.length; i++) {
		if (results[i][58] !== "" && results[i][3] !== "") {
			disappoints.push([results[i][3], results[i][58]])
		}
		if (results[i][59] !== "" && results[i][3] !== "") {
			favorites.push([results[i][3], results[i][59]])
		}
	}

	// var unique = [];
	// for (var i = 0; i < disappoints.length; i++) {
	// 	if (unique.indexOf(disappoints[i][1]) === -1 && countryOrder.indexOf(disappoints[i][1]) === -1) {
	// 		unique.push(disappoints[i][1])
	// 	}
	// }


	// Sorted by origin
	var ordering = {} // map for efficient lookup of sortIndex
	var sortOrder = countryOrder;
	for (var i = 0; i < sortOrder.length; i++) {
		ordering[sortOrder[i]] = i;
	}
	disappoints.sort( function(a, b) {
  	return ordering[a[1]] - ordering[b[1]];
	});
	favorites.sort( function(a, b) {
  	return ordering[a[1]] - ordering[b[1]];
	});
	disappoints.sort( function(a, b) {
		return ordering[a[0]] - ordering[b[0]];
	});
	favorites.sort( function(a, b) {
		return ordering[a[0]] - ordering[b[0]];
	});

	// each unique point on circle grouped
	var favUniques = favorites.map(function(a) { return a[0] });
	var disUniques = disappoints.map(function(a) { return a[0] });
	favUniques.sort(function(a, b) {
  	return ordering[a] - ordering[b];
	});
	disUniques.sort(function(a, b) {
		return ordering[a] - ordering[b];
	});

	var counts = {};
	for (var i = 0; i < favorites.length; i++) {
		if (counts[favorites[i][0]] === undefined) {
			counts[favorites[i][0]] = 1;
		} else {
			counts[favorites[i][0]] += 1;
		}
		if (counts[favorites[i][1]] === undefined) {
			counts[favorites[i][1]] = -1;
		} else {
			counts[favorites[i][1]] -= 1;
		}
	}

	for (var i = 0; i < favorites.length; i++) {
		while (counts[favorites[i][1]] < 0) {
			favUniques.push(favorites[i][1]);
			counts[favorites[i][1]] += 1;
		}
	}
	favUniques.sort(function(a, b) {
		return ordering[a] - ordering[b];
	});

	var disCounts = {};
	for (var i = 0; i < disappoints.length; i++) {
		if (disCounts[disappoints[i][0]] === undefined) {
			disCounts[disappoints[i][0]] = 1;
		} else {
			disCounts[disappoints[i][0]] += 1;
		}
		if (disCounts[disappoints[i][1]] === undefined) {
			disCounts[disappoints[i][1]] = -1;
		} else {
			disCounts[disappoints[i][1]] -= 1;
		}
	}

	for (var i = 0; i < disappoints.length; i++) {
		while (disCounts[disappoints[i][1]] < 0) {
			disUniques.push(disappoints[i][1]);
			disCounts[disappoints[i][1]] += 1;
		}
	}
	disUniques.sort(function(a, b) {
		return ordering[a] - ordering[b];
	});


	return {
		favorites: favorites,
		disappoints: disappoints,
		favUniques: favUniques,
		disUniques: disUniques
	};

}

function orderByYear(a, b) {
  return a.year - b.year
}

function determineMinYear(data) {
  var minYear = 1950;
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].stats.length; j++) {
      if (minYear > data[i].stats[j].year) {
        minYear = data[i].stats[j].year;
      }
    }
  }
  return minYear;
}

function determineMaxYear(data) {
  var maxYear = 1950;
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].stats.length; j++) {
      if (maxYear < data[i].stats[j].year) {
        maxYear = data[i].stats[j].year;
      }
    }
  }
  return maxYear;
}

function loadingMessage() {
	if (!__DEV__) {
		var title = "Surprisingly Good Travel Destinations";
		var info1 = "This visualization shows the unexpectedly good travel destinations according to the annual r/travel survey. Black denotes a respondent's country of citizenship and green denotes the destination.";
		var info2 = "This is a work in progress, so stay tuned."
		var info3 = "Note: If you are on a mobile device turn back now."
		var messages = [info1, info2, info3];

		var loadingContainer = document.createElement("DIV");
		loadingContainer.setAttribute("id", "loading-container");

		var messageContainer = document.createElement("DIV");
		messageContainer.setAttribute("id", "loading-message");

		var messagesBox = document.createElement("DIV");
		messagesBox.setAttribute("id", "message-box");
		messageContainer.appendChild(messagesBox);

		var messageTitle = document.createElement("H3");
		var messageTitleText = document.createTextNode(title);
		messageTitle.appendChild(messageTitleText);
		messagesBox.appendChild(messageTitle);

		for (var i = 0; i < messages.length; i++) {
			var messageInfo = document.createElement("P");
			messageInfo.setAttribute("class", "message-info");
			var messageInfoText = document.createTextNode(messages[i]);
			messageInfo.appendChild(messageInfoText);
			messagesBox.appendChild(messageInfo);
		}

		var closeButton = document.createElement("BUTTON");
		var closeButtonText = document.createTextNode("Close");
		closeButton.appendChild(closeButtonText);
		closeButton.setAttribute("id", "close-button");
		closeButton.setAttribute("onClick", "closeMessage()");
		messagesBox.appendChild(closeButton);

		document.body.appendChild(loadingContainer);
		document.body.appendChild(messageContainer);

	}
}

function closeMessage() {
	document.getElementById("loading-container").style.opacity = 0;
	document.getElementById("loading-container").style.visibility = "hidden";
	document.getElementById("loading-message").style.opacity = 0;
	document.getElementById("loading-message").style.visibility = "hidden";
}

function findScreenEdgesAt(depth) {
	var tl3DCoords = findThisScreenEdge(-1, 1, 0, depth);
	var bl3DCoords = findThisScreenEdge(-1, -1, 0, depth);
	var tr3DCoords = findThisScreenEdge(1, 1, 0, depth);
	var br3DCoords = findThisScreenEdge(1, -1, 0, depth);

	return {
		t: tl3DCoords.y,
		l: tl3DCoords.x,
		r: br3DCoords.x,
		b: br3DCoords.y
	}

	console.log("TL: ", tl3DCoords);
	console.log("TR: ", tr3DCoords);
	console.log("BL: ", bl3DCoords);
	console.log("BR: ", br3DCoords);
}

function findThisScreenEdge(xGL, yGL, zGL, depth) {
	var theseGLCoords = new THREE.Vector3(xGL, yGL, zGL);
	var ray = theseGLCoords.applyMatrix4(camera.projectionMatrixInverse);
	var mult = (camera.position.z - depth) / ray.z;
	return new THREE.Vector2(
		camera.position.x - ray.x * mult,
		camera.position.y - ray.y * mult
	)
}

function findScreenPosAt(x3DCoord, y3DCoord, z3DCoord) {
	var these3DCoords = new THREE.Vector3(x3DCoord, y3DCoord, z3DCoord);
	var ray = these3DCoords.applyMatrix4(camera.projectionMatrix);
	console.log(ray);
}
