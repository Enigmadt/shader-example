
var camera, scene, renderer,
    mouse = { X: 0, y: 0 },
    scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000000000000),
    light = new THREE.PointLight(0xFFFFFF, 3, 1000);
scene.add(camera);
console.log("Kamera und Licht erstellt");

renderer = new THREE.WebGLRenderer( { clearColor: 0x5588aa,
                                        antialias: true
                                }); 
renderer.setSize(window.innerWidth - 50, window.innerHeight - 50);


controls = new THREE.TrackballControls(camera);
controls.enabled = true;
controls.rotateSpeed = 1.0;
controls.zoomSpeed = 1.2;
controls.panSpeed = 0.2;
controls.noZoom = false;
controls.noPan = false;
controls.staticMoving = false;
controls.dynamicDampingFactor = 0.3;
controls.minDistance = 1.1;
controls.maxDistance = 2000000000000;
controls.keys = [65, 83, 68];



// licht einschalten -----------------------
light.position = new THREE.Vector3(0, 0, 0);
light.castShadow = true;
scene.add(light);

var ambilight = new THREE.AmbientLight(0xffffff);
scene.add(ambilight);
console.log("Licht und Kamera zur Scene hinzugefügt");



attributes = {
    displacement: {
    size: { type: 'f', value: [] },
    customColor: { type: 'c', value: [] }
    }
};


uniforms = {
    uscale: { type: "f", value: 100.0 },
    ambientColor: { type: "vec3", value:(0.0,0.0,1.0) },
    diffuseColor: { type: "vec3", value:(0.5,0.5,0.5) },
    SpecularColor: { type: "vec", value:(0.5,0.5,0.5) },
    shininess: { type: "f", value: 0.5 },
    scaleBias: { type: "vec2", value: (1.0, 0.5) },
    heightMap:{ type: "t", value: 0, texture: THREE.ImageUtils.loadTexture("images/hm.jpg") },
    texture0: { type: "t", value: 1, texture: THREE.ImageUtils.loadTexture( "images/wasser.PNG" ) },
    texture1: { type: "t", value: 2, texture: THREE.ImageUtils.loadTexture( "images/sand.PNG" ) },
    texture2: { type: "t", value: 3, texture: THREE.ImageUtils.loadTexture( "images/grass.PNG" ) },
    texture3: { type: "t", value: 4, texture: THREE.ImageUtils.loadTexture( "images/fels1.png" ) },
    texture4: { type: "t", value: 5, texture: THREE.ImageUtils.loadTexture( "images/schnee.PNG" ) }

};

uniforms.texture0.texture.wrapS = uniforms.texture0.texture.wrapT = THREE.RepeatWrapping;
uniforms.texture1.texture.wrapS = uniforms.texture1.texture.wrapT = THREE.RepeatWrapping;
uniforms.texture2.texture.wrapS = uniforms.texture2.texture.wrapT = THREE.RepeatWrapping;
uniforms.texture3.texture.wrapS = uniforms.texture3.texture.wrapT = THREE.RepeatWrapping;
uniforms.texture4.texture.wrapS = uniforms.texture4.texture.wrapT = THREE.RepeatWrapping;
uniforms.heightMap.texture.wrapS = uniforms.heightMap.texture.wrapT = THREE.RepeatWrapping;

camera.position.z = 851000;
//controls.target = new THREE.Vector3(851000, 0, 0);

var vShader = $("#vertexshader");
var fShader = $("#fragmentshader");
var scale=80000, detail=4,

    meshgeo = [[new THREE.IcosahedronGeometry(scale,detail),        scale*1.5],
                [new THREE.IcosahedronGeometry(scale,detail-1),     scale*4],
                [new THREE.IcosahedronGeometry(scale,detail-2),    scale*8],
                [new THREE.IcosahedronGeometry(scale,detail-3),   scale*15],
                [new THREE.IcosahedronGeometry(scale,detail-3),  scale*20],
                [new THREE.IcosahedronGeometry(scale,detail-3),  scale*25]
                ],
    meshmat=new THREE.ShaderMaterial({ wireframe: false, smooth: true, uniforms: uniforms, vertexShader: vShader.text(), fragmentShader: fShader.text() });

var lod1 = new THREE.LOD(),
    lod2 = new THREE.LOD(),
    lod3 = new THREE.LOD(),
    lod4 = new THREE.LOD(),
    lod5 = new THREE.LOD();



for (i = 0; i < meshgeo.length; i++) {


    var mesh1 = new THREE.Mesh(meshgeo[i][0], meshmat);
    var mesh2 = new THREE.Mesh(meshgeo[i][0], meshmat);
    var mesh3 = new THREE.Mesh(meshgeo[i][0], meshmat);
    var mesh4 = new THREE.Mesh(meshgeo[i][0], meshmat);
    var mesh5 = new THREE.Mesh(meshgeo[i][0], meshmat);


    lod2.position = new THREE.Vector3(scale*3, 0, 0);
    lod3.position = new THREE.Vector3(-scale*3, 0, 0);
    lod4.position = new THREE.Vector3(0, scale*3, 0);
    lod5.position = new THREE.Vector3(0, -scale*3, 0);

    lod1.addLevel(mesh1, meshgeo[i][1]);
    lod2.addLevel(mesh2, meshgeo[i][1]);
    lod3.addLevel(mesh3, meshgeo[i][1]);
    lod4.addLevel(mesh4, meshgeo[i][1]);
    lod5.addLevel(mesh5, meshgeo[i][1]);

}
scene.add(lod1);
scene.add(lod2);
scene.add(lod3);
scene.add(lod4);
scene.add(lod5);

