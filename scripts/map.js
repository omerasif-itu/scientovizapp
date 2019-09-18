function drawMap() {
    var spec = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "padding": 10,
        "width": 450,
        "height": 450,
        "autosize": "none",

        "signals": [
            {
                "name": "quakeSize", "value": 6,
                "bind": {"input": "range", "min": 0, "max": 1000}
            },
            {
                "name": "rotate0", "value": 90,
                "bind": {"input": "range", "min": -180, "max": 180}
            },
            {
                "name": "rotate1", "value": -5,
                "bind": {"input": "range", "min": -180, "max": 180}
            }
        ],

        "data": [
            {
                "name": "sphere",
                "values": [
                    {"type": "Sphere"}
                ]
            },
            {
                "name": "world",
                "url": "data/world-110m.json",
                "format": {
                    "type": "topojson",
                    "feature": "countries"
                }
            },
            {
                "name": "earthquakes",
                "url": "data/pubc.json",
                "format": {
                    "type": "json",
                    "property": "features"
                }
            }
        ],

        "projections": [
            {
                "name": "projection",
                "scale": 225,
                "type": "orthographic",
                "translate": {"signal": "[width/2, height/2]"},
                "rotate": [{"signal": "rotate0"}, {"signal": "rotate1"}, 0]
            }
        ],

        "scales": [
            {
                "name": "size",
                "type": "sqrt",
                "domain": [0, 100],
                "range": [0, {"signal": "quakeSize"}]
            }
        ],

        "marks": [
            {
                "type": "shape",
                "from": {"data": "sphere"},
                "encode": {
                    "update": {
                        "fill": {"value": "aliceblue"},
                        "stroke": {"value": "black"},
                        "strokeWidth": {"value": 1.5}
                    }
                },
                "transform": [
                    {
                        "type": "geoshape",
                        "projection": "projection"
                    }
                ]
            },
            {
                "type": "shape",
                "from": {"data": "world"},
                "encode": {
                    "update": {
                        "fill": {"value": "mintcream"},
                        "stroke": {"value": "black"},
                        "strokeWidth": {"value": 0.35}
                    }
                },
                "transform": [
                    {
                        "type": "geoshape",
                        "projection": "projection"
                    }
                ]
            },
            {
                "type": "shape",
                "from": {"data": "earthquakes"},
                "encode": {
                    "update": {
                        "opacity": {"value": 0.25},
                        "fill": {"value": "red"}
                    }
                },
                "transform": [
                    {
                        "type": "geoshape",
                        "projection": "projection",
                        "pointRadius": {"expr": "scale('size', exp(datum.Frequency))"}
                    }
                ]
            }
        ]
    }
    vegaEmbed('#vis', spec)
}

function vl_map() {

    var spec = {
        "title": "Publications",
        "data": {
            url: "data/cpll.csv"
        },
        "encoding": {},
        "projection": {
            "type": "mercator"
        },
        "layer": [
            {
                "data": {
                    url: "data/world-110m.json",
                    "format": {
                        "type": "topojson",
                        "feature": "countries"
                    }
                },
                "mark": {
                    "type": "geoshape",
                    "fill": "lightgrey",
                    "stroke": "darkgrey"
                },
                "width": 800,
                "height": 600
            },
            {
                "mark": {
                    "type": "circle"
                },
                "encoding": {
                    "latitude": {
                        "field": "lat",
                        "type": "quantitative"
                    },
                    "longitude": {
                        "field": "long",
                        "type": "quantitative"
                    },
                    "size": {
                        "field": "rank",
                        "type": "quantitative"
                    }
                }
            }
        ]
    }
    vegaEmbed('#vis', spec);
}

