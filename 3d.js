var PI = 3.14159235;
var maxBranches = 5;
genTree = true;
var angleRange = PI/3;
var ratio = 0.66;
var lenThresh = 5;

var w = 6*window.innerWidth/7;
var h = 6*window.innerHeight/7;
var startY = -h/4;
var startAmt = h/4;

var renderer, camera, scene, controls, leafColor, branchColor, bg;

window.addEventListener( 'resize', onWindowResize, false );

init();
animate();
genColors();
newTree(new THREE.Vector3(0,startY,0), 0,0,0, startAmt);
centerDiv();
function init(){
	var view_angle = 45, aspect = w/h, near = 0.1, far = 10000;

		renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
	camera = new THREE.PerspectiveCamera(
			view_angle, aspect, near, far);

	scene = new THREE.Scene();

	scene.add(camera);

	var camPosX = 0;
	var camPosY = 0;
	var camPosZ =5*h/7;
	var newZ = -(camPosX * Math.cos(5.49779)) - (camPosZ * Math.sin(5.49779));
	var newX = (camPosX * Math.cos(0.78)) + (camPosZ * Math.sin(0.78));
	camera.position.x=camPosX;
	camera.position.y =camPosY;
	camera.position.z = camPosZ;

	renderer.setSize(w,h);

	$("#scn").append(renderer.domElement);



	var pointLight = new THREE.PointLight(0xFFFF);

	pointLight.position.x = 0;
	pointLight.position.y = 250;
	pointLight.position.x = 0;

	scene.add(pointLight);
	
	
	controls = new THREE.OrbitControls( camera,renderer.domElement);

	//controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
	//controls.target.set(THREE.Vector3(0, 0,0));
	controls.enableDamping = true;
	controls.dampingFactor = 0.85;
	controls.enableZoom = false;
};


function rotX(iptVec, rotVal){
var rot = new THREE.Matrix3(1, 0, 0, 0, Math.cos(rotVal), -1*Math.sin(rotVal), 0, Math.sin(rotVal), Math.cos(rotVal));

iptVec.applyMatrix3(rot);

return iptVec;
};

function rotY(iptVec, rotVal){
var rot = new THREE.Matrix3(Math.cos(rotVal), 0, Math.sin(rotVal), 0, 1, 0, -1*Math.sin(rotVal), 0, Math.cos(rotVal));

iptVec.applyMatrix3(rot);

return iptVec;
};

function rotZ(iptVec, rotVal){
	var rot = new THREE.Matrix3(Math.cos(rotVal), -1*Math.sin(rotVal), 0, Math.sin(rotVal), Math.cos(rotVal), 0, 0, 0, 1);
	iptVec.applyMatrix3(rot);

	return iptVec;
	};

function rotXYZ(iptVec, rotXVal, rotYVal, rotZVal){
	var rotX = new THREE.Matrix3();
		rotX.set(1, 0, 0, 0, Math.cos(rotXVal), -1*Math.sin(rotXVal), 0, Math.sin(rotXVal), Math.cos(rotXVal));
	var rotY = new THREE.Matrix3();
		rotY.set(Math.cos(rotYVal), 0, Math.sin(rotYVal), 0, 1, 0, -1*Math.sin(rotYVal), 0, Math.cos(rotYVal));

	var rotZ = new THREE.Matrix3();
			rotZ.set(Math.cos(rotZVal), -1*Math.sin(rotZVal), 0, Math.sin(rotZVal), Math.cos(rotZVal), 0, 0, 0, 1);


	iptVec.applyMatrix3(rotX);
	iptVec.applyMatrix3(rotY);
	iptVec.applyMatrix3(rotZ);
	return iptVec;
	};


function rotAmt(iptVec, rotXVal, rotYVal, rotZVal, amt){
	var retVec = new THREE.Vector3(0, -1*amt, 0);
	retVec = rotXYZ(retVec, rotXVal, rotYVal, rotZVal);
	retVec.add(iptVec);
	return retVec;


		};

function genColors(){
	leafColor = new THREE.Color(Math.random(),Math.random(),Math.random()); 
	branchColor = new THREE.Color(Math.random(),Math.random(),Math.random()); 
 bg = new THREE.Color(Math.random(), Math.random(), Math.random());
renderer.setClearColor( bg);

	};


function newTree(root, rotXVal, rotYVal, rotZVal, totlen){
	var partoflen = totlen*Math.random();
	var tail = new THREE.Vector3(0,partoflen,0);
	tail.copy(rotXYZ(tail, rotXVal, rotYVal, rotZVal));
	tail.add(root);
	totlen = totlen* ratio;
	var lineGeom = new THREE.Geometry();
	var vArr = lineGeom.vertices;
	vArr.push(root, tail);
	lineGeom.computeLineDistances();
	if(totlen * Math.pow(ratio, 2)<= lenThresh){
		var lineMat = new THREE.LineBasicMaterial({color: leafColor});
		}
	else{
		var lineMat = new THREE.LineBasicMaterial({color: branchColor});

	}
	var line = new THREE.Line(lineGeom, lineMat);
	scene.add(line);
	if(totlen > lenThresh){
		var n = parseInt(Math.random()*(maxBranches-1)+1);
		for(var i=0; i<n; i++){
			var theta1 = ((2*Math.random())-1)*angleRange;
			var theta2 = ((2*Math.random())-1)*angleRange;
			var theta3 = ((2*Math.random())-1)*angleRange;
			newTree(tail, theta1,theta2,theta3, totlen);

		};
	};

};
function animate(){
	requestAnimationFrame(animate);
	controls.update();
	render();

};

function render(){
	renderer.render(scene, camera);
};


function regen(){

for( var i = scene.children.length - 1; i >= 0; i--){
	     var obj = scene.children[i];
		      scene.remove(obj);
			    };

genColors();
newTree(new THREE.Vector3(0,startY,0), 0,0,0, startAmt);
};

$("body").keydown(function(e){

if(e.keyCode == 32){
	regen();

};
});


function centerDiv(){
$('#container').css({
    'margin-top'  : '-' + Math.round(h / 2) + 'px',
    'margin-left' : '-' + Math.round(w / 2) + 'px'
});


};

function onWindowResize() {
	w = 6*window.innerWidth/7;
	h = 6*window.innerHeight/7;
	startY = -h/4;
	startAmt = h/4;
				camera.aspect =  w/ h;
				camera.updateProjectionMatrix();
				centerDiv();
				renderer.setSize( w, h );

			}
