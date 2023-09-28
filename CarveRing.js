let CarveRing = function(parent, spread = 1, frequency = 3){

    let view = this
    view.app = parent
    view.spread = spread
    view.frequency = frequency
    view.phase = 0
    view.spacing = 2
    view.special_interval = 0
    view.special_offset = 0
    view.depress = true
    view.hatch = true
    view.top_line = false
    view.bot_line = false
    view.theme_color = 'rgb(0, 0, 255)'
    view.panel = []

    view.angleX = 0
    view.angleY = 0
    view.angleZ = 0

    view.original_angles = [view.angleX, view.angleY, view.angleZ]

    view.original_v = []
    view.vertices = []
    view.faces = []
    view.attractors = []
    view.app.mesh.geometry.vertices.forEach(v => {
        view.original_v.push(new THREE.Vector3(v.x, v.y, v.z))
        view.vertices.push(new THREE.Vector3(v.x, v.y, v.z))
    })

    view.app.mesh.geometry.faces.forEach(f => {view.faces.push(new THREE.Face3(f.a, f.b, f.c))})
    view.svg = d3.select("#" + "control-panel")

    view.origin = {x: view.app.control_panel_x, y: view.app.control_panel_y}

    view.createUI()

}

CarveRing.prototype.createUI = function(){

    let view = this

    console.log("CARVE CREATED!!!")

    view.UI = view.app.UI.addFolder("Carve Ring")
    view.UI.add(view, "spread", 0, 1).onChange(function(){ view.update() })
    view.UI.add(view, "frequency", 1, 6).onChange(function(){ view.update() })
    view.UI.add(view, "phase", 0, .5).onChange(function(){view.update()})
    view.UI.add(view, "spacing", 1.5, 3).onChange(function (){ view.update() })
    view.UI.add(view, "depress").onChange(function (){ view.update() })
    view.UI.add(view, "hatch").onChange(function (){view.update()})
    view.UI.add(view, "top_line").onChange(function(){view.update()}).listen()
    view.UI.add(view, "bot_line").onChange(function(){view.update()}).listen()

    view.UI.add(view, "angleX").onChange(function(){view.update()})
    view.UI.add(view, "angleY").onChange(function(){view.update()})
    view.UI.add(view, "angleZ").onChange(function(){view.update()})

    view.UI.add(view, "retrieve_log")

    view.qx = new THREE.Quaternion()
    view.qy = new THREE.Quaternion()
    view.qz = new THREE.Quaternion()

    // let x = window.innerWidth * .30 + 10
    // let y = window.innerHeight * .10 + view.app.visualizer.div.clientHeight + 10
    let x = 20

    let y = 20
    let spread_extra = {initial: 1}
    view.panel.push(new SliderControl(x, y, view.app.visualizer.div.clientWidth - 2*x, [.5, 1], view, "control-panel", "spread", spread_extra))

    y = 60
    view.panel.push(new SliderControl(x, y, view.app.visualizer.div.clientWidth - 2*x, [1, 6], view, "control-panel", "frequency"))

    y = 100
    let spacing_extra = {freeze: false}
    view.panel.push(new SliderControl(x, y, view.app.visualizer.div.clientWidth - 2*x, [2, 3], view, "control-panel", "spacing", spacing_extra))

    y = 180
    let depress_extra = {options: ["In", "Out"]}
    view.panel.push(new ButtonControl(x, y, 100, 40, "depress", view, depress_extra))

    x = 150
    let hatch_extra = {options: ["Hatch", "Wave"]}
    view.panel.push(new ButtonControl(x, y, 100, 40, "hatch", view, hatch_extra))

    x = 300
    // let download = {options: ["Download"]}
    // view.panel.push(new ButtonControl(x, y, 100, 40, "download", view))

    view.downloadButton = document.createElement("button")
    document.body.appendChild(view.downloadButton)
    view.downloadButton.style.position = "absolute"
    // view.downloadButton.style.top = (x).toString() + "px"
    // view.downloadButton.style.left = (y).toString() + "px"
    view.downloadButton.style.width = "120px"
    view.downloadButton.style.padding = "10px"
    view.downloadButton.style.height = "40px"
    view.downloadButton.style.fontSize = "10px"
    view.downloadButton.style.backgroundColor = 'rgb(200, 0, 0)'
    view.downloadButton.innerHTML = "Download"
    view.downloadButton.onclick = function() {
        view.download_print()
    }

}