var debugaxis = function (axisLength) {
    //Shorten the vertex function
    function v(x, y, z) {
        return new THREE.Vector3(x, y, z);
    }

    //Create axis (point1, point2, colour)
    function createAxis(p1, p2, color) {
        var line, lineGeometry = new THREE.Geometry(),
lineMat = new THREE.LineBasicMaterial({ color: color, lineWidth: 1 });
        lineGeometry.vertices.push(p1, p2);
        line = new THREE.Line(lineGeometry, lineMat);
        scene.add(line);
    }

    createAxis(v(-axisLength, 0, 0), v(axisLength, 0, 0), 0xFF0000);
    createAxis(v(0, -axisLength, 0), v(0, axisLength, 0), 0x00FF00);
    createAxis(v(0, 0, -axisLength), v(0, 0, axisLength), 0x0000FF);
};

debugaxis(500000);


function v(x, y, z) {
    return new THREE.Vector3(x, y, z);
}

var line, linegeometry = new THREE.Geometry(),
    linemat = new THREE.LineBasicMaterial({color: 0xaaaaaa, linewidth: 1});

var radius=200000,winkel = 0;
for (i = 0; i <= 360; i+=5) {

    linegeometry.vertices.push(v(Math.cos( i * Math.PI/180)* radius, Math.sin(i * Math.PI/180) * radius, 0));

}

line = new THREE.Line(linegeometry, linemat);
scene.add(line);

var meshGeom = new THREE.SphereGeometry(3000,8,8), meshMater = new THREE.MeshBasicMaterial({color:0xff0000});

mesh = new THREE.Mesh(meshGeom, meshmat);
mesh.position = new THREE.Vector3(Math.sin(90) * radius, Math.cos(90) * radius, 0);
scene.add(mesh);
//mesh.add(camera);


//################### Kamera Steuerung #####################################

var CameraAbstand = 30, 
    CameraDrehGeschwindigkeit = 0.4, 
    CameraTarget = new THREE.Vector3(0, 0, 0),
    MouseDown = 0,
    oldMouseX = 0,
    oldMouseY = 0,
    moveX = 0,
    moveY = 0;


var rotateStart = new THREE.Vector3(),
    rotateEnd = new THREE.Vector3(),
    eye = new THREE.Vector3();


//document.addEventListener("mousemove", CameraControllMouseMove, false);
//document.addEventListener("mousedown", CameraControlMouseDown, false);
document.addEventListener("mouseup", CameraControlMouseUp, false);
//window.addEventListener('DOMMouseScroll', CameraControlMouseWheel, false);
var moveto = 0;
function CameraControllMouseMove(event) {
    event.preventDefault();


    if (MouseDown === 1) {

        moveto = 1;

        window.mouse.X = ((event.clientX/ window.innerWidth) * 2 - 1);
        window.mouse.Y = -((event.clientY / window.innerHeight) * 2 + 1);

        //camera.position.z = Math.sin(mouse.X ) * Math.sin(mouse.Y ) * CameraAbstand;
        // camera.position.x = Math.cos(mouse.X ) * CameraAbstand;
        // camera.position.y = Math.cos(mouse.Y ) * CameraAbstand;

    }

}

function CameraControlMouseDown(event) {
    event.preventDefault();

    if (event.button === 2) {
        MouseDown = 1;
    }
}
function CameraControlMouseUp(event) {
    event.preventDefault();
    if(event.button === 1){
        MouseDown = 0;

    }
}
function CameraControlMouseWheel(event) {
    event.preventDefault();
    $("#mouse").text(CameraAbstand);
    if (CameraAbstand + event.detail / 3 > 0) CameraAbstand = CameraAbstand + event.detail / 3;

}


//#################### Kamera Steuerung ENDE ################################

function initalize() {
    //ui();


    document.body.appendChild(renderer.domElement);

    animate();
}



function animate() {

    requestAnimationFrame(animate);
    uniforms.uscale.value = camera.position.distanceTo(new THREE.Vector3(0,0,0));               
    render();
}

var winkel = 0,rendern=0;
function render() {

    var time = Date.now() * 0.005;
    winkel = (winkel + 1.536) % 360;
    lod1.rotation = new THREE.Vector3(Math.cos(winkel* Math.PI / 180), Math.sin(winkel* Math.PI / 180), 0);
    mesh.position = new THREE.Vector3(Math.cos(winkel * Math.PI / 180) * radius, Math.sin(winkel * Math.PI / 180) * radius, 0);

    THREE.SceneUtils.traverseHierarchy(scene, function (node) { if (node instanceof THREE.LOD) node.update(camera) });

    controls.update();

    renderer.clear();
    renderer.render(scene, camera);

}