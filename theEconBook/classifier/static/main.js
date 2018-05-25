window.onload = function() {
    var canvas = document.getElementById('canvas'),
        data = JSON.parse(document.getElementById("relationdata").value.replace(/'/g, "\""));

    paper.setup(canvas);

    // draw graphs

    class RadarGraph {
        constructor (data) {
            this.labels = Object.keys(data);
            this.axisPolygons = this.drawAxis(data);
        }
        drawAxis(data) {
            var numOfSides = this.labels.length,
                sideLength = 50,
                number = 5;
            
            var axisPolygons = new paper.Group();
            for (var i = 0; i <= number; i++) {
                var polygon = new paper.Path.RegularPolygon(paper.view.center, numOfSides, sideLength * i);
                polygon.strokeColor = "black";

                axisPolygons.addChild(polygon);
            }
            
            
            this.drawLabels(axisPolygons, this.labels);


            return axisPolygons;
        }
        drawLabels(vertices, labels) {

        }
    }
    
    console.log(data.action);
    var actionGraph = new RadarGraph(data.action);
    var roleGraph = new RadarGraph(data.role);

    //Place graphs on the right position
    var activeGraph = paper.project.activeLayer.children;
    console.log(activeGraph[0].position.x);

    for (var i = 0; i < activeGraph.length; i ++) {
        var maxGraphWidth = paper.view.size.width / activeGraph.length,
            marginLeft = maxGraphWidth / 2 + maxGraphWidth * i,
            marginTop = paper.view.size.height / 2;
        activeGraph[i].position = new paper.Point(marginLeft, marginTop);

        console.log(paper.view.size.width, activeGraph[i].position.x);
    }
    
}