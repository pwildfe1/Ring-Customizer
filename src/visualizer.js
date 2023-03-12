let visualizer = function( grid = true, divID = "") {

    let view = this

    view.scene = new THREE.Scene()
    // view.UI = new dat.GUI();

    let light = new THREE.AmbientLight( 0x404040 ); // soft white light
    view.scene.add(light)

    view.screen_width = window.innerWidth
    view.screen_height = window.innerHeight

    if(divID !== ""){
        view.div = document.getElementById(divID)
        view.screen_width = view.div.clientWidth
        view.screen_height = view.div.clientHeight
    } else {
        view.div = document.body
    }

    if(grid === true) {
        let size = 10;
        let divisions = 10;
        let gridHelper = new THREE.GridHelper(size, divisions);
        view.scene.add(gridHelper);

        gridHelper = new THREE.GridHelper(size, divisions);
        gridHelper.rotation.x = Math.PI/2
        view.scene.add(gridHelper);

        gridHelper = new THREE.GridHelper(size, divisions);
        gridHelper.rotation.z = Math.PI/2
        view.scene.add(gridHelper);
    }

    view.cameras = {
        perspective: new THREE.PerspectiveCamera(45, view.screen_width / view.screen_height, 0.1, 1000),
        left: new THREE.OrthographicCamera(1, 0, 0, 0, .1, 2000),
        right: new THREE.OrthographicCamera(0, 1, 0, 0, .1, 2000)
    }
    view.display = 'perspective'
    view.updateCamera()

    view.renderer = new THREE.WebGLRenderer({ antialias: true });
    view.renderer.setClearColor( new THREE.Color("rgb(245, 245, 245)") );
    view.renderer.setPixelRatio( window.devicePixelRatio );

    if (divID === "") {
        document.body.appendChild(view.renderer.domElement);

    } else {
        let div = document.getElementById(divID);
        div.appendChild(view.renderer.domElement);
    }
    view.renderer.setSize(view.screen_width, view.screen_height);
    view.renderer.shadowMap.enabled = true;


    view.createUI()

}


visualizer.prototype.createUI = function(){

    let view = this

    // view.UI.add(view, 'display', ['perspective', 'left', 'right']).listen().onChange(function(){
    //     view.updateCamera()
    // })

    view.animate()

}


visualizer.prototype.updateCamera = function(){

    let view = this

    if (view.currCamera) view.scene.remove(view.currCamera)

    view.currCamera = view.cameras.perspective
    if (view.display === 'left') view.currCamera = view.cameras.left
    if (view.display === 'right') view.currCamera = view.cameras.right

    let pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    view.currCamera.add( pointLight );
    view.currCamera.position.set( 0, 20, 40 );
    let controls = new THREE.OrbitControls( view.currCamera, view.div );
    view.scene.add(view.currCamera)

}



visualizer.prototype.animate = function(){

    let view = this

    let animate = function() {
        requestAnimationFrame( animate );
        render();
    };

    let mouseX = 0, mouseY = 0;
    let windowHalfX = view.screen_width/ 2;
    let windowHalfY = view.screen_height / 2;

    function onDocumentMouseMove( event ) {
        mouseX = ( event.clientX - windowHalfX ) / 2;
        mouseY = ( event.clientY - windowHalfY ) / 2;
    }

    function render() {
        view.renderer.render( view.scene, view.cameras.perspective );
    }

    animate();

}