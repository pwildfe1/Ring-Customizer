let ButtonControl = function(x, y, width, height, name, parent, extra = {}){

    let view = this

    view.x = x
    view.y = y
    view.width = width
    view.height = height
    view.name = name
    view.parent = parent
    view.extra = extra

    view.options = ["on", "off"]
    if(view.extra.options) view.options = view.extra.options

    view.fontSize = 18
    if(view.extra.fontSize) view.fontSize = view.extra.fontSize

    view.fontFill = "white"
    if(view.extra.fontFill) view.fontFill = view.extra.fontFill

    view.colorOptions = ['rgb(0, 0, 200)', 'rgb(100, 100, 100)']
    if(view.extra.colorOptions) view.colorOptions = view.extra.colorOptions

    view.currIndex = 0

    view.parent.svg.append("rect")
        .attr("id", view.name)
        .attr('x', view.x)
        .attr('y', view.y)
        .attr('width', view.width)
        .attr('height', view.height)
        .attr('stroke', 'black')
        .attr('fill', view.colorOptions[view.currIndex])//'#69a3b2'
        .on('click', function(){
            view.currIndex = (view.currIndex + 1)%view.options.length
            d3.select("#" + view.name + "_text")
                .text(view.options[view.currIndex])
            d3.select(this)
                .attr('fill', view.colorOptions[view.currIndex])
            if (view.parent[view.name] === true){
                view.parent[view.name] = false
            } else {
                view.parent[view.name] = true
            }
            view.parent.update()
        })

    view.parent.svg.append("text")
        .attr("id", view.name + "_text")
        .text(view.options[view.currIndex])
        .attr('font-family', 'Roboto')
        .attr('font-size', view.fontSize.toString() + 'px')
        .attr('width', view.width)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'after-edge')
        .attr('fill', 'white')
        .attr('x', view.x + view.width/2)
        .attr('y', view.y + view.height/2 + 10)
        .on('click', function(){
            view.currIndex = (view.currIndex + 1)%view.options.length
            d3.select("#" + view.name)
                .attr('fill', view.colorOptions[view.currIndex])
            d3.select(this)
                .text(view.options[view.currIndex])
            if (view.parent[view.name] === true){
                view.parent[view.name] = false
            } else {
                view.parent[view.name] = true
            }
            view.parent.update()
        })

}