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

    $.get(link_path).done(function(links) {
        $.get(topic_path).done(function(topics) {

        })
    })
})

const DEFAULT = {
    "VIS_MAG_CONST" : 7,
    "MIN_RADIUS"    : 30,
    "RAD_MAG_CONST" : 10,
    "DEFALT_COLOR"  : "black",
    "MAX_SATURACY"  : 230,
    "BALL_FLITER"   : 20
};

function generatePosition(num) {
    var size = paper.view.size,
        Rand = paper.Point.random,
        posi = [];

    for (var i = 0; i < num; i++) {
        var pos = new Rand().multiply(size).multiply(DEFAULT.VIS_MAG_CONST);
        posi.push(pos);
    }
    return posi;
}

function generateGroups(positions, data_link){
    var groups = [];
    for (let i of Object.keys(data_link)) {
        var {topics} = data_link[i], 
            posgroup = new paper.Group(positions[parseInt(i)]);
        for (let j of topics) {
            posgroup.addChild(positions[parseInt(j)]);
        }
        groups.push(posgroup);
    }

    return groups;
}

