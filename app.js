let app = function(){

    let view = this

    view.visualizer = new visualizer(false, "render_window")

    view.UI = new dat.GUI()

    view.user_name = "fireflower"

    let loader = new THREE.OBJLoader()

    // view.master_IP = "https://fireflower-api-test-y2hc3ntgeq-uk.a.run.app"
    view.master_IP = "http://localhost:5000"

    let offsetX = window.innerWidth * .30
    let offsetY = window.innerHeight * .10 + view.visualizer.div.clientHeight + 10

    view.control_panel_x = offsetX
    view.control_panel_y = offsetY

    // view.controls = d3.select("body").append("svg")
    //     .attr("id", "control-panel")
    //     .attr("height", window.innerHeight * .40)
    //     .attr("width", view.visualizer.div.clientWidth)
    //     .attr("transform","translate(" + offsetX + "," + offsetY + ")")

    // loader.load("ring_7_dent.obj",function(object){
    loader.load("ring_7_dent.obj",function(object){

        view.mesh = object.children[0];
        // let material = new THREE.MeshPhongMaterial();
        view.material = new THREE.MeshStandardMaterial();
        view.material.metalness = .5
        view.material.color.set("#FFD700") //#ffffff
        view.material.doubleSided = true;

        console.log(view.mesh)

        view.mesh.geometry = new THREE.Geometry().fromBufferGeometry(view.mesh.geometry);
        view.mesh.geometry.mergeVertices()
        view.mesh.material = view.material;

        view.visualizer.scene.add(view.mesh);

        view.setValid()

        // view.cymaticRing = new CymaticRing(view, .1, 90)
        // view.imprintRing = new ImprintRing(view, 1, 2)
        view.carveRing = new CarveRing(view)

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

app.prototype.setValid = function(threshold = 0.8){

    let view = this

    view.vn = []
    let v = view.mesh.geometry.vertices
    let f = view.mesh.geometry.faces
    let selected = []
    let minX = v[0].x
    let maxX = v[0].x
    let minY = v[0].y
    let maxY = v[0].y

    view.valid = []
    view.colors = []

    for(let i = 0; i < v.length; i++){
        if(v[i].x > maxX) maxX = v[i].x
        if(v[i].x < minX) minX = v[i].x
        if(v[i].y > maxY) maxY = v[i].y
        if(v[i].y < minY) minY = v[i].y
        view.vn.push(new THREE.Vector3(0, 0, 0))
    }

    view.radius = maxX - 1
    // view.height = maxY - minY
    view.height = maxY
    view.mesh.geometry.computeVertexNormals()


    for(let i = 0; i < f.length; i++){
        let v1 = v[f[i].a]
        let v2 = v[f[i].b]
        let v3 = v[f[i].c]
        let fn = f[i].normal
        let orientation = new THREE.Vector3(v1.x, fn.y, v1.z) // assumming origin is 0, 0, 0
        orientation.normalize()

        if (selected.indexOf(f[i].a) === -1){
            view.vn[f[i].a] = new THREE.Vector3(f[i].vertexNormals[0].x, f[i].vertexNormals[0].y, f[i].vertexNormals[0].z)
            selected.push(f[i].a)
        }

        if (selected.indexOf(f[i].b) === -1){
            view.vn[f[i].b] = new THREE.Vector3(f[i].vertexNormals[1].x, f[i].vertexNormals[1].y, f[i].vertexNormals[1].z)
            selected.push(f[i].b)
        }

        if (selected.indexOf(f[i].c) === -1){
            view.vn[f[i].c] = new THREE.Vector3(f[i].vertexNormals[2].x, f[i].vertexNormals[2].y, f[i].vertexNormals[2].z)
            selected.push(f[i].c)
        }

        if(orientation.dot(fn) > threshold){
            if (view.valid.indexOf(f[i].a) === -1) {
                view.valid.push(f[i].a)
                view.colors.push([100, 100, 0])
            }
            if (view.valid.indexOf(f[i].b) === -1) {
                view.valid.push(f[i].b)
                view.colors.push([100, 100, 0])
            }
            if (view.valid.indexOf(f[i].c) === -1) {
                view.valid.push(f[i].c)
                view.colors.push([100, 100, 0])
            }
        } else {
            view.colors.push([200, 200, 200])
        }
    }

}

// function gen_rgb(values){
//     return 'rgb(' + values.join(',') + ')'
// }


new app()
console.log("IS IT WORKING?")
