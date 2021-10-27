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

const getData = async () => {
    const res = await fetch('https://opendata.si/promet/bicikelj/list/')
    return await res.json()
}

const createMap = (L) => {
    // Create map
    const map = mapSettings(L);
    
    // Create bike icon
    const bikeIcon = L.icon({
        iconUrl: "https://img.icons8.com/ios-glyphs/30/000000/bicycle.png",
        iconSize: [30, 30]
    });

    const getData = async () => {
        const res = await fetch('https://opendata.si/promet/bicikelj/list/')
        const data = await res.json()        
        const markers = data['markers']

        // Show datetime of last update
        lastUpdated = new Date(data.updated * 1000).toLocaleString('sl-SI')
        document.getElementById("last-updated").innerHTML = `Last update: ${lastUpdated}`

        // Loop over markers
        Object.keys(markers).forEach((key) => {
            
            // Add markers
            const marker = L.marker(
                [markers[key].lat, markers[key].lng], 
                {icon: bikeIcon}
            ).addTo(map)
    
            // Add tooltips
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
    getData()
};