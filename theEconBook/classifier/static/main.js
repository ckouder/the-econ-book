
var canvas = document.getElementById('canvas'),
    data = JSON.parse(document.getElementById("relationdata").value.replace(/'/g, "\""));

paper.setup(canvas);

// draw graphs

class RadarGraph {
    constructor (data) {
        this.maximum = 5;
        this.labels = Object.keys(data);
        this.draggable = false;
        this.fullGraph = this.drawGraph(data, this.draggable);
    }

    drawGraph(data, draggable) {
        var fullGraph = new paper.Group(),
            markerGroup = new paper.Group(),
            graphPath = new paper.Path({
                strokeColor: 'red',
                closed: true,
                fillColor: 'red'
            }),
            {vertices, axesGroup} = this.drawAxis();

        this.labels.forEach((el, i) => {
            var path = axesGroup.children['verticalAxisGroup'].children[i],
                offset = data[el] / this.maximum * path.length,
                center = path.getPointAt(offset),
                circle = new paper.Path.Circle({
                    radius: 1,
                    center: center,
                    fillColor: 'red'
                });

            markerGroup.addChild(circle);
            graphPath.add(center);
        });

        fullGraph.addChild(graphPath);
        fullGraph.addChild(markerGroup);
        fullGraph.addChild(axesGroup);
    }

    // Generate axes according to the number of sides
    drawAxis() {
        var numOfSides = this.labels.length,
            sideLength = paper.view.size.width / 20,
            strokeColor = 'black';

        // draw horizontal axes and labels
        var axesGroup = new paper.Group(),
            horizontalAxisGroup = new paper.Group(),
            vertices = [];

        for (var i = 1; i <= this.maximum; i++) {
            var horizontalAxis = new paper.Path.RegularPolygon({
                    center: paper.view.center, 
                    sides: numOfSides, 
                    radius: sideLength * (i-1),
                    strokeColor: strokeColor
                });
            
            var {verticesOfAShape, labelGroup} = this.getVerticesAndLabels(horizontalAxis, i);

            vertices = vertices.concat(verticesOfAShape);
            horizontalAxisGroup.addChild(horizontalAxis);

            console.log(verticesOfAShape);
            
            if (labelGroup.children.length !== 0) {
                horizontalAxisGroup.addChild(labelGroup);
                console.log("added!");
            } else {
                labelGroup.remove();
                console.log("removed!");
            }
        }

        //console.log(horizontalAxisGroup);
        //draw vertical axes
        var verticalAxisGroup = new paper.Group();

        console.log(vertices);
        for (var i = 1; i <= numOfSides; i ++) {
            var startPoint = vertices[0],
                endPoint = vertices[vertices.length - 1 - i],
                verticalAxis = new paper.Path.Line({
                    from: startPoint,
                    to: endPoint,
                    strokeColor: strokeColor,
                });
            verticalAxis.strokeColor.alpha = 0.4;

            verticalAxisGroup.addChild(verticalAxis);
        }

        horizontalAxisGroup.name = "horizontalAxisGroup";
        verticalAxisGroup.name = "verticalAxisGroup";
        axesGroup.addChild(horizontalAxisGroup);
        axesGroup.addChild(verticalAxisGroup);

        return {vertices, axesGroup};
    }

    getVerticesAndLabels(polygon, i) {
        var numOfSides = polygon.segments.length,
            labelGroup = new paper.Group(),
            vertices = [];

        //console.log(polygon);
        if (polygon.area === 0 && polygon.length < numOfSides) {
            vertices.push(polygon.getPointAt(0));
        } else {
            for (var j = 0; j <= numOfSides; j ++) {
                var vertix = polygon.getPointAt(j * polygon.length / numOfSides);
                
                vertices.push(vertix);

                // draw label on each axis if reach the outer boundary
                if (i === this.maximum) {
                    //console.log(label);

                    var label = this.drawLabel(this.labels[j], vertix, polygon);
                    labelGroup.addChild(label);
                }
            }
        }

        labelGroup.scale(1.1);
        labelGroup.translate(new paper.Point(-20,3));

        return {
            verticesOfAShape: vertices,
            labelGroup: labelGroup
        };
    }

    drawLabel(label, vertix, horizontalAxis) {
        return new paper.PointText({
            point: vertix,
            content: label,
        });
    }
}

console.log(data.action);
var actionGraph = new RadarGraph(data.action);
var roleGraph = new RadarGraph({
    'government': 2.3,
    'central_bank': 4.5,
    'households': 0.3,
    'company': 3.4
});
console.log(actionGraph, roleGraph);

//Place graphs on the right position
var activeGraph = paper.project.activeLayer.children;
console.log(activeGraph);

for (var i = 0; i < activeGraph.length; i ++) {
    var maxGraphWidth = paper.view.size.width / activeGraph.length,
        marginLeft = maxGraphWidth / 2 + maxGraphWidth * i,
        marginTop = paper.view.size.height / 2;

    activeGraph[i].position = new paper.Point(marginLeft, marginTop);
}