CarveRing.prototype.reset = function (){
    let view = this
    view.vertices = []
    view.original_v.forEach(v => { view.vertices.push(new THREE.Vector3(v.x, v.y, v.z)) })
}


CarveRing.prototype.update = function (){

    let view = this
    view.reset()
    view.attractors = []

    view.qx.setFromAxisAngle(new THREE.Vector3(1, 0, 0), view.angleX)
    view.qy.setFromAxisAngle(new THREE.Vector3(0, 1, 0), view.angleY)
    view.qz.setFromAxisAngle(new THREE.Vector3(0, 0, 1), view.angleZ)

    if(view.angleX !== view.original_angles[0] || view.angleY !== view.original_angles[1] || view.angleZ !== view.original_angles[2]){
        view.original_angles = [view.angleX, view.angleY, view.angleZ]
        view.transform_body()
    }

    if (view.bot_line === true) view.top_line = false
    if (view.top_line === true) view.bot_line = false

    if (view.hatch === true){
        view.create_hatch()
    } else {
        view.create_lines()
    }

    view.imprint(view.spread*.75, 1)
    console.log(view.spread)
}



CarveRing.prototype.transform_body = function(){

    let view = this

    let euler = new THREE.Euler(view.qx, 'XYZ')
    view.app.mesh.geometry.rotateX(euler.x)

    euler = new THREE.Euler(view.qy, 'XYZ')
    view.app.mesh.geometry.rotateY(euler.y)

    euler = new THREE.Euler(view.qz, 'XYZ')
    view.app.mesh.geometry.rotateY(euler.z)

}



CarveRing.prototype.create_lines = function (){

    let view = this

    let resoU = Math.floor(2 * Math.PI * view.app.radius/view.spacing)
    let att_reso = 20

    for(let i = 0; i < resoU; i++){
        let pts = []
        let r = view.app.radius + 1
        let x = r * Math.cos(i/resoU * 2 * Math.PI)
        let z = r * Math.sin(i/resoU * 2 * Math.PI)
        let line_length = view.app.height * .75 * Math.sin(i/resoU * 2 * Math.PI * view.frequency + view.phase * Math.PI)
        let offset = 0
        if(i > resoU - view.special_interval){
            offset = view.special_offset
        } else if (i < view.special_interval){
            offset = -view.special_offset
        }
        for(let j = 0; j < att_reso; j++){
            if (view.bot_line === true){
                pts.push(new THREE.Vector3(x, j/(att_reso - 1)  * Math.abs(line_length - offset) - Math.abs(offset), z))
            } else if(view.top_line === true){
                pts.push(new THREE.Vector3(x, view.app.height - j / (att_reso - 1) * Math.abs(line_length - offset) + Math.abs(offset), z))
            } else {
                pts.push(new THREE.Vector3(x, j / (att_reso - 1) * line_length + (view.app.height / 2 - line_length / 2), z))
            }
        }
        view.attractors.push(pts)
    }

}


