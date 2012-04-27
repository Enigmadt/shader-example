var canvWidth = window.innerWidth,
    canvHeight = window.innerHeight,
    camera = new THREE.PerspectiveCamera(45, canvWidth / canvHeight, 100, 1000000000000),
    scene = new THREE.Scene(),
    renderer = new THREE.WebGLRenderer({clearColor: 0x000000, antialias: true}),
    mouse = {
       xCoord: 0,
       yCoord: 0
    },
    lightObj = {
       xCoord: -50,
       yCoord: 100,
       zCoord: 500,
       lightColor: 0xffffff,
       showShadowCamera: true
    },
    light = new THREE.SpotLight(lightObj.lightColor),
    controls = new THREE.TrackballControls(camera);

/** /
var ambientlight = new THREE.AmbientLight(lightObj.lightColor);
scene.add(ambientlight);

var light = new THREE.DirectionalLight(0xffffff);
light.position.set(1, 1, 1).normalize();
/**/

// Licht einschalten.
light.castShadow = false;
light.shadowDarkness = 0;
light.shadowCameraVisible = lightObj.showShadowCamera;
light.position = new THREE.Vector3(lightObj.xCoord, lightObj.yCoord, lightObj.zCoord);
light.distance = 10000;
light.intensity = 2;

scene.add(light);
scene.add(camera);

renderer.setSize(canvWidth - 50, canvHeight - 50);

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

attributes = {
   displacement: {
      size: {
         type: 'f',
         value: []
      },
      customColor: {
         type: 'c',
         value: []
      }
   }
};

uniforms = {
   uscale: {
      type: 'f',
      value: 100.0
   },
   ambientColor: {
      type: "vec3",
      value: new THREE.Vector3(0.0, 0.0, 1.0)
   },
   diffuseColor: {
      type: "vec3",
      value: new THREE.Vector3(0.5, 0.5, 0.5)
   },
   specularColor: {
      type: "vec",
      value:new THREE.Vector3(0.5, 0.5, 0.5)
   },
   shininess: {
      type: 'f',
      value: 0.5
   },
   scaleBias: {
      type: "vec2",
      value: new THREE.Vector2(1.0, 0.5)
   },
   heightMap: {
      type: 't',
      value: 0,
      texture: THREE.ImageUtils.loadTexture("images/brickwallHM.jpg")
   },
   texture0: {
      type: 't',
      value: 1,
      texture: THREE.ImageUtils.loadTexture("images/brickwall.jpg")
   },
   texture1: {
      type: 't',
      value: 2,
      texture: THREE.ImageUtils.loadTexture("images/sand.PNG")
   },
   texture2: {
      type: 't',
      value: 3,
      texture: THREE.ImageUtils.loadTexture("images/grass.PNG")
   },
   texture3: {
      type: 't',
      value: 4,
      texture: THREE.ImageUtils.loadTexture("images/fels1.png")
   },
   texture4: {
      type: 't',
      value: 5,
      texture: THREE.ImageUtils.loadTexture( "images/schnee.PNG" )
   }
};

uniforms.texture0.texture.wrapS = uniforms.texture0.texture.wrapT = THREE.RepeatWrapping;
uniforms.texture1.texture.wrapS = uniforms.texture1.texture.wrapT = THREE.RepeatWrapping;
uniforms.texture2.texture.wrapS = uniforms.texture2.texture.wrapT = THREE.RepeatWrapping;
uniforms.texture3.texture.wrapS = uniforms.texture3.texture.wrapT = THREE.RepeatWrapping;
uniforms.texture4.texture.wrapS = uniforms.texture4.texture.wrapT = THREE.RepeatWrapping;

camera.position.z = 15100;

var vertexShader = $("#vertexshader");
var fragmentShader = $("#fragmentshader");

function createScene(geometry)
{
   //var materials = new THREE.MeshLambertMaterial({ wireframe: true, lights: false });

   //console.log(geometry.materials[0].morphTargets);

   //geometry.materials[0].shading = THREE.FlatShading;
   //geometry.materials[0].morphTargets = true;

   var materials = new THREE.MeshFaceMaterial({lights: false});
   console.log(geometry);
   console.log(materials);

   cube = new THREE.Mesh(geometry, materials);
   cube.scale.set(50, 50, 50);

   //console.log(THREE.GeometryUtils);
   //THREE.GeometryUtils.triangulateQuads(geometry);

   //console.log(cube.wireframe);
   scene.add(cube);
}

