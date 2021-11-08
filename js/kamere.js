const createMap = () => {
  // Initial info to define map
  let initLat = 46.059231;
  let initLng = 14.826602;
  let initZoom = 8;

  // API
  let url = "https://opendata.si/promet/cameras/";

  // Charts
  let chart = undefined;

  // Initialize map and get data
  const map = mapSettings(L, initLat, initLng, initZoom);
  getData(map, url, chart);
};

const getData = async (map, url, chart) => {
  let res, data, markers;

  try {
    res = await fetch(url, { method: "GET" });
    data = await res.json();
    markers = data["Contents"][0]["Data"]["Items"];

    // Show datetime of last update
    lastUpdated = new Date(data.updated * 1000).toLocaleString("sl-SI");
    document.getElementById(
      "last-updated"
    ).innerHTML = `Last updated: ${lastUpdated}`;

    createMarkers(map, markers);
  } catch (err) {
    console.log(err);
  }
};

const createMarkers = (map, markers) => {
  // Create bike icon
  const Icons = L.Icon.extend({
    iconSize: [15, 15],
  });

  let camera = new Icons({ iconUrl: "img/icons8-camera-30.png" });
  let markerIcon = { icon: camera };
  let marker = null;

  Object.keys(markers).forEach((each) => {
    // Add marker and marker icon
    marker = L.marker(
      [markers[each]["y_wgs"], markers[each]["x_wgs"]],
      markerIcon
    ).addTo(map);

    // Add tooltip
  });
};
