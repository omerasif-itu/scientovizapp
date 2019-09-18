function pieRing(){
    d3.select("#vis").html(null);
    d3.select("#title").text("Venue Pie");
    d3.select("#detail").text("Distribution of publication submissions in venues.");
    var svg = dimple.newSvg("#vis", 590, 400);
    d3.csv("data/venues.csv", function (data) {
        var myChart = new dimple.chart(svg, data);
        myChart.setBounds(20, 20, 460, 360)
        myChart.addMeasureAxis("p", "Submissions");
        var outerRing = myChart.addSeries("Venue", dimple.plot.pie);
        // var innerRing = myChart.addSeries("Venue", dimple.plot.pie);
        // Negatives are calculated from outside edge, positives from center
        outerRing.innerRadius = "-30px";
        // innerRing.outerRadius = "-40px";
        // innerRing.innerRadius = "-70px";
        myChart.addLegend(500, 20, 90, 300, "left");
        myChart.draw();
    });
}
function venueBars() {
    d3.select("#title").text("Authors/Venue/Publication Distribution");
    d3.select("#detail").text("Authors publications in different venues. Use minimap to scroll through the chart");
    var vegsp = {
        "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
        "data": {"url": "data/venues.csv"},
        "hconcat": [{
            transform: [{
                filter: {selection: "brush"}
            }],
            "mark": "bar",
            "encoding": {
                "x": {
                    "field": "Submissions",
                    "type": "quantitative",
                    "aggregate": "sum",
                    "axis": {
                        "title": "Submissions",
                        "orient":"top"
                    },
                    "scale": {"domain": [0,100]}
                },
                "y": {
                    "field": "Author",
                    "type": "nominal",
                    "sort": "-x",
                    scale:{domain:{selection: "brush"}},
                    axis: {
                        title: null,
                        minExtent:200
                    },

                },
                "color": {
                    "field": "Venue",
                    "type": "nominal",
                    "scale": {
                        "scheme":"rainbow"
                    },
                    "legend": {"title": "Venues"}
                },
                "tooltip": [
                    {
                        "field": "Author",
                        "type": "nominal"
                    },
                    {
                        "field": "Submissions",
                        "type": "quantitative"
                    },
                    {
                        "field": "Venue",
                        "type": "nominal"

                    }
                ]
            }
        },
            {
                height: 200,
                width:50,
                selection:{
                    brush:{
                        type:"interval",
                        encodings:["y"]
                    }
                },
                mark: "bar",
                encoding:{
                    y:{
                        field:"Author",
                        type: "nominal",
                        sort:'-x',
                        axis: null
                    },
                    x:{
                        field:"Submissions",
                        aggregate:'sum',
                        type:'quantitative',
                        axis:null
                    },
                    "color": {
                        "field": "Venue",
                        "type": "nominal",
                        "scale": {
                            "scheme":"rainbow"
                        },
                        "legend": {"title": "Venues"}
                    }
                }
            }]
    }
    vegaEmbed("#vis", vegsp);
}

function topKAuthors(){
    d3.select("#title").text("Select K Authors");
    d3.select("#detail").text("Select K Author given publication submissions.");
    var vegsp = {
        "$schema": "https://vega.github.io/schema/vega/v4.json",
        "width": 500,
        "height": 410,
        "padding": 5,
        "autosize": "fit",
        "signals": [
            {
                "name": "selected",
                "value": "",
                "on": [
                    { "events": "arc:click!", "update": "datum" },
                    { "events": "dblclick!", "update": "''" }
                ]
            },
            {
                "name": "k", "value": 10,
                "bind": {"input": "range", "min": 1, "max": 100, "step": 5}
            },
            {
                "name": "op", "value": "sum",
                "bind": {"input": "select", "options": ["average", "median", "sum"]}
            },
            {
                "name": "label",
                "value": {"average": "Average", "median": "Median", "sum": "Total"}
            }
        ],

        "title": {
            "text": {"signal": "'Top Authors by ' + label[op] + ' Publications'"},
            "anchor": "start",
            "frame": "group"
        },
        "data": [
            {
                "name": "venues",
                "url": "data/venues.json",
                "transform": [
                    {
                        "type": "filter",
                        "expr": "datum.Submissions != null && datum.Author != null"
                    },
                    {
                        "type": "aggregate",
                        "groupby": ["Author"],
                        "ops": [{"signal": "op"}],
                        "fields": ["Submissions"],
                        "as": ["pub_count"]
                    },
                    {
                        "type": "window",
                        "sort": {"field": "pub_count", "order": "descending"},
                        "ops": ["row_number"], "as": ["rank"]
                    },
                    {
                        "type": "filter",
                        "expr": "datum.rank <= k"
                    }
                ]
            }
        ],

        "marks": [
            {
                "type": "rect",
                "from": {"data": "venues"},
                "encode": {
                    "update": {
                        "x": {"scale": "x", "value": 0},
                        "x2": {"scale": "x", "field": "pub_count"},
                        "y": {"scale": "y", "field": "Author"},
                        "height": {"scale": "y", "band": 1},
                        "tooltip":{"signal":"datum"}
                    }
                }
            }
        ],
        "scales": [
            {
                "name": "x",
                "type": "linear",
                "domain": {"data": "venues", "field": "pub_count"},
                "range": "width",
                "nice": true
            },
            {
                "name": "y",
                "type": "band",
                "domain": {
                    "data": "venues", "field": "Author",
                    "sort": {"op": "max", "field": "pub_count", "order": "descending"}
                },
                "range": "height",
                "padding": 0.1
            }
        ],
        "axes": [
            {
                "scale": "x",
                "orient": "bottom",
                "format": "d",
                "tickCount": 3
            },
            {
                "scale": "y",
                "orient": "left"
            }
        ]

    }
    vegaEmbed("#vis", vegsp);
}

