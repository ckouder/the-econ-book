$(document).ready(function() {
    var body = document.body,
        height = window.innerHeight,
        width = window.innerWidth,
        canvas = document.createElement("canvas");
    
    canvas.height = height;
    canvas.width = width;
    canvas.id = "paper";
    body.appendChild(canvas);

    var link_path = "../data/topic-link.json",
        topic_path = "../data/microeconomics.json";

    $.get(link_path).done(function(links){
        $.get(topic_path).done(function(topics) {
            main(canvas, topics, links);
        });
    });
});

function main(canvas, data_topics, data_links) {
    //setup paper.js environment
    var tool, circles, links, circleGroup, linkGroup, num, topics
        linkNums = {},
        linkTopics = {};

    paper.setup(canvas.id);
    tool = new paper.Tool();

    for (let i of Object.keys(data_links)) {
        {num, topics} = data_links[i];
        linkTopics[i] = [];

        linkNums[i] = num;
        linkTopics[i].push(topics);
    }

    circles = generateCircles(data_topics, linkNums);
    links = generateLinks(circles, linkTopics);

    circleGroup = new paper.Group(circles);
    linkGroup = new paper.Group(links);

    linkGroup.insertBelow(circleGroup);

    paper.view.onFrame = function(e) {

    }

    //console.log(linkNums, linkTopics);
    paper.view.draw();
}

function generateCircles(list, coefficients) {
    const CIR_SPRASE_RATE = 7 || argument[2].CIR_SPRASE_RATE,
          RAD_MAG_CONST = 100 || argument[2].RAD_MAG_CONST,
          MIN_RADIUS    = 25 || argument[2].MIN_RADIUS,
          MAX_CLR_SATU  = 200 || argument[2].MAX_CLR_SATU;

    var coe, circle,
        circles = [];

    for (var i=0; i < list.length; i++) {
        coe = coefficients[i] / 20 || 0,
        circle = new paper.Path.Circle({
            "center": new paper.Point.random().multiply(paper.view.size).multiply(CIR_SPRASE_RATE),
            "radius": coe * RAD_MAG_CONST + MIN_RADIUS,
            "fillColor": "#" + Math.floor(coe * MAX_CLR_SATU).toString(16).repeat(3),
            "data_speed": new paper.Point.random().subtract(0.5).multiply(2)
        });
        circles.push(circle);
        console.log(circle.data_speed);
    }
    console.log(circles);
    return circles;
}

function moveCirclesAndLinks(circleList, linkList) {
    for (let circle of circleList) {
        var pos = circle.position,
            x = pos.x,
            y = pos.y;
        
        circle.position = pos.add(circle.data_speed);
        circle.position.x = (x > paper.view.size.width || x < 0)? -x : x;
        circle.position.y = (y > paper.view.size.height || y < 0)? -y : y;
    }
}

function generateLinks(circleList, linksrc) {
    const LINK_WIDTH = 3;
    console.log(linksrc);
    var targets, target_circle, source_circle, link,
        links = [];

    for (let source of Object.keys(linksrc)) {
        targets = linksrc[source];
        
        for (let target of targets) {
            target_circle = circleList[parseInt(target)],
            source_circle = circleList[parseInt(source)],

            link = new paper.Path.Line({
                "from": source_circle.position,
                "to": target_circle.position,
                "strokeWidth": LINK_WIDTH,
                "strokeColor": {
                    "gradient": {
                        "stops": [source_circle.fillColor, target_circle.fillColor]
                    },
                    "origin": source_circle.position,
                    "destination": target_circle.position
                }
            });

            links.push(link);
        }
    }
    return links;
}
