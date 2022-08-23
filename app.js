let app = function(){

    let view = this

    view.visualizer = new visualizer(false)

    view.UI = new dat.GUI()

    let loader = new THREE.OBJLoader()

    view.master_IP = "http://localhost:80"

    loader.load("ring_300x100.obj",function(object){

        view.mesh = object.children[0];
        let material = new THREE.MeshPhongMaterial();
        material.doubleSided = true;

        console.log(view.mesh)

        view.mesh.geometry = new THREE.Geometry().fromBufferGeometry(view.mesh.geometry);
        view.mesh.geometry.mergeVertices()
        view.mesh.material = material;

        view.visualizer.scene.add(view.mesh);

        // view.cymaticRing = new CymaticRing(view, .1, 90)
        view.imprintRing = new ImprintRing(view, .1, 90)

    });


}

new app()
console.log("IS IT WORKING?")
