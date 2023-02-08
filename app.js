let app = function(){

    let view = this

    view.visualizer = new visualizer(false)

    view.UI = new dat.GUI()

    view.user_name = "fireflower"

    let loader = new THREE.OBJLoader()

    view.master_IP = "https://fireflower-api-test-y2hc3ntgeq-uk.a.run.app"
    // view.master_IP = "http://localhost:5000"

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
        view.imprintRing = new ImprintRing(view, 1, 2)

    });


}


app.prototype.add_ping = function(){
    let view = this

    let parameters = {
        "User": view.user_name
    }

    $.ajax({
        type: 'POST',
        cache: false,
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(parameters),
        url: view.master_IP + '/add_log',
        success: (response)=> {
            let results = JSON.parse(response)
            console.log(results)
        },
        error: (err)=>{
            console.warn(err)
            console.log("fuck")
        }

    })

}


app.prototype.query_ping = function(){
    let view = this

    $.ajax({
        type: 'GET',
        cache: false,
        contentType: 'application/json;charset=UTF-8',
        url: view.master_IP + '/retrieve_log',
        success: (response)=> {
            let results = JSON.parse(response)
            console.log(results)
        },
        error: (err)=>{
            console.warn(err)
            console.log("fuck")
        }

    })
}


new app()
console.log("IS IT WORKING?")