CarveRing.prototype.create_hatch = function (){

    let view = this

    let resoU = Math.floor(2 * Math.PI * view.app.radius/view.spacing)
    let att_reso = 40

    let pinch_threshold = (2 * Math.PI * view.app.radius)/view.frequency
    let pinch_points = []

    for(let i = 0; i < view.frequency; i++){
        pinch_points.push(new THREE.Vector3(view.app.radius * Math.cos(i/view.frequency * 2 * Math.PI), view.app.height/2, view.app.radius * Math.sin(i/view.frequency * 2 * Math.PI)))
    }

    for(let i = 0; i < resoU; i++){
        let pts01 = []
        let pts02 = []
        let phase = i/resoU * 2 * Math.PI
        for(let j = 0; j < att_reso; j++){

            let r = view.app.radius + 2
            let pt01 = new THREE.Vector3(r * Math.cos(j/att_reso * view.app.height/r + phase), view.app.height - view.app.height*(j/att_reso), r * Math.sin(j/att_reso * view.app.height/r + phase))
            let minimum_dist = view.app.radius
            for(let k = 0; k < pinch_points.length; k++){
                let dist = pt01.distanceTo(pinch_points[k])
                if(dist < minimum_dist) minimum_dist = dist
            }
            let factor = 0
            if(minimum_dist/pinch_threshold < 1){
                factor = 1 - minimum_dist/pinch_threshold
            }
            let radial_vector01 = new THREE.Vector3(pt01.x, 0, pt01.z)
            radial_vector01.normalize()
            radial_vector01 = radial_vector01.multiplyScalar(-factor)
            pts01.push(pt01.add(radial_vector01))

            let pt02 = new THREE.Vector3(r * Math.cos(j/att_reso * view.app.height/r + phase), view.app.height*(j/att_reso), r * Math.sin(j/att_reso * view.app.height/r + phase))
            minimum_dist = view.app.radius
            for(let k = 0; k < pinch_points.length; k++){
                let dist = pt01.distanceTo(pinch_points[k])
                if(dist < minimum_dist) minimum_dist = dist
            }
            factor = 0
            if (minimum_dist/pinch_threshold < 1){
                factor = 1 - minimum_dist/pinch_threshold
            }
            let radial_vector02 = new THREE.Vector3(pt02.x, 0, pt02.z)
            radial_vector02.normalize()
            radial_vector02 = radial_vector02.multiplyScalar(-factor)
            pts02.push(pt02.add(radial_vector02))

        }
        view.attractors.push(pts01)
        view.attractors.push(pts02)
    }

}


CarveRing.prototype.imprint = function (threshold = .5, depth = .75){

    let view = this

    let attPts = []

    for(let i = 0; i < view.attractors.length; i++) {
        attPts.push(...view.attractors[i])
    }

    for(let i = 0; i < view.app.valid.length; i++){
        let index = view.app.valid[i]
        let min_dist = view.app.radius
        for(let j = 0; j < attPts.length; j++){
            let distance = attPts[j].distanceTo(view.original_v[index])
            if (distance < min_dist) min_dist = distance
        }
        if (min_dist < threshold){
            let n = new THREE.Vector3(view.app.vn[index].x, view.app.vn[index].y, view.app.vn[index].z)
            let factor = (1 - min_dist/threshold) * depth
            if(view.depress === false) factor = -factor
            view.vertices[index] = new THREE.Vector3(view.original_v[index].x - n.x * factor, view.original_v[index].y - n.y * factor, view.original_v[index].z - n.z * factor)
        }
    }

    let geometry = new THREE.Geometry()
    view.vertices.forEach(v => geometry.vertices.push(new THREE.Vector3(v.x, v.y, v.z)))
    geometry.faces = view.faces
    view.app.visualizer.scene.remove(view.app.mesh)
    // let material = new THREE.MeshPhongMaterial();
    // material.doubleSided = true;
    geometry.computeVertexNormals()
    view.app.mesh = new THREE.Mesh(geometry, view.app.material)
    view.app.visualizer.scene.add(view.app.mesh)

}



CarveRing.prototype.download_print = function(){

    let view = this
    let key = "ring"

    let geo = view.app.mesh.geometry
    let spacing = Math.floor(view.spacing * 100) / 100
    let frequency = Math.floor(view.frequency * 100) / 100
    let prefix = frequency.toString() + "_" + spacing.toString()

    let DownloadObject = function (geo, prefix) {
        let v = ""
        let f = ""

        for(let i=0; i<geo.vertices.length; i++){
            let vert = geo.vertices[i]
            v += "v " + vert.x.toString() + " " + vert.y.toString() + " " + vert.z.toString() + "\n"
        }
        for(let i=0; i<geo.faces.length; i++){
            let face = [geo.faces[i].a + 1, geo.faces[i].b + 1, geo.faces[i].c + 1]
            f += "f " + face[0].toString() + " " + face[1].toString() + " " + face[2].toString() + "\n"
        }

        let obj = v + f

        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(obj));
        element.setAttribute('download', prefix + "_ring.obj");

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }

    DownloadObject(geo, prefix)

}


CarveRing.prototype.update_fireflower = function (){

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
            // let material = new THREE.MeshPhongMaterial();
            // material.doubleSided = true;
            geometry.computeVertexNormals()
            view.app.mesh = new THREE.Mesh(geometry, view.app.material)
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