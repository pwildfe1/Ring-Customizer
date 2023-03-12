let SliderControl = function (x, y, width, domain, parent, divId, name, extra = {}){

    let view = this
    view.parent = parent
    view.divId = divId
    view.name = name
    view.x = x
    view.y = y
    view.width = width
    view.div = document.getElementById(view.divId)
    view.extra = extra
    view.minimum = domain[0]
    view.maximum = domain[1]
    view.reading = view.minimum

    view.freeze = false
    if (view.extra.freeze) view.freeze = view.extra.freeze
    view.position = view.x
    if (view.extra.initial) view.position = view.x + view.extra.initial * view.width

    view.parent.svg.append("g")
        .attr("id", view.name)
    view.svg = d3.select("g#" + view.name)

    view.setup()

}


SliderControl.prototype.clear = function (){

    let view = this

    if (view.points.length > 0){
        view.svg.selectAll("path").remove()
        view.svg.selectAll("text").remove()
        view.svg.selectAll("rect").remove()
        view.svg.selectAll("tspan").remove()
    }

}


SliderControl.prototype.setup = function(){

    let view = this

    let GenLine = d3.line()
        .x((p) => p.x)
        .y((p) => p.y)
        .curve(d3.curveBasis)

    let start = { x: view.x, y: view.y }
    let end = {x: view.x + view.width, y: view.y}
    let end_points = [start, end]

    console.log(end_points)

    view.svg.append("path")
        .attr("d", GenLine(end_points))
        .attr("stroke", view.parent.theme_color)
        .attr("stroke-width", 5)
        // .attr("transform", "translate(" + view.x + "," ++ ")")

    // Setup upper and lower boundaries and sliders
    let slider_width = 20
    let slider_thickness = 10
    let upper_limit = [{x: view.position, y: view.y - slider_width/2}, {x: view.position, y: view.y + slider_width/2}]


    // Set up top slider
    view.svg.append("path")
        .attr("id", "upper_limit")
        .attr("d", GenLine(upper_limit))
        .attr("stroke", view.parent.theme_color)
        .attr("stroke-width", slider_thickness)
        .attr("fill", "none")
        .call(d3.drag()
            .on("drag", function (){
                let x = event.clientX - view.parent.origin.x
                console.log(x)
                // console.log(topStart)
                if(x >= view.x && x <= view.x + view.width) {
                    let newPos = [{x: x, y: view.y - slider_width/2}, {x: x, y: view.y + slider_width/2}]
                    d3.select(this).attr("d", GenLine(newPos))
                    view.position = x
                } else if (x < view.x){
                    view.position = view.x
                } else if (x > view.x + view.width){
                    view.position = view.x + view.width
                }
                if(view.freeze === false) {
                    view.reading = (view.maximum - view.minimum) * (view.position - view.x) / (view.width) + view.minimum
                    view.parent[view.name] = view.reading
                    view.parent.update()
                }
            })
            .on("end", function(){
                console.log(view.parent.frequency)
                if(view.freeze === true) {
                    view.reading = (view.maximum - view.minimum) * (view.position - view.x) / (view.width) + view.minimum
                    view.parent[view.name] = view.reading
                    view.parent.update()
                }
            })
        )
        .on('mouseenter', function() { d3.select(this).attr("stroke", "blue") })
        .on('mouseleave', function () { d3.select(this).attr("stroke", "red") })

}