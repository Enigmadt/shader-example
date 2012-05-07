var camera, scene, renderer, container,
    scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000000000000),
    mouse = {x:0,y:0}, INTERSECTED, projector;
    camera.position = new THREE.Vector3(0, 0, -800000),
    config = {wireframe: false};
    
scene.add(camera);

renderer = new THREE.WebGLRenderer( {clearColor: 0x5588aa,antialias: true}); 
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
controls.target = new THREE.Vector3(0,0,-200000);


function createLight(){
    licht = new THREE.PointLight(0xffffaa, 2.5, 5000000);
    licht.position = new THREE.Vector3(0,-5000,0);
    licht.name = "licht";
    scene.add(licht);
    
    ambientlicht = new THREE.AmbientLight(0x444444);
    scene.add(ambientlicht);
}

function createWorld(){
    
    mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(200000, 5), 
            new THREE.MeshLambertMaterial({color: 0x5a5c5f, wireframe: config.wireframe}));
    scene.add(mesh);
    
    geo = new THREE.CubeGeometry(2000, 2000, 500, 1, 1, 1);
    mat = new THREE.MeshBasicMaterial({wireframe: config.wireframe});
    
    for(i=0; i<360; i+=10){
        for(l=0; l<180; l+=10){
            area = new THREE.Mesh(geo,mat );
            radius = 200000;
            area.position = new THREE.Vector3(Math.sin(i*Math.PI/180)*radius,
                                                Math.cos(l*Math.PI/180)*radius,
                                                (Math.cos(i*Math.PI/180)*Math.sin(l*Math.PI/180))*radius);
            area.lookAt(new THREE.Vector3(0,0,0));
            scene.add(area);
        }
    }
    
    
    
    
    
}



function initalize() {
  
    
    container = document.createElement('div');
    container.appendChild(renderer.domElement);
    document.body.appendChild(container);
    controls.domElement = container;
    document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    
    createWorld();
    createLight();
    
    projector = new THREE.Projector();
    
    animate();
    
}

function onDocumentMouseMove(event){
    event.preventDefault();
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}


function animate() {

    requestAnimationFrame(animate);
    render();
}

function MausAuswahl(){
    
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    projector.unprojectVector( vector, camera );
    var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );
    objects = [scene.children[0] ];
    var intersects = ray.intersectObjects( scene.children );
 
    if(intersects.length > 0 ){
        if(INTERSECTED != intersects[0].object){
            intersects[0].object.material.color.setHex(Math.random()* 0xffffff);
            INTERSECTED = intersects[0].object;
        }
       
    }
    else{
        
    }
        
}

var winkel=0;
function render() {
    
    controls.update();
    winkel = (winkel+1) % 360;
    licht.position = new THREE.Vector3(Math.sin(winkel * Math.PI / 180)*500000,0,
                                        Math.cos(winkel * Math.PI / 180)*500000
                                        );
                                            
    MausAuswahl();                                        
    
    renderer.clear();
    renderer.render(scene, camera);

}