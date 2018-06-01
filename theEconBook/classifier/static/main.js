
var canvas = document.getElementById('canvas'),
    data = JSON.parse(document.getElementById("relationdata").value.replace(/'/g, "\""));

paper.setup(canvas);

// draw graphs

class RadarGraph {
    constructor (data, isDynamic) {
        this.maximum = 5;
        this.labels = Object.keys(data);
        this.outputData = {};
        this.fullGraph = this.drawGraph(data, isDynamic);
    }

    drawGraph(data, isDynamic) {
        var fullGraph = new paper.Group(),
            markerGroup = new paper.Group(),
            graphPath = new paper.Path({
                strokeColor: 'red',
                closed: true,
                fillColor: 'red',
                opacity: 0.5
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

        var dynamicGroup = isDynamic? this.drawDynamicGraph(vertices) : undefined;

        fullGraph.addChild(graphPath);
        fullGraph.addChild(markerGroup);
        fullGraph.addChild(axesGroup);
        (dynamicGroup === undefined)? console.log("static graph") : fullGraph.addChild(dynamicGroup);

        return fullGraph;
    }

    drawDynamicGraph(vertices) {
        const color = "blue";

        var dynamicGroup = new paper.Group(),
            triggerGroup = new paper.Group(),
            pathGroup = new paper.Group(),
            selectedMachine = [],
            numOfSides = this.labels.length;
        
        for (let vertix of vertices) {
            let triggerCircle = new paper.Path.Circle({
                radius: 10,
                center: vertix,
                fillColor: color,
                shadowColor: 'black',
                opacity: 0,
                name: vertix.name
            });

            triggerCircle.onMouseEnter = function(e) {
                if (!selectedMachine.includes(this.name)) {
                    this.opacity = 0.6;
                }
            }

            triggerCircle.onMouseLeave = function(e) {
                if (!selectedMachine.includes(this.name)) {
                    this.opacity = 0;
                }
            }

            triggerCircle.onMouseDown = function (e) {

                this.opacity = 1;
                this.radius = 5;

                if (this.name === "0-0") {
                    selectedMachine = [];
                    selectedMachine.push(this.name);
                    pathGroup.removeChildren();

                } else if (!selectedMachine.includes(this.name)) {
                    var deleteName = this.name.split('-')[1];
                    
                    for (let el of selectedMachine) {
                        if (el[el.length - 1] === deleteName) {
                            selectedMachine.splice(selectedMachine.indexOf(el), 1);
                        }
                    }

                    selectedMachine.push(this.name);

                    if (selectedMachine.length === numOfSides) {
                        addPath();
                    }

                    if (selectedMachine.length === numOfSides + 1) {
                        selectedMachine.splice(selectedMachine.indexOf("0-0"), 1);
                        addPath();
                    }
                }
                for (let el of triggerGroup.children) {
                    if(!selectedMachine.includes(el.name)) {
                        el.opacity = 0;
                    }
                }
            }
            triggerGroup.addChild(triggerCircle);
        }

        function addPath() {
            pathGroup.removeChildren();
            var path = new paper.Path();
            for (var i = 0; i < selectedMachine.length; i++) {
                for (var j = i+1; j < selectedMachine.length; j++) {
                    path.add(triggerGroup.children[selectedMachine[i]].position, triggerGroup.children[selectedMachine[j]].position);
                    path.fillColor = color;
                    path.closed = true;
                    path.strokeColor = color;
                }
            }
            pathGroup.addChild(path);
            pathGroup.fillColor = color;
        }
        
        dynamicGroup.addChild(triggerGroup);
        dynamicGroup.addChild(pathGroup);
        
        return dynamicGroup;
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

            // console.log(verticesOfAShape);
            
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
            var origin = polygon.getPointAt(0);
            origin.name = "0-0";

            vertices.push(origin);
        } else {
            for (var j = 0; j <= numOfSides; j ++) {
                var vertix = polygon.getPointAt(j * polygon.length / numOfSides);

                vertix.name = `${i}-${j}`;
                vertices.push(vertix);

                // draw label on each axis if reach the outer boundary
                if (i === this.maximum) {
                    var label = this.drawLabel(this.labels[numOfSides -1-j], vertix, polygon);
                    label.name = `${i}-${numOfSides -1 -j}`;

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

// console.log(data.action);
var actionGraph = new RadarGraph(data.action, true);
var roleGraph = new RadarGraph({
    'government': 3.5,
    'central_bank': 4.5,
    'households': 0.3,
    'company': 3.4
}, true);
// console.log(actionGraph, roleGraph);

//Place graphs on the right position
var activeGraph = paper.project.activeLayer.children;
// console.log(activeGraph);

for (var i = 0; i < activeGraph.length; i ++) {
    var maxGraphWidth = paper.view.size.width / activeGraph.length,
        marginLeft = maxGraphWidth / 2 + maxGraphWidth * i,
        marginTop = paper.view.size.height / 2 - 50;

    activeGraph[i].position = new paper.Point(marginLeft, marginTop);
}