            var camera, scene, renderer,
                mouse = { X: 0, y: 0 },
                scene = new THREE.Scene(),
                camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000000000000),
                light = new THREE.PointLight(0x8a4522, 3, 1000);
            scene.add(camera);
            

            renderer = new THREE.WebGLRenderer( { clearColor: 0x000000,antialias: true }); //  CanvasRenderer();
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
            controls.target = new THREE.Vector3(-20000,0,0);
            


            // licht einschalten -----------------------
            light.position = new THREE.Vector3(0, 5, -5);
            scene.add(light);

            var ambilight = new THREE.AmbientLight(0xbbbbbb);
            scene.add(ambilight);
            
                       

            attributes = {
                displacement: {
                size: { type: 'f', value: [] },
                customColor: { type: 'c', value: [] }
                }
            };

            
            uniforms = {
                time: {type: "f", value: 0},
                uscale: { type: "f", value: 100.0 },
                ambientColor: { type: "vec3", value:(0.0,0.0,1.0) },
                diffuseColor: { type: "vec3", value:(0.5,0.5,0.5) },
                SpecularColor: { type: "vec", value:(0.5,0.5,0.5) },
                shininess: { type: "f", value: 0.5 },
                scaleBias: { type: "vec2", value:(1.0,0.5) },
                texture0: { type: "t", value: 0, texture: THREE.ImageUtils.loadTexture( "Content/images/wasser.PNG" ) },
                texture1: { type: "t", value: 1, texture: THREE.ImageUtils.loadTexture( "Content/images/sand.PNG" ) },
                texture2: { type: "t", value: 2, texture: THREE.ImageUtils.loadTexture( "Content/images/grass.PNG" ) },
                texture3: { type: "t", value: 3, texture: THREE.ImageUtils.loadTexture( "Content/images/fels1.png" ) },
                texture4: { type: "t", value: 4, texture: THREE.ImageUtils.loadTexture( "Content/images/schnee.PNG" ) }
                //grass1: { type: "t", value: 5, texture: THREE.ImageUtils.loadTexture( "images/grass1.PNG" ) }
              
            };
           
            uniforms.texture0.texture.wrapS = uniforms.texture0.texture.wrapT = THREE.RepeatWrapping;
            uniforms.texture1.texture.wrapS = uniforms.texture1.texture.wrapT = THREE.RepeatWrapping;
            uniforms.texture2.texture.wrapS = uniforms.texture2.texture.wrapT = THREE.RepeatWrapping;
            uniforms.texture3.texture.wrapS = uniforms.texture3.texture.wrapT = THREE.RepeatWrapping;
            uniforms.texture4.texture.wrapS = uniforms.texture4.texture.wrapT = THREE.RepeatWrapping;
                        
            camera.position.set(-20050,0,0)
            

            var vShader = $("#vertexshader");
            var fShader = $("#fragmentshader");

            scene.add(new THREE.Mesh(new THREE.OctahedronGeometry(20000,6),new THREE.ShaderMaterial({wireframe:false, uniforms: uniforms, vertexShader: vShader.text(), fragmentShader: fShader.text() }) ));
            //scene.add(new THREE.Mesh(new THREE.OctahedronGeometry(20000,6),new THREE.MeshBasicMaterial({color:0x0000ff, wireframe:true}) ));
        var cubegeo = new THREE.CubeGeometry(1,1,1,2,2,2),
                cubemat = new THREE.MeshBasicMaterial({}),
                cube = new THREE.Mesh(cubegeo,cubemat);
		scene.add(cube);
                cube.position.set(-20000.5,0,0);
                cube.scale.set(1,1,1);
                
            var size = 1.51, length = 60000,pfeilgroese = 5000;
        
            function v(x,y,z){ 
                return new THREE.Vertex(new THREE.Vector3(x,y,z)); 
            }

            var lineGeor = new THREE.Geometry(),
                lineGeog = new THREE.Geometry(),
                lineGeob = new THREE.Geometry();
                
            lineGeor.vertices.push(v(-length, 0, 0), v(length, 0, 0),v(length-pfeilgroese, 0, pfeilgroese),v(length-pfeilgroese, 0, -pfeilgroese),v(length, 0, 0) ); 
            lineGeog.vertices.push(v(0, -length, 0), v(0, length, 0) );
            lineGeob.vertices.push(v(0, 0, -length), v(0, 0, length) );
            
            var lineMatr = new THREE.LineBasicMaterial({color: 0xff0000, lineWidth: size});
            var lineMatg = new THREE.LineBasicMaterial({color: 0x00ff00, lineWidth: size});
            var lineMatb = new THREE.LineBasicMaterial({color: 0x0000ff, lineWidth: size});
            
            var liner = new THREE.Line(lineGeor, lineMatr),
                lineg = new THREE.Line(lineGeog, lineMatg),
                lineb = new THREE.Line(lineGeob, lineMatb);
                
           // line.type = THREE.Lines;
            scene.add(liner);scene.add(lineg);scene.add(lineb);


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


            var winkel = 0;
            function animate() {
                
                requestAnimationFrame(animate);
                
                winkel = (winkel+1) % 360
                var time = parseFloat(Date.now());
                uniforms.time.value = winkel;
                $("#mouse").text(winkel);
                uniforms.uscale.value = camera.position.distanceTo(new THREE.Vector3(0,0,0));               
                render();
            }


            function render() {
            
                

                //camera.position.x += 0.1;
                // camera.lookAt(CameraTarget);
                //particleSystem.rotation.y -= 0.00051 % 360
                
                
                if (moveto == 1) {

                    if (camera.position.distanceTo(new THREE.Vector3(0, 0, 10000000)) <= 10) {

                        //moveto = 0;
                    }
                    else {
                       //camera.translateZ(-camera.position.distanceTo(new THREE.Vector3(0, 0, 3000000000))/5 );
                    }
                    
                }
            
                controls.update();

                renderer.clear();
                renderer.render(scene, camera);
            }