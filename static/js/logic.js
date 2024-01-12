// Adding the tile layer
let streetlayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let NASAGIBS_ViirsEarthAtNight2012 = L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}', {
    attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
    bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
    minZoom: 1,
    maxZoom: 8,
    format: 'jpg',
    time: '',
    tilematrixset: 'GoogleMapsCompatible_Level'
});

// Initialize all the LayerGroups

let layers = {
    tectonic: new L.LayerGroup(),
    earthquake: new L.LayerGroup()

};

// Create the map with our layers
let map = L.map("map", {
    center: [27.96044, -82.30695],
    zoom: 3,
    layers: [
        streetlayer,
        layers.tectonic,
        layers.earthquake
    ]
});

let baseMaps = {
    "streetmap":streetlayer,
    "NASA":NASAGIBS_ViirsEarthAtNight2012

}


//NASAGIBS_ViirsEarthAtNight2012.addTo(map);

let overlays = {
    "Tectonic Plates": layers.tectonic,
    "Earthquake Data": layers.earthquake
};

L.control.layers(baseMaps, overlays).addTo(map);



//read in both API of earthquake and tectonic data

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

let url_2 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";


d3.json(url).then(function (response) {
    // three functions to tie into json above


    function style(feature) {
        return {
            fillColor: getColor(feature.geometry.coordinates[2]),
            weight: 2,
            opacity: 1,
            radius: getRadius(feature.properties.mag),
            color: "#333300",
            dashArray: '1',
            fillOpacity: 0.9
        };
    }
    function getColor(depth) {

        if (depth <= 10) {
            return "#98EE00";
        }

        else if (depth >= 10 && depth <= 30) {
            return "#ccff33";
        }

        else if (depth > 30 && depth <= 50) {
            return "#ffcc00";
        }

        else if (depth > 50 && depth <= 70) {
            return "#ff9900";
        }

        else if (depth > 70 && depth <= 90) {
            return "#ff6600";
        }

        else if (depth > 90) {
            return "#ff0000";
        };

    }


    function getRadius(mag) {
        if (mag === 0) return 1;
        return mag * 4;
    }

    L.geoJson(response, {
        pointToLayer: function (features, latlng) {
            return L.circleMarker(latlng)
        },
        style: style,
        onEachFeature: function (features, layer) {
            layer.bindPopup("Magnitude: " + features.properties.mag +
                "<br>" + "Depth: " + features.geometry.coordinates[2] + "<br>"
                + "Place: " + features.properties.place)
        }

    }).addTo(map);

    //read in plate tectonics API call and data
    d3.json(url_2).then(function (response_2) {
       L.geoJson(response_2,{weight:2, color:"red"}).addTo(layers.tectonic)
       layers.tectonic.addTo(baseMap)
        console.log(plateData)

        //function to make the tectonic lines

    });


let legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {

    let div = L.DomUtil.create('div', 'info legend'),
        depth = [-10, 10, 30, 50, 70, 90],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (i = 0; i < depth.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depth[i] + 1) + '"></i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);

});