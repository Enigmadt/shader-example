var camera, scene, renderer, container,
    scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000000000000);
    
    camera.position = new THREE.Vector3(0, 0, -800000);
    
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
}

function createWorld(){
    
    mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(200000, 5), 
            new THREE.MeshPhongMaterial({color: 0x5a5c5f}));
    scene.add(mesh);
    
    area = new THREE.Mesh(new THREE.CubeGeometry(2000, 2000, 500, 1, 1, 1), new THREE.MeshBasicMaterial({}));
    area.position = new THREE.Vector3(0,0,-200100);
    scene.add(area);
}



function initalize() {
  
    createWorld();
    createLight();
    
    container = document.createElement('div');
    container.appendChild(renderer.domElement);
    document.body.appendChild(container);
    controls.domElement = container;
    animate();
    
}


function animate() {

    requestAnimationFrame(animate);
    render();
}

var winkel=0;
function render() {
    
    controls.update();
    winkel = (winkel+1) % 360;
    licht.position = new THREE.Vector3(Math.sin(winkel * Math.PI / 180)*500000,
                                                            Math.cos(winkel * Math.PI / 180)*500000,0);
    renderer.clear();
    renderer.render(scene, camera);

}