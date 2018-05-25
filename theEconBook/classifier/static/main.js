window.onload = function() {
    var canvas = document.getElementById('canvas'),
        data = JSON.parse(document.getElementById("relationdata").value.replace(/'/g, "\""));

    paper.setup(canvas);

    // draw graphs

    class RadarGraph {
        constructor (data) {
            this.data = data;
            this.labels = Object.keys(data);
            this.axes = this.drawAxis(data);
        }
        drawAxis(data) {
            var numOfSides = this.labels.length,
                sideLength = paper.view.size.width / 20,
                number = 4,
                strokeColor = 'black';

            // draw shape axes and labels
            var axesGroup = new paper.Group(),
                horizontalAxisGroup = new paper.Group(),
                labelGroup = new paper.Group(), 
                vertices = [];

            for (var i = 0; i <= number; i++) {
                var horizontalAxis = new paper.Path.RegularPolygon({
                        center: paper.view.center, 
                        sides: numOfSides, 
                        radius: sideLength * i,
                        strokeColor: strokeColor,
                        name: numOfSides + '-' + i
                    });
                
                if (horizontalAxis !== 0 && horizontalAxis.length >= numOfSides) {
                    for (var j = 0; j <= numOfSides; j ++) {
                        //console.log(j, horizontalAxis.length);
                        var textPoistion = j * horizontalAxis.length / numOfSides;
                        
                        vertices.push(horizontalAxis.getPointAt(textPoistion));

                        if (i === number) {
                            var label = this.drawLabel(this.labels[j], textPoistion, horizontalAxis);
                            labelGroup.addChild(label);
                        }
                    }
                } else {
                    vertices.push(horizontalAxis.getPointAt(0));
                }

                labelGroup.scale(1.1);
                labelGroup.translate(new paper.Point(-20,3));
                horizontalAxisGroup.addChild(horizontalAxis);
                horizontalAxisGroup.addChild(labelGroup);
            }

            //draw vertical axes
            var verticalAxisGroup = new paper.Group();

            for (var i = 1; i <= numOfSides; i ++) {
                var startPoint = vertices[0],
                    endPoint = vertices[vertices.length - 1 - i],
                    k = (startPoint.y - endPoint.y) / (startPoint.x - endPoint.x),
                    verticalAxis = new paper.Path.Line({
                        from: startPoint,
                        to: endPoint,
                        strokeColor: strokeColor,
                    });
                verticalAxis.strokeColor.alpha = 0.4;

                verticalAxisGroup.addChild(verticalAxis);
            }

            axesGroup.addChild(horizontalAxisGroup);
            axesGroup.addChild(verticalAxisGroup);

            return axesGroup;
        }
        drawLabel(data, position, horizontalAxis) {
            return new paper.PointText({
                point: horizontalAxis.getPointAt(position),
                content: data,
            });
        }
    }
    
    console.log(data.action);
    var actionGraph = new RadarGraph(data.action);
    var roleGraph = new RadarGraph(data.role);
    console.log(actionGraph, roleGraph);

    //Place graphs on the right position
    var activeGraph = paper.project.activeLayer.children;
    console.log(activeGraph[0].position.x);

    for (var i = 0; i < activeGraph.length; i ++) {
        var maxGraphWidth = paper.view.size.width / activeGraph.length,
            marginLeft = maxGraphWidth / 2 + maxGraphWidth * i,
            marginTop = paper.view.size.height / 2;
        activeGraph[i].position = new paper.Point(marginLeft, marginTop);

        console.log(activeGraph);
    }
    
}