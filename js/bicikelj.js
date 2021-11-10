const createMap = (L) => {
  // Initialize map and get data
  const map = mapSettings(L);
  getData(map);
};

const mapSettings = () => {
  // Initial info to define map
  initLat = 46.051367;
  initLng = 14.506542;
  initZoom = 13;

  // Create map
  const map = L.map("map").setView([initLat, initLng], initZoom);

  // Add tiles and icon
  const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const attr =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const tiles = L.tileLayer(tileUrl, { attr });
  tiles.addTo(map);
  return map;
};

const getData = async (map) => {
  const url = "https://opendata.si/promet/bicikelj/list/";
  let res, data, markers;

  try {
    res = await fetch(url, { method: "GET" });
    data = await res.json();
    markers = data["markers"];

    // Show datetime of last update
    lastUpdated = new Date(data.updated * 1000).toLocaleString("sl-SI");
    document.getElementById(
      "last-updated"
    ).innerHTML = `Last updated: ${lastUpdated}`;
  } catch (err) {
    console.log(err);
    markers = {};
  }
  // Create markers on map
  createMarkers(map, markers);

  // Draw charts
  stackedChart(markers);
  pieChart(markers);
};

const createMarkers = (map, markers) => {
  // Create bike icon
  const BikeIcon = L.Icon.extend({
    iconSize: [30, 30],
  });

  let blackBike = new BikeIcon({ iconUrl: "img/icons8-black-bicycle-30.png" }),
    redBike = new BikeIcon({ iconUrl: "img/icons8-red-bicycle-30.png" });

  Object.keys(markers).forEach((key) => {
    // Check available bikes at location
    if (markers[key]["station"].available === "0") {
      markerIcon = { icon: redBike };
    } else {
      markerIcon = { icon: blackBike };
    }

    // Add marker
    const marker = L.marker(
      [markers[key].lat, markers[key].lng],
      markerIcon
    ).addTo(map);

    // Add tooltip
    const tooltip = L.tooltip({
      permanent: false,
      direction: "auto",
    }).setContent(`
            <p>${markers[key].address}</p>
            <p>Št. koles na voljo: ${markers[key]["station"].available}</p>
            <p>Št. parkirnih mest na voljo: ${markers[key]["station"].free}</p>
        `);

    marker.bindTooltip(tooltip).openTooltip();
    map.addLayer(marker);
  });
};

const chartData = (markers) => {
  // Initialize data format
  let data = {
    addresses: [],
    available: [],
    free: [],
  };

  Object.keys(markers).forEach((key) => {
    data["addresses"].push(markers[key].address);
    data["available"].push(parseInt(markers[key].station.available));
    data["free"].push(parseInt(markers[key].station.free));
  });
  return data;
};

const stackedChart = (markers) => {
  // Get data for chart
  let data = chartData(markers);

  // Draw chart
  Highcharts.chart("stacked-bar", {
    chart: {
      type: "bar",
      backgroundColor: "#f0f0f0",
    },
    title: {
      text: "",
    },
    lang: {
      noData: "No data to show",
    },
    xAxis: {
      categories: data["addresses"],
    },
    yAxis: {
      min: 0,
      title: {
        text: "Število postaj",
      },
    },
    legend: {
      reversed: true,
    },
    plotOptions: {
      series: {
        stacking: "normal",
        pontWidth: 10,
      },
    },
    series: [
      {
        name: "Št. koles na voljo",
        data: data["available"],
        color: "#9ae17b",
      },
      {
        name: "Št. parkirnih mest na voljo",
        data: data["free"],
        color: "#707070",
      },
    ],
  });
};

const pieChart = (markers) => {
  // Get data for chart
  let data = chartData(markers);

  // Calculate totals
  let sumAvailable = data.available.reduce((acc, val) => acc + val);
  let sumFree = data.free.reduce((acc, val) => acc + val);
  let total = sumAvailable + sumFree;

  Highcharts.chart("3d-pie", {
    chart: {
      type: "pie",
      backgroundColor: "#f0f0f0",
      options3d: {
        enabled: true,
        alpha: 40,
        beta: 0,
      },
    },
    title: {
      text: "",
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    tooltip: {
      pointFormat: "<b>{point.percentage:.1f}%</b>",
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        depth: 35,
        dataLabels: {
          enabled: true,
          format: "{point.name}",
        },
      },
    },
    series: [
      {
        type: "pie",
        data: [
          {
            name: "Kolesa na voljo",
            y: (sumAvailable / total) * 100,
            sliced: true,
            color: "#9ae17b",
          },
          {
            name: "Parkirna mesta na voljo",
            y: (sumFree / total) * 100,
            color: "#707070",
          },
        ],
      },
    ],
  });
};
