const createMap = (L) => {
    // Create map
    const map = mapSettings(L);   

    // Get data from API
    getData(map)
};

const mapSettings = () => {
    // Initial info to define map
    initLat = 46.051367;
    initLng = 14.506542;
    initZoom = 13;

     // Create map
    const map = L.map('map').setView([initLat, initLng], initZoom)

    // Add tiles and icon
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
    const attr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    const tiles = L.tileLayer(tileUrl, { attr })
    tiles.addTo(map)
    return map
}

const getData = async (map) => {
    const res = await fetch('https://opendata.si/promet/bicikelj/list/')
    const data = await res.json()        
    const markers = data['markers']

    // Show datetime of last update
    lastUpdated = new Date(data.updated * 1000).toLocaleString('sl-SI')
    document.getElementById("last-updated").innerHTML = `Last updated: ${lastUpdated}`
    
    // Create markers on map
    createMarkers(map, markers)

    // Draw stacked-bar chart
    drawStackedChart(markers)
}

const createMarkers = (map, markers) => {
    // Create bike icon
    const BikeIcon = L.Icon.extend({
        iconSize: [30, 30]
    });

    let blackBike = new BikeIcon({iconUrl: "img/icons8-black-bicycle-30.png"}),
        redBike = new BikeIcon({iconUrl: "img/icons8-red-bicycle-30.png"})

    // Loop over markers
    Object.keys(markers).forEach((key) => {

        // Check available bikes at location
        if (markers[key]['station'].available === "0") {
            markerIcon = { icon: redBike }
        } else {
            markerIcon = { icon: blackBike }
        }
        
        // Add marker
        const marker = L.marker([markers[key].lat, markers[key].lng], markerIcon).addTo(map)

        // Add tooltip
        const tooltip = L.tooltip({
            permanent: false,
            direction: "auto",
        }).setContent(`
            <p>${markers[key].address}</p>
            <p>Št. koles na voljo: ${markers[key]['station'].available}</p>
        `)

        marker.bindTooltip(tooltip).openTooltip()
        map.addLayer(marker)
    });
}

const drawStackedChart = (markers) => {

    // Initialize data format
    let data = {
        'addresses': [],
        'available': [],
        'free': []
    }

    // Put data 
    Object.keys(markers).forEach((key) => {
        data['addresses'].push(markers[key].address)
        data['available'].push(parseInt(markers[key].station.available))
        data['free'].push(parseInt(markers[key].station.free))
    })

    Highcharts.chart('stacked-bar', {
        chart: {
            type: 'bar',
            backgroundColor: '#f0f0f0'
        },
        title: {
            text: ''
        },
        xAxis: {
            categories: data['addresses']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Total fruit consumption'
            }
        },
        legend: {
            reversed: true
        },
        plotOptions: {
            series: {
                stacking: 'normal',
                pontWidth: 10
            }
        },
        series: [{
            name: 'Št. koles na voljo',
            data: data['available']
        }, {
            name: 'Št. parkirnih mest na voljo',
            data: data['free']
        }]
    });
}