function vegamap() {

    var spec = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "width": 900,
        "height": 500,
        "autosize": "none",

        "signals": [
            {"name": "tx", "update": "width / 2"},
            {"name": "ty", "update": "height / 2"},
            {
                "name": "scale",
                "value": 150,
                "on": [{
                    "events": {"type": "wheel", "consume": true},
                    "update": "clamp(scale * pow(1.0005, -event.deltaY * pow(16, event.deltaMode)), 150, 3000)"
                }]
            },
            {
                "name": "angles",
                "value": [0, 0],
                "on": [{
                    "events": "mousedown",
                    "update": "[rotateX, centerY]"
                }]
            },
            {
                "name": "cloned",
                "value": null,
                "on": [{
                    "events": "mousedown",
                    "update": "copy('projection')"
                }]
            },
            {
                "name": "start",
                "value": null,
                "on": [{
                    "events": "mousedown",
                    "update": "invert(cloned, xy())"
                }]
            },
            {
                "name": "drag", "value": null,
                "on": [{
                    "events": "[mousedown, window:mouseup] > window:mousemove",
                    "update": "invert(cloned, xy())"
                }]
            },
            {
                "name": "delta", "value": null,
                "on": [{
                    "events": {"signal": "drag"},
                    "update": "[drag[0] - start[0], start[1] - drag[1]]"
                }]
            },
            {
                "name": "rotateX", "value": 0,
                "on": [{
                    "events": {"signal": "delta"},
                    "update": "angles[0] + delta[0]"
                }]
            },
            {
                "name": "centerY", "value": 0,
                "on": [{
                    "events": {"signal": "delta"},
                    "update": "clamp(angles[1] + delta[1], -60, 60)"
                }]
            }
        ],

        "projections": [
            {
                "name": "projection",
                "type": "mercator",
                "scale": {"signal": "scale"},
                "rotate": [{"signal": "rotateX"}, 0, 0],
                "center": [0, {"signal": "centerY"}],
                "translate": [{"signal": "tx"}, {"signal": "ty"}]
            }
        ],

        "data": [
            {
                "name": "world",
                "url": "data/world-110m.json",
                "format": {
                    "type": "topojson",
                    "feature": "countries"
                }
            },
            {
                "name": "graticule",
                "transform": [
                    {"type": "graticule", "step": [15, 15]}
                ]
            },
            {
                "name": "ranks",
                "url": "data/cpll.csv",
                "format": {"type": "csv", "parse": "auto"},
                "transform": [
                    {
                        "type": "geopoint",
                        "projection": "projection",
                        "fields": ["long", "lat"]
                    }
                ]
            }
        ],

        "marks": [
            {
                "type": "shape",
                "from": {"data": "graticule"},
                "encode": {
                    "enter": {
                        "strokeWidth": {"value": 1},
                        "stroke": {"value": "#ddd"},
                        "fill": {"value": null}
                    }
                },
                "transform": [
                    {"type": "geoshape", "projection": "projection"}
                ]
            },
            {
                "type": "shape",
                "from": {"data": "world"},
                "encode": {
                    "enter": {
                        "strokeWidth": {"value": 0.5},
                        "stroke": {"value": "#9a9a9a"},
                        "fill": {"value": "#e5e8d3"}
                    }
                },
                "transform": [
                    {"type": "geoshape", "projection": "projection"}
                ]
            },
            {
                "type": "symbol",
                "from": {"data": "ranks"},
                "encode": {
                    update:{
                        "x": {"field":"x"},
                        "y": {"field":"y"},
                        size:{"value":100},
                        fill:{"value":"teal"},
                        "strokeWidth": {"value": 0.5},
                        stroke:{"value":"white"},
                    },
                    "enter": {
                        shape:"circle",
                        size:{"value":100},
                        fill:{"value":"teal"},
                        stroke:{"value":"white"},
                        "strokeWidth": {"value": 0.5},
                        "tooltip": {"signal": "{'Country': datum.country, 'No. of Publication':datum.frequency, 'Rank':datum.rank}"}
                    },
                    "hover": {
                        "size":{"value":200},
                        "strokeWidth": {"value": 1.5},
                        stroke:{"value":"teal"},
                        "fill": {"value": "white"}
                    }
                }
            }
        ]
    }
    vegaEmbed("#vis", spec)
}