//var shaderMat = new THREE.ShaderMaterial({ smooth:true,uniforms: uniforms, vertexShader: vShader.text(), fragmentShader: fShader.text(), wireframe: true, lights: false });
//scene.add(new THREE.Mesh(new THREE.SphereGeometry(5000, 100, 100), shaderMat));
// scene.add(new THREE.Mesh(new THREE.OctahedronGeometry(5000, 6),new THREE.ShaderMaterial({ smooth: false, uniforms: uniforms, vertexShader: vShader.text(), fragmentShader: fShader.text(), wireframe: false }) ));
//scene.add(new THREE.Mesh(new THREE.CubeGeometry(10000, 10000, 1000, 50, 50, 50),new THREE.ShaderMaterial({ smooth: false, uniforms: uniforms, vertexShader: vShader.text(), fragmentShader: fShader.text(), wireframe: false }) ));

var loader = new THREE.JSONLoader();
loader.load("models/VertexPaintTest.json", createScene);

(function(axisLength)
{
   //Shorten the vertex function
   function v(x, y, z)
   {
      return new THREE.Vector3(x, y, z);
   }

   //Create axis (point1, point2, colour)
   function createAxis(p1, p2, color)
   {
      var line,
          lineGeometry = new THREE.Geometry(),
          lineMat = new THREE.LineBasicMaterial({color: color, lineWidth: 1});

      lineGeometry.vertices.push(p1, p2);
      line = new THREE.Line(lineGeometry, lineMat);

      scene.add(line);
   }

   createAxis(v(0, 0, 0), v(axisLength, 0, 0), 0xFF0000);
   createAxis(v(0, 0, 0), v(0, axisLength, 0), 0x00FF00);
   createAxis(v(0, 0, -axisLength), v(0, 0, 0), 0x0000FF);
}(500));


function v(x, y, z)
{
   return new THREE.Vector3(x, y, z);
}

var lineGeometry = new THREE.Geometry(),
    meshGeometry = new THREE.Geometry()
    lineMat = new THREE.LineBasicMaterial({color: 0xffffff, linewidth: 10}),
	 meshMat = new THREE.MeshBasicMaterial({color: 0x444444, wireframe: false}),
    line = new THREE.Line(lineGeometry, lineMat);
	 lineMesh = new THREE.Mesh(meshGeometry, meshMat),
    radius = 2000;

for(i = 0; i <= 360; i++)
{
   lineGeometry.vertices.push(v(Math.cos(i * Math.PI / 180) * radius, 0, (Math.sin(i * Math.PI / 180) * radius) * -1));
   meshGeometry.vertices.push(v(Math.cos(i * Math.PI / 180) * radius, 0, (Math.sin(i * Math.PI / 180) * radius) * -1));

   //console.log("X: "+linegeometry.vertices[i].position.x);
   //console.log("Z: "+linegeometry.vertices[i].position.z);
}

var verticesLength = lineGeometry.vertices.length - 1;

for(var j = 0; j < verticesLength; j++)
{
   meshGeometry.faces.push(new THREE.Face3(j, j + 1, verticesLength - j));
}

meshGeometry.mergeVertices();
meshGeometry.computeCentroids();

lineMesh.doubleSided = true;
lineMesh.add(line);
scene.add(lineMesh);


//            var meshGeom = new THREE.SphereGeometry(100,8,8),
//			meshMater = new THREE.MeshBasicMaterial({color:0xff0000});
//
//            mesh = new THREE.Mesh(meshGeom, meshMater);
//            mesh.position = new THREE.Vector3(Math.sin(90) * radius, Math.cos(90) * radius, 0);
//            scene.add(mesh);




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
            //document.addEventListener("mouseup", CameraControlMouseUp, false);
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
                render();
            }

function render()
{
   controls.update();
   renderer.render(scene, camera);

	console.log();
}