function donuts(){

    var vegsp = {
        "$schema": "https://vega.github.io/schema/vega/v4.json",
        "width": 400,
        "height": 400,
        "autosize": "none",

        "data":[
            {
                name:"ven",
                url:"data/venues.json"
            }
        ],
        marks:[
            {
                type:"arc",
                from:{data:"ven"},
                encode:{
                    enter:{
                        fill:{
                            scale: "color",
                            field: "Submissions"
                        }
                    }
                }

            }
        ],
        scales:[
            {
                name:"color",
                type:"ordinal",
                domain:{data: "ven", field:"Venue"},
                range:{scheme:"category20"}
            }
        ]
    }
    vegaEmbed("#vis", vegsp);
}
function piechart() {
    var vegspec = {
        "$schema": "https://vega.github.io/schema/vega/v4.json",
        "width": 600,
        "height": 600,
        "autosize": "fit",

        "signals": [
            {
                "name": "selected",
                "value": "",
                "on": [
                    {"events": "arc:click!", "update": "datum"},
                    {"events": "dblclick!", "update": "''"}
                ]
            }
        ],

        "data": [
            {
                "name": "ven",
                "url": "data/venues.json",
                "transform": [
                    {
                        "type": "pie",
                        "field": "Submissions",
                        "groupby": ["Venue"]
                    }
                ]
            }
        ],

        "scales": [
            {
                "name": "color",
                "type": "ordinal",
                "domain":{"data":"ven","field":"Venue"},
                "range": {"scheme": "category20"}
            }
        ],

        "marks": [
            {
                "name": "mark",
                "type": "arc",
                "interactive": true,
                "from": {"data": "ven"},
                "encode": {
                    "enter": {
                        "fill": {"scale": "color", "field": "Venue"},
                        "aggregate":"sum",
                        "x": {"signal": "width / 2"},
                        "y": {"signal": "height / 2"},
                        "tooltip": {"signal": "datum"}
                    },
                    "update": {
                        "startAngle": {"field": "startAngle"},
                        "endAngle": {"field": "endAngle"},
                        "padAngle": [{"value": 0.01}],
                        "outerRadius": {"signal": "width / 5"},
                        "cornerRadius": {"value": 0},
                        "innerRadius": {"signal": 45},
                        "opacity": [{"value": 1.0}],
                        "fill": [{"scale": "color", "field": "Venue"}]
                    },
                    "hover": {}
                }
            }
        ]
    }
    vegaEmbed("#vis",vegspec);
}

function piechart2(){
    var vegspec = {
        "$schema": "https://vega.github.io/schema/vega/v4.json",
        "width": 600,
        "height": 600,
        "autosize": "none",

        "signals": [
            {
                "name": "selected",
                "value": "",
                "on": [
                    { "events": "arc:click!", "update": "datum" },
                    { "events": "dblclick!", "update": "''" }
                ]
            },
            {
                "name": "startAngle", "value": 0,
                "bind": {"input": "range", "min": 0, "max": 6.29, "step": 0.01}
            },
            {
                "name": "endAngle", "value": 6.29,
                "bind": {"input": "range", "min": 0, "max": 6.29, "step": 0.01}
            },
            {
                "name": "padAngle", "value": 0,
                "bind": {"input": "range", "min": 0, "max": 0.1}
            },
            {
                "name": "innerRadius", "value": 60,
                "bind": {"input": "range", "min": 0, "max": 90, "step": 1}
            },
            {
                "name": "cornerRadius", "value": 0,
                "bind": {"input": "range", "min": 0, "max": 10, "step": 0.5}
            },
            {
                "name": "sort", "value": false,
                "bind": {"input": "checkbox"}
            }
        ],

        "data": [
            {
                "name": "table",
                "url": "data/venues.json",
                "transform": [
                    {
                        "type": "pie",
                        "field": "Submissions",
                        "aggregate":"sum",
                        "startAngle": {"signal": "startAngle"},
                        "endAngle": {"signal": "endAngle"},
                        "sort": {"signal": "sort"}
                    }
                ]
            }
        ],

        "scales": [
            {
                "name": "color",
                "type": "nominal",
                "domain": {"data": "table", "field": "Venue"},
                "range": {"scheme": "category20"}
            }
        ],

        "marks": [
            {
                "type": "arc",
                "from": {"data": "table"},
                "encode": {
                    "enter": {
                        "fill": {"scale": "color", "field": "Venue"},
                        "x": {"signal": "width / 2"},
                        "y": {"signal": "height / 2"},
                        "tooltip":{"signal":"datum"}
                    },
                    "update": {
                        "startAngle": {"field": "startAngle"},
                        "endAngle": {"field": "endAngle"},
                        "padAngle": {"signal": "padAngle"},
                        "innerRadius": {"signal": "innerRadius"},
                        "outerRadius": {"signal": "width / 2"},
                        "cornerRadius": {"signal": "cornerRadius"}
                    }
                }
            }
        ]
    }
    vegaEmbed("#vis", vegspec);
}