function vegamapexp() {

    d3.select("h1").text("Rank of Countries by Publications")
    d3.select('p').text("")
    var spec = {
        "padding": {"left": 80, "top": 5, "right": 5, "bottom": 5},
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "width": 900,
        "height": 500,
        "autosize": "none",

        "signals": [
            {"name": "tx", "update": "width / 2"},
            {"name": "ty", "update": "height / 2"},
            {
                "name": "scale",
                "value": 150,
                "on": [{
                    "events": {"type": "wheel", "consume": true},
                    "update": "clamp(scale * pow(1.0005, -event.deltaY * pow(16, event.deltaMode)), 150, 3000)"
                }]
            },
            {
                "name": "angles",
                "value": [0, 0],
                "on": [{
                    "events": "mousedown",
                    "update": "[rotateX, centerY]"
                }]
            },
            {
                "name": "cloned",
                "value": null,
                "on": [{
                    "events": "mousedown",
                    "update": "copy('projection')"
                }]
            },
            {
                "name": "start",
                "value": null,
                "on": [{
                    "events": "mousedown",
                    "update": "invert(cloned, xy())"
                }]
            },
            {
                "name": "drag", "value": null,
                "on": [{
                    "events": "[mousedown, window:mouseup] > window:mousemove",
                    "update": "invert(cloned, xy())"
                }]
            },
            {
                "name": "delta", "value": null,
                "on": [{
                    "events": {"signal": "drag"},
                    "update": "[drag[0] - start[0], start[1] - drag[1]]"
                }]
            },
            {
                "name": "rotateX", "value": 0,
                "on": [{
                    "events": {"signal": "delta"},
                    "update": "angles[0] + delta[0]"
                }]
            },
            {
                "name": "centerY", "value": 0,
                "on": [{
                    "events": {"signal": "delta"},
                    "update": "clamp(angles[1] + delta[1], -60, 60)"
                }]
            }
        ],

        "projections": [
            {
                "name": "projection",
                "type": "mercator",
                "scale": {"signal": "scale"},
                "rotate": [{"signal": "rotateX"}, 0, 0],
                "center": [0, {"signal": "centerY"}],
                "translate": [{"signal": "tx"}, {"signal": "ty"}]
            }
        ],

        "data": [
            {
                "name": "world",
                "url": "data/world-110m.json",
                "format": {
                    "type": "topojson",
                    "feature": "countries"
                }
            },
            {
                "name": "graticule",
                "transform": [
                    {"type": "graticule", "step": [15, 15]}
                ]
            },
            {
                "name": "ranks",
                "url": "data/cpll.csv",
                "format": {"type": "csv", "parse": "auto"},
                "transform": [
                    {
                        "type": "geopoint",
                        "projection": "projection",
                        "fields": ["long", "lat"],
                        "poinRadius":{"expr": "scale('size', exp(datum.rank))"}
                    }
                ]
            }
        ],
        // "scales": [
        //     {
        //         "name": "color",
        //         "type": "quantize",
        //         "domain": [0, 0.15],
        //         "range": {"scheme": "blues", "count": 59}
        //     }
        // ],
        "scales": [
            {
                "name": "size",
                "type": "linear",
                "domain": {"data": "ranks", "field": "rank"},
                "range": [50, 300],
                "reverse":"true"
            },
            {
                "name": "color",
                "type": "quantize",
                "domain": {"data": "ranks", "field": "rank"},
                "range": {"scheme": "redyellowgreen", "count":59, "extent":[1,0]}
            }
        ],
        "legends": [
            {
                "title": "Ranks",
                "orient": "bottom-right",
                "type": "symbol",
                "size": "size",
                "fill": "color",
                "format": "s",
                "clipHeight": 16

            }
        ],


        "marks": [
            {
                "type": "shape",
                "from": {"data": "graticule"},
                "encode": {
                    "enter": {
                        "strokeWidth": {"value": 1},
                        "stroke": {"value": "#ddd"},
                        "fill": {"value": null}
                    }
                },
                "transform": [
                    {"type": "geoshape", "projection": "projection"}
                ]
            },
            {
                "type": "shape",
                "from": {"data": "world"},
                "encode": {
                    "enter": {
                        "strokeWidth": {"value": 0.5},
                        "stroke": {"value": "#b3d0e8"},
                        "fill": {"value": "#ecf3f9"}
                    }
                },
                "transform": [
                    {"type": "geoshape", "projection": "projection"}
                ]
            },
            {
                "type": "symbol",
                "from": {"data": "ranks"},
                "encode": {
                    update:{
                        "x": {"field":"x"},
                        "y": {"field":"y"},
                        size:{"scale": "size", "field": "rank"},
                        fill:{"scale":"color", "field":"rank"},
                        "strokeWidth": {"value": 0.5},
                        stroke:{"value":"white"},
                    },
                    "enter": {
                        shape:"circle",
                        size:{"scale": "size", "field": "rank"},
                        fill:{"scale":"color", "field":"rank"},
                        stroke:{"value":"white"},
                        "strokeWidth": {"value": 0.5},
                        "tooltip": {"signal": "{'Country': datum.country, 'No. of Publication':datum.frequency, 'Rank':datum.rank}"}
                    },
                    "hover": {
                        "size":{"value":300},
                        "strokeWidth": {"value": 1.5},
                        stroke:{"value":"white"},
                        "fill": {"scale":"color", "field":"rank"}
                    }
                    // "hover": {
                    //     "strokeWidth": {"value": 0.5},
                    //     stroke:{"value":"teal"},
                    //     "fill": {"value": "white"}
                    // }
                }
                // "transform": [
                //     {
                //         from:"ranks",
                //         "type": "geopoint",
                //         "projection": "projection",
                //         "fields":['long', 'lat']
                //     },
                //     {
                //         type: "formula", expr: "[datum.x, datum.y]", as: "center"
                //     },
                //     {
                //         type: "formula", expr: "{x:datum.center[0], y:datum.center[1]}", as: "centerDict"
                //     }
                // ]
            }
        ]
    }
    vegaEmbed("#vis", spec)
}

