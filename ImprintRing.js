let ImprintRing = function(parent, amplitude, frequency){

    let view = this
    view.app = parent
    view.amplitude = amplitude
    view.frequency = frequency
    view.centered = true
    view.orientation = "center"
    view.spacing = 1

    console.log("IMPRINT STARTED")

    view.createUI()

}

ImprintRing.prototype.createUI = function(){

    let view = this

    console.log("IMPRINT CREATED!!!")

    view.UI = view.app.UI.addFolder("Imprint Ring")
    view.UI.add(view, "amplitude", 0, 1).onFinishChange(function(){ view.update() })
    view.UI.add(view, "frequency", 1, 6).step(1).onFinishChange(function(){ view.update() })
    view.UI.add(view, "spacing", 1, 4).onFinishChange(function (){ view.update() })
    view.UI.add(view, "centered").onFinishChange(function (){ view.update() })
    view.UI.add(view, "retrieve_log")

}


ImprintRing.prototype.update = function (){

    let view = this

    view.orientation = "bottom"
    if (view.centered === true) view.orientation = "center"

    let parameters = {
        "amplitude": view.amplitude,
        "frequency": view.frequency,
        "spacing": view.spacing,
        "orientation": view.orientation
    }

    console.log(parameters)

    $.ajax({
        type: 'POST',
        cache: false,
        contentType: 'application/json;charset=UTF-8',
        data: JSON.stringify(parameters),
        url: view.app.master_IP + '/imprint',
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


ImprintRing.prototype.retrieve_log = function(){
    let view = this
    view.app.query_ping()
}