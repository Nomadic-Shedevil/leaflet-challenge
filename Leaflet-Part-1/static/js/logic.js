// Adding the tile layer
let baseMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let map = L.map("map", {
    center: [27.96044, -82.30695],
    zoom: 3
});

baseMap.addTo(map);


let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";


d3.json(url).then(function (response) {
    // three functions to tie into json


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

        else if (depth >= 10 && depth <= 30 ) {
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

        else if (depth > 90){
            return "#ff0000";
        };

    }


    function getRadius(mag) {
        if (mag === 0) return 1;
        return mag * 4;
    }

    L.geoJson(response, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng)
        },
        style: style,
        onEachFeature: function (features, layer) {
            layer.bindPopup("Magnitude: " + features.properties.mag +
                "<br>" + "Depth: " + features.geometry.coordinates[2] + "<br>"
                + "Place: " + features.properties.place)
        }

    }).addTo(map);


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