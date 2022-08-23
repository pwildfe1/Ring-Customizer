let ImprintRing = function(parent, frequency, threshold){

    let view = this
    view.app = parent
    view.frequency = frequency
    view.threshold = threshold

    console.log("IMPRINT STARTED")

    view.createUI()

}

ImprintRing.prototype.createUI = function(){

    let view = this

    console.log("IMPRINT CREATED!!!")

    view.UI = view.app.UI.addFolder("Imprint Ring")
    view.UI.add(view, "frequency", 0, .3)
    view.UI.add(view, "threshold", 30, 180)
    view.UI.add(view, "update")

}

ImprintRing.prototype.update = function (){

    let view = this

    let parameters = {
        "frequency": view.frequency,
        "threshold": view.threshold
    }

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

        },
        error: (err)=>{
            console.warn(err)
            console.log("fuck")
        }
    });

    // $.post( view.app.master_IP + '/cymatic', parameters).done(function (response) {
    //
    //     console.log('response received!', response); // the api response is an array of generated file name
    //
    //     // // download result file
    //     // let download_URL = view.app.master_IP + '/storage/download?name=' + response[0] + '&t=' + view.app.API_key;
    //     // // open(download_URL)
    //     //
    //     // new THREE.OBJLoader().load(download_URL,obj=> {
    //     //     view.app.statusTag.text('pattern updated!')
    //     //     view.projectPattern(obj.children[0].geometry)
    //     // })
    //
    // }).fail(function (error) {
    //     console.log(error)
    // })

}