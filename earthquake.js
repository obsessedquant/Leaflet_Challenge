var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";


d3.json(queryUrl).then(function (data) {
    console.log("data is: ", data);
    var earthquakes_1 = createFeatures(data.features);
    console.log("earthquakes_1 is: ", earthquakes_1);
    createMap(earthquakes_1);
});

function createFeatures(earthquakeData) {

    function chooseColor(size) {
        if (size > 90) color = "rgb(255,95,102)";
        else if (size > 70) color = "rgb(255,164,101)";
        else if (size > 50) color = "rgb(250,220,66)";
        else if (size > 30) color = "rgb(250,220,66)";
        else if (size > 10) color = "rgb(218,245,70)";
        else color = "rgb(153,247,69)";
        return color;
    }

    var list_of_earthquakes = [];
    var locationz = [];

    // Add circles to the map.
    earthquakeData.forEach(x => {
        locationz = [];
        locationz = [x.geometry.coordinates[1], x.geometry.coordinates[0]];
        list_of_earthquakes.push(L.circle(locationz, {
            fillOpacity: 0.75,
            color: "black",
            weight: 0.5,
            fillColor: chooseColor(x.geometry.coordinates[2]),
            radius: x.properties.mag * 100000
        }).bindPopup(`<h3>${x.properties.place}</h3><hr><p>${new Date(x.properties.time)}</p>`));
    });

    console.log("list of earthquakes is: ", list_of_earthquakes);

    var earthquakes_0 = L.layerGroup(list_of_earthquakes);

    return earthquakes_0
}

function updateLegend() {
    console.log('updateLegend called')
    document.querySelector(".legend").innerHTML = [
        "<div style='font-size:14px'><div class='box green'></div>&nbsp;-10 - 10</div>",
        "<div style='font-size:14px'><div class='box lightgreen'></div>&nbsp;10 - 30</div>",
        "<div style='font-size:14px'><div class='box gold'></div>&nbsp;30 - 50</div>",
        "<div style='font-size:14px'><div class='box lightorange'></div>&nbsp;50 - 70</div>",
        "<div style='font-size:14px'><div class='box orange'></div>&nbsp;70 - 59</div>",
        "<div style='font-size:14px'><div class='box red'></div>&nbsp;90+</div>"
    ].join("");
}

function createMap(earthquakes) {

    console.log("createMap has been called with this data: ", earthquakes)

    // Create the base layers.
    var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Use this link to get the GeoJSON data.

    // Getting our GeoJSON data
    var tectonic_plates = "GeoJSON/PB2002_boundaries.json";

    var tect_platez = new L.LayerGroup();
    
    d3.json(tectonic_plates).then(function (data) {
        tect_plates = L.geoJson(data).addTo(tect_platez);
    })

    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    var myMap = L.map("map", {
        center: [15.5994, -28.6731],
        zoom: 3,
        layers: [street, tect_platez, earthquakes]
    });

    street.addTo(myMap);

    // Create a baseMaps object.
    var baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Create an overlay object to hold our overlay.
    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Tectonic Plates": tect_platez
    };

    var info = L.control({
        position: "bottomright"
    });

    info.onAdd = function () {
        var div = L.DomUtil.create("div", "legend");
        return div;
    };
    // Add the info legend to the map.
    info.addTo(myMap);

    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    updateLegend();

}