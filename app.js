let app = function(){

    let view = this
    view.visualizer = new visualizer(false)

    let loader = new THREE.OBJLoader()

    loader.load("base_ring.obj",function(object){

        view.mesh = object.children[0];
        let material = new THREE.MeshPhongMaterial();
        material.doubleSided = true;

        view.mesh.geometry = new THREE.Geometry().fromBufferGeometry(view.mesh.geometry);
        view.mesh.material = material;

        view.visualizer.scene.add(view.mesh);

    });


}

new app()
console.log("IS IT WORKING?")