function vegaorth() {

    var spec = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "padding": 10,
        "width": 450,
        "height": 450,
        "autosize": "none",

        "signals": [
            {
                "name": "quakeSize", "value": 6,
                "bind": {"input": "range", "min": 0, "max": 12}
            },
            {
                "name": "rotate0", "value": 90,
                "bind": {"input": "range", "min": -180, "max": 180}
            },
            {
                "name": "rotate1", "value": -5,
                "bind": {"input": "range", "min": -180, "max": 180}
            }
        ],

        "data": [
            {
                "name": "sphere",
                "values": [
                    {"type": "Sphere"}
                ]
            },
            {
                "name": "world",
                "url": "data/world-110m.json",
                "format": {
                    "type": "topojson",
                    "feature": "countries"
                }
            },
            {
                "name": "ranks",
                "url": "data/cpll.csv",
                "format": {
                    "type": "csv",
                    "parse": "auto"
                },
                "transform": [
                    {
                        "type": "geopoint",
                        "projection": "projection",
                        "fields": ["long", "lat"]
                    }
                ]
            }
        ],

        "projections": [
            {
                "name": "projection",
                "scale": 225,
                "type": "orthographic",
                "translate": {"signal": "[width/2, height/2]"},
                "rotate": [{"signal": "rotate0"}, {"signal": "rotate1"}, 0]
            }
        ],

        "scales": [
            {
                "name": "size",
                "type": "sqrt",
                "domain": [0, 100],
                "range": [0, {"signal": "quakeSize"}]
            }
        ],

        "marks": [
            {
                "type": "shape",
                "from": {"data": "sphere"},
                "encode": {
                    "update": {
                        "fill": {"value": "aliceblue"},
                        "stroke": {"value": "black"},
                        "strokeWidth": {"value": 1.5}
                    }
                },
                "transform": [
                    {
                        "type": "geoshape",
                        "projection": "projection"
                    }
                ]
            },
            {
                "type": "shape",
                "from": {"data": "world"},
                "encode": {
                    "update": {
                        "fill": {"value": "mintcream"},
                        "stroke": {"value": "black"},
                        "strokeWidth": {"value": 0.35}
                    }
                },
                "transform": [
                    {
                        "type": "geoshape",
                        "projection": "projection"
                    }
                ]
            },
            {
                "type": "shape",
                "from": {"data": "ranks"},
                "encode": {
                    "update": {
                        x:{field:"x"},
                        y:{field:"y"}
                    },
                    enter:{
                        shape:"point",
                        size:{"value":100},
                        fill:{"value":"red"},
                        "tooltip": {"signal": "datum.rank"}
                    },
                    "hover": {"fill": {"value": "red"}}
                },
                "transform": [
                    {
                        "type": "geopoint",
                        "fields":["lat","long"],
                        "projection": "projection",
                        "pointRadius": {"expr": "scale('size', exp(datum.rank))"}
                    }
                ]
            }
        ]
    }

    vegaEmbed("#vis", spec);
}