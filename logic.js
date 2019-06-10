
//Define markersize and marker color functions

function markerSize(mag) {
  return mag * 45000;
}

function markerColor(mag) {
  if (mag <= 1) {
    return "#ADFF2F";
  } else if (mag <= 2) {
    return "#9ACD32";
  } else if (mag <= 3) {
    return "#FFFF00";
  } else if (mag <= 4) {
    return "#ffd700";
  } else if (mag <= 5) {
    return "#FFA500";
  } else {
    return "#FF0000";
  };
}


//Retrieve earthquake data, create markers

var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url, function (response) {

  data = response.features

  var coordinates = [];

  for (var i = 0; i < data.length; i++) {
    var location = data[i];

    var coordinate = L.circle([location.geometry.coordinates[1], location.geometry.coordinates[0]], {
      color: markerColor(location.properties.mag),
      radius: markerSize(location.properties.mag),
      fillOpacity: 0.7,
      stroke: false,
    })
      .bindPopup("<h3>Magitude: " + location.properties.mag + "<h3><h3>Location: " + location.properties.place + "<h3>")

    coordinates.push(coordinate);
  }


  createMap(L.layerGroup(coordinates));

});


// Create Maps 
function createMap(earthquake) {

  //Create light map and satellite maps
  var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });


  var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  //Create basemap object to hold map layer
  var baseMaps = {
    "Light map": light,
    "Satellite map": satellite
  };

  var overlayMaps = {
    "Earthquakes": earthquake
  };

  //Create map object
  var map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [light, earthquake]
  });

  //Layer control 
  L.control.layers(baseMaps, overlayMaps).addTo(map);


  //Legend
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    div.innerHTML += "<h4>Magnitudes</h4>";
      mag = [0, 1, 2, 3, 4, 5];

    for (var i = 0; i < mag.length; i++) {
      div.innerHTML +=
        '<i style="background:' + markerColor(mag[i] + 1) + '"></i> ' +
        + mag[i] + (mag[i + 1] ? ' - ' + mag[i + 1] + '<br>' : ' + ');
    }

    return div;
  };

legend.addTo(map);

}

