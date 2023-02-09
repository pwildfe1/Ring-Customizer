let CarveRing = function(parent, spread = 1, frequency = 3){

    let view = this
    view.app = parent
    view.spread = spread
    view.frequency = frequency
    view.spacing = 2

    view.createUI()

}

CarveRing.prototype.createUI = function(){

    let view = this

    console.log("CARVE CREATED!!!")

    view.UI = view.app.UI.addFolder("Carve Ring")
    view.UI.add(view, "spread", 0, 1).step(.1).onFinishChange(function(){ view.update() })
    view.UI.add(view, "frequency", 1, 6).step(1).onFinishChange(function(){ view.update() })
    view.UI.add(view, "spacing", 2, 3).onFinishChange(function (){ view.update() })
    view.UI.add(view, "retrieve_log")

}

CarveRing.prototype.update = function (){

    let view = this

    let parameters = {
        "threshold": view.spread,
        "frequency": view.frequency,
        "spacing": view.spacing,
    }

    console.log(parameters)

    $.ajax({
        type: 'POST',
        cache: false,
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(parameters),
        url: view.app.master_IP + '/carve',
        success: (response)=> {
            let results = JSON.parse(response)
            let vertices = results.v
            let faces = results.f
            let geometry = new THREE.Geometry()
            let v = []
            let f = []
            for(let i = 0; i < vertices.length; i++){ v.push(new THREE.Vector3(vertices[i][0], vertices[i][1], vertices[i][2])) }
            for(let i = 0; i < faces.length; i++){ f.push(new THREE.Face3(faces[i][0], faces[i][1], faces[i][2])) }
            console.log(v)
            console.log(f)
            geometry.vertices = v
            geometry.faces = f
            view.app.visualizer.scene.remove(view.app.mesh)
            let material = new THREE.MeshPhongMaterial();
            material.doubleSided = true;
            geometry.computeVertexNormals()
            view.app.mesh = new THREE.Mesh(geometry, material)
            view.app.visualizer.scene.add(view.app.mesh)

            view.app.add_ping()

        },
        error: (err)=>{
            console.warn(err)
            console.log("fuck")
        }
    });

}


CarveRing.prototype.retrieve_log = function(){
    let view = this
    view.app.query_ping()
}